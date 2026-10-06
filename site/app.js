function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function (_$5, _document$modelContex) {
  var E = globalThis.TouhouEngine;
  var characters = globalThis.TouhouContent,
    T = globalThis.TouhouTalents,
    R = globalThis.TouhouRelationships;
  var memoirImage = globalThis.TouhouMemoirImage;
  var companionSummary = globalThis.TouhouCompanionSummary;
  var memoirNames = memoirImage ? memoirImage.createNames(characters) : [];
  var $ = function $(id) {
    return document.getElementById(id);
  };
  var categoryNames = {
    main: '正作及官方出版物',
    hifuu: '秘封',
    pc98: '旧作'
  };
  var stats = {
    health: 5,
    insight: 5,
    bond: 5,
    fortune: 5
  };
  var life = null,
    visible = null,
    rng = null,
    timer = null,
    paused = false,
    rendered = 0,
    talentKey = null,
    relationKey = null,
    memoirText = '';
  var replay = new URLSearchParams(location.search).get('seed');
  var fixedSeed = replay !== null && /^\d{1,10}$/.test(replay) ? Number(replay) >>> 0 : null;
  var runSeed = 0,
    draft = [],
    selected = [],
    draftNumber = 0;
  var exportSequence = 0,
    imageURLs = [],
    companionAccount = null;
  // A gameplay seed needs no security guarantee; vendor WebViews may omit crypto.
  function newDraft() {
    var _globalThis$crypto;
    runSeed = fixedSeed !== null && fixedSeed !== void 0 ? fixedSeed : (_globalThis$crypto = globalThis.crypto) !== null && _globalThis$crypto !== void 0 && _globalThis$crypto.getRandomValues ? crypto.getRandomValues(new Uint32Array(1))[0] : Math.floor(Math.random() * 0x100000000) >>> 0;
    draft = T.draw(E.random((runSeed ^ 0x35dab) + draftNumber++));
    selected = [];
    renderTalents();
  }
  function renderTalents() {
    var _$;
    $('talent-count').textContent = selected.length;
    $('confirm-talents').disabled = selected.length !== 3;
    (_$ = $('talent-list')).replaceChildren.apply(_$, _toConsumableArray(draft.map(function (id) {
      var t = T.list.find(function (t) {
          return t.id === id;
        }),
        chosen = selected.includes(id),
        conflict = T.conflict(id, selected),
        button = node('button', undefined, 'talent grade-' + t.grade + (chosen ? ' selected' : ''));
      button.type = 'button';
      button.dataset.talent = id;
      button.setAttribute('aria-pressed', String(chosen));
      button.disabled = !chosen && (selected.length === 3 || !!conflict);
      var heading = node('span', undefined, 'talent-heading');
      heading.append(node('strong', t.name), node('small', T.grades[t.grade].name));
      button.append(heading, node('span', t.description, 'talent-description'));
      if (conflict) button.append(node('span', '与「' + T.list.find(function (t) {
        return t.id === conflict;
      }).name + '」互斥', 'talent-conflict'));
      button.onclick = function () {
        selected = chosen ? selected.filter(function (x) {
          return x !== id;
        }) : [].concat(_toConsumableArray(selected), [id]);
        renderTalents();
      };
      return button;
    })));
  }
  function confirmTalents() {
    var _$2;
    T.validate(selected);
    $('talent-setup').hidden = true;
    $('setup').hidden = false;
    (_$2 = $('chosen-talents')).replaceChildren.apply(_$2, _toConsumableArray(selected.map(function (id) {
      var t = T.list.find(function (t) {
          return t.id === id;
        }),
        p = node('p', undefined, 'chosen-talent grade-' + t.grade);
      p.append(node('strong', t.name), node('span', t.description));
      return p;
    })));
    refreshAllocation();
    $('start').focus();
  }
  $('redraw-talents').onclick = newDraft;
  $('confirm-talents').onclick = confirmTalents;
  $('change-talents').onclick = function () {
    $('setup').hidden = true;
    $('talent-setup').hidden = false;
  };
  E.validateWeights(globalThis.TouhouConfig);
  var hints = {
    health: '身体与寿数',
    insight: '学识与手艺',
    bond: '来往与情分',
    fortune: '家计与机缘'
  };
  function node(tag, text, className) {
    var el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className) el.className = className;
    return el;
  }
  function memoirParagraph(text) {
    var p = node('p');
    if (memoirImage) memoirImage.appendText(p, text, memoirNames);else p.textContent = text;
    return p;
  }
  function renderCompanion(account) {
    var section = $('companion-memoir');
    section.replaceChildren();
    section.className = 'companion-memoir' + (account.id ? '' : ' companion-empty');
    section.append(node('p', account.title, 'eyebrow'), node('h4', account.name, 'companion-name'));
    if (account.yearsText) section.append(node('p', account.yearsText, 'companion-years'), node('p', account.periodText, 'companion-period'));
    if (account.outcomeTitle) section.append(node('h5', account.outcomeTitle, 'companion-outcome'));
    var ending = memoirParagraph(account.outcomeText);
    ending.className = 'companion-ending';
    section.append(ending);
    if (account.moments.length) {
      section.append(node('h5', '相伴拾记'));
      var list = node('ol', undefined, 'companion-moments');
      var _iterator = _createForOfIteratorHelper(account.moments),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var moment = _step.value;
          var item = node('li');
          item.append(node('span', moment.time, 'companion-time'), memoirParagraph(moment.text));
          list.append(item);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      section.append(list);
    }
  }
  function resetMemoirExport() {
    exportSequence++;
    var _iterator2 = _createForOfIteratorHelper(imageURLs),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var url = _step2.value;
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    imageURLs = [];
    $('memoir-images').replaceChildren();
    $('memoir-images').hidden = true;
    $('export-status').textContent = '';
    $('export-memoir').disabled = false;
    $('export-memoir').textContent = '导出图片';
  }
  function setText(el, text) {
    var value = String(text);
    if (el.textContent !== value) el.textContent = value;
  }
  function formatChange(value) {
    return value === 0 ? '0' : value > 0 ? '+' + value : value.toString().replace('-', '−');
  }
  var statFields = Object.fromEntries(E.STATS.map(function (k) {
    var item = node('div', undefined, 'live-stat'),
      values = node('dd');
    var current = node('strong'),
      change = node('small', undefined, 'stat-change');
    current.id = 'live-value-' + k;
    change.id = 'live-change-' + k;
    values.append(current, change);
    item.append(node('dt', E.LABELS[k]), values);
    $('live-stats').append(item);
    return [k, {
      current: current,
      change: change
    }];
  }));
  function renderLifeTalents() {
    var _$3;
    var key = visible.talents.join('|');
    if (key === talentKey) return;
    talentKey = key;
    var talents = visible.talents.map(function (id) {
      return T.list.find(function (t) {
        return t.id === id;
      });
    });
    $('live-talents').textContent = '天赋 · ' + talents.map(function (t) {
      return t.name;
    }).join(' · ');
    (_$3 = $('live-talent-descriptions')).replaceChildren.apply(_$3, _toConsumableArray(talents.map(function (t) {
      var p = node('p');
      p.append(node('strong', t.name), node('span', t.description));
      return p;
    })));
  }
  function renderRelationships() {
    var _$4;
    var relations = visible.relationships;
    var key = JSON.stringify(relations.map(function (r) {
      return [r.id, r.name, r.status, r.stage, r.learning, r.romanceClosed, r.alive, visible.ended ? r.summary : ''];
    }));
    $('relationships').hidden = relations.length === 0;
    if (key === relationKey) return;
    relationKey = key;
    (_$4 = $('relationship-list')).replaceChildren.apply(_$4, _toConsumableArray(relations.map(function (relation) {
      var item = node('li', undefined, 'relationship-item'),
        line = node('p', undefined, 'relationship-line');
      line.append(node('strong', relation.name), node('span', relation.status, 'relationship-status'));
      if (!relation.alive) line.append(node('span', relation.departure, 'relationship-departed'));
      if (relation.stage) line.append(node('span', '经历 · ' + relation.stage, 'relationship-stage'));
      if (relation.learning) line.append(node('span', relation.learning, 'relationship-stage'));
      if (relation.romanceClosed) line.append(node('span', '恋爱分支已结束', 'relationship-stage'));
      item.append(line, node('p', relation.scene, 'relationship-scene'));
      if (visible.ended && relation.summary) item.append(node('p', relation.summary, 'relationship-summary'));
      return item;
    })));
  }
  function allocationTotal() {
    return E.STATS.reduce(function (sum, k) {
      return sum + stats[k];
    }, 0);
  }
  function refreshAllocation() {
    E.STATS.forEach(function (k) {
      $('points-' + k).value = stats[k];
      $('value-' + k).textContent = stats[k];
      $('minus-' + k).disabled = stats[k] === 0;
      $('plus-' + k).disabled = stats[k] === 10 || allocationTotal() === 20;
    });
    $('remaining').textContent = 20 - allocationTotal();
    $('start').disabled = allocationTotal() !== 20;
  }
  var _iterator3 = _createForOfIteratorHelper(E.STATS),
    _step3;
  try {
    var _loop = function _loop() {
      var k = _step3.value;
      var row = node('div', undefined, 'allocation-row');
      var heading = node('div', undefined, 'allocation-name');
      var label = node('label', E.LABELS[k]);
      label.htmlFor = 'points-' + k;
      heading.append(label, node('span', hints[k], 'stat-hint'));
      var inputRow = node('div', undefined, 'allocation-input');
      var minus = node('button', '−');
      minus.type = 'button';
      minus.id = 'minus-' + k;
      minus.setAttribute('aria-label', '减少' + E.LABELS[k]);
      var input = node('input');
      input.type = 'range';
      input.min = 0;
      input.max = 10;
      input.step = 1;
      input.id = 'points-' + k;
      input.value = 5;
      var output = node('output', '5');
      output.id = 'value-' + k;
      output.htmlFor = input.id;
      var plus = node('button', '+');
      plus.type = 'button';
      plus.id = 'plus-' + k;
      plus.setAttribute('aria-label', '增加' + E.LABELS[k]);
      minus.onclick = function () {
        stats[k]--;
        refreshAllocation();
      };
      plus.onclick = function () {
        stats[k]++;
        refreshAllocation();
      };
      input.oninput = function () {
        var available = 20 - allocationTotal() + stats[k];
        stats[k] = Math.min(Number(input.value), available);
        refreshAllocation();
      };
      inputRow.append(minus, input, output, plus);
      row.append(heading, inputRow);
      $('allocation').append(row);
    };
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  $('random-points').onclick = function () {
    E.STATS.forEach(function (k) {
      return stats[k] = 0;
    });
    for (var i = 0; i < 20; i++) {
      var choices = E.STATS.filter(function (k) {
        return stats[k] < 10;
      });
      stats[choices[Math.floor(Math.random() * choices.length)]]++;
    }
    refreshAllocation();
  };
  var weights = globalThis.TouhouConfig;
  $('probability-note').textContent = "本作设定：普通人".concat(+(weights.ordinary * 100).toFixed(3), "% · 正作").concat(+(weights.main * 100).toFixed(3), "% · 秘封").concat(+(weights.hifuu * 100).toFixed(3), "% · 旧作").concat(+(weights.pc98 * 100).toFixed(3), "%。");
  $('talent-grade-note').textContent = '初始等级抽取权重为' + T.grades.map(function (g) {
    return "".concat(g.name).concat(g.weight, "%");
  }).join('、') + '。';
  $('romance-scope').textContent = "普通人可与".concat(characters.length, "位人物来往，其中").concat(TouhouRelationshipData.filter(function (r) {
    return r.romance;
  }).length, "位有专属情缘。莲子、梅莉与男性人物保留各自的友谊、同伴或竞争线路。");
  (_$5 = $('life-goal')).replaceChildren.apply(_$5, _toConsumableArray(E.goals.map(function (g) {
    var option = node('option', g.name);
    option.value = g.id;
    return option;
  })));
  var _iterator4 = _createForOfIteratorHelper(TouhouRelationshipData.filter(function (r) {
      return r.romance;
    })),
    _step4;
  try {
    var _loop2 = function _loop2() {
      var route = _step4.value;
      var option = node('option', characters.find(function (c) {
        return c.id === route.id;
      }).name);
      option.value = route.id;
      $('romance-wish').append(option);
    };
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      _loop2();
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  function describeGoal() {
    setText($('goal-description'), E.goals.find(function (g) {
      return g.id === $('life-goal').value;
    }).description);
    $('romance-wish-controls').hidden = $('life-goal').value !== 'romance';
  }
  $('life-goal').onchange = describeGoal;
  describeGoal();
  function stopTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }
  // Keep only derived display values: the engine remains authoritative and can finish
  // a whole step while its records wait. Publish that step after its last record.
  function captureVisible(s) {
    var partner = R.partner(s);
    return {
      description: E.describeLife(s),
      phase: s.phase,
      goal: E.goalStatus(s),
      stats: _objectSpread({}, s.stats),
      lastChanges: _objectSpread({}, s.lastChanges),
      talents: _toConsumableArray(s.talents),
      relationships: R.describe(s),
      ended: s.ended,
      partner: partner ? s.afterlife ? "生前伴侣 · ".concat(partner.name, " · 生死相隔") : "情缘 · ".concat(partner.name, " · ").concat(partner.status) : s.firstPartnerId ? '情缘 · ' + (s.firstPartnerId === 'local:spouse' ? '村民伴侣' : s.people[s.firstPartnerId].name) + ' · 旧日相伴' : '情缘 · 尚无伴侣'
    };
  }
  // The engine may have ended while its final records still await display.
  function playbackEnded() {
    return life.ended && rendered === life.log.length;
  }
  // Replace the pending timeout so speed and pause changes keep one timer.
  function schedule() {
    stopTimer();
    if (life && !playbackEnded() && !paused) timer = setTimeout(tick, Number($('speed').value));
  }
  function tick() {
    timer = null;
    if (!life || playbackEnded()) return;
    try {
      // A year may produce several records. Show them before advancing again.
      if (rendered === life.log.length) E.step(life, rng);
      render(rendered + 1);
      schedule();
    } catch (error) {
      stopTimer();
      paused = true;
      $('runtime-error').textContent = '人生推进失败：' + error.message;
      $('runtime-error').hidden = false;
      $('running-status').textContent = '发生错误';
      console.error(error);
    }
  }
  function start() {
    if (life) return;
    E.validateAllocation(stats);
    T.validate(selected);
    var seed = runSeed;
    rng = E.random(seed ^ 0x9e3779b9);
    life = E.createLife({
      stats: stats,
      talents: selected,
      seed: seed,
      goal: $('life-goal').value,
      romanceWish: $('life-goal').value === 'romance' ? $('romance-wish').value || null : null
    });
    paused = false;
    rendered = 0;
    talentKey = null;
    relationKey = null, memoirText = '';
    // Opening talent effects also have queued records; show allocated values first.
    visible = captureVisible(_objectSpread(_objectSpread({}, life), {}, {
      stats: life.allocated
    }));
    $('setup').hidden = true;
    $('life').hidden = false;
    $('settlement').hidden = true;
    $('runtime-error').hidden = true;
    $('timeline').replaceChildren();
    memoirText = '';
    resetMemoirExport();
    $('live-talent-details').open = false;
    render(1);
    $('life').scrollIntoView(true);
    $('pause').focus({
      preventScroll: true
    });
    schedule();
  }
  function restart() {
    stopTimer();
    resetMemoirExport();
    life = null;
    visible = null;
    rng = null;
    paused = false;
    rendered = 0;
    talentKey = null;
    relationKey = null, memoirText = '';
    $('life').hidden = true;
    $('setup').hidden = true;
    $('settlement').hidden = true;
    $('talent-setup').hidden = false;
    $('relationships').hidden = true;
    $('relationship-list').replaceChildren();
    E.STATS.forEach(function (k) {
      return stats[k] = 5;
    });
    newDraft();
    $('talent-setup').scrollIntoView(true);
    $('talent-title').focus({
      preventScroll: true
    });
  }
  function togglePause() {
    if (!life || playbackEnded()) return;
    paused = !paused;
    render();
    schedule();
  }
  function pauseInBackground() {
    if (!life || playbackEnded()) return;
    paused = true;
    stopTimer();
    render();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pauseInBackground();
  });
  addEventListener('pagehide', pauseInBackground);
  function render() {
    var revealTo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : rendered;
    var end = Math.min(revealTo, life.log.length),
      finished = life.ended && end === life.log.length;
    if (end === life.log.length) visible = captureVisible(life);
    var description = visible.description;
    setText($('identity'), life.character ? categoryNames[life.character.category] + ' · 开局身份' : '寻常出身 · ' + (description.career || '最初的岁月'));
    setText($('life-title'), life.character ? life.character.name : '你的这一生');
    setText($('live-time'), description.time);
    setText($('time-kind'), life.named ? '纪事' : '行年');
    setText($('live-species'), description.species);
    setText($('live-body-status'), description.status);
    setText($('life-status-label'), life.character ? '篇章' : '身体');
    setText($('where'), "".concat(description.location, " · ").concat(description.phaseLabel || E.PHASES[visible.phase]));
    var goal = visible.goal;
    setText($('goal-status'), "心愿 · ".concat(goal.name, " · ").concat(goal.status, "。").concat(goal.description));
    setText($('running-status'), finished ? '已结算' : paused ? '已暂停' : '人生行进中');
    setText($('pause'), paused ? '继续' : '暂停');
    $('pause').disabled = finished;
    $('speed').disabled = finished;
    var _iterator5 = _createForOfIteratorHelper(E.STATS),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var k = _step5.value;
        var _statFields$k = statFields[k],
          current = _statFields$k.current,
          change = _statFields$k.change,
          delta = visible.lastChanges[k],
          signed = formatChange(delta);
        setText(current, visible.stats[k]);
        current.setAttribute('aria-label', '当前值' + visible.stats[k]);
        setText(change, signed);
        change.className = 'stat-change' + (delta > 0 ? ' gain' : delta < 0 ? ' loss' : '');
        change.setAttribute('aria-label', '本步净变化' + signed);
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    renderLifeTalents();
    renderRelationships();
    $('partner-status').hidden = !!life.character;
    setText($('partner-status'), visible.partner);
    var firstNew = null;
    var _iterator6 = _createForOfIteratorHelper(life.log.slice(rendered, end)),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var _entry$developmentMom;
        var entry = _step6.value;
        var li = node('li');
        if (life.named) li.classList.add('named-entry');
        if (entry.chronicle) li.classList.add('chronicle-entry');
        if (entry.ending) li.classList.add('ending-entry');
        li.append(node('span', entry.time, 'when'));
        var body = node('div');
        if (entry.chronicle) {
          var h = entry.chronicle,
            line = node('p', {
              canon: '原作回顾',
              'route-dependent': '原作路线分支',
              reported: '原作中的记述',
              unknown: '资料未明'
            }[h.certainty] + ' · ' + h.work, 'event-scene'),
            link = node('a', '查看出处');
          link.href = 'chronicles.html#' + life.character.id + '-' + h.historyId;
          link.target = '_blank';
          link.rel = 'noopener';
          line.append(document.createTextNode(' · '), link);
          body.append(line);
        }
        if (entry.futureOpening) {
          li.classList.add('future-opening');
          body.append(node('strong', '此后岁月 · ' + E.futureLabel(life)));
        }
        if ((_entry$developmentMom = entry.developmentMoment) !== null && _entry$developmentMom !== void 0 && _entry$developmentMom.major) {
          var m = entry.developmentMoment,
            notice = node('div', undefined, 'development-moment');
          notice.dataset.kind = m.kind;
          notice.append(node('strong', m.title), node('p', '当前：' + m.status + '。' + m.impact));
          body.append(notice);
          li.classList.add('major-development');
        }
        if (entry.relationshipMoment && entry.relationshipMoment.kind !== 'closed') {
          var _m = entry.relationshipMoment,
            _notice = node('div', undefined, 'relationship-moment');
          _notice.dataset.kind = _m.kind;
          _notice.append(node('strong', _m.title + ' · ' + _m.person));
          if (_m.kind !== 'bereaved') _notice.append(node('p', '当前：' + _m.status + '。' + _m.impact));
          body.append(_notice);
          li.classList.add('major-relationship');
        }
        if (entry.relationship) {
          var r = entry.relationship,
            _line = node('p', r.name + ' · ' + (r.from !== r.to ? (r.from ? R.labels[r.from] + ' → ' : '') + R.labels[r.to] : R.labels[r.to] + ' · ' + r.stage), 'relationship-progress');
          _line.dataset.person = r.id;
          _line.dataset.from = r.from || '';
          _line.dataset.to = r.to;
          body.append(_line);
        }
        if (entry.scene) body.append(node('p', entry.scene, 'event-scene'));
        if (entry.premise) body.append(node('p', entry.premise, 'event-premise'));
        body.append(node('p', entry.text, 'event-text'));
        var changes = Object.entries(entry.effects).filter(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
            v = _ref2[1];
          return v !== 0;
        }).map(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 2),
            k = _ref4[0],
            v = _ref4[1];
          return "".concat(E.LABELS[k]).concat(v > 0 ? '+' : '').concat(v);
        });
        if (entry.check) {
          var check = entry.check;
          var condition = "".concat(E.LABELS[check.stat], "≥").concat(check.min, " · ").concat(check.passed ? '达成' : '未达成');
          var meta = node('div', undefined, 'event-meta');
          meta.append(node('span', condition, check.passed ? 'pass' : 'fail'));
          if (changes.length) meta.append(document.createTextNode('　' + changes.join('　')));
          body.append(meta);
        } else if (changes.length || entry.reason) body.append(node('div', [entry.reason, changes.join('　')].filter(Boolean).join('　'), 'event-meta'));
        li.append(body);
        $('timeline').append(li);
        firstNew !== null && firstNew !== void 0 ? firstNew : firstNew = li;
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    if (firstNew && $('follow').checked) {
      var timeline = $('timeline');
      timeline.scrollTop += firstNew.getBoundingClientRect().top - timeline.getBoundingClientRect().top;
    }
    rendered = end;
    if (finished) {
      var text = life.summary.memoir.paragraphs.join('\n\n');
      if (text !== memoirText) {
        var _$6;
        memoirText = text;
        companionAccount = companionSummary.compose(life);
        renderCompanion(companionAccount);
        (_$6 = $('memoir')).replaceChildren.apply(_$6, _toConsumableArray(life.summary.memoir.paragraphs.map(memoirParagraph)));
      }
      $('settlement').hidden = false;
      setText($('ending-title'), life.ending);
      setText($('ending-text'), life.endingText);
      setText($('ending-summary'), "".concat(description.time, " · ").concat(life.summary.events, "件往事 · 历练").concat(life.summary.xp, " · 亲近同伴").concat(life.summary.companions, "位 · 心愿「").concat(goal.name, "」").concat(goal.status));
    }
  }
  $('export-memoir').onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var current, sequence, isCurrent, description, goal, data, _$7, pages, items, _i, _imageURLs, url, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          current = life;
          if (!(!(current !== null && current !== void 0 && current.ended) || !playbackEnded())) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          resetMemoirExport();
          sequence = exportSequence, isCurrent = function isCurrent() {
            return life === current && exportSequence === sequence;
          };
          description = E.describeLife(current), goal = E.goalStatus(current); // Snapshot settled values before any asynchronous encoding. Never read a new
          // life's values or write into its controls after a restart.
          data = {
            subject: current.character ? current.character.name : '你的这一生',
            ending: current.ending,
            endingText: current.endingText,
            identity: [description.time, description.species, description.location, description.status].filter(Boolean).join(' · '),
            metrics: "".concat(current.summary.events, "件往事 · 历练").concat(current.summary.xp, " · 亲近同伴").concat(current.summary.companions, "位"),
            stats: E.STATS.map(function (k) {
              return {
                label: E.LABELS[k],
                initial: current.allocated[k],
                "final": current.stats[k]
              };
            }),
            talents: current.talents.map(function (id) {
              return T.list.find(function (t) {
                return t.id === id;
              }).name;
            }),
            goal: goal.name + ' · ' + goal.status,
            goalDescription: goal.description,
            companion: companionAccount,
            paragraphs: _toConsumableArray(current.summary.memoir.paragraphs),
            names: _toConsumableArray(memoirNames)
          };
          $('export-memoir').disabled = true;
          $('export-memoir').textContent = '生成中…';
          $('export-status').textContent = '正在把这一生写成图片…';
          _context.p = 2;
          if (memoirImage) {
            _context.n = 3;
            break;
          }
          throw new Error('图片组件未能加载，请刷新后重试。');
        case 3:
          _context.n = 4;
          return memoirImage.create(data, isCurrent, function (index, total) {
            if (isCurrent()) $('export-status').textContent = "正在生成第".concat(index, " / ").concat(total, "张图片…");
          });
        case 4:
          pages = _context.v;
          if (isCurrent()) {
            _context.n = 5;
            break;
          }
          return _context.a(2);
        case 5:
          items = pages.map(function (page, index) {
            var url = URL.createObjectURL(page.blob);
            imageURLs.push(url);
            var item = node('figure', undefined, 'memoir-image'),
              preview = node('a', undefined, 'memoir-image-preview'),
              img = node('img');
            preview.href = url;
            preview.target = '_blank';
            preview.rel = 'noopener noreferrer';
            preview.setAttribute('aria-label', "预览一生总结第".concat(index + 1, "张原图，在新窗口打开"));
            img.src = url;
            img.alt = "一生总结第".concat(index + 1, " / ").concat(pages.length, "张 · ").concat(data.subject, " · ").concat(data.ending);
            img.width = page.width;
            img.height = page.height;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.onerror = function () {
              if (isCurrent()) $('export-status').textContent = "第".concat(index + 1, "张图片未能显示，请重新生成图片。");
            };
            preview.append(img);
            var caption = node('figcaption'),
              actions = node('div', undefined, 'memoir-image-actions');
            caption.append(node('span', "第".concat(index + 1, " / ").concat(pages.length, "张 · ").concat(page.width, " × ").concat(page.height)));
            var open = node('a', '查看原图'),
              save = node('a', '保存 PNG');
            open.href = url;
            open.target = '_blank';
            open.rel = 'noopener noreferrer';
            save.href = url;
            save.download = "幻想乡一生纪-".concat(data.subject.replace(/[\\/:*?"<>|]/g, ''), "-").concat(current.seed, "-").concat(index + 1, ".png");
            save.target = '_blank';
            save.rel = 'noopener noreferrer';
            save.onclick = function () {
              if (isCurrent()) $('export-status').textContent = "已向浏览器请求保存第".concat(index + 1, "张 PNG。若没有出现下载，可查看原图后长按或右键保存。");
            };
            actions.append(open, save);
            caption.append(actions);
            item.append(preview, caption);
            return item;
          });
          (_$7 = $('memoir-images')).replaceChildren.apply(_$7, _toConsumableArray(items));
          $('memoir-images').hidden = false;
          $('export-status').textContent = "已生成".concat(pages.length, "张 PNG，完整收录本卷总结。点击图片可预览原图，选择「保存 PNG」下载；手机也可在原图上长按保存。");
          _context.n = 7;
          break;
        case 6:
          _context.p = 6;
          _t = _context.v;
          if (isCurrent()) {
            for (_i = 0, _imageURLs = imageURLs; _i < _imageURLs.length; _i++) {
              url = _imageURLs[_i];
              URL.revokeObjectURL(url);
            }
            imageURLs = [];
            $('memoir-images').replaceChildren();
            $('memoir-images').hidden = true;
            $('export-status').textContent = '图片导出未成功：' + (_t.message || '浏览器无法生成图片。') + ' 可再次点击「导出图片」重试。';
          }
        case 7:
          _context.p = 7;
          if (isCurrent()) {
            $('export-memoir').disabled = false;
            $('export-memoir').textContent = '导出图片';
          }
          return _context.f(7);
        case 8:
          return _context.a(2);
      }
    }, _callee, null, [[2, 6, 7, 8]]);
  }));
  $('start').onclick = start;
  $('pause').onclick = togglePause;
  $('restart').onclick = restart;
  $('again').onclick = restart;
  $('speed').onchange = schedule;
  $('coverage-count').textContent = "".concat(characters.length, "种特殊身份");
  $('scope-note').textContent = '收录正作、旧作、秘封及官方出版物的具名角色；同一人物的形态合并。仅被历史故事提及的神明、无名群体及封面上身份不明的人物，列入来源页的范围说明。';
  function renderRoster() {
    var _$8;
    var query = $('search').value.trim().toLowerCase();
    var list = characters.filter(function (c) {
      return [c.name, c.chronicle.anchor.location || c.location].join(' ').toLowerCase().includes(query);
    });
    (_$8 = $('roster-list')).replaceChildren.apply(_$8, _toConsumableArray(list.map(function (c) {
      var row = node('div', undefined, 'roster-row');
      var link = node('a', c.name);
      link.href = 'chronicles.html#' + c.id;
      row.append(link, node('small', "".concat(categoryNames[c.category], " · ").concat(c.chronicle.anchor.location || c.location)));
      return row;
    })));
  }
  $('search').oninput = renderRoster;
  refreshAllocation();
  newDraft();
  renderRoster();
  if ((_document$modelContex = document.modelContext) !== null && _document$modelContex !== void 0 && _document$modelContex.registerTool && typeof AbortController !== 'undefined') {
    var lifecycle = new AbortController();
    for (var _i2 = 0, _arr = [{
        name: 'read_life',
        description: '查看已显示的人生、种族、身体、属性与本步净变化、天赋、来往及最近三条事件。',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false
        },
        annotations: {
          readOnlyHint: true
        },
        execute: function execute() {
          return life ? _objectSpread(_objectSpread({
            name: life.character ? life.character.name : '你的这一生'
          }, visible.description), {}, {
            ended: visible.ended,
            paused: paused,
            stats: _objectSpread({}, visible.stats),
            lastChanges: _objectSpread({}, visible.lastChanges),
            talents: _toConsumableArray(visible.talents),
            relationships: visible.relationships.map(function (r) {
              return _objectSpread({}, r);
            }),
            events: life.log.slice(Math.max(0, rendered - 3), rendered)
          }) : {
            phase: 'allocation',
            stats: _objectSpread({}, stats)
          };
        }
      }, {
        name: 'set_life_paused',
        description: '暂停或继续当前人生。',
        inputSchema: {
          type: 'object',
          properties: {
            paused: {
              type: 'boolean'
            }
          },
          required: ['paused'],
          additionalProperties: false
        },
        annotations: {
          readOnlyHint: false
        },
        execute: function execute(input) {
          if (typeof input.paused !== 'boolean') throw new Error('paused必须为布尔值。');
          if (!life || playbackEnded()) throw new Error('当前没有可推进的人生。');
          paused = input.paused;
          render();
          schedule();
          return {
            paused: paused
          };
        }
      }]; _i2 < _arr.length; _i2++) {
      var tool = _arr[_i2];
      Promise.resolve(document.modelContext.registerTool(tool, {
        signal: lifecycle.signal
      }))["catch"](function (error) {
        return console.error('WebMCP注册失败', error);
      });
    }
    addEventListener('pagehide', function () {
      return lifecycle.abort();
    }, {
      once: true
    });
  }
})();
