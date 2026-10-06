function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
/* Personal guidance, finite gifts and one-use preparations. Canon boundaries live in each authored route. */
(function () {
  var data = function data() {
    return globalThis.TouhouRelationshipData;
  };
  var workCount = function workCount(s, career) {
    return s.history.filter(function (id) {
      return /^career:[^:]+:work-/.test(id) && (!career || id.startsWith('career:' + career + ':'));
    }).length;
  };
  function offer(s) {
    var _s$careerDevelopment;
    var ignoreWork = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (s.character || s.ended || s.afterlife || s.dormant || s.injured || s.pendingCause || s.stats.health <= 0 || s.body !== 'humanoid' || s.realm !== 'gensokyo' || !s.partnerId || s.partnerId === 'local:spouse' || s.firstPartnerId !== s.partnerId) return null;
    var r = s.relations[s.partnerId],
      p = s.people[r.id],
      route = data().find(function (d) {
        return d.id === r.id;
      }),
      g = route.guidance;
    if (!g || r.status !== 'lover' || r.next !== null || !p.alive || p.leaveAt <= s.age || s.age < 20) return null;
    var progress = r.guidance;
    if ((progress === null || progress === void 0 ? void 0 : progress.completedAt) !== undefined) {
      return progress.followedUp ? null : {
        r: r,
        g: g,
        step: g.followup,
        followup: true,
        due: progress.completedAt + g.followup.delay
      };
    }
    if (s.opportunity || s.development || (_s$careerDevelopment = s.careerDevelopment) !== null && _s$careerDevelopment !== void 0 && _s$careerDevelopment.transition) return null;
    if (g.species && !g.species.includes(s.species)) return null;
    if (g.grant.kind === 'longevity' && s.species !== 'human' && !globalThis.TouhouSpiritual.agingMagic(s)) return null;
    if (g.grant.kind === 'training' && !s.career) return null;
    if (g.grant.kind === 'transformation' && (s.species !== 'human' || s.transformation)) return null;
    var index = (progress === null || progress === void 0 ? void 0 : progress.stage) || 0,
      step = g.stages[index],
      c = step.when;
    if (progress !== null && progress !== void 0 && progress.workCareer && s.career !== progress.workCareer) return null;
    if (Object.entries(c.min || {}).some(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];
      return s.stats[k] < v;
    }) || c.xp !== undefined && s.xp < c.xp || c.trust !== undefined && r.trust < c.trust) return null;
    if (!ignoreWork && c.work && (!progress || workCount(s, progress.workCareer) - progress.workAt < c.work)) return null;
    return {
      r: r,
      g: g,
      step: step,
      index: index,
      due: (progress ? progress.lastAt : r.loveAt) + step.delay,
      followup: false
    };
  }
  function grant(s, r, g, eventId) {
    var gift = g.grant,
      progress = r.guidance;
    progress.result = {
      kind: gift.kind,
      age: s.age,
      eventId: eventId
    };
    if (gift.kind === 'longevity') {
      s.vitality += gift.vitality;
      s.horizon += gift.years;
      globalThis.TouhouHealth.strain(s, gift.wear, g.title);
      Object.assign(progress.result, {
        vitality: gift.vitality,
        observationYears: gift.years,
        ageless: false
      });
    } else if (gift.kind === 'training') {
      var d = globalThis.TouhouCareers.init(s);
      s.stats.insight = Math.min(30, s.stats.insight + gift.insight);
      s.xp += gift.xp;
      d.practice += gift.practice;
      d.stagePractice += gift.practice;
      d.history.push({
        id: d.id,
        stage: d.stage,
        age: s.age,
        event: eventId
      });
      Object.assign(progress.result, {
        career: d.id,
        practice: gift.practice,
        xp: gift.xp
      });
    } else if (gift.kind === 'transformation') {
      globalThis.TouhouEngine.transform(s, gift.species, {
        eventId: eventId
      });
      Object.assign(progress.result, {
        species: gift.species,
        ageless: false
      });
    } else if (gift.kind === 'protection') progress.protection = _objectSpread(_objectSpread({}, gift), {}, {
      usedAt: null
    });
  }
  function candidate(s) {
    var o = offer(s);
    if (!o) return null;
    var id = 'guidance:' + o.r.id + ':' + o.step.key;
    var eligible = function eligible(state) {
      var current = offer(state);
      return !!current && current.r.id === o.r.id && current.step.key === o.step.key && state.age >= current.due;
    };
    return {
      due: o.due,
      chance: .3,
      get: function get() {
        return {
          id: id,
          text: o.step.text,
          effects: o.followup ? {} : o.step.effects,
          xp: o.followup ? 0 : o.step.xp,
          wear: o.followup ? 0 : o.step.wear,
          weight: 1,
          repeat: 1,
          "with": [o.r.id],
          scene: o.r.scene,
          contactMedium: o.r.medium,
          when: eligible,
          apply: function apply(state) {
            var _r$guidance;
            var current = offer(state);
            if (!current || current.r.id !== o.r.id || current.step.key !== o.step.key || state.age < current.due) throw Error('伴侣指引的经历或条件已经改变：' + id);
            var r = current.r;
            if (current.followup) {
              r.guidance.followedUp = true;
              r.guidance.history.push({
                id: id,
                age: state.age,
                text: o.step.text
              });
              return;
            }
            (_r$guidance = r.guidance) !== null && _r$guidance !== void 0 ? _r$guidance : r.guidance = {
              stage: 0,
              lastAt: null,
              workAt: workCount(state),
              history: [],
              followedUp: false
            };
            if (current.step.operation === 'human-magic') {
              state.flags.add('human-magic');
              state.career = 'magic';
              var previous = state.careerDevelopment,
                d = globalThis.TouhouCareers.init(state);
              if (d !== previous) d.history.at(-1).event = id;
              r.guidance.workCareer = 'magic';
              r.guidance.workAt = workCount(state, 'magic');
            }
            r.guidance.stage++;
            r.guidance.lastAt = state.age;
            r.guidance.history.push({
              id: id,
              age: state.age,
              text: o.step.text
            });
            if (r.guidance.stage === current.g.stages.length) {
              r.guidance.completedAt = state.age;
              grant(state, r, current.g, id);
            }
          }
        };
      }
    };
  }
  function protect(s, cause, record) {
    var _r$guidance2;
    if (s.ended || s.afterlife || s.dormant || s.body !== 'humanoid' || !['health', 'pursuit'].includes(cause) || !s.firstPartnerId || s.firstPartnerId === 'local:spouse') return false;
    var r = s.relations[s.firstPartnerId],
      guard = (_r$guidance2 = r.guidance) === null || _r$guidance2 === void 0 ? void 0 : _r$guidance2.protection;
    if (!guard || guard.usedAt !== null || guard.cause !== cause) return false;
    var p = s.people[r.id];
    // 自制准备留在主角手中；伴侣当场施救则必须仍相伴且存活，不能让故人继续出场救助。
    if (!guard.selfMade && (s.partnerId !== r.id || r.status !== 'lover' || !p.alive || p.leaveAt <= s.age)) return false;
    guard.usedAt = s.age;
    s.pendingCause = null;
    if (cause === 'pursuit') s.hermit.raids.at(-1).result = 'rescued';
    var id = 'guidance:' + r.id + ':protection-used';
    record(s, id, guard.text, {
      health: Math.max(0, guard.health - s.stats.health)
    }, _objectSpread({
      scene: r.scene
    }, guard.selfMade ? {
      remember: [r.id]
    } : {
      "with": [r.id]
    }));
    s.history.push(id);
    s.seen[id] = 1;
    s.flags.add('event:' + id);
    return true;
  }
  function needsWork(s) {
    var o = offer(s, true),
      p = o === null || o === void 0 ? void 0 : o.r.guidance;
    return !!o && !o.followup && !!p && s.age >= o.due && !!o.step.when.work && workCount(s, p.workCareer) - p.workAt < o.step.when.work;
  }
  globalThis.TouhouGuidance = {
    candidate: candidate,
    protect: protect,
    workCount: workCount,
    needsWork: needsWork
  };
})();
