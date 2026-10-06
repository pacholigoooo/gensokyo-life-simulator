var _excluded = ["present", "alone", "apply"];
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
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
/* Four mutually exclusive, original chance stories. Canon boundaries: docs/species-research.md. */
(function () {
  var forms = {
    youkai: {
      label: '妖怪',
      habitat: 'outskirts',
      location: '人里外的旧庵',
      stride: 5,
      chapter: 76,
      endTitle: '旧名未改',
      endText: '岁月改了你的形貌。你收敛妖气，在村外安顿下来，仍记得做人的旧名与故人。'
    },
    hermit: {
      label: '仙人（人类）',
      habitat: 'mountain',
      location: '山中小庵',
      stride: 4,
      chapter: 70,
      endTitle: '山中长年',
      endText: '山中又过许多春秋。你暂收远游之念，继续修持，也照看故人留下的坟与旧屋。'
    },
    magician: {
      label: '魔法使',
      habitat: 'forest',
      location: '林间魔法小屋',
      stride: 5,
      chapter: 80,
      endTitle: '灯火未熄',
      endText: '不再为饥饿奔忙以后，你把漫长岁月花在魔法与旧书上。此番远游已尽，窗里的灯还亮着。'
    },
    vampire: {
      label: '吸血鬼',
      habitat: 'mansion',
      location: '旧洋馆厢房',
      stride: 5,
      chapter: 74,
      endTitle: '长夜归处',
      endText: '许多熟悉面孔已留在往年。你守着夜间的约定，在厚帘后收好旧物，等待下一次暮色。'
    }
  };
  var starts = [],
    events = [],
    after = [];
  // One shared discovery roll for all eligible ordinary-life paths; no extra RNG call.
  function discoveryChance(s, eligibleStarts) {
    var _config$opportunityMu;
    var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : globalThis.TouhouLifeConfig;
    if (!eligibleStarts.length) return 0;
    var affinity = new Set(eligibleStarts.flatMap(function (e) {
      return e.talentBoost || [];
    }).filter(function (t) {
      return s.talents.includes(t);
    })).size;
    var clue = s.flags.has('talent-clue:youkai') && eligibleStarts.some(function (e) {
      return e.id === 'chance:youkai-found';
    });
    return Math.min(1, (config.opportunityChance * (1 + .6 * Math.min(2, affinity)) + (clue ? .018 : 0)) * ((_config$opportunityMu = config.opportunityMultiplier) !== null && _config$opportunityMu !== void 0 ? _config$opportunityMu : 1));
  }
  var human = function human(s) {
    return !s.character && s.species === 'human' && !s.transformation;
  };
  var canBegin = function canBegin(s) {
    return human(s) && !s.opportunity && !s.development && !globalThis.TouhouPartnerLearning.inProgress(s) && s.opportunityAttempts < 2;
  };
  function mikoAvailable(s) {
    var _s$people, _s$relations;
    var p = (_s$people = s.people) === null || _s$people === void 0 ? void 0 : _s$people.miko,
      r = (_s$relations = s.relations) === null || _s$relations === void 0 ? void 0 : _s$relations.miko;
    return !!p && p.alive && p.leaveAt > s.age && p.close >= 3 && !p.afterlife && !p.dormant && p.medium !== 'dream' && (r === null || r === void 0 ? void 0 : r.medium) !== 'dream' && (r === null || r === void 0 ? void 0 : r.status) !== 'lover' && s.realm === 'gensokyo' && s.partnerId !== 'miko' && !s.afterlife && !s.dormant;
  }
  // Replace only a successfully drawn hermit discovery; this adds neither a roll nor a start weight.
  function discovered(s, event) {
    var _s$careerDevelopment;
    if ((event === null || event === void 0 ? void 0 : event.id) !== 'chance:hermit-found' || !mikoAvailable(s) || (_s$careerDevelopment = s.careerDevelopment) !== null && _s$careerDevelopment !== void 0 && _s$careerDevelopment.transition || !globalThis.TouhouEngine.eligible(s, event)) return event;
    return _objectSpread(_objectSpread({}, event), {}, {
      id: 'mentorship:miko:hermit-found',
      mentorId: 'miko',
      remember: ['miko'],
      scene: '师徒修持 · 神子',
      text: '你向相识的神子求学。她先托你照看杂务，见你肯认真练习，才留下一段行气功课。你收好纸页，开始逐日记下疑处。',
      dev: _objectSpread(_objectSpread({}, event.dev), {}, {
        mentorId: 'miko'
      }),
      when: function when(state) {
        var _state$careerDevelopm;
        return event.when(state) && !((_state$careerDevelopm = state.careerDevelopment) !== null && _state$careerDevelopm !== void 0 && _state$careerDevelopm.transition) && mikoAvailable(state);
      },
      apply: function apply(state) {
        begin(state, 'hermit');
        state.opportunity.mentorId = 'miko';
      }
    });
  }
  function begin(s, kind) {
    if (kind === 'youkai') s.flags["delete"]('talent-clue:youkai');
    s.opportunity = {
      kind: kind,
      stage: 1,
      since: s.age,
      startedAge: s.age
    };
    s.opportunityAttempts++;
  }
  function pass(s) {
    s.opportunity.stage = 2;
    s.opportunity.since = s.age;
  }
  function fail(s, kind) {
    s.pathHistory.push({
      kind: kind,
      result: 'failed',
      age: s.age
    });
    s.failedPaths.push(kind);
    s.opportunity = null;
  }
  // Only an underprepared final trial waits longer; no new draw, attempt or stat grant.
  function trialDue(s, stage, delay, passed) {
    return s.age - s.opportunity.since >= delay + (stage === 2 && !passed ? globalThis.TouhouLifeConfig.livingFinalGraceYears : 0);
  }
  function start(kind, text, rule) {
    starts.push(_objectSpread(_objectSpread({
      id: 'chance:' + kind + '-found',
      text: text,
      effects: {},
      weight: globalThis.TouhouLifeConfig.livingOpportunityWeight,
      repeat: 1
    }, rule), {}, {
      dev: {
        kind: kind,
        start: true
      },
      when: function when(s) {
        return canBegin(s) && !s.failedPaths.includes(kind);
      },
      apply: function apply(s) {
        return begin(s, kind);
      }
    }));
  }
  function trial(kind, stage, delay, thresholds, success, failure) {
    var ready = function ready(s) {
      var _s$opportunity;
      return human(s) && ((_s$opportunity = s.opportunity) === null || _s$opportunity === void 0 ? void 0 : _s$opportunity.kind) === kind && s.opportunity.stage === stage && s.age - s.opportunity.since >= delay && !(kind === 'hermit' && s.opportunity.mentorId === 'miko');
    };
    var _loop = function _loop() {
      var _arr$_i = _slicedToArray(_arr[_i], 2),
        passed = _arr$_i[0],
        definition = _arr$_i[1];
      var _apply = definition.apply;
      events.push(_objectSpread(_objectSpread({
        id: "chance:".concat(kind, "-").concat(stage, "-").concat(passed ? 'pass' : 'fail'),
        weight: 1,
        repeat: 1,
        effects: {}
      }, definition), {}, {
        dev: {
          kind: kind,
          stage: stage,
          delay: delay,
          thresholds: thresholds,
          passed: passed
        },
        when: function when(s) {
          return ready(s) && trialDue(s, stage, delay, passed) && Object.entries(thresholds).every(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
              key = _ref2[0],
              value = _ref2[1];
            return (key === 'xp' ? s.xp : s.stats[key]) >= value;
          }) === passed;
        },
        apply: function apply(s) {
          if (_apply) _apply(s);
          if (passed) {
            if (stage === 1) pass(s);else globalThis.TouhouEngine.transform(s, kind);
          } else fail(s, kind);
        }
      }));
    };
    for (var _i = 0, _arr = [[true, success], [false, failure]]; _i < _arr.length; _i++) {
      _loop();
    }
  }
  start('youkai', '行旅归来，你带回一卷残缺妖术，纸边还留着冷雾。', {
    minAge: 22,
    maxAge: 60,
    min: {
      insight: 7
    },
    talentBoost: ['spirit-eye', 'boundary', 'wander'],
    habitats: ['village', 'outskirts', 'forest']
  });
  trial('youkai', 1, 3, {
    insight: 9,
    fortune: 3
  }, {
    text: '你搬离人里，在旧庵试读妖术，先舍下原先的安稳。',
    effects: {
      fortune: -2,
      bond: -1
    },
    xp: 2,
    apply: function apply(s) {
      s.habitat = 'outskirts';
      s.location = '人里外的旧庵';
      s.home = false;
    }
  }, {
    text: '残卷中的术式超出所学，你把它封起，放下妖化的念头。',
    effects: {
      insight: 1,
      fortune: -1
    }
  });
  trial('youkai', 2, 5, {
    health: 7,
    insight: 11,
    xp: 8
  }, {
    text: '积年的妖术终于改变肉身，你压下妖气，记牢做人的旧名。',
    effects: {
      health: 2,
      bond: -2
    },
    wear: 3
  }, {
    text: '妖术反噬了身体，你熄掉旧庵的灯，带伤停下修习。',
    effects: {
      health: -3
    },
    wear: 6,
    apply: function apply(s) {
      return s.injured = true;
    }
  });
  start('hermit', '山路上有人留下一页行气法，你带回家反复读过。', {
    minAge: 24,
    maxAge: 62,
    min: {
      health: 5,
      insight: 6
    },
    talentBoost: ['patient', 'forest', 'stargaze'],
    habitats: ['village', 'outskirts', 'mountain']
  });
  trial('hermit', 1, 3, {
    health: 6,
    insight: 8
  }, {
    text: '多年行气渐有章法，你在山间结庵，减少俗务牵挂。',
    effects: {
      fortune: -2,
      health: 1
    },
    xp: 3,
    apply: function apply(s) {
      s.habitat = 'mountain';
      s.location = '山中小庵';
      s.home = false;
    }
  }, {
    text: '行气始终难以调匀，你先停下苦修，养回寻常气力。',
    effects: {
      health: 1,
      fortune: -1
    }
  });
  trial('hermit', 2, 5, {
    health: 8,
    insight: 10,
    xp: 10
  }, {
    text: '积年修持让身体渐离衰朽，你成为仙人，仍须日日精进。',
    effects: {
      health: 3,
      insight: 1
    },
    wear: -3
  }, {
    text: '杂念与病痛打断修持，你收好行气法，回到平常作息。',
    effects: {
      health: -1,
      insight: 1
    },
    wear: 2
  });
  function mikoTrial(stage, delay, thresholds, success, failure) {
    var ready = function ready(s) {
      var _s$opportunity2;
      return human(s) && ((_s$opportunity2 = s.opportunity) === null || _s$opportunity2 === void 0 ? void 0 : _s$opportunity2.kind) === 'hermit' && s.opportunity.mentorId === 'miko' && s.opportunity.stage === stage && s.age - s.opportunity.since >= delay;
    };
    var _loop2 = function _loop2() {
      var _arr2$_i = _slicedToArray(_arr2[_i2], 2),
        passed = _arr2$_i[0],
        definition = _arr2$_i[1];
      var id = stage === 2 && passed ? 'mentorship:miko:hermit-transformed' : "mentorship:miko:hermit-".concat(stage, "-").concat(passed ? 'pass' : 'fail');
      var present = definition.present,
        alone = definition.alone,
        _apply2 = definition.apply,
        rules = _objectWithoutProperties(definition, _excluded);
      events.push(_objectSpread(_objectSpread({
        id: id,
        weight: 1,
        repeat: 1,
        effects: {}
      }, rules), {}, {
        mentorId: 'miko',
        remember: ['miko'],
        scene: '师徒修持 · 神子',
        text: function text(s) {
          return mikoAvailable(s) ? present : alone;
        },
        dev: {
          kind: 'hermit',
          stage: stage,
          delay: delay,
          thresholds: thresholds,
          passed: passed,
          mentorId: 'miko'
        },
        when: function when(s) {
          return ready(s) && trialDue(s, stage, delay, passed) && Object.entries(thresholds).every(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              value = _ref4[1];
            return (key === 'xp' ? s.xp : s.stats[key]) >= value;
          }) === passed;
        },
        apply: function apply(s) {
          if (_apply2) _apply2(s);
          if (passed) {
            if (stage === 1) pass(s);else globalThis.TouhouEngine.transform(s, 'hermit', {
              eventId: id,
              source: 'mentor-guidance',
              mentorId: 'miko'
            });
          } else fail(s, 'hermit');
        }
      }));
    };
    for (var _i2 = 0, _arr2 = [[true, success], [false, failure]]; _i2 < _arr2.length; _i2++) {
      _loop2();
    }
  }
  // The mentor's absence changes the scene, not the student's earned progress or thresholds.
  mikoTrial(1, 3, {
    health: 6,
    insight: 8
  }, {
    present: '三年里，你做完杂务也不曾搁下功课。神子听过你的心得，指出急躁之处。你渐能调匀气息，在山间结庵自修。',
    alone: '三年里，你照着旧功课练习，如今已无法再向神子请教。你核清每次调息的变化，渐有章法，在山间结庵自修。',
    effects: {
      fortune: -2,
      health: 1
    },
    xp: 3,
    apply: function apply(s) {
      s.habitat = 'mountain';
      s.location = '山中小庵';
      s.home = false;
    }
  }, {
    present: '三年的功课仍没能练稳。神子听出你行气时的勉强，劝你先养回气力。你收好纸页，停下这次苦修。',
    alone: '三年的功课仍没能练稳。旧页旁积下许多未解的疑处，你独自停下苦修，先养回寻常气力。',
    effects: {
      health: 1,
      fortune: -1
    }
  });
  mikoTrial(2, 5, {
    health: 8,
    insight: 10,
    xp: 10
  }, {
    present: '结庵后的五年里，你把神子指出的错处逐一练过。身体渐离衰朽，你修成仙人。她核过你的进境，仍嘱你日日修持，提防地狱追索。',
    alone: '结庵后的五年里，你依着旧功课逐一核清错处。身体渐离衰朽，你独自修成仙人。旧页留在案边，日日修持与地狱追索仍要自己面对。',
    effects: {
      health: 3,
      insight: 1
    },
    wear: -3
  }, {
    present: '结庵后的五年没能稳住修持。神子劝你别再硬撑，你收好仍未练通的功课，带着病痛回到平常作息。',
    alone: '结庵后的五年没能稳住修持。杂念与病痛渐重，你独自收好仍未练通的功课，回到平常作息。',
    effects: {
      health: -1,
      insight: 1
    },
    wear: 2
  });
  start('magician', '旧书摊的一册魔导书吸引了你，几页小术式尚能辨清。', {
    minAge: 18,
    maxAge: 60,
    min: {
      insight: 8,
      fortune: 3
    },
    talentBoost: ['scroll', 'reader', 'curious'],
    habitats: ['village', 'outskirts', 'forest']
  });
  trial('magician', 1, 3, {
    insight: 10,
    fortune: 2
  }, {
    text: '你学会几样实用魔法，开始靠它谋生，每日照常吃饭歇息。',
    effects: {
      fortune: -2,
      insight: 1
    },
    xp: 3,
    apply: function apply(s) {
      s.career = 'magic';
      s.flags.add('human-magic');
      globalThis.TouhouCareers.init(s);
    }
  }, {
    text: '耗材渐尽，术式仍无法维持，你暂把魔导书收回柜中。',
    effects: {
      fortune: -2,
      insight: 1
    }
  });
  trial('magician', 2, 5, {
    insight: 13,
    health: 5,
    xp: 10
  }, {
    text: '你完成舍食之术，成为魔法使，搬到林间继续研究。',
    effects: {
      health: 2,
      fortune: -2
    },
    wear: 2
  }, {
    text: '舍食之术未能完成，你仍以人类之身练习小魔法。',
    effects: {
      health: -2,
      insight: 1
    },
    wear: 3
  });
  start('vampire', '一位夜行客看中了你的守信，邀你谈一桩漫长的约定。', {
    minAge: 20,
    maxAge: 58,
    min: {
      bond: 8,
      fortune: 4
    },
    talentBoost: ['invited', 'promise', 'fortune'],
    habitats: ['village', 'outskirts', 'mansion']
  });
  trial('vampire', 1, 2, {
    bond: 9,
    insight: 7,
    fortune: 3
  }, {
    text: '你备下厚帘与夜间食源，答应离开原先的白昼生活。',
    effects: {
      fortune: -3,
      bond: -1
    },
    xp: 1
  }, {
    text: '夜行客看出准备不足，收回邀约，你带着疲惫归家。',
    effects: {
      health: -1,
      bond: -1
    }
  });
  trial('vampire', 2, 3, {
    health: 8,
    bond: 9,
    insight: 9
  }, {
    text: '你成了吸血鬼，仍记得旧名，搬进厚帘遮光的厢房。',
    effects: {
      health: 2,
      bond: -2
    },
    wear: 4
  }, {
    text: '那夜只留下贫血与虚弱，夜行客停止尝试，你仍是人类。',
    effects: {
      health: -3
    },
    wear: 6,
    apply: function apply(s) {
      return s.injured = true;
    }
  });
  var abandoned = {
    id: 'chance:abandoned',
    text: '多年未能继续这条路，你收好留下的物件，把心力放回生活。',
    effects: {
      insight: 1
    },
    weight: 1,
    repeat: 2,
    when: function when(s) {
      return human(s) && !!s.opportunity && s.age - s.opportunity.startedAge >= 18;
    },
    apply: function apply(s) {
      return fail(s, s.opportunity.kind);
    }
  };
  function later(kind, id, text) {
    var effects = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var rules = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    after.push(_objectSpread(_objectSpread({
      id: "changed:".concat(kind, "-").concat(id),
      text: text,
      effects: effects,
      weight: 2,
      repeat: 5
    }, rules), {}, {
      when: function when(s) {
        return !s.character && s.species === kind && !!s.transformation && (!rules.when || rules.when(s));
      }
    }));
  }
  later('youkai', 'name', '你在旧纸上写下原来的名字，笔迹已有些陌生。', {
    bond: 1
  });
  later('youkai', 'border', '你在村外停步，等送货人把日用品放在约好的石边。', {
    fortune: -1
  });
  later('youkai', 'aura', '妖气险些惊动山路行人，你退入暗处慢慢收拢。', {
    insight: 1
  }, {
    wear: 1
  });
  later('youkai', 'practice', '你学着控制新得的力量，折断的树枝越来越少。', {
    insight: 1
  }, {
    xp: 2
  });
  later('youkai', 'old-house', '途经旧居外的小路，你想起当年清晨的叫卖声。', {
    bond: 1
  });
  later('youkai', 'guest', '陌生妖怪在庵外避雨，你们各自说起山里的近况。', {
    bond: 1
  });
  later('youkai', 'mist', '夜雾覆过窗台，你静静调匀新生的气息。', {
    health: 1
  }, {
    wear: -.5
  });
  later('hermit', 'breath', '晨起行气已成习惯，你听着松涛慢慢收息。', {
    health: 1
  }, {
    wear: -.6
  });
  later('hermit', 'hunger', '你减少口腹之欲，把多出的粮食送下山。', {
    bond: 1,
    fortune: -1
  });
  later('hermit', 'visitor', '山下有人来问修持，你只教了自己练熟的一段。', {
    insight: 1,
    bond: 1
  }, {
    xp: 1
  });
  later('hermit', 'quiet', '尘世旧愿忽然涌上心头，你坐了许久才重新入定。', {
    insight: 1
  });
  later('hermit', 'medicine', '你辨认山间药草，留下一份应付修行中的病痛。', {}, {
    apply: function apply(s) {
      return s.remedy = true;
    }
  });
  later('hermit', 'paths', '昔日上山的小路已被草木盖住，你慢慢重新认路。', {
    insight: 1
  });
  later('hermit', 'balance', '一段稳妥修持让你更能驾驭气息，身体轻松了些。', {
    health: 1
  }, {
    xp: 2,
    wear: -.5
  });
  after.push({
    id: 'mentorship:miko:hermit-old-lesson',
    mentorId: 'miko',
    remember: ['miko'],
    scene: '师徒修持 · 旧功课',
    text: function text(s) {
      return mikoAvailable(s) ? '成仙已过十二年，你重读初学的旧页，把新近的疑处写信请教神子。她回信提醒你重练最初的一段；你试过才补上注解，仍照常修持，留意追索。' : '成仙已过十二年，你重读初学的旧页。如今无法再向神子请教，你独自检验最初的一段，把新的体会写在边栏，仍照常修持，留意追索。';
    },
    effects: {
      insight: 1
    },
    xp: 1,
    weight: 2,
    repeat: 1,
    when: function when(s) {
      var _s$transformation;
      return !s.character && s.species === 'hermit' && ((_s$transformation = s.transformation) === null || _s$transformation === void 0 ? void 0 : _s$transformation.source) === 'mentor-guidance' && s.transformation.mentorId === 'miko' && s.transformation.eventId === 'mentorship:miko:hermit-transformed' && s.age - s.transformation.age >= 12;
    }
  });
  later('magician', 'meal', '炉边煮了一餐旧日饭食，你为了熟悉的味道慢慢吃完。', {
    bond: 1
  });
  later('magician', 'spell', '舍食后的空余时日，被你分给一本迟迟读不通的旧书。', {
    insight: 1
  }, {
    xp: 2
  });
  later('magician', 'growth', '你再习停止衰老的法术，窗外又换过一轮新叶。', {
    health: 1
  }, {
    xp: 1,
    wear: -.5,
    when: function when(s) {
      return !s.magic.ageless;
    }
  });
  later('magician', 'reagent', '一次试验烧坏容器，你带着灼伤停下手里的术式。', {
    health: -2,
    fortune: -1
  }, {
    wear: 3,
    apply: function apply(s) {
      return s.injured = true;
    }
  });
  later('magician', 'trade', '你用实用的小魔法换来纸墨，继续手边的研究。', {
    fortune: 1
  }, {
    xp: 1
  });
  later('magician', 'visitors', '陌生的求学者叩门，你让对方先学会照看炉火。', {
    bond: 1
  });
  later('magician', 'shelf', '书架已经换过几回，你仍找得到最初那册魔导书。', {
    insight: 1
  });
  later('magician', 'lamp', '夜里不觉饥饿，你还是按旧习停下来望了会儿窗外。', {
    health: 1
  });
  later('vampire', 'curtain', '日光移到窗沿，你拉严厚帘，安静等到暮色。', {
    health: 1
  }, {
    wear: -.5
  });
  later('vampire', 'supply', '约好的夜间食源如期送来，你留足报酬，守住分寸。', {
    health: 1,
    fortune: -1
  });
  later('vampire', 'shortage', '夜间食源中断，你带着饥饿另寻可靠的供给。', {
    health: -2,
    fortune: -1
  }, {
    wear: 2
  });
  later('vampire', 'dawn', '误了归程，晨光灼伤皮肤，你躲进近旁的阴影。', {
    health: -3
  }, {
    wear: 5,
    bias: {
      insight: -1
    },
    apply: function apply(s) {
      return s.injured = true;
    }
  });
  later('vampire', 'parasol', '你撑伞走过短短一段日照路，始终留意脚边阴影。', {
    insight: 1
  }, {
    min: {
      insight: 10
    }
  });
  later('vampire', 'rain', '雨势截断归路，你躲进檐下，等雨停后再绕行。', {});
  later('vampire', 'night', '夜色让感官渐渐清晰，你记住远处轻轻的脚步。', {
    insight: 1
  }, {
    xp: 1
  });
  later('vampire', 'memory', '厚帘后留着人类时代的小物件，你取出擦了擦。', {
    bond: 1
  });
  for (var _i3 = 0, _arr3 = ['youkai', 'magician', 'vampire']; _i3 < _arr3.length; _i3++) {
    var kind = _arr3[_i3];
    later(kind, 'warning', '你听见追查村民妖化的消息，收敛气息，减少露面。', {
      bond: -1
    }, {
      wear: 2,
      repeat: 2
    });
    later(kind, 'pursuit', '退治的术光逼近，你带伤暂避山林，等追索远去才返回。', {
      health: -4,
      fortune: -2
    }, {
      wear: 8,
      repeat: 2,
      apply: function apply(s) {
        return s.injured = true;
      }
    });
  }
  after.push({
    id: 'changed:human-magic',
    text: '清晨吃过饭，你照常练习让纸片轻轻飞起。',
    effects: {
      insight: 1
    },
    weight: 2,
    repeat: 4,
    xp: 1,
    when: function when(s) {
      return human(s) && s.flags.has('human-magic');
    }
  });
  globalThis.TouhouOpportunities = {
    forms: forms,
    starts: starts,
    events: events,
    after: after,
    abandoned: abandoned,
    discoveryChance: discoveryChance,
    discovered: discovered
  };
})();
