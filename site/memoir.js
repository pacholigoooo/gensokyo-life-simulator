function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
/* A short account assembled from recorded events, never from unplayed routes. */
(function () {
  var at = function at(age) {
    return Number(age.toFixed(1));
  };
  function compose(s) {
    var _s$transformation, _s$hermit;
    if (s.named) {
      var entries = [s.log.find(function (e) {
        return e.id === 'origin';
      }), s.log.find(function (e) {
        return e.id === 'history:anchor';
      }), s.log.find(function (e) {
        return e.id === 'future:opening';
      })].concat(_toConsumableArray(s.log.filter(function (e) {
        return e.check;
      })), [s.log.find(function (e) {
        return e.ending;
      })]);
      var _facts = entries.map(function (e) {
        return {
          kind: e.ending ? 'ending' : e.chronicle ? 'canon' : 'future',
          text: e.text,
          evidence: [e.id]
        };
      });
      return {
        paragraphs: [s.character.name + ' · 原作回顾'].concat(_toConsumableArray(_facts.slice(0, 2).map(function (f) {
          return f.text;
        })), ['此后岁月 · ' + globalThis.TouhouEngine.futureLabel(s)], _toConsumableArray(_facts.slice(2).map(function (f) {
          return f.text;
        }))),
        facts: _facts
      };
    }
    var facts = [],
      paragraphs = [];
    var happened = function happened(id) {
      return s.log.find(function (e) {
        return e.id === id;
      });
    };
    function fact(kind, text, evidence) {
      facts.push({
        kind: kind,
        text: text,
        evidence: evidence
      });
      return text;
    }
    var opening = [fact('origin', (s.character ? "这一生，你是".concat(s.character.name, "。") : '') + s.log.find(function (e) {
      return e.id === 'origin';
    }).text, ['origin'])];
    if (s.character) {
      var turning = s.log.filter(function (e) {
        return e.check;
      }).at(-1);
      if (turning) opening.push(fact('personal', turning.text, [turning.id]));
    } else if (s.careerHistory.length) {
      var first = s.careerHistory[0];
      opening.push(fact('career', "".concat(at(first.age), "岁起，你做起了").concat(globalThis.TouhouEvents.jobs[first.id], "的营生。"), [first.event]));
      var magic = s.careerHistory.find(function (c) {
        return c.id === 'magic' && c !== first;
      });
      if (magic) opening.push(fact('career-change', "后来学成的小魔法，成了另一门营生。", [magic.event]));
    }
    if (happened('common:migrate')) opening.push(fact('move', '搬到人里东街以后，你重新认熟了邻里的门。', ['common:migrate']));
    if (s.debugUsed) opening.unshift(fact('debug', '这是一段调试人生。', s.log.filter(function (e) {
      return e.developer;
    }).map(function (e) {
      return e.id;
    })));
    paragraphs.push(opening.join(''));
    var ties = [];
    // A surviving friend's recent visit must not displace the lifetime partner's older farewell.
    var _iterator = _createForOfIteratorHelper(Object.values(s.relations).sort(function (a, b) {
        return Number(b.id === s.firstPartnerId) - Number(a.id === s.firstPartnerId) || Number(b.status === 'lover') - Number(a.status === 'lover') || b.lastAt - a.lastAt;
      }).slice(0, 3)),
      _step;
    try {
      var _loop = function _loop() {
        var _r$marriage2;
        var r = _step.value;
        var p = s.people[r.id],
          dream = r.medium === 'dream',
          past = r.history.map(function (h) {
            return h.status;
          }),
          status = ['bereaved', 'parted'].includes(r.status) ? r.previousStatus : r.status;
        var core = r.history.filter(function (h) {
          var _r$marriage;
          return !h.key.startsWith('echo:') && !h.key.startsWith('marriage:') && !['intro', 'farewell', 'remembrance'].includes(h.key) && (((_r$marriage = r.marriage) === null || _r$marriage === void 0 ? void 0 : _r$marriage.stage) !== 3 || h.age < r.marriage.marriedAt);
        }).at(-1);
        var firstDream = happened('relation:' + r.id + ':intro').contactMedium === 'dream';
        var line = "".concat(firstDream ? '梦中，你' : '你', "与").concat(p.name, "在").concat(at(r.startedAt), "岁时相识。");
        if (core) line += core.text;
        if (((_r$marriage2 = r.marriage) === null || _r$marriage2 === void 0 ? void 0 : _r$marriage2.stage) === 3) line += "".concat(dream ? '梦里' : '后来', "，你们在").concat(at(r.marriage.marriedAt), "岁那年结为夫妻。");
        if (happened('relation:' + r.id + ':marriage:unwed')) line += '两人商量好以恋人身份长久相伴。';
        if (!p.alive) line += dream ? '后来梦路渐远，这段来往留在醒后的记事里。' : '后来对方离世，来往成了旧事。';else if (status === 'reconciled') line += '旧日的隔阂有了缓和。';else if (status === 'lover' && (!s.ended || s.deathCause === 'chapter')) line += s.afterlife ? '生前相许的心意，随旧名一同留下。' : '彼此相许的心意，伴你走到此卷末尾。';else if (status === 'enemy' && past.some(function (x) {
          return ['friend', 'confidant', 'mentor'].includes(x);
        })) line += '曾经的亲近，终究化作了旧怨。';else if (status === 'enemy') line += '你们结下了怨。';else if (status === 'estranged') line += '往后的来往渐渐疏远。';
        ties.push(fact('relationship', line, s.log.filter(function (e) {
          return e.id.startsWith('relation:' + r.id + ':') || e.id === 'farewell-' + r.id;
        }).map(function (e) {
          return e.id;
        })));
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    if (happened('common:marry')) {
      var line = '你与一位村民结伴过日子。';
      if (happened('common:child-born')) line += happened('child-grown') ? '孩子渐渐长大，有了自己的生活。' : '家中添了孩子，灯下多了一份牵挂。';
      if (s.people['local:spouse'].alive === false) line += '伴侣已经离世，旧日家常留在记忆里。';
      ties.push(fact('family', line, ['common:marry'].concat(_toConsumableArray(happened('common:child-born') ? ['common:child-born'] : []), _toConsumableArray(happened('child-grown') ? ['child-grown'] : []), _toConsumableArray(s.people['local:spouse'].alive === false ? ['farewell-local:spouse'] : []))));
    } else if (happened('common:courtship') || happened('common:local-young-confession')) ties.push(fact('courtship', s.people['local:spouse'].alive ? '你与一位村民互明心意，约好此后常常相见。' : '你曾与一位村民相恋，后来对方离世。', [happened('common:local-young-confession') ? 'common:local-young-confession' : 'common:courtship'].concat(_toConsumableArray(s.people['local:spouse'].alive === false ? ['farewell-local:spouse'] : []))));
    if (!ties.length && happened('parents-farewell')) ties.push(fact('family-memory', '长辈相继离世之后，熟悉的屋里还留着他们的旧物。', ['parents-farewell']));
    if (happened('common:unwed-promise')) ties.push(fact('companionship', '你们商量好以恋人身份长久相伴。', ['common:unwed-promise']));
    if (ties.length) paragraphs.push(ties.join(''));
    var later = [];
    for (var _i = 0, _Object$values = Object.values(s.relations); _i < _Object$values.length; _i++) {
      var _r$guidance;
      var r = _Object$values[_i];
      if ((_r$guidance = r.guidance) !== null && _r$guidance !== void 0 && _r$guidance.result) {
        var result = happened(r.guidance.result.eventId);
        later.push(fact('guidance', result.text, [result.id]));
        var rescue = happened('guidance:' + r.id + ':protection-used');
        if (rescue) later.push(fact('protection', rescue.text, [rescue.id]));
      }
    }
    if (s.transformation) {
      var t = s.transformation;
      later.push(fact('transformation', "".concat(at(t.age), "岁那年，你成为").concat(_objectSpread(_objectSpread({}, globalThis.TouhouOpportunities.forms), globalThis.TouhouAfterlife.forms)[t.kind].label, "。"), [t.eventId]));
    }
    var _iterator2 = _createForOfIteratorHelper(s.log.filter(function (e) {
        return /^chance:.*-(?:1|2)-fail$/.test(e.id) || e.id === 'chance:abandoned';
      })),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var failure = _step2.value;
        later.push(fact('failed-path', failure.text, [failure.id]));
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (s.pathHistory.some(function (p) {
      return p.result === 'unfinished';
    })) later.push(fact('unfinished-path', '这门修习尚未做完。', s.log.filter(function (e) {
      return e.id.startsWith('chance:') && e.id.endsWith('-found');
    }).map(function (e) {
      return e.id;
    })));
    var stopped = s.log.find(function (e) {
      return /^magic:shachu:.*:pass$/.test(e.id);
    });
    if (stopped) later.push(fact('ageless', '你学成舍虫之术，身体停止成长与老化。', [stopped.id]));else if (((_s$transformation = s.transformation) === null || _s$transformation === void 0 ? void 0 : _s$transformation.kind) === 'magician') later.push(fact('aging-magic', '舍食已经学成，身体仍随着年岁改变。', [s.transformation.eventId]));
    if ((_s$hermit = s.hermit) !== null && _s$hermit !== void 0 && _s$hermit.raids.length) {
      var survived = s.hermit.raids.filter(function (r) {
        return r.result !== 'lost' && (r.age < s.age || s.deathCause === 'chapter');
      }).length;
      if (survived) later.push(fact('pursuit', "你从".concat(survived, "次鬼神追索中生还，此后的修持仍须时时提防。"), s.log.filter(function (e) {
        return e.id.startsWith('hermit:attack:') || e.id.startsWith('hermit:rescued:');
      }).map(function (e) {
        return e.id;
      })));
    }
    for (var _i2 = 0, _arr = ['legendary:pinnacle', 'legendary:outside-return', 'legendary:hifuu-meeting', 'legendary:faith-offering', 'akyuu-return:returned', 'akyuu-return:failed']; _i2 < _arr.length; _i2++) {
      var id = _arr[_i2];
      var e = happened(id);
      if (e) later.push(fact('legendary', e.text, [id]));
    }
    if (later.length) paragraphs.push(later.join(''));
    var closing = [];
    if (happened('common:repay')) closing.push(fact('debt', '借下的债终于还清，手头轻了一桩牵挂。', ['common:debt', 'common:repay']));else if (s.flags.has('debt')) closing.push(fact('debt', '那笔旧债仍未还清。', ['common:debt']));else if (happened('common:house')) closing.push(fact('home', '用积蓄换来的住处，曾替你挡过风雨。', ['common:house']));else if (happened('common:tools-lost')) closing.push(fact('loss', '旧工具曾在途中遗失。', ['common:tools-lost']));
    if (s.deathCause === 'chapter') closing.push(fact('ending', "这一卷在".concat(globalThis.TouhouEngine.time(s), "暂时合上。").concat(s.endingText), ['ending']));else closing.push(fact('ending', s.character || s.transformation ? "".concat(globalThis.TouhouEngine.time(s), "，").concat(s.endingText) : s.endingText, ['ending']));
    paragraphs.push(closing.join(''));
    return {
      paragraphs: paragraphs,
      facts: facts
    };
  }
  globalThis.TouhouMemoir = {
    compose: compose
  };
})();
