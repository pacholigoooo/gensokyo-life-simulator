function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/* Paper memoirs use only the settled game's own text and local canvas drawing. */
(function () {
  var WIDTH = 1120,
    MAX_HEIGHT = 4096,
    LEFT = 80,
    CONTENT_WIDTH = WIDTH - LEFT * 2,
    CONTENT_TOP = 246,
    FOOTER = 116;
  var PAPER = '#f8f4ec',
    INK = '#282824',
    RED = '#992e27',
    MUTED = '#676158',
    LINE = '#c9beb0';
  var FONT = '"Noto Serif CJK SC", "Songti SC", "SimSun", serif';
  // These are names actually used by the game's prose, not arbitrary surname suffixes.
  var aliases = Object.fromEntries('reimu:灵梦 marisa:魔理沙 meiling:美铃 patchouli:帕秋莉 sakuya:咲夜 remilia:蕾米莉亚 flandre:芙兰朵露 letty:蕾蒂 alice:爱丽丝 lily_white:莉莉 lunasa:露娜萨 merlin:梅露兰 lyrica:莉莉卡 youmu:妖梦 yuyuko:幽幽子 ran:蓝 yukari:紫 suika:萃香 wriggle:莉格露 mystia:米斯蒂娅 keine:慧音 tewi:天为 reisen:铃仙 eirin:永琳 kaguya:辉夜 mokou:妹红 aya:文 medicine:梅蒂欣 yuuka:幽香 komachi:小町 eiki:映姬 kagerou:影狼 benben:弁弁 yatsuhashi:八桥 seija:正邪 shinmyoumaru:针妙丸 raiko:雷鼓 sumireko:堇子 doremy:哆来咪 sagume:探女 hecatia:赫卡提亚 joon:女苑 shion:紫苑 eternity:拉尔瓦 nemuno:合欢 aunn:阿吽 narumi:成美 satono:里乃 mai_teireida:舞 okina:隐岐奈 eika:璎花 urumi:润美 kutaka:久侘歌 yachie:八千慧 mayumi:磨弓 keiki:袿姬 saki:早鬼 yuma:尤魔 shizuha:静叶 minoriko:穰子 hina:雏 nitori:荷取 momiji:椛 sanae:早苗 kanako:神奈子 suwako:诹访子 iku:衣玖 tenshi:天子 yamame:山女 parsee:帕露西 yuugi:勇仪 satori:觉 rin:阿燐 utsuho:阿空 koishi:恋 nazrin:娜兹玲 kogasa:小伞 ichirin:一轮 murasa:水蜜 shou:星 byakuren:白莲 nue:鵺 hatate:果 sunny:桑尼 luna:露娜 star:斯塔 kyouko:响子 yoshika:芳香 seiga:青娥 tojiko:屠自古 futo:布都 miko:神子 mamizou:猯藏 kana:卡娜 rikako:理香子 chiyuri:千百合 yumemi:梦美 renko:莲子 maribel:梅莉 mike:三花 takane:高岭 sannyo:山如 misumaru:魅须丸 tsukasa:典 megumu:龙 chimata:千亦 momoyo:百百世 biten:美天 enoko:慧之子 chiyari:血枪 hisami:日狭美 zanmu:残无 ubame:姥芽 chimi:魑魅 nareko:驯子 yuiman:维缦 ariya:阿梨夜 nina:贝子 rinnosuke:霖之助 akyuu:阿求 toyohime:丰姬 yorihime:依姬 reisen2:二号铃仙 kasen:华扇 kosuzu:小铃 miyoi:美宵 mizuchi:瑞灵 youki:妖忌 layla:蕾拉'.split(' ').map(function (pair) {
    return pair.split(':');
  }));
  function createNames(characters) {
    var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var names = [];
    var _iterator = _createForOfIteratorHelper(characters),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var c = _step.value;
        names.push(c.name);
        if (aliases[c.id]) names.push(aliases[c.id]);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    names.push.apply(names, _toConsumableArray(extra));
    return _toConsumableArray(new Set(names.filter(function (name) {
      return typeof name === 'string' && name;
    }))).sort(function (a, b) {
      return b.length - a.length;
    });
  }
  function singleName(text, index, name) {
    // 雪、舞、橙等单字也有普通词义；仅在人物动作或明确来往语境里强调。
    var before = text.slice(0, index),
      after = text.slice(index + name.length);
    if (/^(色|红|白|花|地|台|蹈|会|落|飘|季|夜|天)/.test(after)) return false;
    return /^(与你|和你|邀你|请你|向你|对你|问你|为你|替你|带你|笑着|说道|说起|点头|摇头|离去|离世|的心愿|的经历|的旧物|的来信|的手|的脸)/.test(after) || /(?:与|和|向|问|陪|拜访|遇见|看见|听见|想起|记得|认识|寻到|一位名叫)$/.test(before) && /^(?:[，。；、：？！「」·\s]|$|你|她|他|在|把|将|的)/.test(after) || (index === 0 || /[「『（(]/.test(text[index - 1])) && /^(?:[」』）)·\s]|$)/.test(after);
  }
  function splitNames(value, names) {
    var text = String(value),
      runs = [];
    var plain = '',
      i = 0;
    while (i < text.length) {
      var match = names.find(function (name) {
        return text.startsWith(name, i) && (name.length > 1 || singleName(text, i, name));
      });
      if (match) {
        if (plain) {
          runs.push({
            text: plain,
            bold: false
          });
          plain = '';
        }
        runs.push({
          text: match,
          bold: true
        });
        i += match.length;
      } else {
        plain += text[i];
        i++;
      }
    }
    if (plain) runs.push({
      text: plain,
      bold: false
    });
    return runs;
  }
  function appendText(parent, value, names) {
    var _iterator2 = _createForOfIteratorHelper(splitNames(value, names)),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var run = _step2.value;
        if (run.bold) {
          var strong = document.createElement('strong');
          strong.textContent = run.text;
          parent.append(strong);
        } else parent.append(document.createTextNode(run.text));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return parent;
  }
  function font(size, bold) {
    return (bold ? '600 ' : '400 ') + size + 'px ' + FONT;
  }
  function wrap(ctx, text, names, size) {
    var width = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : CONTENT_WIDTH;
    var allBold = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    var glyphs = splitNames(text, names).flatMap(function (run) {
        return Array.from(run.text, function (_char) {
          return {
            text: _char,
            bold: allBold || run.bold
          };
        });
      }),
      lines = [];
    var widths = new Map();
    var measure = function measure(glyph) {
      var key = (glyph.bold ? 'b' : 'n') + glyph.text;
      if (!widths.has(key)) {
        ctx.font = font(size, glyph.bold);
        widths.set(key, ctx.measureText(glyph.text).width);
      }
      return widths.get(key);
    };
    var current = [],
      length = 0;
    var flush = function flush() {
      lines.push(current);
      current = [];
      length = 0;
    };
    var _iterator3 = _createForOfIteratorHelper(glyphs),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var glyph = _step3.value;
        if (glyph.text === '\r') continue;
        if (glyph.text === '\n') {
          flush();
          continue;
        }
        var w = measure(glyph);
        if (current.length && length + w > width) {
          // Keep closing punctuation with a preceding character, and move opening
          // brackets with the following text; no glyph is thrown away at a break.
          var carry = [];
          if (/[，。！？；：、）】》」』…,.!?;:)]/.test(glyph.text) && current.length > 1) carry.unshift(current.pop());
          while (current.length > 1 && /[（【《「『(]/.test(current[current.length - 1].text)) carry.unshift(current.pop());
          flush();
          current = carry;
          length = carry.reduce(function (sum, g) {
            return sum + measure(g);
          }, 0);
        }
        current.push(glyph);
        length += w;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    if (current.length || !lines.length) flush();
    return lines;
  }
  function plan(ctx, data) {
    var names = data.names || [],
      rows = [];
    var paragraph = function paragraph(text) {
      var _options$gap;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var size = options.size || 34,
        height = options.height || 58;
      var _iterator4 = _createForOfIteratorHelper(wrap(ctx, String(text), names, size, CONTENT_WIDTH, !!options.bold)),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var glyphs = _step4.value;
          rows.push({
            glyphs: glyphs,
            size: size,
            height: height,
            color: options.color || INK,
            kind: options.kind || 'text'
          });
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      rows.push({
        height: (_options$gap = options.gap) !== null && _options$gap !== void 0 ? _options$gap : 16,
        kind: 'gap'
      });
    };
    var section = function section(text) {
      return paragraph(text, {
        size: 26,
        height: 44,
        bold: true,
        color: RED,
        kind: 'section',
        gap: 8
      });
    };
    paragraph(data.subject, {
      size: 35,
      height: 54,
      bold: true,
      gap: 4
    });
    paragraph(data.ending, {
      size: 48,
      height: 72,
      bold: true,
      color: RED,
      gap: 16
    });
    paragraph(data.endingText, {
      size: 32,
      height: 54,
      gap: 20
    });
    paragraph(data.identity, {
      size: 26,
      height: 43,
      color: MUTED,
      gap: 5
    });
    paragraph(data.metrics, {
      size: 26,
      height: 43,
      color: MUTED,
      gap: 22
    });
    if (data.companion) {
      var partner = data.companion;
      section(partner.title);
      paragraph(partner.name, {
        size: 48,
        height: 72,
        bold: true,
        color: RED,
        kind: 'section',
        gap: 8
      });
      if (partner.yearsText) {
        paragraph(partner.yearsText, {
          size: 34,
          height: 56,
          bold: true,
          gap: 5
        });
        paragraph(partner.periodText, {
          size: 27,
          height: 46,
          color: MUTED,
          gap: 14
        });
      }
      if (partner.outcomeTitle) paragraph(partner.outcomeTitle, {
        size: 32,
        height: 52,
        bold: true,
        gap: 4
      });
      paragraph(partner.outcomeText, {
        size: 32,
        height: 54,
        gap: 18
      });
      if (partner.moments.length) {
        section('相伴拾记');
        var _iterator5 = _createForOfIteratorHelper(partner.moments),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var moment = _step5.value;
            paragraph(moment.time, {
              size: 26,
              height: 44,
              color: RED,
              kind: 'section',
              gap: 2
            });
            paragraph(moment.text, {
              size: 32,
              height: 54,
              gap: 18
            });
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
    }
    section('四属性');
    paragraph('落笔 → 结算 · 属性上限30', {
      size: 24,
      height: 39,
      color: MUTED,
      gap: 4
    });
    paragraph(data.stats.map(function (stat) {
      return "".concat(stat.label, " ").concat(stat.initial, " → ").concat(stat["final"]);
    }).join('　'), {
      size: 30,
      height: 50,
      gap: 18
    });
    section('随身天赋');
    paragraph(data.talents.join(' · ') || '无', {
      size: 30,
      height: 50,
      gap: 18
    });
    section('这一生的心愿');
    paragraph(data.goal, {
      size: 30,
      height: 50,
      gap: 4
    });
    paragraph(data.goalDescription, {
      size: 27,
      height: 46,
      color: MUTED,
      gap: 24
    });
    section('一生总结');
    var _iterator6 = _createForOfIteratorHelper(data.paragraphs),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var text = _step6.value;
        paragraph(text);
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    var pages = [];
    var page = {
      rows: [],
      used: CONTENT_TOP
    };
    function finish() {
      page.height = Math.min(MAX_HEIGHT, Math.max(1100, Math.ceil(page.used + FOOTER)));
      pages.push(page);
      page = {
        rows: [],
        used: CONTENT_TOP
      };
    }
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      if (row.kind === 'gap' && !page.rows.length) continue;
      var reserve = 0;
      if (row.kind === 'section') for (var j = i + 1; j < rows.length; j++) {
        reserve += rows[j].height;
        if (rows[j].kind !== 'gap') break;
      }
      if (page.rows.length && page.used + row.height + reserve > MAX_HEIGHT - FOOTER) finish();
      if (row.kind === 'gap' && !page.rows.length) continue;
      page.rows.push(_objectSpread(_objectSpread({}, row), {}, {
        y: page.used
      }));
      page.used += row.height;
    }
    if (page.rows.length) finish();
    return pages;
  }
  function line(ctx, x1, y1, x2, y2) {
    var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : LINE;
    var width = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  function draw(ctx, page, index, total) {
    var height = page.height;
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, WIDTH, height);
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.strokeRect(35.5, 35.5, WIDTH - 71, height - 71);
    // A torii is drawn as a few straight strokes, without remote artwork.
    line(ctx, 916, 91, 1038, 91, RED, 6);
    line(ctx, 929, 112, 1025, 112, RED, 4);
    line(ctx, 947, 91, 941, 165, RED, 5);
    line(ctx, 1007, 91, 1013, 165, RED, 5);
    line(ctx, 977, 94, 977, 112, RED, 3);
    ctx.fillStyle = RED;
    ctx.fillRect(LEFT, 76, 62, 111);
    ctx.fillStyle = PAPER;
    ctx.font = font(34, true);
    ctx.textBaseline = 'top';
    ctx.fillText('一', 94, 84);
    ctx.fillText('生', 94, 135);
    ctx.fillStyle = INK;
    ctx.font = font(46, true);
    ctx.fillText('幻想乡 · 一生纪', 168, 78);
    ctx.fillStyle = MUTED;
    ctx.font = font(25, false);
    ctx.fillText(index === 0 ? '春去秋来，故事留在纸上。' : '一生总结 · 续卷', 170, 151);
    line(ctx, LEFT, 214, WIDTH - LEFT, 214, RED, 2);
    var _iterator7 = _createForOfIteratorHelper(page.rows),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var row = _step7.value;
        if (!row.glyphs) continue;
        var x = LEFT;
        ctx.fillStyle = row.color;
        var _iterator8 = _createForOfIteratorHelper(row.glyphs),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var glyph = _step8.value;
            ctx.font = font(row.size, glyph.bold);
            ctx.fillText(glyph.text, x, row.y);
            x += ctx.measureText(glyph.text).width;
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
    line(ctx, LEFT, height - 88, WIDTH - LEFT, height - 88);
    ctx.fillStyle = MUTED;
    ctx.font = font(21, false);
    ctx.fillText('东方Project同人 · 角色原作：上海爱丽丝幻乐团 / ZUN', LEFT, height - 65);
    ctx.fillStyle = RED;
    ctx.font = font(22, true);
    ctx.textAlign = 'right';
    ctx.fillText("".concat(index + 1, " / ").concat(total), WIDTH - LEFT, height - 65);
    ctx.textAlign = 'left';
  }
  function cancelled() {
    var error = new Error('此卷已重开，图片生成已取消。');
    error.name = 'AbortError';
    return error;
  }
  function png(canvas) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var timer = setTimeout(function () {
        return finish(null, new Error('图片编码超时，请重试。'));
      }, 15000);
      function finish(blob, error) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (error) reject(error);else if (!blob || !blob.size || blob.type !== 'image/png') reject(new Error('浏览器未能生成 PNG 图片，请重试。'));else resolve(blob);
      }
      try {
        if (typeof canvas.toBlob === 'function') canvas.toBlob(function (blob) {
          return finish(blob);
        }, 'image/png');else {
          var url = canvas.toDataURL('image/png');
          if (!url.startsWith('data:image/png;base64,')) throw new Error('此浏览器无法编码 PNG 图片。');
          var binary = atob(url.slice(url.indexOf(',') + 1)),
            bytes = new Uint8Array(binary.length);
          for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
          finish(new Blob([bytes], {
            type: 'image/png'
          }));
        }
      } catch (error) {
        finish(null, error);
      }
    });
  }
  function create(_x) {
    return _create.apply(this, arguments);
  }
  function _create() {
    _create = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data) {
      var _globalThis$URL, _globalThis$URL2;
      var isCurrent,
        onProgress,
        canvas,
        ctx,
        pages,
        results,
        i,
        blob,
        _args = arguments;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            isCurrent = _args.length > 1 && _args[1] !== undefined ? _args[1] : function () {
              return true;
            };
            onProgress = _args.length > 2 && _args[2] !== undefined ? _args[2] : function () {};
            if (isCurrent()) {
              _context.n = 1;
              break;
            }
            throw cancelled();
          case 1:
            if (!(!((_globalThis$URL = globalThis.URL) !== null && _globalThis$URL !== void 0 && _globalThis$URL.createObjectURL) || !((_globalThis$URL2 = globalThis.URL) !== null && _globalThis$URL2 !== void 0 && _globalThis$URL2.revokeObjectURL))) {
              _context.n = 2;
              break;
            }
            throw new Error('此浏览器无法预览本地图片，请换用支持图片文件的浏览器。');
          case 2:
            canvas = document.createElement('canvas');
            canvas.width = WIDTH;
            canvas.height = 1;
            ctx = canvas.getContext('2d');
            if (ctx) {
              _context.n = 3;
              break;
            }
            throw new Error('此浏览器未提供画布，无法生成图片。');
          case 3:
            pages = plan(ctx, data), results = [];
            _context.p = 4;
            i = 0;
          case 5:
            if (!(i < pages.length)) {
              _context.n = 11;
              break;
            }
            _context.n = 6;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 0);
            });
          case 6:
            if (isCurrent()) {
              _context.n = 7;
              break;
            }
            throw cancelled();
          case 7:
            onProgress(i + 1, pages.length);
            canvas.width = WIDTH;
            canvas.height = pages[i].height;
            draw(ctx, pages[i], i, pages.length);
            _context.n = 8;
            return png(canvas);
          case 8:
            blob = _context.v;
            if (isCurrent()) {
              _context.n = 9;
              break;
            }
            throw cancelled();
          case 9:
            results.push({
              blob: blob,
              width: WIDTH,
              height: pages[i].height
            });
          case 10:
            i++;
            _context.n = 5;
            break;
          case 11:
            return _context.a(2, results);
          case 12:
            _context.p = 12;
            canvas.width = 1;
            canvas.height = 1;
            return _context.f(12);
          case 13:
            return _context.a(2);
        }
      }, _callee, null, [[4,, 12, 13]]);
    }));
    return _create.apply(this, arguments);
  }
  globalThis.TouhouMemoirImage = {
    createNames: createNames,
    splitNames: splitNames,
    appendText: appendText,
    create: create,
    plan: plan,
    width: WIDTH,
    maxHeight: MAX_HEIGHT
  };
})();
