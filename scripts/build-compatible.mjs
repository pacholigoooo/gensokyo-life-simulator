import {readFile, writeFile, readdir, mkdir, rm, rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve, dirname, join, relative} from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {transformAsync} from '@babel/core';
import presetEnv from '@babel/preset-env';
import {build as bundle} from 'esbuild';
import {parse} from 'acorn';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const hash = value => createHash('sha256').update(value).digest('hex');
const targets = {chrome: '49'};
const excluded = ['dev.js'];

// These rules apply only when the corresponding modern layout feature is absent.
// In Chrome 49 the record and setup remain usable without Grid, gap, or svh.
const fallbackCSS = `/* Generated browser compatibility layout. Modern style.css remains the source. */
@supports not (display:grid){
 .setup-grid{display:block}.intent{border-left:0;border-top:1px solid var(--line);padding:20px 0 0}
 .talent-list{display:block}.talent{width:100%;margin-bottom:10px}
 .live-stats{display:flex}.live-stat{width:25%}
 #relationship-list{display:block}.relationship-item{margin-bottom:8px}
 #timeline li{display:block;position:relative;padding-left:82px}
 #timeline .when{position:absolute;left:0;top:17px;width:68px}
 .roster-row{display:flex;justify-content:space-between}.roster-row small{max-width:58%}
 @media(max-width:650px){#timeline li{padding-left:64px}#timeline .when{top:15px;width:52px}}
}
@supports not (gap:1px){
 .masthead>.seal{margin-right:17px}.allocation-input>*+*{margin-left:13px}
 .talent-actions>*+*,.music-actions>*+*{margin-left:8px}
 .controls>*+*{margin-left:9px}.controls label,.controls #restart{margin-left:auto}
 .relationship-line>*+*,.life-condition>*+*{margin-left:9px}
 .live-stat dd small{margin-left:8px}
 @media(max-width:650px){.masthead>.seal{margin-right:12px}.controls>*+*{margin-left:6px}.controls #restart{margin-left:6px}}
}
@supports not (height:1svh){
 .life-hud{max-height:50vh;padding-top:8px}#timeline{max-height:52vh}
 #live-talent-descriptions{max-height:30vh}
}
@supports not (width:min(300px,100vw)){
 .music-menu{width:300px;max-width:calc(100vw - 40px)}
}
`;

async function filesWithin(directory, prefix = '') {
  const files = [];
  for (const entry of (await readdir(directory, {withFileTypes: true})).sort((a, b) => a.name.localeCompare(b.name))) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) files.push(...await filesWithin(join(directory, entry.name), name + '/'));
    else {
      assert(entry.isFile(), 'Compatibility input must be a regular file: ' + name);
      files.push(name);
    }
  }
  return files;
}

function scanJavaScript(source) {
  const ast = parse(source, {ecmaVersion: 'latest', sourceType: 'script'});
  const syntax = Object.create(null), methods = new Set();
  const increment = feature => { syntax[feature] = (syntax[feature] || 0) + 1; };
  function walk(node) {
    if (!node || typeof node !== 'object') return;
    if (node.type === 'ChainExpression') increment('optionalChaining');
    if (node.type === 'LogicalExpression' && node.operator === '??') increment('nullishCoalescing');
    if (node.type === 'AssignmentExpression' && ['??=', '&&=', '||='].includes(node.operator)) increment('logicalAssignment');
    if (node.type === 'BinaryExpression' && node.operator === '**') increment('exponentiation');
    if (node.type === 'AwaitExpression') increment('await');
    if (node.type === 'CallExpression' && node.callee.type === 'MemberExpression') {
      const member = node.callee;
      if (!member.computed) methods.add(member.property.name);
    }
    for (const [key, value] of Object.entries(node)) {
      if (key === 'start' || key === 'end') continue;
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === 'object') walk(value);
    }
  }
  walk(ast);
  return {syntax, methods: [...methods].sort()};
}

async function transpile(source, filename, compact = false) {
  const result = await transformAsync(source, {
    filename, sourceType: 'script', babelrc: false, configFile: false,
    comments: true, compact, generatorOpts: {jsescOption: {minimal: true}},
    // core-js must see native typeof results while it installs the Symbol shim.
    presets: [[presetEnv, {targets, modules: false, bugfixes: true, forceAllTransforms: true, useBuiltIns: false,
      exclude: filename === 'compat.js' ? ['transform-typeof-symbol'] : []}]]
  });
  // ES5 parsing is deliberately stricter than Chrome 49's syntax support.
  // It also rejects forgotten modules, async functions, ?. and ?? in dependencies.
  parse(result.code, {ecmaVersion: 5, sourceType: 'script'});
  return result.code + '\n';
}

