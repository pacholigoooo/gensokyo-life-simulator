function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* Simulation intervals and checks; canon boundaries: docs/species-research-v5.md and docs/hermit-counter-v16.md. */
(function () {
  var learned = new Set(['byakuren']),
    hermits = new Set(['seiga', 'miko', 'futo']);
  function init(s, rng) {
    var _s$character;
    s.magic = null;
    s.hermit = null;
    s.pendingCause = null;
    var id = (_s$character = s.character) === null || _s$character === void 0 ? void 0 : _s$character.id;
    if (id === 'marisa') s.magic = {
      origin: 'human',
      stage: 'human',
      ageless: false,
      nextStudyAt: null,
      attempts: 0
    };
    // Named magicians enter at their established identity. Unknown training dates do not
    // justify replaying an unfinished childhood or assigning a human aging deadline.
    if (['patchouli', 'alice'].includes(id)) {
      s.species = 'magician';
      s.magic = {
        origin: id === 'patchouli' ? 'born' : 'learned',
        stage: 'complete',
        ageless: true,
        nextStudyAt: null,
        attempts: 0
      };
    }
    if (learned.has(id)) s.magic = {
      origin: 'learned',
      stage: 'human',
      ageless: false,
      nextStudyAt: null,
      attempts: 0
    };
    if (id === 'narumi') s.magic = {
      origin: 'animated',
      stage: 'animated',
      ageless: true,
      nextStudyAt: null,
      attempts: 0
    };
  }
  function agingMagic(s) {
    return !!s.magic && !s.magic.ageless && s.magic.origin !== 'animated';
  }
  function interval(rng) {
    return 80 + Math.floor(rng() * 41);
  }
  function startHermit(s, rng) {
    s.hermit = {
      since: s.age,
      nextAttackAt: s.age + interval(rng),
      warned: false,
      prepared: 0,
      preparationTried: false,
      raids: []
    };
  }
  function onTransform(s, kind) {
    if (kind === 'hermit' || kind === 'shikaisen') {
      startHermit(s, globalThis.TouhouEngine.random(s.seed ^ s.turn ^ 0x287a));
      if (kind === 'shikaisen') s.hermit.ageless = true;
    }
    if (kind === 'magician') s.magic = {
      origin: 'learned',
      stage: 'fasting',
      ageless: false,
      nextStudyAt: s.age + 4,
      attempts: 0
    };
  }
  function event(id, text, effects, apply) {
    var extra = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    return _objectSpread({
      id: id,
      text: text,
      effects: effects,
      apply: apply,
      weight: 1,
      repeat: 1
    }, extra);
  }
  function select(s, rng) {
    var _s$character2;
    var forced = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    if (s.ended) return null;
    if (hermits.has((_s$character2 = s.character) === null || _s$character2 === void 0 ? void 0 : _s$character2.id) && !s.hermit && s.turn >= 18) return event('hermit:attained', '修持延长了寿命，你开始提防地狱来者的追索。', {}, function (state) {
      startHermit(state, rng);
      if (['miko', 'futo'].includes(state.character.id)) state.hermit.ageless = true;
    });
    if (s.hermit) {
      // 停止老化只改变身体年岁；尸解仙同样保留追索、准备与受伤的整条事件链。
      var h = s.hermit,
        n = h.raids.length + 1;
      if (!h.warned && s.age >= h.nextAttackAt - 12) return event('hermit:warning:' + n, '山中传来鬼神寻访延寿者的消息，你开始留意庵外动静。', {}, function () {
        h.warned = true;
      });
      if (s.age >= h.nextAttackAt) {
        var _s$character3;
        var ally = Object.values(s.relations).some(function (r) {
          return s.people[r.id].alive && ['friend', 'confidant', 'mentor', 'lover'].includes(r.status) && ['eirin', 'mokou', 'alice'].includes(r.id);
        });
        var chance = Math.max(.08, Math.min(.94, .12 + s.stats.health * .018 + s.stats.insight * .015 + s.xp * .004 + h.prepared * .12 + (s.talents.includes('careful') || s.talents.includes('patient') ? .05 : 0) + (ally ? .05 : 0) + (((_s$character3 = s.character) === null || _s$character3 === void 0 ? void 0 : _s$character3.id) === 'seiga' ? .1 : 0)));
        var practice = ['changed:hermit-breath', 'changed:hermit-balance', 'changed:hermit-visitor', 'development:shikaisen-practice-1', 'development:shikaisen-practice-2', 'development:shikaisen-practice-3'].reduce(function (sum, id) {
          return sum + (s.seen[id] || 0);
        }, 0);
        var resisting = !s.injured && s.stats.health >= 8 && s.stats.insight >= 8 && s.xp >= 8;
        // 击退占既有存活检定的一部分；修持与战备改变胜法，不额外掷一次免死骰。
        var counterChance = resisting ? Math.min(chance, .8, .04 + s.stats.health * .008 + s.stats.insight * .008 + Math.min(40, s.xp) * .003 + Math.min(6, practice) * .035 + h.prepared * .09) : 0;
        if (forced.attack === 'repelled' && !resisting) return null;
        var result = forced.attack;
        if (!result) {
          var roll = rng();
          result = roll < counterChance ? 'repelled' : roll < chance ? 'escaped' : rng() < .55 ? 'wounded' : 'lost';
        }
        var text = result === 'repelled' ? '鬼神逼近时，你稳住气息迎击，凭修成的护身术挡下重击，又将来者逼退。庵前重归安静，你仍照常修持。' : result === 'escaped' ? resisting ? '你迎击鬼神，却未能将它逼退；挡开束缚后，你循山路脱身，暂时避过这次追索。' : h.prepared ? '鬼神逼近时，你循备下的退路脱身，暂时躲过这次追索。' : '鬼神逼近时，你凭多年修持挣开束缚，暂时逃离追索。' : result === 'wounded' ? resisting ? '你的反击没能挡住鬼神，它步步紧逼；你拼着重伤逃离，许久才返回。' : '鬼神步步紧逼，你拼着重伤逃离，许久才返回。' : resisting ? '你的反击被鬼神压住，退路随即封死。重击落下，你倒在山道旁，气息将绝。' : '鬼神封住退路，重击落下，你倒在山道旁，气息将绝。';
        var hurt = result === 'wounded' || result === 'lost';
        return event('hermit:attack:' + n + ':' + result, text, {
          health: result === 'repelled' ? 0 : result === 'escaped' ? -1 : result === 'wounded' ? -5 : -30
        }, function (state) {
          h.raids.push({
            age: state.age,
            result: result,
            prepared: h.prepared,
            chance: chance,
            counterChance: counterChance,
            resisting: resisting,
            practice: practice
          });
          h.nextAttackAt = state.age + interval(rng);
          h.warned = false;
          h.prepared = 0;
          h.preparationTried = false;
          if (hurt) state.injured = true;
          if (result === 'lost') state.pendingCause = 'pursuit';
        }, {
          xp: result === 'repelled' ? 2 : 0,
          wear: result === 'repelled' ? .5 : result === 'escaped' ? 1 : result === 'wounded' ? 12 : 20
        });
      }
      if (h.warned && !h.preparationTried) {
        var careful = (s.stats.insight >= 10 || s.talents.includes('patient')) && s.stats.fortune >= 2;
        var strong = s.stats.health >= 10;
        return event('hermit:prepare:' + n, careful ? '你置办护身符具，反复演练迎击的阵势，也重走山间退路，记牢每一处分岔。' : strong ? '你反复练习护身、反击与脱身的步法，等疲倦退去再试。' : '你试着布置退路，纷乱的气息仍让阵势难以维持。', careful ? {
          fortune: -2
        } : strong ? {
          health: -1
        } : {
          insight: 1
        }, function () {
          h.prepared = careful ? 2 : strong ? 1 : 0;
          h.preparationTried = true;
        }, {
          xp: careful || strong ? 1 : 0
        });
      }
    }
    var m = s.magic;
    if ((m === null || m === void 0 ? void 0 : m.origin) === 'learned' && m.stage === 'human' && s.turn >= 18) {
      var byakuren = s.character.id === 'byakuren';
      return event('magic:learned-species', byakuren ? '返老还童的魔术稳住了身体，你踏入魔法使的长岁月。' : '舍食之术渐渐稳定，你从人类修习者成为了魔法使。', {
        insight: 1
      }, function (state) {
        m.stage = byakuren ? 'complete' : 'fasting';
        m.ageless = byakuren;
        m.nextStudyAt = byakuren ? null : state.age + 4;
      });
    }
    if (m && ['born', 'learned'].includes(m.origin) && !m.ageless && m.nextStudyAt !== null && s.age >= m.nextStudyAt) {
      var ready = s.stats.insight >= 10 && s.xp >= 7;
      var inspired = s.flags.has('legend:insight');
      var _chance = Math.min(inspired ? .96 : .88, .2 + s.stats.insight * .018 + s.xp * .008 + (s.talents.includes('patient') || s.talents.includes('scroll') ? .12 : 0) + (inspired ? .12 : 0));
      var passed = ready && (forced.study === undefined ? rng() < _chance : forced.study),
        _n = m.attempts + 1;
      return event('magic:shachu:' + _n + ':' + (passed ? 'pass' : 'fail'), passed ? '舍虫之术终于维持住了，你的身体从此停止成长与老化。' : '舍虫术式没能维持，你记下错处，身体仍在随年岁改变。', passed ? {
        health: 1,
        insight: 1
      } : {
        insight: 1,
        fortune: -1
      }, function (state) {
        m.attempts++;
        if (passed) {
          m.stage = 'complete';
          m.ageless = true;
          m.nextStudyAt = null;
        } else m.nextStudyAt = state.age + 6 + Math.floor(rng() * 5);
      }, {
        xp: passed ? 2 : 1
      });
    }
    return null;
  }
  function resolve(s, record) {
    if (s.pendingCause === 'pursuit' && s.stats.health > 0) {
      s.hermit.raids.at(-1).result = 'rescued';
      s.pendingCause = null;
      record(s, 'hermit:rescued:' + s.hermit.raids.length, '你缓过一口气，拖着伤身挣脱追索，回山后重新修持。');
    }
  }
  function description(s) {
    var m = s.magic;
    if (m) {
      if (m.origin === 'animated') return '赋生地藏·魔法使';
      if (m.stage === 'human') return '人类·魔法修习';
      return (m.origin === 'born' ? '天生魔法使' : '后天魔法使') + (m.ageless ? '·停止老化' : '·仍会衰老');
    }
    if (!s.character && s.species === 'human' && s.flags.has('human-magic')) return '人类·魔法修习';
    return null;
  }
  globalThis.TouhouSpiritual = {
    init: init,
    onTransform: onTransform,
    select: select,
    resolve: resolve,
    agingMagic: agingMagic,
    description: description
  };
})();
