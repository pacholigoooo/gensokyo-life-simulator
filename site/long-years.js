function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/* Finite projects in the later years of an ordinary person's transformed life. */
(function () {
  var chains = function chains() {
    return globalThis.TouhouLongYearsData;
  };
  var kinds = ['magician', 'hermit', 'shikaisen', 'youkai', 'vampire', 'ghost', 'vengeful', 'kami'];
  function init(s) {
    s.longYears = {
      chains: {},
      lastAt: null,
      lastTurn: -2,
      history: []
    };
  }
  function mature(s) {
    return !s.character && !!s.transformation && kinds.includes(s.species) && s.age >= 80 && s.age - s.transformation.age >= 12;
  }
  function livingPartner(s) {
    var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : s.partnerId;
    if (!id || s.partnerId !== id || s.firstPartnerId !== id) return false;
    var p = s.people[id],
      r = s.relations[id];
    return !!p && p.alive && p.leaveAt > s.age && p.medium !== 'dream' && (id === 'local:spouse' ? s.married || s.unwedAt !== null : (r === null || r === void 0 ? void 0 : r.status) === 'lover' && r.medium !== 'dream' && r.next === null);
  }
  function matches(s) {
    var rule = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return !Object.entries(rule.min || {}).some(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];
      return s.stats[k] < v;
    }) && !Object.entries(rule.max || {}).some(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        k = _ref4[0],
        v = _ref4[1];
      return s.stats[k] > v;
    }) && !(rule.flags || []).some(function (f) {
      return !s.flags.has(f);
    }) && !(rule.without || []).some(function (f) {
      return s.flags.has(f);
    });
  }
  function available(s, c) {
    var _c$requires, _c$species;
    if (s.age - s.transformation.age < (c.minYears || 0) || s.age < (c.minAge || 0)) return false;
    if (c.species && !c.species.includes(s.species) || c.careers && !c.careers.includes(s.career) || c.habitats && !c.habitats.includes(s.habitat)) return false;
    if ((_c$requires = c.requires) !== null && _c$requires !== void 0 && _c$requires.some(function (f) {
      return !s.flags.has(f);
    })) return false;
    if (c.group === 'career' && (!s.careerDevelopment || s.careerDevelopment.stage < 2 || s.afterlife)) return false;
    // Each afterlife has its own physical limits. Shared bodily scenes never cross this boundary.
    if (s.afterlife && !((_c$species = c.species) !== null && _c$species !== void 0 && _c$species.includes(s.species))) return false;
    if (c.group === 'partner') {
      if (s.afterlife || s.body !== 'humanoid' || s.realm !== 'gensokyo') return false;
      if (c.bereaved) {
        var id = s.firstPartnerId,
          _person = id && s.people[id],
          loss = id && s.log.find(function (e) {
            return e.id === 'farewell-' + id;
          });
        return !!_person && !s.partnerId && !_person.alive && _person.medium !== 'dream' && !!loss && s.age - loss.age >= 6 && loss.age - s.firstLoveAt >= (c.minSharedYears || 24);
      }
      if (!livingPartner(s) || s.age - s.firstLoveAt < (c.minSharedYears || 24) || c.partnerIds && !c.partnerIds.includes(s.partnerId)) return false;
      var person = globalThis.TouhouContent.find(function (p) {
        return p.id === s.partnerId;
      });
      if (person && (person.body !== 'humanoid' || person.animalMind || c.needsFreedom && person.confined)) return false;
    }
    return true;
  }
  function replaceable(s, event) {
    var _event$freshText;
    if (!event) return !!s.afterlife;
    if (s.afterlife) return false;
    // Ongoing courtship, wedding, learning and dangerous checks retain their original slots.
    // Only familiar daily scenes can make room for a new later-life project.
    var routine = event.id.startsWith('common:') && event.repeat > 1 && !event.localRomance || event.id.startsWith('changed:') || /:marriage:daily:|:echo:/.test(event.id) || /^career:[^:]+:work-\d+:/.test(event.id) || event.id.startsWith('circle:');
    if (!routine) return false;
    // New wording belongs to the same familiar routine for project scheduling.
    var text = (_event$freshText = event.freshText) !== null && _event$freshText !== void 0 ? _event$freshText : event.text,
      body = typeof text === 'function' ? text(s) : text;
    return s.log.some(function (e) {
      return e.text === body;
    });
  }
  function resources(s, values) {
    for (var _i = 0, _Object$entries = Object.entries(values || {}); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];
      if (['faith', 'cohesion', 'resentment'].includes(key)) {
        var a = s.afterlife,
          limit = key === 'faith' ? 30 : 24;
        a[key] = Math.max(0, Math.min(limit, a[key] + value));
      } else if (key === 'practice') {
        s.careerDevelopment.practice += value;
        s.careerDevelopment.stagePractice += value;
      } else s.careerDevelopment[key] += value;
    }
  }
  function scene(s, c, progress) {
    var _stage$branches;
    var index = (progress === null || progress === void 0 ? void 0 : progress.next) || 0,
      stage = c.stages[index],
      choice = ((_stage$branches = stage.branches) === null || _stage$branches === void 0 ? void 0 : _stage$branches.find(function (b) {
        return matches(s, b.when);
      })) || stage;
    var partnerId = (progress === null || progress === void 0 ? void 0 : progress.partnerId) || (c.group === 'partner' ? c.bereaved ? s.firstPartnerId : s.partnerId : null);
    var body = choice.text.replaceAll('{partner}', partnerId ? s.people[partnerId].name : '');
    return {
      id: 'development:long-' + c.id + '-' + index,
      text: body,
      effects: choice.effects || {},
      xp: choice.xp || 0,
      wear: choice.wear || 0,
      weight: 1,
      repeat: 1,
      scene: '积年续事 · ' + c.title,
      set: choice.set,
      clear: choice.clear,
      sharedWith: c.group === 'partner' && !c.bereaved ? partnerId : undefined,
      developmentMoment: index === c.stages.length - 1 ? {
        kind: 'long-years',
        major: true,
        status: '积年新篇',
        title: c.title,
        impact: body
      } : undefined,
      apply: function apply(state) {
        var current = state.longYears.chains[c.id] || {
          next: 0,
          startedAt: state.age,
          lastAt: state.age,
          partnerId: partnerId,
          done: false
        };
        resources(state, choice.resources);
        current.next++;
        current.lastAt = state.age;
        current.done = current.next === c.stages.length;
        state.longYears.chains[c.id] = current;
        state.longYears.lastAt = state.age;
        state.longYears.lastTurn = state.turn;
        state.longYears.history.push({
          chain: c.id,
          stage: index,
          age: state.age,
          partnerId: partnerId,
          done: current.done
        });
      }
    };
  }
  function interrupted(s, c, progress) {
    return {
      id: 'development:long-' + c.id + '-interrupted',
      text: c.interruptedText || '营生与住处有了变化，你收好这段未完的记录，暂时停下' + c.title + '的打算。',
      effects: {},
      weight: 1,
      repeat: 1,
      scene: '积年续事 · ' + c.title,
      apply: function apply(state) {
        progress.done = true;
        progress.interrupted = true;
        progress.lastAt = state.age;
        state.longYears.lastAt = state.age;
        state.longYears.lastTurn = state.turn;
        state.longYears.history.push({
          chain: c.id,
          stage: 'interrupted',
          age: state.age,
          partnerId: progress.partnerId,
          done: true
        });
      }
    };
  }
  function select(s, event) {
    if (!mature(s) || s.ended || s.dormant || s.injured || s.pendingCause || s.stats.health <= 4 || globalThis.TouhouAfterlife.ending(s) || !replaceable(s, event)) return null;
    var state = s.longYears;
    if (s.turn - state.lastTurn < 2 || state.lastAt !== null && s.age - state.lastAt < 4) return null;
    var active = chains().filter(function (c) {
      return state.chains[c.id] && !state.chains[c.id].done;
    });
    var _iterator = _createForOfIteratorHelper(active),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var c = _step.value;
        var progress = state.chains[c.id];
        if (c.group === 'partner' && !c.bereaved && !livingPartner(s, progress.partnerId) || c.careers && !c.careers.includes(s.career) || c.habitats && !c.habitats.includes(s.habitat)) return interrupted(s, c, progress);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var continuing = active.filter(function (c) {
      return available(s, c) && s.age - state.chains[c.id].lastAt >= c.stages[state.chains[c.id].next].delay;
    });
    if (continuing.length) {
      continuing.sort(function (a, b) {
        return state.chains[a.id].lastAt - state.chains[b.id].lastAt;
      });
      return scene(s, continuing[0], state.chains[continuing[0].id]);
    }
    if (active.length >= 2) return null;
    var pool = chains().filter(function (c) {
      return !state.chains[c.id] && available(s, c) && !active.some(function (a) {
        return a.group === 'partner' === (c.group === 'partner');
      });
    });
    if (!pool.length) return null;
    // The project draw does not consume the relationship selector's random stream.
    var rng = globalThis.TouhouEngine.random(s.seed ^ Math.imul(s.turn, 0x45d9f3b));
    var personal = pool.filter(function (c) {
      var _c$requires2;
      return c.partnerIds || ((_c$requires2 = c.requires) === null || _c$requires2 === void 0 ? void 0 : _c$requires2.some(function (f) {
        return f.startsWith('talent-story:');
      }));
    });
    var choices = personal.length && rng() < .65 ? personal : pool;
    return scene(s, choices[Math.floor(rng() * choices.length)]);
  }
  globalThis.TouhouLongYears = {
    init: init,
    mature: mature,
    livingPartner: livingPartner,
    matches: matches,
    available: available,
    replaceable: replaceable,
    select: select
  };
})();