function verifyRuntime(compatibility, sourceScripts, legacyScripts, scriptOrder) {
  const original = vm.createContext({console, setTimeout, clearTimeout});
  const legacy = vm.createContext({console, setTimeout, clearTimeout});
  // These removals reproduce missing capabilities, not an actual QQ WebView.
  vm.runInContext(`
    this.globalThis = undefined; this.Promise = undefined; this.Map = undefined;
    this.Set = undefined; this.Symbol = undefined; this.URL = undefined; this.URLSearchParams = undefined;
    Array.from = undefined; Array.prototype.at = undefined; Array.prototype.flat = undefined;
    Array.prototype.flatMap = undefined; Array.prototype.includes = undefined;
    Object.entries = undefined; Object.values = undefined; Object.fromEntries = undefined;
    String.prototype.replaceAll = undefined;
  `, legacy);
  vm.runInContext(compatibility, legacy, {filename: 'compat.js'});
  const polyfills = JSON.parse(vm.runInContext(`JSON.stringify({
    globalThis: globalThis === this, at: [1,2].at(-1) === 2,
    flat: [1,[2]].flat().join(',') === '1,2',
    flatMap: [1,2].flatMap(function(n){return [n,n]}).join(',') === '1,1,2,2',
    includes: [1,2].includes(2), fromEntries: Object.fromEntries([['x',3]]).x === 3,
    entries: Object.entries({x:3})[0][0] === 'x', values: Object.values({x:3})[0] === 3,
    replaceAll: 'aba'.replaceAll('a','x') === 'xbx',
    urlSearchParams: new URLSearchParams('?seed=41').get('seed') === '41',
    url: new URL('/x','https://example.test/').href === 'https://example.test/x',
    promise: typeof Promise.resolve === 'function',
    map: new Map([['x',3]]).get('x') === 3, set: new Set([1,1]).size === 1
  })`, legacy));
  assert(Object.values(polyfills).every(Boolean), 'A required runtime polyfill failed: ' + JSON.stringify(polyfills));
  const engineOrder = scriptOrder.filter(file => !['app.js', 'music.js', 'compat.js'].includes(file));
  for (const file of engineOrder) {
    vm.runInContext(sourceScripts.get(file), original, {filename: 'dist/' + file});
    vm.runInContext(legacyScripts.get(file), legacy, {filename: 'site/' + file});
  }
  const samples = [
    {seed: 1, character: null}, {seed: 41, character: null}, {seed: 1049, character: null},
    {seed: 23, character: 'reimu'}, {seed: 41, character: 'patchouli'}, {seed: 57, character: 'suwako'}
  ];
  const replay = input => `(function(){
    var input = ${JSON.stringify(input)}, E = TouhouEngine;
    var person = input.character === null ? null : TouhouContent.find(function(c){return c.id === input.character});
    if(input.character !== null && !person) throw new Error('Unknown compatibility sample');
    var life = E.createLife({stats:{health:5,insight:5,bond:5,fortune:5},talents:['reader','friendly','tea'],seed:input.seed,character:person});
    var rng = E.random(input.seed ^ 0x9e3779b9), steps = 0;
    while(!life.ended && steps++ < 3000) E.step(life,rng);
    if(!life.ended) throw new Error('Compatibility replay did not settle');
    return JSON.stringify({age:life.age,turn:life.turn,stats:life.stats,history:life.history,flags:Array.from(life.flags),log:life.log,summary:life.summary,ending:life.ending});
  })()`;
  const replays = samples.map(input => {
    const before = vm.runInContext(replay(input), original);
    const after = vm.runInContext(replay(input), legacy);
    assert.equal(after, before, 'Compatibility changed the replay: ' + JSON.stringify(input));
    return {...input, sha256: hash(after), events: JSON.parse(after).log.length};
  });
  return {method: 'Missing-API VM smoke checks and six controlled exact source/build life replays; no QQ device claim.', polyfills, replays};
}

