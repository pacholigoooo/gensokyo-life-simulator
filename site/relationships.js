function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
/* Ordinary lives retain each named relationship through its own authored graph. */
(function () {
  var labels = {
    acquaintance: '相识',
    friend: '友人',
    confidant: '挚友',
    mentor: '师友',
    rival: '对手',
    enemy: '仇敌',
    estranged: '疏远',
    reconciled: '缓和',
    lover: '相恋',
    bereaved: '故人',
    parted: '梦别'
  };
  var friendly = new Set(['friend', 'confidant', 'mentor', 'reconciled', 'lover']);
  var data = function data() {
      return globalThis.TouhouRelationshipData;
    },
    C = globalThis.TouhouContacts;
  var maxActive = 2;
  function init(s) {
    s.relations = {};
    s.partnerId = null;
    s.firstPartnerId = null;
    s.firstLoveAt = null;
    s.unwedAt = null;
    s.meetingPlan = {
      enabled: false,
      current: null,
      history: []
    };
  }
  function activeCount(s) {
    return Object.values(s.relations).filter(function (r) {
      return r.next !== null && s.people[r.id].alive;
    }).length;
  }
  // firstPartnerId 是终身唯一约定；partnerId 是当前相伴。离世或分离只能清当前状态。
  function freePartner(s) {
    return s.firstPartnerId === null && s.partnerId === null && !s.married && s.courtshipAt === null;
  }
  function bindPartner(s, id) {
    if (!freePartner(s)) throw Error('这一生已经确立过恋人。');
    s.firstPartnerId = id;
    s.firstLoveAt = s.age;
    s.partnerId = id;
  }
  function introductionDueAt(s) {
    var years = Object.values(s.relations).map(function (r) {
      return r.startedAt;
    });
    return years.length ? Math.max.apply(Math, _toConsumableArray(years)) + globalThis.TouhouLifeConfig.introductionGap : 18;
  }
  function partner(s) {
    return s.partnerId ? {
      id: s.partnerId,
      name: s.partnerId === 'local:spouse' ? '村民伴侣' : s.people[s.partnerId].name,
      status: s.married ? '已婚' : '相恋'
    } : null;
  }
  function partnerChange(s, before) {
    var _s$relations$before$i;
    var after = partner(s);
    if ((before === null || before === void 0 ? void 0 : before.id) === (after === null || after === void 0 ? void 0 : after.id) && (before === null || before === void 0 ? void 0 : before.status) === (after === null || after === void 0 ? void 0 : after.status)) return;
    if (after) return {
      kind: after.status === '已婚' ? 'marriage' : 'courtship',
      title: after.status === '已婚' ? '结婚' : '确立恋人',
      person: after.name,
      status: after.status,
      impact: after.status === '已婚' ? '婚礼过后，日常有了新的约定。' : '彼此说定心意，往后的日子一起走。'
    };
    var died = !s.people[before.id].alive;
    if (died && ((_s$relations$before$i = s.relations[before.id]) === null || _s$relations$before$i === void 0 ? void 0 : _s$relations$before$i.medium) === 'dream') return {
      kind: 'dream-parting',
      title: '梦中别离',
      person: before.name,
      status: '梦路渐远',
      impact: '相见的梦淡去了，旧事留在记忆里。'
    };
    return {
      kind: died ? 'bereaved' : 'breakup',
      title: died ? '伴侣离世' : '分手',
      person: before.name,
      status: '旧日相伴',
      impact: '这段心意留在往后的记忆里。'
    };
  }
  function romanceClosure(s, id) {
    var route = data().find(function (d) {
        return d.id === id;
      }),
      r = s.relations[id];
    if (!route.romance || r.romanceClosed || r.status === 'lover' || route.romanceStart && !r.romancePath) return;
    // Attributes can grow; only completed choices and immutable talents close a path.
    function possible(node, flags, trust) {
      return node !== null && route.nodes[node].branches.some(function (b) {
        var _c$relationFlags, _c$missingRelationFla, _c$training;
        var c = b.when;
        if ((_c$relationFlags = c.relationFlags) !== null && _c$relationFlags !== void 0 && _c$relationFlags.some(function (f) {
          return !flags.includes(f);
        }) || (_c$missingRelationFla = c.missingRelationFlags) !== null && _c$missingRelationFla !== void 0 && _c$missingRelationFla.some(function (f) {
          return flags.includes(f);
        }) || c.talentsAny && !((_c$training = c.training) !== null && _c$training !== void 0 && _c$training.talent) && !c.talentsAny.some(function (t) {
          return s.talents.includes(t);
        }) || c.minTrust !== undefined && trust < c.minTrust || c.maxTrust !== undefined && trust > c.maxTrust) return false;
        var nextFlags = [].concat(_toConsumableArray(flags.filter(function (f) {
          var _b$clear;
          return !((_b$clear = b.clear) !== null && _b$clear !== void 0 && _b$clear.includes(f));
        })), _toConsumableArray(b.set || []));
        return b.status === 'lover' || possible(b.next, nextFlags, Math.max(-10, Math.min(10, trust + (b.trust || 0))));
      });
    }
    if (possible(r.next, r.flags, r.trust)) return;
    r.romanceClosed = true;
    return {
      kind: 'closed',
      title: '恋爱分支结束',
      person: s.people[id].name,
      status: labels[r.status],
      impact: '这段来往此后不再进入恋爱。'
    };
  }
  function romanceView(route) {
    return route.romanceContact ? _objectSpread(_objectSpread({}, route), {}, {
      contact: route.romanceContact
    }) : route;
  }
  function canStartRomance(s, route) {
    return !!route.romanceStart && freePartner(s) && C.gateReady(s, route);
  }
  function extendedHuman(s) {
    return s.flags.has('partner-learning:care-complete') || s.flags.has('partner-learning:vitality-complete') || Object.values(s.relations).some(function (r) {
      var _r$guidance;
      return ((_r$guidance = r.guidance) === null || _r$guidance === void 0 || (_r$guidance = _r$guidance.result) === null || _r$guidance === void 0 ? void 0 : _r$guidance.kind) === 'longevity';
    });
  }
  function realStudy(s) {
    var _s$opportunity, _s$development;
    return ((_s$opportunity = s.opportunity) === null || _s$opportunity === void 0 ? void 0 : _s$opportunity.stage) >= 2 || ((_s$development = s.development) === null || _s$development === void 0 ? void 0 : _s$development.kind) === 'shikaisen' && s.development.progress >= 2 || Object.values(s.partnerStudy || {}).some(function (p) {
      var _p$receive;
      return ((_p$receive = p.receive) === null || _p$receive === void 0 ? void 0 : _p$receive.stage) >= 2 && p.receive.stage < p.receive.maxStages && ['magician', 'hermit', 'vampire', 'boundary'].includes(p.receive.kind);
    });
  }
  function romanticTiming(s) {
    if (s.species !== 'human' || extendedHuman(s)) return 1;
    // A first clue is not extra lifespan. Late starts remain possible, but become less common.
    return s.bodyAge >= 55 ? .15 : s.bodyAge >= 45 ? .4 : 1;
  }
  function oldFriend(s, route) {
    var checkContact = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var r = s.relations[route.id];
    // Yoshika's respectful gate-side acquaintance can lead only to her separately authored past-life dream.
    var remembered = route.id === 'yoshika' && (r === null || r === void 0 ? void 0 : r.status) === 'rival' && r.trust >= 3 && r.flags.includes('steps-recorded') && !r.flags.includes('command-pressed');
    return !s.character && !s.ended && !s.afterlife && !s.dormant && !!r && !!route.romanceStart && r.romanceAllowed && !r.romancePath && !r.romanceClosed && (friendly.has(r.status) || remembered) && r.status !== 'lover' && s.people[r.id].alive && s.people[r.id].leaveAt > s.age && freePartner(s) && s.body === 'humanoid' && s.age >= 24 && s.age - r.startedAt >= globalThis.TouhouLifeConfig.oldFriendRomanceYears && (!checkContact || C.gateReady(s, route));
  }
  function oldFriendEvent(s, route) {
    var r = s.relations[route.id],
      node = route.nodes[route.romanceStart],
      b = node.branches.find(function (b) {
        return matches(s, r, b.when);
      });
    if (!b) throw Error('旧友恋爱入口没有可达分支：' + route.id);
    var e = branchEvent(route, route.romanceStart, b),
      apply = e.apply;
    e.apply = function (state) {
      if (!oldFriend(state, route)) throw Error('旧友恋爱前置已改变：' + route.id);
      // Keep the lived friendship. Only the route and its contact medium change (Yoshika uses a historical dream).
      r.romancePath = true;
      r.romanceFromFriend = true;
      r.romanceOrigin = 'old-friend';
      r.next = route.romanceStart;
      r.medium = C.mode(romanceView(route));
      r.scene = C.scene(romanceView(route));
      state.people[r.id].medium = r.medium;
      apply(state);
    };
    return e;
  }
  function introWeight(s, route) {
    if (route.romance && freePartner(s)) return (route.romanceGate.category === 'pc98' ? globalThis.TouhouLifeConfig.pc98RomanceWeight : 1) * globalThis.TouhouLifeConfig.romanceIntroWeight * (s.romanceWish === route.id ? globalThis.TouhouLifeConfig.romanceWishWeight : 1);
    return C.relatedWeight(s, route) * (1 + s.talents.filter(function (t) {
      return route.talents.includes(t);
    }).length * .8 + (route.careers.includes(s.career) ? 1 : 0));
  }
  function youngAgeReady(s, route, r) {
    var p = s.people[route.id];
    return !!route.young && r.young && r.youngOrigin === 'fictional-youth' && r.startedAt >= 10 && r.startedAt <= 11 && (route.id === 'akyuu' ? globalThis.TouhouAkyuu.age(s) >= 18 : p.ageBasis === 'fictional-same-age' && p.ageAtMeet + s.age - p.metAt >= 16);
  }
  function canLove(s, route, r) {
    return !s.character && !s.afterlife && !s.dormant && s.body === 'humanoid' && r.romanceAllowed && data().some(function (d) {
      return d.id === route.id && d.romance;
    }) && route.romance && C.gateReady(s, route) && s.age >= (r.young ? 16 : 20) && (!r.young || youngAgeReady(s, route, r)) && (route.id !== 'akyuu' || globalThis.TouhouAkyuu.age(s) >= 18) && r.visits >= 4 && s.age - r.startedAt >= 6 && r.trust >= 4 && freePartner(s);
  }
  function echoDelay(r, e) {
    return e.interval || 6;
  }
  function matches(s, r, c) {
    var _c$training2, _c$training3, _c$flags, _c$missingFlags, _c$relationFlags2, _c$missingRelationFla2;
    if (c.minAge !== undefined && s.age < c.minAge || c.maxAge !== undefined && s.age > c.maxAge) return false;
    if (c.min && Object.entries(c.min).some(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];
      return s.stats[k] < v;
    }) || c.max && Object.entries(c.max).some(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
        k = _ref4[0],
        v = _ref4[1];
      return s.stats[k] > v;
    })) return false;
    if (c.habitats && !c.habitats.includes(s.habitat) || c.species && !c.species.includes(s.species) || c.careers && !c.careers.includes(s.career) && !s.flags.has((_c$training2 = c.training) === null || _c$training2 === void 0 ? void 0 : _c$training2.career)) return false;
    if (c.talentsAny && !c.talentsAny.some(function (id) {
      return s.talents.includes(id);
    }) && !s.flags.has((_c$training3 = c.training) === null || _c$training3 === void 0 ? void 0 : _c$training3.talent)) return false;
    if ((_c$flags = c.flags) !== null && _c$flags !== void 0 && _c$flags.some(function (f) {
      return !s.flags.has(f);
    }) || (_c$missingFlags = c.missingFlags) !== null && _c$missingFlags !== void 0 && _c$missingFlags.some(function (f) {
      return s.flags.has(f);
    })) return false;
    if ((_c$relationFlags2 = c.relationFlags) !== null && _c$relationFlags2 !== void 0 && _c$relationFlags2.some(function (f) {
      return !r.flags.includes(f);
    }) || (_c$missingRelationFla2 = c.missingRelationFlags) !== null && _c$missingRelationFla2 !== void 0 && _c$missingRelationFla2.some(function (f) {
      return r.flags.includes(f);
    })) return false;
    if (c.minTrust !== undefined && r.trust < c.minTrust || c.maxTrust !== undefined && r.trust > c.maxTrust) return false;
    if (c.minVisits !== undefined && r.visits < c.minVisits || c.minYears !== undefined && s.age - r.startedAt < c.minYears) return false;
    return !c.freePartner || freePartner(s);
  }
  function remember(s, r, key, text) {
    r.history.push({
      key: key,
      age: s.age,
      text: text,
      status: r.status,
      label: r.label
    });
    r.lastAt = s.age;
  }
  function begin(s, route, romantic) {
    var intro = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : romantic && route.romanceIntro ? route.romanceIntro : route.intro;
    var romanceAllowed = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
    var origin = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'ambient';
    var view = romantic ? romanceView(route) : route;
    // 初识是否走恋爱图只决定当下的来往；未相恋的旧友仍可凭真实经历发展。
    var r = {
      id: route.id,
      status: 'acquaintance',
      previousStatus: null,
      next: romantic ? route.romanceStart : route.intro.next,
      label: intro.label,
      romancePath: romantic,
      romanceAllowed: romanceAllowed,
      courses: {},
      practice: {},
      startedAt: s.age,
      lastAt: s.age,
      trust: 0,
      visits: 1,
      flags: [],
      history: [],
      echoes: {},
      activityAt: {},
      lastEchoKey: null,
      loveAt: null,
      loveDelay: null,
      marriage: null,
      circleAt: null,
      circleKey: null,
      remembranceAt: null,
      summary: ''
    };
    s.relations[route.id] = r;
    r.romanceOrigin = origin;
    r.medium = C.mode(view);
    r.scene = C.scene(view);
    s.people[route.id].medium = r.medium;
    remember(s, r, 'intro', intro.text);
  }
  function advance(s, route, node, key, b) {
    var r = s.relations[route.id];
    if (b.status === 'lover') {
      if (!canLove(s, route, r)) throw Error('恋爱节点违反成年或伴侣契约：' + route.id);
      bindPartner(s, route.id);
      r.loveAt = s.age;
      r.loveDelay = pace(s, r).courtship;
    } else if (b.status && r.status === 'lover' && b.status !== 'lover' && s.partnerId === route.id) s.partnerId = null;
    if (b.status) r.status = b.status;
    r.trust = Math.max(-10, Math.min(10, r.trust + (b.trust || 0)));
    r.visits++;
    r.next = b.next;
    r.label = b.label;
    // 友人身份来自已经发生的往来与信任；原图的 next 保留，未发生的友情节点不能算作经历。
    if (!r.romancePath && r.status === 'acquaintance' && r.visits >= 3 && r.trust >= 2) r.status = 'friend';
    var _iterator = _createForOfIteratorHelper(b.clear || []),
      _step;
    try {
      var _loop = function _loop() {
        var f = _step.value;
        r.flags = r.flags.filter(function (x) {
          return x !== f;
        });
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var _iterator2 = _createForOfIteratorHelper(b.set || []),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var f = _step2.value;
        if (!r.flags.includes(f)) r.flags.push(f);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (b.injury) s.injured = true;
    s.people[route.id].close = friendly.has(r.status) ? Math.max(2, r.trust) : ['enemy', 'estranged'].includes(r.status) ? 0 : 1;
    remember(s, r, node + ':' + key, b.text);
  }
  function event(route, id, text, effects, apply) {
    var extra = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
    return _objectSpread({
      id: 'relation:' + route.id + ':' + id,
      text: text,
      effects: effects,
      weight: 1,
      repeat: 1,
      "with": [route.id],
      apply: apply,
      scene: C.scene(route),
      contactMedium: C.mode(route),
      premise: id === 'intro' ? route.contact.premise : undefined
    }, extra);
  }
  function introduction(route, s) {
    var tryRomance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var romanceAllowed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var origin = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'ambient';
    var romantic = tryRomance && !!s && canStartRomance(s, route),
      view = romantic ? romanceView(route) : route,
      original = romantic && route.romanceIntro ? route.romanceIntro : route.preparedIntro && s && !matches(s, null, route.entry) ? route.preparedIntro : route.intro;
    // Childhood recognition changes the meeting text, not adult trust or courtship prerequisites.
    var intro = _objectSpread(_objectSpread({}, original), {}, {
      text: (s ? C.reunion(s, route.id) : '') + original.text
    });
    return event(view, 'intro', intro.text, intro.effects, function (state) {
      return begin(state, route, romantic, intro, romanceAllowed, origin);
    }, {
      talentBoost: route.talents
    });
  }
  function youngEntry(s, route) {
    return !!route.young && !s.character && !s.ended && !s.afterlife && !s.dormant && s.realm === 'gensokyo' && s.body === 'humanoid' && s.species === 'human' && freePartner(s) && !s.people[route.id] && !s.relations[route.id] && matches(s, null, route.young.entry);
  }
  function youngIntroduction(route, s) {
    if (!youngEntry(s, route)) throw Error('少年初识前置未完成：' + route.id);
    var y = route.young,
      view = romanceView(route);
    return event(view, 'intro', y.intro.text, y.intro.effects, function (state) {
      begin(state, route, true, y.intro, true, 'young');
      var r = state.relations[route.id],
        p = state.people[route.id];
      r.next = y.start;
      r.young = true;
      r.youngOrigin = 'fictional-youth';
      r.canonAge = 'unknown';
      r.youngScenes = {};
      r.scene = '少年篇（二创） · ' + view.contact.place;
      if (route.id !== 'akyuu') {
        p.ageAtMeet = state.age;
        p.ageBasis = 'fictional-same-age';
      }
    }, {
      scene: '少年篇（二创） · ' + view.contact.place,
      youngScene: true,
      set: y.contactFlag ? [y.contactFlag] : []
    });
  }
  function youngMeeting(s, rng) {
    var plan = s.meetingPlan;
    if (s.age < 10 || s.age > 11 || plan.youngChecked || !freePartner(s) || s.species !== 'human' || s.body !== 'humanoid') return null;
    if (plan.youngAt === undefined) plan.youngAt = 10 + Math.floor(rng() * 2);
    if (s.age < plan.youngAt) return null;
    plan.youngChecked = true;
    if (rng() >= globalThis.TouhouLifeConfig.youngNamedChance) return null;
    // Draw from the full roster, not a four-person pool. Childhood access grants
    // no second high-probability draw to people who already live nearby.
    var choices = data().filter(function (d) {
      var _s$people$d$id;
      return d.romance && ((_s$people$d$id = s.people[d.id]) === null || _s$people$d$id === void 0 ? void 0 : _s$people$d$id.alive) !== false;
    });
    if (!choices.length) return null;
    var weights = choices.map(function (d) {
      return C.leadWeight(s, d);
    });
    var n = rng() * weights.reduce(function (a, b) {
        return a + b;
      }, 0),
      i = 0;
    while (i < weights.length - 1 && n >= weights[i]) n -= weights[i++];
    var route = choices[i];
    return youngEntry(s, route) ? youngIntroduction(route, s) : null;
  }
  function youngScene(s, route, item) {
    var r = s.relations[route.id];
    return event(romanceView(route), 'young-scene:' + item.key, item.text, {}, function (state) {
      r.youngScenes[item.key] = state.age;
      remember(state, r, 'young-scene:' + item.key, item.text);
    }, {
      scene: '少年篇（二创） · ' + route.contact.place,
      youngScene: true
    });
  }
  function branchEvent(route, nodeId, b) {
    var young = nodeId.startsWith('young:');
    return event(nodeId.startsWith('love:') || young ? romanceView(route) : route, nodeId + ':' + b.key, b.text, b.effects, function (state) {
      return advance(state, route, nodeId, b.key, b);
    }, _objectSpread({
      xp: b.xp || 0,
      wear: b.wear || 0
    }, young ? {
      scene: '少年篇（二创） · ' + route.contact.place,
      youngScene: true
    } : {}));
  }
  function echoEvent(s, route, e) {
    var r = s.relations[route.id],
      text = e.romanceEcho ? globalThis.TouhouCompanionship.text(s, r, e) : e.text;
    return event(r.romancePath ? romanceView(route) : route, 'echo:' + e.key + ':' + (r.echoes[e.key] || 0), text, e.effects, function (state) {
      r.echoes[e.key] = (r.echoes[e.key] || 0) + 1;
      r.lastEchoKey = e.key;
      r.activityAt['echo:' + e.key] = state.age;
      remember(state, r, 'echo:' + e.key, text);
      state.people[r.id].close = friendly.has(r.status) ? Math.max(2, r.trust) : 0;
    });
  }
  function echoDueAt(s, route, e) {
    var _r$activityAt;
    var r = s.relations[route.id];
    return r.status === 'lover' && route.marriage ? ((_r$activityAt = r.activityAt['echo:' + e.key]) !== null && _r$activityAt !== void 0 ? _r$activityAt : r.loveAt) + Math.max(echoDelay(r, e), pace(s, r).echo) : r.lastAt + echoDelay(r, e);
  }
  function canEcho(s, route, e) {
    var r = s.relations[route.id];
    return !s.ended && !s.afterlife && !s.dormant && s.body === 'humanoid' && !!r && !(r.young && s.age < 20) && r.next === null && s.people[r.id].alive && s.people[r.id].leaveAt > s.age && (!r.romancePath || e.romanceEcho) && e.states.includes(r.status) && (r.status !== 'lover' || s.partnerId === r.id) && (!(r.status === 'lover' && route.marriage) ? (r.echoes[e.key] || 0) < 2 : r.lastEchoKey !== e.key && s.age - r.lastAt >= 2 && globalThis.TouhouCompanionship.fresh(s, r, globalThis.TouhouCompanionship.text(s, r, e))) && (!e.when || matches(s, r, e.when));
  }
  function marriageStage(s, route) {
    var _r$marriage, _r$marriage2;
    var r = s.relations[route.id];
    if (!route.marriage || !r || r.status !== 'lover' || r.next !== null || s.partnerId !== route.id || !s.people[route.id].alive || s.people[route.id].leaveAt <= s.age || s.character || s.ended || s.afterlife || s.dormant || s.body !== 'humanoid' || s.realm !== 'gensokyo' || s.age < 20 || r.trust < 4 || s.unwedAt !== null) return null;
    if (((_r$marriage = r.marriage) === null || _r$marriage === void 0 ? void 0 : _r$marriage.stage) === 3) return s.married ? 'daily' : null;
    if (s.married) return null;
    return ['proposal', 'planning', 'wedding'][((_r$marriage2 = r.marriage) === null || _r$marriage2 === void 0 ? void 0 : _r$marriage2.stage) || 0];
  }
  // Lifespans of both partners matter: an aging partner keeps the human calendar.
  function pace(s, r) {
    var p = s.people[r.id],
      finitePartner = p.life === 'human' && !p.ageless || p.species === 'magician' && !p.ageless;
    if (s.species === 'human' || s.species === 'magician' && !s.magic.ageless || finitePartner) {
      var base = globalThis.TouhouLifeConfig.humanMarriageYears;
      var _courtship = s.species === 'human' && s.bodyAge < 45 && s.wear < s.vitality * .7 && s.stats.health > 3 && !s.injured && realStudy(s) ? base + 3 : s.species === 'human' && s.wear < s.vitality * .7 && s.stats.health > 3 && !s.injured && extendedHuman(s) ? base + 1 : base;
      return {
        courtship: _courtship,
        ceremony: 1,
        daily: 3,
        echo: 6
      };
    }
    var schedules = {
      hermit: [4, 2, 4, 8],
      shikaisen: [5, 2, 4, 8],
      magician: [5, 2, 4, 10],
      youkai: [6, 3, 5, 10],
      vampire: [8, 3, 5, 12]
    };
    var _schedules$s$species = _slicedToArray(schedules[s.species], 4),
      courtship = _schedules$s$species[0],
      ceremony = _schedules$s$species[1],
      daily = _schedules$s$species[2],
      echo = _schedules$s$species[3];
    return {
      courtship: courtship,
      ceremony: ceremony,
      daily: daily,
      echo: echo
    };
  }
  function marriageDueAt(s, r, key) {
    var cadence = pace(s, r);
    return key === 'proposal' ? Math.max(r.lastAt + 1, r.loveAt + Math.max(r.loveDelay, cadence.courtship)) : Math.max(r.lastAt + 1, r.marriage.lastAt + cadence.ceremony);
  }
  function marriageEvent(s, route, key) {
    var r = s.relations[route.id],
      text = route.marriage[key];
    return event(r.romancePath ? romanceView(route) : route, 'marriage:' + key, text, {
      bond: 1
    }, function (state) {
      if (marriageStage(state, route) !== key || state.age < marriageDueAt(state, r, key)) throw Error('婚事前置未完成：' + route.id + '/' + key);
      if (key === 'proposal') r.marriage = {
        stage: 1,
        lastAt: state.age,
        marriedAt: null,
        daily: {},
        lastDaily: null
      };else {
        r.marriage.stage++;
        r.marriage.lastAt = state.age;
      }
      if (key === 'wedding') {
        state.married = true;
        r.marriage.marriedAt = state.age;
      }
      r.label = {
        proposal: '许下婚约',
        planning: '一起筹备婚事',
        wedding: r.medium === 'dream' ? '梦中结为夫妻' : '结为夫妻'
      }[key];
      remember(state, r, 'marriage:' + key, text);
    });
  }
  function unwedEvent(s, route) {
    var r = s.relations[route.id],
      text = '谈起往后的安排，你与' + s.people[route.id].name + '商量好继续以恋人身份相伴。两人都愿意，便把这份约定记在共同的日子里。';
    return event(romanceView(route), 'marriage:unwed', text, {
      bond: 1
    }, function (state) {
      if (marriageStage(state, route) !== 'proposal' || state.age < marriageDueAt(state, r, 'proposal')) throw Error('相伴约定前置未完成：' + route.id);
      state.unwedAt = state.age;
      r.label = '约定以恋人相伴';
      remember(state, r, 'marriage:unwed', text);
    });
  }
  function dailyDueAt(s, r, d) {
    var _r$activityAt2;
    return ((_r$activityAt2 = r.activityAt['marriage:' + d.key]) !== null && _r$activityAt2 !== void 0 ? _r$activityAt2 : r.marriage.marriedAt) + pace(s, r).daily;
  }
  function marriageDailyEvent(s, route, d) {
    var r = s.relations[route.id],
      text = globalThis.TouhouCompanionship.text(s, r, d);
    return event(r.romancePath ? romanceView(route) : route, 'marriage:daily:' + d.key + ':' + (r.marriage.daily[d.key] || 0), text, {}, function (state) {
      if (marriageStage(state, route) !== 'daily' || state.age < dailyDueAt(state, r, d) || state.age - r.lastAt < 2 || r.marriage.lastDaily === d.key || !globalThis.TouhouCompanionship.fresh(state, r, text)) throw Error('婚后日常前置未完成：' + route.id + '/' + d.key);
      r.marriage.daily[d.key] = (r.marriage.daily[d.key] || 0) + 1;
      r.marriage.lastDaily = d.key;
      r.activityAt['marriage:' + d.key] = state.age;
      r.label = '婚后相伴';
      remember(state, r, 'marriage:daily:' + d.key, text);
    });
  }
  // Human years are scarce: keep every scene, while placing the confession after its authored minimum acquaintance.
  function nodeDueAt(s, route, r) {
    var node = route.nodes[r.next],
      _short = s.species === 'human' && !extendedHuman(s) && !realStudy(s) && r.romancePath;
    var delay = _short ? Math.min(node.delay, 1) : node.delay;
    var love = node.branches.find(function (b) {
      return b.status === 'lover';
    });
    var ownAgeDue = love && r.young && route.id === 'akyuu' ? s.age + Math.max(0, 18 - globalThis.TouhouAkyuu.age(s)) : 0;
    return Math.max(r.lastAt + delay, love ? Math.max(love.when.minAge, r.startedAt + love.when.minYears, ownAgeDue) : 0);
  }
  function select(s, rng) {
    if (s.character || s.ended || s.afterlife || s.dormant || s.realm !== 'gensokyo') return null;
    var young = youngMeeting(s, rng);
    if (young) return young;
    // A selected first visit keeps its visitor through the neutral introduction.
    // Drawing another person next year would dilute people who need an extra scene.
    if (s.plannedIntroduction) {
      var visit = s.plannedIntroduction,
        route = data().find(function (r) {
          return r.id === visit.id;
        });
      if (s.relations[visit.id] || !freePartner(s) || s.people[visit.id].alive === false || s.people[visit.id].leaveAt <= s.age || s.body !== 'humanoid') s.plannedIntroduction = null;else if (s.age > visit.age && s.age >= introductionDueAt(s) && activeCount(s) < maxActive) {
        var e = introduction(route, s, visit.allowed),
          apply = e.apply;
        e.apply = function (state) {
          state.plannedIntroduction = null;
          apply(state);
        };
        return e;
      }
    }
    var candidates = [globalThis.TouhouPartnerLearning.candidate(s), globalThis.TouhouAkyuu.candidate(s), globalThis.TouhouCompanionship.candidate(s), globalThis.TouhouGuidance.candidate(s)].filter(Boolean);
    var _loop2 = function _loop2() {
      var r = _Object$values[_i];
      if (s.people[r.id].alive && s.people[r.id].leaveAt > s.age) {
        var _route = data().find(function (d) {
          return d.id === r.id;
        });
        if (C.waitingPractice(s, _route)) candidates.push({
          due: r.lastAt + 1,
          chance: .8,
          get: function get() {
            return C.practiceEvent(s, _route);
          }
        });else if (r.next !== null) {
          // 按数据顺序选择首条满足条件的分支，末尾空条件承接其余情况；不能随机抽取。
          var node = _route.nodes[r.next];
          candidates.push({
            due: nodeDueAt(s, _route, r),
            chance: s.species === 'human' ? globalThis.TouhouLifeConfig.humanBranchChance : .4,
            get: function get() {
              if (r.romancePath && r.status !== 'lover' && !freePartner(s)) return branchEvent(_route, r.next, {
                key: 'interrupted',
                text: _route.romanceInterrupted,
                effects: {},
                next: null,
                status: 'friend',
                label: '心意止于朋友'
              });
              var b = node.branches.find(function (b) {
                return matches(s, r, b.when) && (b.status !== 'lover' || canLove(s, _route, r));
              });
              if (!b) throw Error('关系节点没有可达分支：' + r.id + '/' + r.next);
              return branchEvent(_route, r.next, b);
            }
          });
        } else if (r.next === null) {
          if (r.young && r.status === 'lover' && s.partnerId === r.id && s.age < 20) {
            var scene = _route.young.scenes.find(function (e) {
              return r.youngScenes[e.key] === undefined;
            });
            if (scene) candidates.push({
              due: r.lastAt + 1,
              chance: .6,
              get: function get() {
                return youngScene(s, _route, scene);
              }
            });
          }
          var stage = marriageStage(s, _route);
          if (stage && stage !== 'daily') candidates.push({
            due: marriageDueAt(s, r, stage),
            chance: s.species === 'human' ? globalThis.TouhouLifeConfig.humanMarriageChance : .3,
            get: function get() {
              return stage === 'proposal' && rng() < globalThis.TouhouLifeConfig.unwedCompanionshipChance ? unwedEvent(s, _route) : marriageEvent(s, _route, stage);
            }
          });
          if (stage === 'daily' && s.age - r.lastAt >= 2) {
            var _iterator3 = _createForOfIteratorHelper(_route.marriage.daily),
              _step3;
            try {
              var _loop3 = function _loop3() {
                var d = _step3.value;
                if (r.marriage.lastDaily !== d.key && globalThis.TouhouCompanionship.fresh(s, r, globalThis.TouhouCompanionship.text(s, r, d))) candidates.push({
                  due: dailyDueAt(s, r, d),
                  chance: .25,
                  get: function get() {
                    return marriageDailyEvent(s, _route, d);
                  }
                });
              };
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                _loop3();
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
          if (!stage || stage === 'daily') {
            var _iterator4 = _createForOfIteratorHelper(_route.echoes),
              _step4;
            try {
              var _loop4 = function _loop4() {
                var e = _step4.value;
                if (canEcho(s, _route, e)) candidates.push({
                  due: echoDueAt(s, _route, e),
                  chance: .18,
                  get: function get() {
                    return echoEvent(s, _route, e);
                  }
                });
              };
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                _loop4();
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          }
        }
      }
    };
    for (var _i = 0, _Object$values = Object.values(s.relations); _i < _Object$values.length; _i++) {
      _loop2();
    }
    var ready = candidates.filter(function (c) {
        return s.age >= c.due;
      }).sort(function (a, b) {
        return a.due - b.due;
      }),
      oldest = ready[0];
    // A waiting line has a finite priority deadline; newer people cannot replace it.
    if (oldest && (s.age >= oldest.due + (s.species === 'human' ? globalThis.TouhouLifeConfig.humanWaitLimit : 6) || rng() < oldest.chance)) return oldest.get();
    // Eligible people share a base weight; a chosen wish and the PC-98 category are explicit exceptions.
    var friends = freePartner(s) ? data().filter(function (route) {
      return oldFriend(s, route) && (s.relations[route.id].next !== null || activeCount(s) < maxActive);
    }) : [];
    if (friends.length && rng() < globalThis.TouhouLifeConfig.oldFriendRomanceChance * romanticTiming(s)) {
      var weights = friends.map(function (route) {
        return introWeight(s, route);
      });
      var pick = rng() * weights.reduce(function (a, b) {
          return a + b;
        }, 0),
        index = 0;
      while (index < weights.length - 1 && pick >= weights[index]) pick -= weights[index++];
      return oldFriendEvent(s, friends[index]);
    }
    if (activeCount(s) < maxActive && s.age >= introductionDueAt(s)) {
      // First romantic acquaintances all use the broad visit draw. A second draw
      // from only reachable places would give nearby people an extra early chance.
      // Existing friends still develop above; later visits can choose other people.
      var routes = data().filter(function (d) {
        var _s$people$d$id2;
        return !(freePartner(s) && d.romance) && !s.relations[d.id] && ((_s$people$d$id2 = s.people[d.id]) === null || _s$people$d$id2 === void 0 ? void 0 : _s$people$d$id2.alive) !== false && C.canMeet(s, d) && C.entryReady(s, d);
      });
      if (routes.length) {
        var _weights = routes.map(function (d) {
          return introWeight(s, d);
        });
        // Completed friendships do not permanently reduce a single person's chance of a new meeting.
        var affinity = Math.max.apply(Math, _toConsumableArray(_weights)),
          chance = globalThis.TouhouLifeConfig.relationshipChance * (s.species === 'human' ? globalThis.TouhouLifeConfig.humanIntroMultiplier * (s.age >= globalThis.TouhouLifeConfig.humanEstablishedIntroAge ? globalThis.TouhouLifeConfig.humanEstablishedIntroMultiplier : 1) : 1) * Math.min(2, affinity) / (1 + (freePartner(s) ? activeCount(s) : Object.keys(s.relations).length));
        if (chance > 0 && rng() < chance) {
          var n = rng() * _weights.reduce(function (a, b) {
              return a + b;
            }, 0),
            _index = 0;
          while (_index < _weights.length - 1 && n >= _weights[_index]) n -= _weights[_index++];
          var _route2 = routes[_index],
            allowed = s.romanceWish === _route2.id || rng() < globalThis.TouhouLifeConfig.mutualRomanceChance;
          if (!allowed && !C.canMeet(s, _route2)) return null;
          var romantic = allowed && (!C.canMeet(s, _route2) || s.romanceWish === _route2.id || rng() < globalThis.TouhouLifeConfig.firstMeetingRomanceChance * romanticTiming(s));
          if ((romantic || _route2.romance && !_route2.romanceStart) && C.gateAvailable(s, _route2)) {
            var _e = C.gateEvent(_route2),
              _apply = _e.apply;
            _e.apply = function (state) {
              _apply(state);
              state.plannedIntroduction = {
                id: _route2.id,
                age: state.age,
                allowed: allowed
              };
            };
            return _e;
          }
          return introduction(_route2, s, romantic);
        }
      }
    }
    return null;
  }
  function farewellText(s, id) {
    var r = s.relations[id],
      p = s.people[id],
      route = data().find(function (d) {
        return d.id === id;
      });
    if (((r === null || r === void 0 ? void 0 : r.status) === 'lover' || (r === null || r === void 0 ? void 0 : r.previousStatus) === 'lover') && route !== null && route !== void 0 && route.marriage) {
      if (s.afterlife && r.medium === 'dream') return '与' + p.name + '相见的旧梦渐渐淡去，身后的岁月里，你仍记得那时的问候。';
      if (s.afterlife && r.medium !== 'dream') return p.name + '走到了生命尽头；身后的岁月里，你仍记着初见时的那句问候。';
      return route.marriage.bereaved;
    }
    return p.medium === 'dream' ? s.afterlife ? "与".concat(p.name, "相见的梦已经远去，最后一次往返仍留在旧日记忆里。") : "与".concat(p.name, "相见的梦渐渐淡去，你醒来记下最后一次往返。") : "".concat(p.name, "走到了生命尽头，你想起了旧日往来。");
  }
  function departure(s, cause) {
    if (cause === 'chapter' || !s.partnerId) return null;
    var r = s.relations[s.partnerId],
      route = data().find(function (d) {
        return d.id === s.partnerId;
      });
    return (r === null || r === void 0 ? void 0 : r.status) === 'lover' && s.people[r.id].alive && route !== null && route !== void 0 && route.marriage ? route.marriage.surviving : null;
  }
  function upkeep(s) {
    var _s$people$s$partnerId;
    if (s.partnerId && ((_s$people$s$partnerId = s.people[s.partnerId]) === null || _s$people$s$partnerId === void 0 ? void 0 : _s$people$s$partnerId.alive) === false) {
      s.partnerId = null;
      s.married = false;
      s.courtshipAt = null;
    }
    var _loop5 = function _loop5() {
      var r = _Object$values2[_i2];
      if (!s.people[r.id].alive && !['bereaved', 'parted'].includes(r.status)) {
        r.previousStatus = r.status;
        r.status = r.medium === 'dream' ? 'parted' : 'bereaved';
        r.next = null;
        r.label = r.medium === 'dream' ? '梦路渐远' : ['enemy', 'estranged'].includes(r.previousStatus) ? '旧怨留存' : '故人已逝';
        remember(s, r, 'farewell', r.previousStatus === 'lover' && data().find(function (d) {
          return d.id === r.id;
        }).marriage ? farewellText(s, r.id) : s.people[r.id].name + (r.medium === 'dream' ? '渐渐离开这段梦，往来的旧事仍在记忆里。' : '已离世，往事停留在记忆里。'));
      }
    };
    for (var _i2 = 0, _Object$values2 = Object.values(s.relations); _i2 < _Object$values2.length; _i2++) {
      _loop5();
    }
  }
  function finish(s, cause) {
    var _loop6 = function _loop6() {
      var _r$marriage3, _r$marriage4;
      var r = _Object$values3[_i3];
      var route = data().find(function (d) {
          return d.id === r.id;
        }),
        name = s.people[r.id].name;
      if (!s.people[r.id].alive && (r.status === 'lover' || r.previousStatus === 'lover') && route.marriage) r.summary = farewellText(s, r.id);else if (!s.people[r.id].alive) r.summary = r.medium === 'dream' ? '与' + name + '相见的梦路渐远，年表里仍记着这段来往。' : name + '已经离世，你留下的年表仍记着这段往来。';else if (cause !== 'chapter' && r.status === 'lover' && route.marriage) r.summary = route.marriage.surviving;else if (s.afterlife) r.summary = "生前与".concat(name, "的来往，留在了旧日的记忆里。");else if (cause === 'chapter') r.summary = ((_r$marriage3 = r.marriage) === null || _r$marriage3 === void 0 ? void 0 : _r$marriage3.stage) === 3 && r.status === 'lover' ? route.marriage.farewell + ' 这一卷暂时合上，你们的相伴仍在继续。' : ['enemy', 'estranged'].includes(r.status) ? "这一卷已尽，你与".concat(name, "的隔阂仍在。") : "这一卷已尽，你与".concat(name, "的来往还在继续。");else if (r.next !== null || r.status === 'acquaintance') r.summary = "你与".concat(name, "的故事，停在了「").concat(r.label, "」。");else if (((_r$marriage4 = r.marriage) === null || _r$marriage4 === void 0 ? void 0 : _r$marriage4.stage) === 3) r.summary = route.marriage.farewell;else r.summary = r.romancePath && r.status === 'friend' ? r.history.at(-1).text : route.farewell[r.status];
    };
    for (var _i3 = 0, _Object$values3 = Object.values(s.relations); _i3 < _Object$values3.length; _i3++) {
      _loop6();
    }
  }
  function describe(s) {
    return Object.values(s.relations).map(function (r) {
      var _r$marriage5;
      return {
        id: r.id,
        name: s.people[r.id].name,
        status: r.status === 'lover' && ((_r$marriage5 = r.marriage) === null || _r$marriage5 === void 0 ? void 0 : _r$marriage5.stage) === 3 ? '已婚' : labels[r.status],
        stage: (s.afterlife ? '生前 · ' + r.label : r.label) + (r.id === 'akyuu' ? ' · 阿求' + Math.floor(globalThis.TouhouAkyuu.age(s)) + '岁' : ''),
        learning: s.people[r.id].learning ? '修习 · ' + {
          magician: '魔法',
          hermit: '仙道',
          care: '调养',
          scholar: '抄校'
        }[s.people[r.id].learning.kind] + ' ' + s.people[r.id].learning.stage + '/3' : '',
        romanceClosed: !!r.romanceClosed,
        scene: r.scene,
        medium: r.medium,
        departure: r.medium === 'dream' ? '梦中别离' : '已故',
        alive: s.people[r.id].alive,
        summary: r.summary
      };
    });
  }
  globalThis.TouhouRelationships = {
    unwedEvent: unwedEvent,
    youngEntry: youngEntry,
    youngIntroduction: youngIntroduction,
    youngAgeReady: youngAgeReady,
    youngScene: youngScene,
    nodeDueAt: nodeDueAt,
    extendedHuman: extendedHuman,
    realStudy: realStudy,
    romanticTiming: romanticTiming,
    oldFriend: oldFriend,
    oldFriendEvent: oldFriendEvent,
    labels: labels,
    init: init,
    begin: begin,
    matches: matches,
    select: select,
    upkeep: upkeep,
    finish: finish,
    describe: describe,
    freePartner: freePartner,
    bindPartner: bindPartner,
    partner: partner,
    partnerChange: partnerChange,
    romanceClosure: romanceClosure,
    introWeight: introWeight,
    canLove: canLove,
    echoDelay: echoDelay,
    introduction: introduction,
    branchEvent: branchEvent,
    echoEvent: echoEvent,
    romanceView: romanceView,
    canStartRomance: canStartRomance,
    activeCount: activeCount,
    maxActive: maxActive,
    introductionDueAt: introductionDueAt,
    echoDueAt: echoDueAt,
    canEcho: canEcho,
    pace: pace,
    marriageStage: marriageStage,
    marriageDueAt: marriageDueAt,
    marriageEvent: marriageEvent,
    dailyDueAt: dailyDueAt,
    marriageDailyEvent: marriageDailyEvent,
    farewellText: farewellText,
    departure: departure
  };
})();
