function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* Both settlement outputs read this account; it never changes a life's state. */
(function () {
  var number = function number(value) {
    return Number(value.toFixed(1));
  };
  function compose(s) {
    var id = s.firstPartnerId;
    if (!id) return {
      id: null,
      title: '此生情缘',
      name: s.named ? '本卷未记情缘' : '未曾结缘',
      yearsText: '',
      periodText: '',
      outcomeTitle: '',
      outcomeText: s.named ? '本卷没有相恋或婚姻的记录。' : '这一生没有确立恋人。',
      moments: []
    };
    var p = s.people[id],
      r = s.relations[id],
      local = id === 'local:spouse',
      dream = (r === null || r === void 0 ? void 0 : r.medium) === 'dream';
    var name = local ? '村民伴侣' : p.name,
      begin = s.firstLoveAt;
    var log = s.log.map(function (e, index) {
      return _objectSpread(_objectSpread({}, e), {}, {
        index: index
      });
    });
    var intro = log.find(function (e) {
      return local ? ['common:local-meet', 'common:local-young-meet'].includes(e.id) : e.id === 'relation:' + id + ':intro';
    });
    var love = log.find(function (e) {
      var _e$relationship;
      return e.age === begin && (local ? ['common:courtship', 'common:local-young-confession'].includes(e.id) : ((_e$relationship = e.relationship) === null || _e$relationship === void 0 ? void 0 : _e$relationship.id) === id && e.relationship.to === 'lover' && e.relationship.from !== 'lover');
    });
    var wedding = log.find(function (e) {
      return e.id === (local ? 'common:marry' : 'relation:' + id + ':marriage:wedding');
    });
    var unwed = log.find(function (e) {
      return e.id === (local ? 'common:unwed-promise' : 'relation:' + id + ':marriage:unwed');
    });
    if (!love) throw Error('伴侣回顾缺少实际相许记录：' + id);
    // Stop at recorded separation, not the later age at which this life ends.
    // Akyuu's return starts a new interval; time apart never becomes shared years.
    var limit = s.afterlife ? s.afterlife.since : s.age,
      intervals = [];
    var farewells = log.filter(function (e) {
      return e.id === 'farewell-' + id;
    });
    var since = begin,
      lastStop = null;
    var _iterator = _createForOfIteratorHelper(log),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _e$relationship2;
        var e = _step.value;
        if (e.age < begin || e.age > limit) continue;
        if (e.id === 'farewell-' + id || ((_e$relationship2 = e.relationship) === null || _e$relationship2 === void 0 ? void 0 : _e$relationship2.id) === id && e.relationship.from === 'lover' && e.relationship.to !== 'lover') {
          if (since !== null) {
            var _s$akyuuReturn$deathA, _s$akyuuReturn;
            // Akyuu can die between yearly entries. Her recorded deadline survives
            // the first return separately from the final death, so neither gap is lost.
            var at = id === 'akyuu' && e.id === 'farewell-' + id ? e === farewells[0] ? (_s$akyuuReturn$deathA = (_s$akyuuReturn = s.akyuuReturn) === null || _s$akyuuReturn === void 0 ? void 0 : _s$akyuuReturn.deathAt) !== null && _s$akyuuReturn$deathA !== void 0 ? _s$akyuuReturn$deathA : p.deadAt : p.deadAt : e.age;
            if (!Number.isFinite(at) || at < since) throw Error('伴侣回顾的告别时点不完整：' + id);
            intervals.push([since, at]);
            since = null;
            lastStop = e;
          }
        } else if (id === 'akyuu' && e.id === 'akyuu-return:returned' && since === null) {
          since = e.age;
          lastStop = null;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (since !== null) intervals.push([since, limit]);
    var years = number(intervals.reduce(function (sum, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        a = _ref2[0],
        b = _ref2[1];
      return sum + b - a;
    }, 0));
    var marriedYears = wedding ? number(intervals.reduce(function (sum, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        a = _ref4[0],
        b = _ref4[1];
      return sum + Math.max(0, b - Math.max(a, wedding.age));
    }, 0)) : null;
    var until = intervals[intervals.length - 1][1];
    var yearsText = (dream ? '梦中相伴 ' : '相伴 ') + years + ' 年' + (wedding ? ' · ' + (dream ? '梦中结缘 ' : '婚后 ') + marriedYears + ' 年' : '');
    var periodText = number(begin) + '岁相许，记至' + number(until) + '岁' + (intervals.length > 1 ? '；重逢前的离别时日未计入相伴。' : '。');
    var outcomeTitle, outcomeText;
    if (lastStop) {
      var farewell = lastStop.id === 'farewell-' + id;
      outcomeTitle = farewell ? dream ? '梦路渐远' : '伴侣先行离世' : '相恋止于往年';
      outcomeText = lastStop.text;
    } else if (s.afterlife) {
      var laterFarewell = log.filter(function (e) {
        return e.id === 'farewell-' + id && e.age > limit;
      }).at(-1);
      outcomeTitle = laterFarewell ? dream ? '生死相隔 · 梦路渐远' : '生死相隔 · 伴侣已故' : '生死相隔';
      outcomeText = '你在' + number(limit) + '岁告别生前的生活。' + (laterFarewell ? laterFarewell.time + '，' + laterFarewell.text : '这段相伴留在旧日记忆里。');
    } else if (s.deathCause === 'chapter') {
      outcomeTitle = wedding ? '仍在相守' : '相恋未终';
      outcomeText = '此卷暂时合上，你们的' + (dream ? '梦中相伴' : '相伴') + '仍在继续。';
    } else {
      outcomeTitle = '相伴至此生终点';
      outcomeText = dream ? '你的人生走到终点，这段梦中相恋随此卷收束。' : '你先走到了人生终点，此卷结束时，' + name + '仍然在世。';
    }
    var selected = [],
      texts = new Set();
    function keep(e) {
      if (e && !texts.has(e.text)) {
        selected.push(e);
        texts.add(e.text);
      }
    }
    keep(intro);
    keep(love);
    keep(wedding);
    keep(unwed);
    var reunion = id === 'akyuu' ? log.find(function (e) {
      return e.id === 'akyuu-return:returned' && e.age <= limit;
    }) : null;
    keep(reunion);
    var shared = log.filter(function (e) {
      var _e$with;
      if (!intervals.some(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
          a = _ref6[0],
          b = _ref6[1];
        return e.age >= a && e.age <= b;
      }) || e.id === 'ending' || e.id === 'farewell-' + id || e.id.startsWith('remembrance:')) return false;
      return local ? /^common:(?:local-date-|spouse-)/.test(e.id) || e.id.startsWith('local:marriage:') : e.id.startsWith('relation:' + id + ':') || e.circleOf === id || ((_e$with = e["with"]) === null || _e$with === void 0 ? void 0 : _e$with.includes(id)) || e.id.startsWith('guidance:' + id + ':') || id === 'akyuu' && e.id === 'akyuu-return:aftercare';
    });
    var outside = log.find(function (e) {
      var _s$outsideJourney;
      return e.id === 'legendary:outside-return' && ((_s$outsideJourney = s.outsideJourney) === null || _s$outsideJourney === void 0 ? void 0 : _s$outsideJourney.partnerId) === id;
    });
    keep(outside);
    var _iterator2 = _createForOfIteratorHelper(shared.reverse()),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _e = _step2.value;
        if (selected.length >= 7) break;
        keep(_e);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var moments = selected.sort(function (a, b) {
      return a.index - b.index;
    }).map(function (e) {
      return {
        id: e.id,
        index: e.index,
        age: e.age,
        time: e.time,
        text: e.text
      };
    });
    return {
      id: id,
      title: '与你相伴',
      name: name,
      years: years,
      marriedYears: marriedYears,
      yearsText: yearsText,
      periodText: periodText,
      outcomeTitle: outcomeTitle,
      outcomeText: outcomeText,
      moments: moments
    };
  }
  globalThis.TouhouCompanionSummary = {
    compose: compose
  };
})();