export async function buildCompatible() {
  const sourceDirectory = join(root, 'dist'), destination = join(root, 'site');
  const staging = join(root, '.site-compatible-tmp-' + process.pid);
  const packageJSON = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
  const sourceFiles = await filesWithin(sourceDirectory);
  const sourceBuffers = new Map(await Promise.all(sourceFiles.map(async name => [name, await readFile(join(sourceDirectory, name))])));
  const sourceScripts = new Map(), legacyScripts = new Map(), inventory = {};
  const entryHTML = sourceBuffers.get('index.html').toString();
  assert(!/type\s*=\s*["']module["']/i.test(entryHTML), 'The player entry must use classic scripts.');
  const scriptOrder = [...entryHTML.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)].map(match => match[1]);
  assert(scriptOrder.length && scriptOrder.every(file => sourceBuffers.has(file) && !excluded.includes(file)), 'Player script dependency missing or test-only.');
  const bundled = await bundle({
    entryPoints: [join(root, 'scripts/legacy-entry.js')], bundle: true, write: false,
    platform: 'browser', format: 'iife', target: ['chrome49'], minify: true,
    legalComments: 'eof', logLevel: 'silent'
  });
  const compatibility = await transpile(bundled.outputFiles[0].text, 'compat.js', true);
  await rm(staging, {recursive: true, force: true});
  await mkdir(staging, {recursive: true});
  try {
    for (const name of sourceFiles) {
      const buffer = sourceBuffers.get(name);
      if (name.endsWith('.js')) {
        const source = buffer.toString();
        sourceScripts.set(name, source);
        inventory[name] = {sha256: hash(buffer), ...scanJavaScript(source), published: !excluded.includes(name)};
        if (name === 'compat.js' || excluded.includes(name)) continue;
        const compiled = await transpile(source, name, name.endsWith('-data.js'));
        legacyScripts.set(name, compiled);
        await mkdir(dirname(join(staging, name)), {recursive: true});
        await writeFile(join(staging, name), compiled);
      } else {
        let output = buffer;
        if (name.endsWith('.html')) {
          let html = buffer.toString();
          html = html.replace(/(<link\b[^>]*\bhref=["']style\.css["'][^>]*>)/i, '$1\n<link rel="stylesheet" href="compat.css">');
          if (/<script\b/i.test(html)) html = html.replace(/<script\b/i, '<script src="compat.js" defer></script>\n<script');
          output = html;
        }
        await mkdir(dirname(join(staging, name)), {recursive: true});
        await writeFile(join(staging, name), output);
      }
    }
    await writeFile(join(staging, 'compat.js'), compatibility);
    await writeFile(join(staging, 'compat.css'), fallbackCSS);
    const runtime = verifyRuntime(compatibility, sourceScripts, legacyScripts, scriptOrder);
    const licenses = [];
    for (const dependency of ['core-js', '@babel/core']) {
      const folder = dirname(require.resolve(dependency + '/package.json'));
      licenses.push(dependency + '\n' + await readFile(join(folder, 'LICENSE'), 'utf8'));
    }
    await writeFile(join(staging, 'THIRD_PARTY_LICENSES.txt'), licenses.join('\n\n'));
    // Fail a concurrent source edit instead of publishing mixed generations.
    for (const [name, source] of sourceBuffers) assert.equal(hash(await readFile(join(sourceDirectory, name))), hash(source), 'Source changed during compatibility build: ' + name);
    const generated = {};
    for (const name of await filesWithin(staging)) {
      const buffer = await readFile(join(staging, name));
      if (name.endsWith('.js')) parse(buffer.toString(), {ecmaVersion: 5, sourceType: 'script'});
      generated[name] = {sha256: hash(buffer), bytes: buffer.length};
    }
    const receipt = {
      version: packageJSON.version, target: 'Chrome / Android WebView 49', syntax: 'ES5 classic scripts',
      tools: packageJSON.devDependencies, sourceDirectory: 'dist', outputDirectory: 'site',
      excluded, scripts: ['compat.js', ...scriptOrder], source: inventory, files: generated,
      checks: {allPublishedJavaScriptParsedAsES5: true, noRuntimeModulesOrCDN: true, runtime}
    };
    await writeFile(join(staging, 'compatibility-build.json'), JSON.stringify(receipt, null, 2) + '\n');
    // Only replace the old site after the complete staged build passed validation.
    await rm(destination, {recursive: true, force: true});
    await rename(staging, destination);
    console.log(JSON.stringify({compatibleSite: relative(root, destination), target: receipt.target, parsedScripts: Object.keys(generated).filter(file => file.endsWith('.js')).length, exactLifeReplays: runtime.replays.length, polyfillChecks: Object.keys(runtime.polyfills).length, bytes: Object.values(generated).reduce((sum, file) => sum + file.bytes, 0)}));
    return receipt;
  } catch (error) {
    await rm(staging, {recursive: true, force: true});
    throw error;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildCompatible();
