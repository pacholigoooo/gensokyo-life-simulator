function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* One lifecycle and event selector for ordinary and named lives. */
(function () {
  var STATS = ['health', 'insight', 'bond', 'fortune'];
  var LABELS = {
    health: '体魄',
    insight: '悟性',
    bond: '缘分',
    fortune: '家底'
  };
  var PHASES = ['初始', '成长', '立足', '盛年', '晚期'];
  var H = globalThis.TouhouHealth,
    O = globalThis.TouhouOpportunities,
    R = globalThis.TouhouRelationships,
    S = globalThis.TouhouSpiritual,
    C = globalThis.TouhouContacts,
    TS = globalThis.TouhouTalentStories,
    A = globalThis.TouhouAfterlife,
    K = globalThis.TouhouCareers,
    L = globalThis.TouhouLongYears;
  var forms = _objectSpread(_objectSpread({}, O.forms), A.forms);
  var SPECIES = {
    human: '人类',
    "long": '长生者',
    eternal: '不死者',
    fairy: '妖精',
    spirit: '灵体',
    beast: '兽类',
    construct: '构造物'
  };
  function random(seed) {
    var x = seed >>> 0;
    return function () {
      x += 0x6D2B79F5;
      var t = Math.imul(x ^ x >>> 15, 1 | x);
      t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function validateAllocation(stats) {
    if (!stats || STATS.some(function (k) {
      return !Number.isInteger(stats[k]) || stats[k] < 0 || stats[k] > 10;
    }) || STATS.reduce(function (sum, k) {
      return sum + stats[k];
    }, 0) !== 20) throw new Error('请分配20点，每项0至10点。');
  }
  function validateWeights(w) {
    if (['ordinary', 'main', 'hifuu', 'pc98'].some(function (k) {
      return !Number.isFinite(w[k]) || w[k] < 0;
    }) || Math.abs(w.ordinary + w.main + w.hifuu + w.pc98 - 1) > 1e-10) throw new Error('身份概率之和必须为1。');
  }
  function drawCategory(rng) {
    var w = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : globalThis.TouhouConfig;
    var n = rng();
    for (var _i = 0, _arr = ['ordinary', 'main', 'hifuu', 'pc98']; _i < _arr.length; _i++) {
      var k = _arr[_i];
      n -= w[k];
      if (n < 0) return k;
    }
    return 'pc98';
  }
  function drawIdentity(rng) {
    var characters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : globalThis.TouhouContent;
    var w = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : globalThis.TouhouConfig;
    var category = drawCategory(rng, w);
    if (category === 'ordinary') return null;
    var pool = characters.filter(function (c) {
      return c.category === category;
    });
    if (!pool.length) throw new Error("缺少".concat(category, "人物。"));
    return pool[Math.floor(rng() * pool.length)];
  }
  function isAnimal(s) {
    var _s$character;
    return s.body === 'beast' || ((_s$character = s.character) === null || _s$character === void 0 ? void 0 : _s$character.animalMind) === true;
  }
  function phase(turn) {
    return turn < 9 ? 0 : turn < 20 ? 1 : turn < 40 ? 2 : turn < 65 ? 3 : 4;
  }
  function time(s) {
    if (s.named) return s.named.time;
    if (s.mortalDeath) return "生前".concat(Math.floor(s.mortalDeath.age), "岁 · 身后").concat(Number((s.age - s.mortalDeath.age).toFixed(1)), "年");
    if (s.life === 'beast' && s.age > 0 && s.age < 1) return "".concat(Math.round(s.age * 24) / 2, "个月");
    var age = Number(s.age.toFixed(1));
    return s.life === 'construct' ? "使用".concat(age, "年") : s.life === 'human' || s.life === 'beast' || s.transformation ? "".concat(age, "岁") : "第".concat(age, "年");
  }
  function change(s, effects) {
    var applied = {};
    for (var _i2 = 0, _Object$entries = Object.entries(effects); _i2 < _Object$entries.length; _i2++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
        k = _Object$entries$_i[0],
        v = _Object$entries$_i[1];
      var before = s.stats[k];
      s.stats[k] = Math.max(0, Math.min(30, before + v));
      applied[k] = s.stats[k] - before;
    }
    return applied;
  }
  function add(s, id, text) {
    var effects = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var extra = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    var entry = _objectSpread({
      id: id,
      turn: s.turn,
      age: s.age,
      phase: s.phase,
      time: time(s),
      text: text,
      effects: change(s, effects)
    }, extra);
    s.log.push(entry);
    return entry;
  }
  function advanceAge(s) {
    var _s$character2;
    // turn 计常规时间推进，age 是故事行年；身体老化另由健康模块维护 bodyAge。
    // 阿求来往与未完成舍虫的魔法使优先逐年推进，避免长生步幅跨过短寿或修习期限。
    if (globalThis.TouhouAkyuu.annual(s)) return s.age + 1;
    if (S.agingMagic(s)) return s.age + 1;
    if (s.transformation) return s.age + (s.turn - s.transformation.turn <= 10 ? 1 : forms[s.species].stride);
    if (s.magic) return s.age + (s.turn <= 12 ? 1 : s.turn <= 50 ? 5 : 1);
    if ((_s$character2 = s.character) !== null && _s$character2 !== void 0 && _s$character2.lifeYears) return s.targetYears * s.turn / s.horizon;
    if (s.life === 'beast') return s.turn <= 8 ? s.turn / 24 : 1 / 3 + (s.turn - 8) / 4;
    if (s.life === 'human' || s.life === 'construct') return s.turn;
    var stride = {
      "long": 5,
      eternal: 20,
      fairy: 2,
      spirit: 4
    }[s.life];
    return s.turn <= 12 ? s.turn : s.turn <= 50 ? 12 + (s.turn - 12) * stride : 12 + 38 * stride + s.turn - 50;
  }
  function meet(s, id, rng) {
    var _profile$span;
    if (s.people[id]) return;
    var c = globalThis.TouhouContent.find(function (c) {
      return c.id === id;
    });
    var mortal = (c === null || c === void 0 ? void 0 : c.life) === 'human' || (c === null || c === void 0 ? void 0 : c.life) === 'beast' || id.startsWith('local:');
    var name = (c === null || c === void 0 ? void 0 : c.name) || {
      'local:childhood': '幼时相识',
      'local:neighbor': '邻居',
      'local:friend': '同道',
      'local:student': '后辈',
      'local:spouse': '相识的村民'
    }[id];
    if (!name) throw new Error("未知同伴".concat(id));
    var remaining = mortal ? c !== null && c !== void 0 && c.lifeYears ? 18 : (c === null || c === void 0 ? void 0 : c.life) === 'beast' ? 18 + Math.floor(rng() * 9) : id === 'local:student' ? 48 + Math.floor(rng() * 18) : ['human', 'beast'].includes(s.life) && id.startsWith('local:') ? Math.max(12, 68 - s.age) + Math.floor(rng() * 18) : 36 + Math.floor(rng() * 20) : Infinity;
    var profile = globalThis.TouhouPartnerLearning.personProfile(id);
    s.people[id] = {
      name: name,
      alive: true,
      close: 1,
      metAt: s.age,
      leaveAt: s.age + ((_profile$span = profile === null || profile === void 0 ? void 0 : profile.span) !== null && _profile$span !== void 0 ? _profile$span : remaining),
      species: (profile === null || profile === void 0 ? void 0 : profile.species) || 'human',
      life: (profile === null || profile === void 0 ? void 0 : profile.life) || 'human',
      career: (profile === null || profile === void 0 ? void 0 : profile.career) || null,
      ageless: (profile === null || profile === void 0 ? void 0 : profile.ageless) || false
    };
    globalThis.TouhouAkyuu.initPerson(s, id, s.people[id], rng);
  }
  function early(s) {
    if (s.turn === 1) {
      var good = s.initial.health >= 6;
      s.flags.add(good ? 'sturdy' : 'fragile');
      add(s, 'early-health', s.body === 'machine' ? good ? '机身运转平稳，很快能独自巡行。' : '关节偶尔卡顿，你慢慢调匀步子。' : s.body === 'beast' ? good ? '你渐渐熟悉身体，很快便能自在活动。' : '你安静待在暖处，慢慢积蓄气力。' : s.body === 'spirit' ? good ? '魂魄渐稳，你认清了最初的归处。' : '影子时聚时散，你花时间稳住自己。' : good ? '你精力充足，总想看看门外的世界。' : '你常在窗边歇息，留心屋外的声音。', good ? {
        health: 1
      } : {}, {
        reason: "初始体魄".concat(s.initial.health)
      });
    }
    if (s.turn === 2) {
      var _good = s.initial.insight >= 6;
      s.flags.add(_good ? 'quick-learner' : 'patient-learner');
      if (_good) s.xp++;
      add(s, 'early-insight', s.life === 'human' && s.age < 1 ? _good ? '你很快认出熟悉的声音，循声转过头。' : '你反复听熟悉的声音，慢慢认出身旁的人。' : isAnimal(s) ? _good ? '你记住了来往的声响，独自寻到熟悉的角落。' : '你循着熟悉的动静，慢慢辨认回去的路。' : s.body === 'machine' ? _good ? '你辨出旧记录中的错位，校准了动作。' : '你逐条重做记录，慢慢认全指令。' : _good ? '几个零散线索，让你忽然懂得一件事。' : '你反复练习，终于记牢了一件小事。', _good ? {
        insight: 1
      } : {}, {
        reason: "初始悟性".concat(s.initial.insight)
      });
    }
    if (s.turn === 3) {
      var _s$character3;
      var _good2 = s.initial.bond >= 6;
      s.flags.add(_good2 ? 'outgoing' : 'quiet');
      if (_good2) meet(s, 'local:childhood', random(s.seed ^ 41));
      add(s, 'early-bond', _good2 ? s.life === 'human' && s.age < 2 ? '熟悉的面孔常在身旁，你渐渐认得来往的人。' : (_s$character3 = s.character) !== null && _s$character3 !== void 0 && _s$character3.confined ? '守候的身影记住了你，偶尔回应你的目光。' : '常来往的邻伴记住了你，约好下回相见。' : '你独自待了一阵，慢慢习惯这片地方。', _good2 ? {
        bond: 1
      } : {}, {
        reason: "初始缘分".concat(s.initial.bond)
      });
    }
  }
  function createLife(_ref) {
    var _character, _character2, _character3;
    var stats = _ref.stats,
      _ref$talents = _ref.talents,
      talents = _ref$talents === void 0 ? [] : _ref$talents,
      character = _ref.character,
      _ref$seed = _ref.seed,
      seed = _ref$seed === void 0 ? Date.now() : _ref$seed,
      _ref$goal = _ref.goal,
      goal = _ref$goal === void 0 ? 'none' : _ref$goal,
      _ref$romanceWish = _ref.romanceWish,
      romanceWish = _ref$romanceWish === void 0 ? null : _ref$romanceWish;
    if (!goals.some(function (g) {
      return g.id === goal;
    })) throw Error('请选择已有的人生目标。');
    if (romanceWish !== null && (goal !== 'romance' || !globalThis.TouhouRelationshipData.some(function (r) {
      return r.id === romanceWish && r.romance;
    }))) throw Error('请选择已有情缘人物。');
    validateAllocation(stats);
    if (talents.length) globalThis.TouhouTalents.validate(talents);
    talents = _toConsumableArray(talents).sort(function (a, b) {
      return globalThis.TouhouTalents.list.findIndex(function (t) {
        return t.id === a;
      }) - globalThis.TouhouTalents.list.findIndex(function (t) {
        return t.id === b;
      });
    });
    if (character === undefined) character = drawIdentity(random(seed), globalThis.TouhouContent);
    var rng = random(seed ^ 0x71ed),
      profile = character || {
        life: 'human',
        body: 'humanoid',
        realm: 'gensokyo',
        family: true,
        career: null
      };
    var horizon = 72 + Math.floor(rng() * 18) + stats.health;
    var s = {
      seed: seed,
      initial: _objectSpread({}, stats),
      stats: _objectSpread({}, stats),
      allocated: _objectSpread({}, stats),
      talents: _toConsumableArray(talents),
      talentSeen: {},
      character: character,
      life: profile.life,
      body: profile.body,
      realm: profile.originRealm || profile.realm,
      hasFamily: profile.family,
      turn: 0,
      age: 0,
      phase: 0,
      horizon: horizon,
      targetYears: profile.lifeYears ? profile.lifeYears[0] + rng() * (profile.lifeYears[1] - profile.lifeYears[0]) : null,
      ended: false,
      score: 0,
      log: [],
      history: [],
      seen: {},
      flags: new Set(),
      people: {},
      location: ((_character = character) === null || _character === void 0 ? void 0 : _character.originLocation) || (((_character2 = character) === null || _character2 === void 0 ? void 0 : _character2.realm) === 'outside' ? '外界的住处' : ((_character3 = character) === null || _character3 === void 0 ? void 0 : _character3.location) || '人类村落'),
      career: profile.career,
      careerHistory: profile.career ? [{
        id: profile.career,
        age: 0,
        event: 'origin'
      }] : [],
      xp: 0,
      species: profile.life,
      habitat: character ? 'other' : 'village',
      transformation: null,
      opportunity: null,
      opportunityAttempts: 0,
      failedPaths: [],
      pathHistory: [],
      lastChanges: Object.fromEntries(STATS.map(function (k) {
        return [k, 0];
      })),
      home: profile.fixedHome === true,
      tools: false,
      remedy: false,
      injured: false,
      educated: false,
      retired: false,
      parentsAlive: profile.family,
      parentsLeaveAt: 40 + Math.floor(rng() * 19),
      married: false,
      courtshipAt: null,
      childBorn: null,
      childIndependent: false
    };
    s.goal = goal;
    s.romanceWish = romanceWish;
    s.childhood = [];
    if (character && !character.chronicle) throw Error('缺少人物前史：' + character.id);
    if (!character) add(s, 'origin', '你出生在人类村落，屋外响着清晨的叫卖声。');
    s.remedyAt = 0;
    var initialEffects = {};
    var _iterator = _createForOfIteratorHelper(talents),
      _step;
    try {
      var _loop = function _loop() {
        var id = _step.value;
        var t = globalThis.TouhouTalents.list.find(function (t) {
          return t.id === id;
        });
        s.flags.add('talent:' + id);
        if (t.flag) s.flags.add('talent:' + t.flag);
        var fx = t.id === 'handy' && isAnimal(s) ? {
          fortune: 1
        } : t.initial || {};
        for (var _i3 = 0, _Object$entries2 = Object.entries(fx); _i3 < _Object$entries2.length; _i3++) {
          var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i3], 2),
            stat = _Object$entries2$_i[0],
            value = _Object$entries2$_i[1];
          initialEffects[stat] = (initialEffects[stat] || 0) + value;
        }
        if (t.start === 'tools') {
          if (!isAnimal(s)) s.tools = true;
        } else if (t.start) s[t.start] = true;
        s.horizon += t.years || 0;
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (character) change(s, initialEffects);else if (Object.keys(initialEffects).length) add(s, 'talent-start', '随身天赋显出最初的影响。', initialEffects, {
      reason: talents.map(function (id) {
        return globalThis.TouhouTalents.list.find(function (t) {
          return t.id === id;
        }).name;
      }).join(' · ')
    });
    s.initial = _objectSpread({}, s.stats);
    s.horizon += s.stats.health - stats.health;
    H.init(s, rng);
    R.init(s);
    S.init(s, rng);
    A.init(s);
    K.init(s);
    L.init(s);
    if (talents.includes('healthful')) s.vitality += 5;
    var rich = s.initial.fortune >= 7,
      poor = s.initial.fortune <= 3;
    s.flags.add(rich ? 'well-supplied' : poor ? 'scarce' : 'modest');
    if (rich) {
      s.tools = !isAnimal(s);
      s.home = true;
    }
    if (character) {
      initNamed(s);
      return s;
    }
    add(s, 'early-fortune', s.body === 'beast' ? rich ? '最初的栖处遮风避雨，食物也很充足。' : poor ? '栖处缺少食物，你学会留意周围。' : '栖处不大，足够安静歇息。' : s.body === 'machine' ? rich ? '备用零件齐全，你有一处固定的工房。' : poor ? '可用零件不多，每次修整都得仔细。' : '旧工具摆在身边，足够最初的维护。' : rich ? '起居用度宽裕，你有了安稳的落脚处。' : poor ? '你手边的用度不多，得把每件东西用妥。' : '最初的日子平实，日常用度刚好够用。', {}, {
      reason: "初始家底".concat(s.initial.fortune)
    });
    return s;
  }
  function eligible(s, e) {
    var _s$character4, _e$requires, _e$excludes, _e$with, _e$with2, _e$remember;
    if (s.ended) return false;
    if ((s.afterlife || s.dormant) && !e.id.startsWith('development:')) return false;
    if (e.habitats && !e.habitats.includes(s.habitat)) return false;
    if (e.species && !e.species.includes(s.species)) return false;
    if ((_s$character4 = s.character) !== null && _s$character4 !== void 0 && _s$character4.confined && e.needsFreedom) return false;
    if (e.phases && (s.phase < e.phases[0] || s.phase > e.phases[1])) return false;
    // 人物续篇使用相对年数；旧事件的出生年龄门槛由已审读的成熟阶段正文取代。
    var continuedPersonal = s.named && s.character.events.some(function (personal) {
      return personal.id === e.id;
    });
    if (!continuedPersonal && (e.minAge !== undefined && s.age < e.minAge || e.maxAge !== undefined && s.age > e.maxAge)) return false;
    if (e.bodies && !e.bodies.includes(s.body) || e.realms && !e.realms.includes(s.realm) || e.lives && !e.lives.includes(s.life)) return false;
    if (e.careers && !e.careers.includes(s.career)) return false;
    if (e.min && Object.entries(e.min).some(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
        k = _ref3[0],
        v = _ref3[1];
      return s.stats[k] < v;
    }) || e.max && Object.entries(e.max).some(function (_ref4) {
      var _ref5 = _slicedToArray(_ref4, 2),
        k = _ref5[0],
        v = _ref5[1];
      return s.stats[k] > v;
    })) return false;
    if ((_e$requires = e.requires) !== null && _e$requires !== void 0 && _e$requires.some(function (f) {
      return !s.flags.has(f);
    }) || (_e$excludes = e.excludes) !== null && _e$excludes !== void 0 && _e$excludes.some(function (f) {
      return s.flags.has(f);
    })) return false;
    if ((_e$with = e["with"]) !== null && _e$with !== void 0 && _e$with.some(function (id) {
      var _s$people$id;
      return ((_s$people$id = s.people[id]) === null || _s$people$id === void 0 ? void 0 : _s$people$id.alive) === false;
    })) return false;
    if ((_e$with2 = e["with"]) !== null && _e$with2 !== void 0 && _e$with2.some(function (id) {
      return ['human', 'beast'].includes(globalThis.TouhouContent.find(function (c) {
        return c.id === id;
      }).life);
    }) && s.character && !s.named && !['human', 'beast', 'construct'].includes(s.life) && s.turn < 50) return false;
    if ((_e$remember = e.remember) !== null && _e$remember !== void 0 && _e$remember.some(function (id) {
      return !s.people[id];
    })) return false;
    if (e.when && !e.when(s)) return false;
    if ((s.seen[e.id] || 0) >= (e.repeat || 1) || s.history.slice(-10).includes(e.id)) return false;
    return true;
  }
  function weight(s, e) {
    var value = e.weight;
    if (e.id === 'chance:magician-found' && s.flags.has('legend:insight')) value *= 2.5;
    if (e.id === 'chance:kami-found' && s.flags.has('legend:faith')) value *= globalThis.TouhouLifeConfig.faithOpportunityMultiplier;
    if (e.id === 'chance:youkai-found' && s.flags.has('talent-clue:youkai')) value *= 4;
    for (var _i4 = 0, _Object$entries3 = Object.entries(e.bias || {}); _i4 < _Object$entries3.length; _i4++) {
      var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i4], 2),
        stat = _Object$entries3$_i[0],
        direction = _Object$entries3$_i[1];
      value *= direction > 0 ? (2 + s.stats[stat]) / 7 : 14 / (4 + s.stats[stat]);
    }
    var _iterator2 = _createForOfIteratorHelper(s.talents),
      _step2;
    try {
      var _loop2 = function _loop2() {
        var _globalThis$TouhouTal;
        var id = _step2.value;
        if ((_globalThis$TouhouTal = globalThis.TouhouTalents.list.find(function (t) {
          return t.id === id;
        }).boost) !== null && _globalThis$TouhouTal !== void 0 && _globalThis$TouhouTal.includes(e.id)) value *= 2;
      };
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        _loop2();
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (e.talentBoost) value *= Math.min(3, Math.pow(1.8, s.talents.filter(function (id) {
      return e.talentBoost.includes(id);
    }).length));
    return value / (1 + (s.seen[e.id] || 0) * 1.5);
  }
  function choose(s, pool, rng) {
    var n = rng() * pool.reduce(function (sum, e) {
      return sum + weight(s, e);
    }, 0);
    var _iterator3 = _createForOfIteratorHelper(pool),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var e = _step3.value;
        n -= weight(s, e);
        if (n < 0) return e;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return pool[pool.length - 1];
  }
  function applyEvent(s, e, rng) {
    var _s$relations$relation;
    var developer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var previousPartner = R.partner(s);
    var relationId = e.id.startsWith('relation:') ? e["with"][0] : null,
      previousStatus = relationId ? (_s$relations$relation = s.relations[relationId]) === null || _s$relations$relation === void 0 ? void 0 : _s$relations$relation.status : null;
    if (e.set) e.set.forEach(function (f) {
      return s.flags.add(f);
    });
    if (e.clear) e.clear.forEach(function (f) {
      return s.flags["delete"](f);
    });
    var _iterator4 = _createForOfIteratorHelper(e["with"] || []),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var id = _step4.value;
        meet(s, id, rng);
        s.people[id].close++;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    var hadRemedy = s.remedy,
      oldCareer = s.career;
    if (e.apply) e.apply(s, rng);
    s.xp += e.xp || 0;
    if (!hadRemedy && s.remedy) s.remedyAt = s.age;
    if (s.career !== oldCareer) s.careerHistory.push({
      id: s.career,
      age: s.age,
      event: e.id
    });
    var baseReason = e.min ? Object.entries(e.min).map(function (_ref6) {
      var _ref7 = _slicedToArray(_ref6, 2),
        k = _ref7[0],
        v = _ref7[1];
      return "".concat(LABELS[k], "≥").concat(v);
    }).join(' · ') : e.max ? Object.entries(e.max).map(function (_ref8) {
      var _ref9 = _slicedToArray(_ref8, 2),
        k = _ref9[0],
        v = _ref9[1];
      return "".concat(LABELS[k], "≤").concat(v);
    }).join(' · ') : e.bias ? Object.entries(e.bias).map(function (_ref0) {
      var _ref1 = _slicedToArray(_ref0, 2),
        k = _ref1[0],
        v = _ref1[1];
      return "".concat(LABELS[k]).concat(v > 0 ? '带来机会' : '影响际遇');
    }).join(' · ') : undefined;
    var related = s.talents.filter(function (id) {
      var _e$talentBoost;
      return (_e$talentBoost = e.talentBoost) === null || _e$talentBoost === void 0 ? void 0 : _e$talentBoost.includes(id);
    }).map(function (id) {
      return globalThis.TouhouTalents.list.find(function (t) {
        return t.id === id;
      }).name;
    });
    var reason = [developer ? '开发者触发' : '', baseReason, related.length ? related.join('、') + '带来机缘' : ''].filter(Boolean).join(' · ');
    var relation = relationId ? s.relations[relationId] : null;
    var relationship = relation ? {
      id: relationId,
      name: s.people[relationId].name,
      from: previousStatus,
      to: relation.status,
      stage: relation.label,
      visits: relation.visits
    } : undefined;
    var relationshipMoment = e.relationshipMoment || R.partnerChange(s, previousPartner) || (relationId ? R.romanceClosure(s, relationId) : undefined);
    add(s, e.id, typeof e.text === 'function' ? e.text(s) : e.text, e.effects, _objectSpread(_objectSpread({
      reason: reason,
      "with": e["with"],
      remember: e.remember,
      scene: e.scene,
      premise: e.premise,
      contactMedium: e.contactMedium,
      relationship: relationship,
      relationshipMoment: relationshipMoment,
      developmentMoment: e.developmentMoment,
      sharedWith: e.sharedWith
    }, e.circleOf ? {
      circleOf: e.circleOf
    } : {}), developer ? {
      developer: true
    } : {}));
    H.event(s, e);
    s.seen[e.id] = (s.seen[e.id] || 0) + 1;
    s.history.push(e.id);
    s.flags.add('event:' + e.id);
  }
  function recover(s) {
    if (s.injured) {
      s.injured = false;
      var remedy = s.remedy;
      s.remedy = false;
      H.strain(s, remedy ? -1.5 : -.5, '伤后调养');
      add(s, 'recovery', s.body === 'machine' ? remedy ? '备好的替换件派上用场，机身恢复运作。' : '受损的机件修好之后，你重新活动起来。' : s.body === 'beast' ? remedy ? '你伏回窝里，药草的气味伴着伤痛慢慢散去。' : '你在熟悉的窝里休养，伤处慢慢愈合。' : remedy ? '先前备下的药草派上用场，伤势渐渐好了。' : '你停下手边的事，养好了上次受的伤。', {
        health: remedy ? 2 : 1
      });
    }
  }
  function upkeep(s) {
    var _s$people$localChild;
    if (s.dormant) return;
    var previousPartner = R.partner(s);
    var partnerFarewell = null;
    if (s.remedy && s.body !== 'machine' && s.age - s.remedyAt >= 3) {
      s.remedy = false;
      add(s, 'remedy-expired', '存下的药草已经受潮，没法再用了。');
    }
    if (s.parentsAlive && s.age >= s.parentsLeaveAt) {
      s.parentsAlive = false;
      add(s, 'parents-farewell', '长辈相继离世，旧物留在熟悉的屋里。', {
        bond: -1
      });
    }
    // leaveAt is a death deadline only for aging companions. Chapter limits belong
    // to the protagonist's ending and must never turn a long-lived friend into a death.
    // A finite dream contact ends the dream connection, even for an ageless actor.
    for (var _i5 = 0, _Object$entries4 = Object.entries(s.people); _i5 < _Object$entries4.length; _i5++) {
      var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i5], 2),
        id = _Object$entries4$_i[0],
        p = _Object$entries4$_i[1];
      if (p.alive && s.age >= p.leaveAt && (p.medium === 'dream' || !p.ageless)) {
        if (id === 'akyuu') globalThis.TouhouAkyuu.onDeath(s, p);
        p.alive = false;
        var entry = add(s, 'farewell-' + id, R.farewellText(s, id), {
          bond: -1
        });
        if ((previousPartner === null || previousPartner === void 0 ? void 0 : previousPartner.id) === id) partnerFarewell = entry;
      }
    }
    if (s.childBorn !== null && (_s$people$localChild = s.people['local:child']) !== null && _s$people$localChild !== void 0 && _s$people$localChild.alive && !s.childIndependent && s.age - s.childBorn >= 18) {
      s.childIndependent = true;
      add(s, 'child-grown', s.afterlife ? '后辈在祭日说起，孩子已经有了自己的生活。' : '孩子有了自己的生活，偶尔捎回一封家书。', {
        bond: 1
      });
    }
    R.upkeep(s);
    if (partnerFarewell) partnerFarewell.relationshipMoment = R.partnerChange(s, previousPartner);
    if (!s.dormant && (s.life === 'human' || S.agingMagic(s)) && s.bodyAge >= 60 && s.turn % 5 === 0) add(s, 'aging', '这些年气力渐衰，你把日常节奏放慢了一点。', {
      health: -1
    });
    if (s.life === 'beast' && s.phase === 4 && s.turn % 6 === 0) change(s, {
      health: -1
    });
    if (s.phase === 4 && !s.retired) {
      var _s$character5;
      s.retired = true;
      add(s, 'late-life', s.body === 'beast' ? s.life === 'eternal' ? '你更常静静伏着，留意周围细小的变化。' : '活动渐少，你更常在熟悉的地方停留。' : s.body === 'machine' ? (_s$character5 = s.character) !== null && _s$character5 !== void 0 && _s$character5.animalMind ? '你减少远行，机件检修时便安静伏着。' : '你减少远行，花更多时间照看旧部件。' : s.life === 'human' ? '你放慢了日常脚步，开始整理多年的旧物。' : '许多旧事已经远去，你把心力放回日常。');
    }
  }
  function triggerTalents(s) {
    var _iterator5 = _createForOfIteratorHelper(s.talents),
      _step5;
    try {
      var _loop3 = function _loop3() {
        var id = _step5.value;
        var t = globalThis.TouhouTalents.list.find(function (t) {
          return t.id === id;
        });
        var _iterator6 = _createForOfIteratorHelper((t.triggers || []).entries()),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var _step6$value = _slicedToArray(_step6.value, 2),
              index = _step6$value[0],
              hook = _step6$value[1];
            var key = id + ':' + index;
            if (hook.once && s.talentSeen[key] || s.talentSeen[key] === s.turn) continue;
            if (hook.at && !hook.at.includes(s.turn) || hook.lowHealth !== undefined && s.stats.health > hook.lowHealth) continue;
            s.talentSeen[key] = s.turn;
            s.xp += hook.xp || 0;
            add(s, 'talent:' + key, hook.text, hook.effects, {
              talent: t.name,
              reason: t.name
            });
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      };
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        _loop3();
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
  }
  function transform(s, kind) {
    var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (s.ended || s.character || s.transformation || s.species !== 'human' || !forms[kind] || s.development && !A.forms[kind] || A.forms[kind] && !A.canTransform(s, kind, context)) throw new Error('当前人生不能再次转变种族。');
    var form = forms[kind];
    s.transformation = {
      kind: kind,
      age: s.age,
      turn: s.turn,
      origin: '人类村落普通人',
      eventId: context.eventId || "chance:".concat(kind, "-2-pass")
    };
    s.transformation.source = context.source || (/^(partner-learning:|guidance:)/.test(s.transformation.eventId) ? 'partner-guidance' : 'independent');
    if (context.mentorId) s.transformation.mentorId = context.mentorId;
    s.pathHistory.push({
      kind: kind,
      result: 'transformed',
      age: s.age
    });
    s.opportunity = null;
    s.species = kind;
    s.life = 'long';
    s.habitat = form.habitat;
    s.location = form.location;
    s.horizon = s.turn + form.chapter + Math.min(24, Math.floor(s.stats.health / 2) + Math.floor(s.xp / 3));
    s.retired = false;
    s.phase = 2;
    s.home = true;
    s.illness = null;
    if (kind === 'magician') {
      H.strain(s, -Math.min(3, s.wear * .1), '舍食修习');
      s.vitality += 5;
    } else {
      s.bodyAge = Math.min(35, s.bodyAge);
      H.strain(s, -s.wear * .7, '蜕变后的身体');
      s.vitality += kind === 'hermit' ? 35 : 50;
    }
    S.onTransform(s, kind);
    A.onTransform(s, kind, context);
    K.onTransform(s, kind);
  }
  function futureLabel(s) {
    return {
      continuation: '二创续篇',
      legacy: '二创余响',
      hypothetical: '二创假设'
    }[s.character.chronicle.future.mode];
  }
  function describeLife(s) {
    var _s$hermit;
    if (s.named) {
      var c = s.character.chronicle;
      return {
        species: c.anchor.identity || s.character.identity,
        status: s.named.stage === 'future' ? futureLabel(s) : '原作回顾',
        time: time(s),
        location: s.location,
        career: globalThis.TouhouEvents.jobs[s.career],
        phaseLabel: s.named.stage === 'future' ? '续篇' : c.anchor.age.label
      };
    }
    var status = [];
    if (s.illness) status.push('咳疾未愈');
    if (s.injured) status.push(s.body === 'machine' ? '机件受损' : '有伤在身');
    if (s.stats.health <= 3) status.push('气力虚弱');else if (H.spent(s) || s.wear > s.vitality * .8) status.push('衰弱渐重');
    if (A.description(s)) status.push(A.description(s));
    if (s.opportunity) status.push({
      youkai: '研习妖术',
      hermit: '山中修持',
      magician: '魔法修习（人类）',
      vampire: '夜客之约'
    }[s.opportunity.kind]);
    if (s.retired) status.push('休居');
    if (s.legendaryMastery) status.push(s.legendaryMastery.title);
    if ((_s$hermit = s.hermit) !== null && _s$hermit !== void 0 && _s$hermit.warned) status.push(s.hermit.prepared ? '追索将近·已有准备' : '追索将近');
    return {
      species: S.description(s) || (s.character ? s.character.identity : s.transformation ? forms[s.species].label : SPECIES[s.species]),
      status: status.join(' · ') || '起居平稳',
      time: time(s),
      location: s.location,
      career: K.description(s)
    };
  }
  function finish(s, cause) {
    var divineEnding = A.divineEnding(s, cause);
    if (divineEnding) {
      s.divineEndingId = cause;
      cause = 'chapter';
    }
    globalThis.TouhouAkyuu.finish(s);
    if (s.development) A.fail(s, 'unfinished');
    if (s.opportunity) {
      s.pathHistory.push({
        kind: s.opportunity.kind,
        result: 'unfinished',
        age: s.age
      });
      s.opportunity = null;
    }
    s.ended = true;
    s.deathCause = cause;
    s.earlyDeath = cause === 'health' || cause === 'pursuit' || cause === 'age' && s.turn < 65;
    if (divineEnding) {
      var _divineEnding = _slicedToArray(divineEnding, 2);
      s.ending = _divineEnding[0];
      s.endingText = _divineEnding[1];
    } else if (A.endings[cause]) {
      var _A$endings$cause = _slicedToArray(A.endings[cause], 2);
      s.ending = _A$endings$cause[0];
      s.endingText = _A$endings$cause[1];
    } else if (cause === 'pursuit') {
      s.ending = '仙途止于此';
      s.endingText = '追索中的重伤夺去了性命，庵里留下旧日的笔记与未尽的功课。';
    } else if (s.earlyDeath) {
      s.ending = s.age < 60 ? '未竟的春秋' : '此生落幕';
      s.endingText = cause === 'age' ? '岁月留下的耗损渐渐积重，你的气力终于走到了尽头。' : s.illness ? '久病耗尽了气力，这一生停在病榻旁的灯下。' : !s.injured ? '身体渐渐衰弱，气力终于耗尽，这一生停在了灯下。' : s.transformation ? '伤势终于压过了新生的力量，你的旧名留在故人记忆里。' : s.body === 'beast' ? '伤病让这一生提早停下，熟悉的巢穴渐渐安静。' : '伤病耗尽了力气，还有些未做完的事，留在了这一年的末尾。';
    } else if (cause === 'age' && s.character && s.life === 'long') {
      s.ending = '此生落幕';
      s.endingText = "岁月积下的耗损终于走到尽头，".concat(s.location, "留下了你的旧物与未竟的心愿。");
    } else if (s.character) {
      s.ending = {
        human: '此生落幕',
        beast: cause === 'chapter' ? '归栖晚年' : '此生归寂',
        construct: '旧物留声',
        fairy: '又一回新生',
        spirit: '尘缘渐远',
        eternal: '长路暂歇',
        "long": '岁月留痕'
      }[s.life];
      s.endingText = s.character[s.score === 2 ? 'success' : s.score === 1 ? 'bittersweet' : 'failure'];
    } else if (s.transformation && cause === 'age') {
      s.ending = ['hermit', 'shikaisen'].includes(s.species) ? '山中灯尽' : '书页合拢';
      s.endingText = ['hermit', 'shikaisen'].includes(s.species) ? '修持曾让衰老迟来，肉身终究走到了尽头。山中旧庵留着你的笔迹，也留着做人的旧名。' : '舍食让你踏入魔法使之列，尚未停下的老化却走到尽头。最初那册魔导书仍留在桌边。';
    } else if (s.transformation) {
      s.ending = forms[s.species].endTitle;
      s.endingText = forms[s.species].endText;
    } else {
      var _s$people$localChild2;
      s.ending = '此生落幕';
      s.endingText = "你在".concat(s.location, "迎来此生的终点，享年").concat(Math.floor(s.age), "岁。").concat(s.childIndependent && (_s$people$localChild2 = s.people['local:child']) !== null && _s$people$localChild2 !== void 0 && _s$people$localChild2.alive ? '孩子收好了留下的家书。' : s.home ? '旧屋还留着生活的痕迹。' : '走过的街巷，收藏了这一生。');
    }
    R.finish(s, cause);
    var farewell = R.departure(s, cause);
    if (farewell) s.endingText += ' ' + farewell;
    s.summary = {
      years: Number(s.age.toFixed(1)),
      events: s.history.length,
      xp: s.xp,
      companions: Object.values(s.people).filter(function (p) {
        return p.alive && p.close >= 2;
      }).length,
      species: describeLife(s).species,
      cause: cause,
      relationships: R.describe(s)
    };
    add(s, 'ending', s.endingText, {}, {
      ending: true
    });
    s.summary.memoir = globalThis.TouhouMemoir.compose(s);
  }
  function completedStep(s, before) {
    var _iterator7 = _createForOfIteratorHelper(STATS),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var k = _step7.value;
        s.lastChanges[k] = s.stats[k] - before[k];
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
    return s;
  }
  function selectOrdinary(s, rng, common) {
    var _s$meetingPlan$curren;
    var rescue = globalThis.TouhouAkyuu.select(s, rng);
    if (rescue) return rescue;
    var development = A.select(s, rng);
    if (development) return development;
    var studyWork = globalThis.TouhouPartnerLearning.needsWork(s) || globalThis.TouhouGuidance.needsWork(s);
    if (studyWork) {
      var _career = K.select(s, rng);
      if (_career) return _career;
    }
    if (eligible(s, O.abandoned)) return O.abandoned;
    // A prepared independent trial gets its own chance before social scheduling can postpone it.
    var progress = O.events.filter(function (e) {
      return eligible(s, e);
    });
    if (progress.length && rng() < .38) return choose(s, progress, rng);
    var starts = [].concat(_toConsumableArray(O.starts), _toConsumableArray(A.starts)).filter(function (e) {
      return eligible(s, e);
    });
    if (starts.length && rng() < O.discoveryChance(s, starts)) return O.discovered(s, choose(s, starts, rng));
    var prospect = C.prospect(s, rng);
    if (prospect) return prospect;
    var local = globalThis.TouhouEvents.localRomance(s, rng, ((_s$meetingPlan$curren = s.meetingPlan.current) === null || _s$meetingPlan$curren === void 0 ? void 0 : _s$meetingPlan$curren.id) === 'local:spouse');
    if (local) return local;
    var relation = R.select(s, rng);
    if (relation) return relation;
    var contact = C.select(s, rng);
    if (contact) return contact;
    var encounters = globalThis.TouhouEncounters.events.filter(function (e) {
      return eligible(s, e);
    });
    var affinityCount = s.talents.filter(function (t) {
      return ['wander', 'forest', 'spirit-eye', 'boundary', 'stargaze'].includes(t);
    }).length;
    if (encounters.length && rng() < Math.min(.3, globalThis.TouhouLifeConfig.encounterChance * (1 + .2 * affinityCount))) return choose(s, encounters, rng);
    var changed = O.after.filter(function (e) {
      return eligible(s, e);
    });
    if (changed.length && rng() < .36) return choose(s, changed, rng);
    var career = studyWork ? null : K.select(s, rng);
    if (career) return career;
    if (!common.length) throw new Error("第".concat(s.turn, "步没有可用生活事件。"));
    return choose(s, common, rng);
  }
  function resolveEnd(s, cause, rng) {
    if (globalThis.TouhouGuidance.protect(s, cause, add)) return;
    if (!A.beforeDeath(s, cause, rng, add)) finish(s, cause);
  }
  function completeEvent(s, event, rng, before) {
    var _s$character6, _s$character7, _s$character8, _s$character9, _s$character0;
    var developer = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    applyEvent(s, event, rng, developer);
    // 身后续事与原有供养同年发生，保留魂形与香火原有的消耗、恢复节奏。
    if (s.afterlife) {
      var continuation = L.select(s);
      if (continuation) applyEvent(s, continuation, rng, developer);
      var divine = A.continuation(s);
      if (divine) applyEvent(s, divine, rng, developer);
    }
    if (['development:shikaisen-transformed', 'development:shikaisen-wake-failed'].includes(event.id)) upkeep(s);
    var vulnerable = ['human', 'beast'].includes(s.life) || !!s.transformation || !!s.hermit || !!s.magic;
    if (s.injured && ((_s$character6 = s.character) !== null && _s$character6 !== void 0 && _s$character6.regenerates || s.life === 'fairy')) {
      s.injured = false;
      add(s, 'regrowth', s.life === 'fairy' ? '散开的灵气重新聚拢，你又活蹦乱跳起来。' : '伤处很快复原，你歇息片刻便重新起身。', {
        health: 2
      });
    }
    if (!s.afterlife && !s.dormant) triggerTalents(s);
    S.resolve(s, add);
    // 死亡原因先于篇章期限结算。chapter 只表示收束观察篇章，不能写成角色自然老死。
    var chapterEnd = (_s$character7 = s.character) !== null && _s$character7 !== void 0 && _s$character7.lifeYears ? s.horizon : Math.max(s.transformation ? s.transformation.turn + 40 : 65, s.horizon - Math.floor(s.wear * .25) + Math.min(6, Math.floor(s.xp / 12)));
    var afterlifeEnd = A.ending(s);
    if (afterlifeEnd) finish(s, afterlifeEnd);else if (s.pendingCause) resolveEnd(s, s.pendingCause, rng);else if (!s.dormant && s.stats.health <= 0 && vulnerable && s.phase >= 2) resolveEnd(s, 'health', rng);else if (H.spent(s)) resolveEnd(s, 'age', rng);else if ((s.life !== 'human' && !S.agingMagic(s) || (_s$character8 = s.character) !== null && _s$character8 !== void 0 && _s$character8.lifeYears) && s.turn >= chapterEnd) resolveEnd(s, (_s$character9 = s.character) !== null && _s$character9 !== void 0 && _s$character9.lifeYears || ((_s$character0 = s.character) === null || _s$character0 === void 0 ? void 0 : _s$character0.id) === 'socrates' ? 'age' : 'chapter', rng);
    return completedStep(s, before);
  }
  function step(s, rng) {
    var _s$dev, _s$dev2, _s$character1, _s$dev3, _s$character10;
    if (s.ended) return s;
    if (s.named) return stepNamed(s, rng);
    // 彼岸归途是同一年内的连续操作；先完成它，再恢复年度推进与同伴寿限检查。
    if (globalThis.TouhouAkyuu.pending(s)) return completeEvent(s, globalThis.TouhouAkyuu.select(s, rng), rng, _objectSpread({}, s.stats));
    if ((_s$dev = s.dev) !== null && _s$dev !== void 0 && _s$dev.enabled && s.dev.pending) {
      var _before = _objectSpread({}, s.stats),
        _event = globalThis.TouhouDev.consume(s, rng);
      if (!_event) return completedStep(s, _before);
      s.dev.waitingSpiritual = false;
      return completeEvent(s, _event, rng, _before, true);
    }
    if ((_s$dev2 = s.dev) !== null && _s$dev2 !== void 0 && _s$dev2.waitingSpiritual) {
      var _before2 = _objectSpread({}, s.stats),
        _event2 = S.select(s, rng);
      if (!_event2) throw Error('待处理的修持阶段已经丢失。');
      s.dev.waitingSpiritual = false;
      s.dev.message = '本阶段已按原概率处理。';
      return completeEvent(s, _event2, rng, _before2);
    }
    var before = _objectSpread({}, s.stats),
      oldAge = s.age;
    if (!s.afterlife && !s.dormant) recover(s);
    s.turn++;
    s.age = advanceAge(s);
    s.phase = s.transformation ? s.turn - s.transformation.turn < 24 ? 2 : s.turn < s.horizon - 18 ? 3 : 4 : phase(s.turn);
    if (((_s$character1 = s.character) === null || _s$character1 === void 0 ? void 0 : _s$character1.realm) === 'outside' && s.age >= 18) s.location = s.phase === 4 ? '外界的住处' : s.character.location;
    var _iterator8 = _createForOfIteratorHelper(((_s$character10 = s.character) === null || _s$character10 === void 0 ? void 0 : _s$character10.moves) || []),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var move = _step8.value;
        if (move.turn === s.turn) {
          s.realm = move.realm;
          s.location = move.location;
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    upkeep(s);
    early(s);
    C.childhood(s, add, meet);
    H.year(s, s.age - oldAge, rng, add);
    A.year(s, s.age - oldAge);
    if (!s.afterlife && !s.dormant) triggerTalents(s);
    if (!s.character && !s.afterlife && !s.dormant && s.age >= 18 && !s.career) {
      s.career = s.stats.insight >= 7 ? 'scholar' : s.stats.health >= 7 ? 'garden' : s.stats.bond >= 7 ? 'trade' : 'craft';
      s.careerHistory.push({
        id: s.career,
        age: s.age,
        event: 'first-work'
      });
      K.init(s);
      s.xp++;
      add(s, 'first-work', '成年以后，你做起' + globalThis.TouhouEvents.jobs[s.career] + '，慢慢学会独立生活。', {
        fortune: 1
      });
    }
    var vulnerable = ['human', 'beast'].includes(s.life) || !!s.transformation || !!s.hermit || !!s.magic;
    var afterlifeEnd = A.ending(s);
    if (afterlifeEnd) {
      finish(s, afterlifeEnd);
      return completedStep(s, before);
    }
    if (!s.dormant && s.stats.health <= 0) {
      if (vulnerable && s.phase >= 2) {
        resolveEnd(s, 'health', rng);
        return completedStep(s, before);
      }
      add(s, 'rest', s.body === 'machine' ? '机件停转了一阵，修整后才又活动起来。' : s.life === 'fairy' ? '身体散入四周的自然，醒来时又是新的一天。' : '你静养了一段时日，等气力重新聚拢。', {
        health: 2
      });
    }
    if (H.spent(s)) {
      resolveEnd(s, 'age', rng);
      return completedStep(s, before);
    }
    var at = [6, 18, 40, 65].indexOf(s.turn);
    if (s.character && at >= 0) {
      var m = s.character.milestones[at];
      if (m.check) {
        var passed = s.stats[m.check.stat] >= m.check.min;
        if (passed) s.score++;
        add(s, "milestone-".concat(at), passed ? m.pass : m.fail, passed ? m.passEffects : m.failEffects, {
          check: _objectSpread(_objectSpread({}, m.check), {}, {
            passed: passed
          })
        });
      } else add(s, "milestone-".concat(at), m.text, m.effects);
    }
    var common = globalThis.TouhouEvents.events.filter(function (e) {
      return !e.localRomance && eligible(s, e);
    });
    if ((_s$dev3 = s.dev) !== null && _s$dev3 !== void 0 && _s$dev3.enabled && S.select(s, function () {
      return .5;
    })) {
      s.dev.waitingSpiritual = true;
      s.dev.pauseRequested = true;
      s.dev.message = '已到修持或追索的关键时刻。可指定本阶段结果，或继续按原概率推进。';
      return completedStep(s, before);
    }
    var development = s.afterlife || s.dormant ? A.select(s, rng) : null;
    var spiritual = development ? null : S.select(s, rng),
      talentStory = development || spiritual ? null : TS.select(s, rng);
    var event;
    if (development) event = development;else if (talentStory) event = talentStory;else if (spiritual) event = spiritual;else if (s.character) {
      var personal = s.character.events.filter(function (e) {
        return eligible(s, e);
      });
      var pool = personal.length && (!common.length || rng() < .52) ? personal : common;
      if (!pool.length) throw new Error("第".concat(s.turn, "步没有可用事件：").concat(s.character.id));
      event = choose(s, pool, rng);
    } else event = selectOrdinary(s, rng, common);
    if (!s.afterlife) {
      var continuation = L.select(s, event);
      if (continuation) event = continuation;
    }
    globalThis.TouhouCompanionship.courtship(s, add);
    completeEvent(s, event, rng, before);
    globalThis.TouhouCompanionship.localMarriage(s, add);
    return s;
  }

  // 前史固定记录已核实的作品经历。玩家属性只参与标出的续篇，不能改写已发生的原作事实。
  function namedHistory(s, index) {
    var h = s.character.chronicle.history[index];
    s.named.time = h.label;
    add(s, index === 0 ? 'origin' : 'history:' + h.id, h.text, {}, {
      chronicle: {
        kind: h.kind,
        certainty: h.certainty,
        work: h.work,
        historyId: h.id,
        sourceIds: h.sourceIds,
        note: h.note
      }
    });
    s.named.index = index + 1;
  }
  function initNamed(s) {
    var c = s.character.chronicle;
    s.named = {
      stage: 'canon',
      index: 0,
      turn: 0,
      elapsed: 0,
      time: '已知起点'
    };
    s.realm = c.anchor.realm || s.character.realm;
    s.location = c.anchor.location || s.character.location;
    s.parentsAlive = false;
    s.hasFamily = false;
    s.courtshipAt = null;
    namedHistory(s, 0);
  }
  function finishNamed(s) {
    var f = s.character.chronicle.future;
    s.ended = true;
    s.deathCause = 'chapter';
    s.earlyDeath = false;
    s.ending = s.score === 2 ? '心愿已成' : s.score === 1 ? '留待来日' : '此卷暂歇';
    s.endingText = f[s.score === 2 ? 'success' : s.score === 1 ? 'bittersweet' : 'failure'];
    add(s, 'ending', s.endingText, {}, {
      ending: true
    });
    s.summary = {
      years: s.named.elapsed,
      events: s.history.length,
      xp: s.xp,
      companions: Object.values(s.people).filter(function (p) {
        return p.alive && p.close >= 2;
      }).length,
      species: describeLife(s).species,
      cause: 'chapter',
      relationships: [],
      canonEvents: s.character.chronicle.history.length,
      ageLabel: s.character.chronicle.anchor.age.label
    };
    s.summary.memoir = globalThis.TouhouMemoir.compose(s);
  }
  function stepNamed(s, rng) {
    var _c$anchor$age$years2;
    var before = _objectSpread({}, s.stats),
      c = s.character.chronicle,
      n = s.named;
    s.turn++;
    if (n.stage === 'canon') {
      if (n.index < c.history.length) namedHistory(s, n.index);else {
        n.stage = 'anchor';
        n.time = c.anchor.label;
        add(s, 'history:anchor', c.anchor.text, {}, {
          chronicle: {
            kind: 'anchor',
            certainty: 'canon',
            work: c.anchor.age.label,
            historyId: 'anchor',
            sourceIds: [],
            note: c.anchor.age.note
          }
        });
      }
      return completedStep(s, before);
    }
    if (n.stage === 'anchor') {
      var _c$anchor$age$years;
      n.stage = 'future';
      n.time = '此后岁月';
      s.age = (_c$anchor$age$years = c.anchor.age.years) !== null && _c$anchor$age$years !== void 0 ? _c$anchor$age$years : 0;
      add(s, 'future:opening', c.future.intro, {}, {
        futureOpening: true
      });
      return completedStep(s, before);
    }
    n.turn++;
    n.elapsed = Number((c.future.years * n.turn / 20).toFixed(1));
    s.age = ((_c$anchor$age$years2 = c.anchor.age.years) !== null && _c$anchor$age$years2 !== void 0 ? _c$anchor$age$years2 : 0) + n.elapsed;
    n.time = '此后第' + n.elapsed + '年';
    // 已有身份的续篇从立足前段开始；两次早段日常之后进入展开，避免重走空缺的幼年。
    s.phase = n.turn <= 3 ? 1 : n.turn <= 9 ? 2 : n.turn <= 15 ? 3 : 4;
    for (var _i6 = 0, _Object$entries5 = Object.entries(s.people); _i6 < _Object$entries5.length; _i6++) {
      var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i6], 2),
        id = _Object$entries5$_i[0],
        p = _Object$entries5$_i[1];
      if (p.alive && !p.ageless && s.age >= p.leaveAt) {
        p.alive = false;
        add(s, 'farewell-' + id, p.name + '年老离世，你将旧日来往记在卷中。', {
          bond: -1
        });
      }
    }
    var at = [1, 7, 13, 20].indexOf(n.turn);
    if (at >= 0) {
      var m = c.future.milestones[at];
      if (m.check) {
        var passed = s.stats[m.check.stat] >= m.check.min;
        if (passed) s.score++;
        add(s, 'milestone-' + at, passed ? m.pass : m.fail, passed ? m.passEffects : m.failEffects, {
          check: _objectSpread(_objectSpread({}, m.check), {}, {
            passed: passed
          })
        });
      } else add(s, 'milestone-' + at, m.text, m.effects);
    } else {
      var overrides = new Map(c.future.eventOverrides.map(function (e) {
        return [e.id, e];
      }));
      var pool = s.character.events.map(function (e) {
        return _objectSpread(_objectSpread({}, e), overrides.get(e.id));
      }).filter(function (e) {
        return eligible(s, e);
      });
      if (!pool.length) throw Error('人物续篇没有可用事件：' + s.character.id + '，第' + n.turn + '步');
      // 先选即将离开适用阶段的日常，给后段保留仍可发生的事。
      var lastPhase = Math.min.apply(Math, _toConsumableArray(pool.map(function (e) {
        return e.phases[1];
      })));
      applyEvent(s, choose(s, pool.filter(function (e) {
        return e.phases[1] === lastPhase;
      }), rng), rng);
    }
    if (n.turn === 20) finishNamed(s);
    return completedStep(s, before);
  }
  var goals = [{
    id: 'none',
    name: '随遇而安',
    description: '写完这一卷人生。',
    check: function check(s) {
      return s.ended;
    }
  }, {
    id: 'romance',
    name: '两情相悦',
    description: '与一位具名人物确立恋人关系。',
    check: function check(s) {
      return s.log.some(function (e) {
        var _e$relationship;
        return ((_e$relationship = e.relationship) === null || _e$relationship === void 0 ? void 0 : _e$relationship.to) === 'lover' && (!s.romanceWish || e.relationship.id === s.romanceWish);
      });
    }
  }, {
    id: 'career',
    name: '薪火相传',
    description: '寻常出身的职业达到传承阶段。',
    check: function check(s) {
      var _s$careerDevelopment;
      return !!((_s$careerDevelopment = s.careerDevelopment) !== null && _s$careerDevelopment !== void 0 && _s$careerDevelopment.history.some(function (h) {
        return h.stage === 3;
      }));
    }
  }, {
    id: 'longlife',
    name: '八十春秋',
    description: '行年达到80岁。',
    check: function check(s) {
      return s.age >= 80;
    }
  }, {
    id: 'transformation',
    name: '另一种人生',
    description: '寻常出身后完成一次种族或身后转变。',
    check: function check(s) {
      return !!s.transformation;
    }
  }, {
    id: 'experience',
    name: '见多识广',
    description: '历练达到40。',
    check: function check(s) {
      return s.xp >= 40;
    }
  }];
  function goalStatus(s) {
    if (s.named) {
      var _goal = s.character.chronicle.future.goal,
        _achieved = s.score === 2;
      return _objectSpread(_objectSpread({
        id: 'personal'
      }, _goal), {}, {
        achieved: _achieved,
        status: _achieved ? '已达成' : s.ended ? '未达成' : '进行中'
      });
    }
    var goal = goals.find(function (g) {
        return g.id === s.goal;
      }),
      achieved = goal.check(s),
      name = goal.name + (s.romanceWish ? ' · ' + globalThis.TouhouContent.find(function (c) {
        return c.id === s.romanceWish;
      }).name : '');
    return {
      id: goal.id,
      name: name,
      description: goal.description,
      achieved: achieved,
      status: achieved ? '已达成' : s.ended ? '未达成' : '进行中'
    };
  }
  globalThis.TouhouEngine = {
    STATS: STATS,
    LABELS: LABELS,
    PHASES: PHASES,
    random: random,
    validateAllocation: validateAllocation,
    validateWeights: validateWeights,
    drawCategory: drawCategory,
    drawIdentity: drawIdentity,
    createLife: createLife,
    step: step,
    eligible: eligible,
    weight: weight,
    meet: meet,
    time: time,
    isAnimal: isAnimal,
    transform: transform,
    describeLife: describeLife,
    futureLabel: futureLabel,
    forms: forms,
    record: add,
    goals: goals,
    goalStatus: goalStatus
  };
})();
