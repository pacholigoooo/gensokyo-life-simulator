function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* Akyuu's own short lifespan and a single, explicitly fictional return from the afterworld. */
(function () {
  var R = function R() {
      return globalThis.TouhouRelationships;
    },
    E = function E() {
      return globalThis.TouhouEngine;
    };
  var active = new Set(['departed', 'river', 'office', 'gate']);
  function initPerson(s, id, p, rng) {
    if (id !== 'akyuu') return;
    p.ageAtMeet = 12 + Math.floor(rng() * 3);
    p.naturalLimit = 26 + rng() * 4;
    p.suspendedYears = 0;
    p.deadAt = null;
    p.leaveAt = s.age + p.naturalLimit - p.ageAtMeet;
  }
  // 死亡期间停在阿求自己的死亡年龄；归来只扣除离世时段，不把她改成年轻的新角色。
  function age(s) {
    var p = s.people.akyuu;
    return p ? p.ageAtMeet + (p.alive ? s.age : p.deadAt) - p.metAt - p.suspendedYears : null;
  }
  function annual(s) {
    var p = s.people.akyuu,
      r = s.relations.akyuu;
    return !s.character && !s.afterlife && !s.dormant && !!(p !== null && p !== void 0 && p.alive) && !!r && (r.next !== null || s.partnerId === 'akyuu');
  }
  function strength(s) {
    var _s$akyuuReturn, _s$magic;
    if ((s.flags.has('legend:soul-seal') || (_s$akyuuReturn = s.akyuuReturn) !== null && _s$akyuuReturn !== void 0 && _s$akyuuReturn.sealUsed) && s.xp >= 18 && s.stats.insight >= 12) return true;
    if (s.xp < 40 || s.stats.insight < 18) return false;
    if (s.species === 'magician') return ((_s$magic = s.magic) === null || _s$magic === void 0 ? void 0 : _s$magic.ageless) === true;
    if (['hermit', 'shikaisen'].includes(s.species)) return !!s.hermit && (s.hermit.ageless || s.hermit.raids.some(function (r) {
      return ['escaped', 'repelled'].includes(r.result);
    }));
    return ['youkai', 'vampire'].includes(s.species) && s.stats.health >= 20 && s.xp >= 50;
  }
  function embodied(s) {
    return !s.character && !s.ended && !s.afterlife && !s.dormant && s.realm === 'gensokyo' && s.body === 'humanoid' && s.stats.health > 0 && !s.pendingCause;
  }
  function bonded(s) {
    var r = s.relations.akyuu;
    return s.firstPartnerId === 'akyuu' && !!r && r.trust >= 4 && r.visits >= 7 && r.loveAt !== null;
  }
  function canPrepare(s) {
    return embodied(s) && bonded(s) && s.partnerId === 'akyuu' && s.people.akyuu.alive && age(s) >= 18 && s.flags.has('contact:sanzu') && strength(s) && !s.injured && s.stats.health >= 14 && s.stats.fortune >= 4;
  }
  function event(key, text, apply) {
    var effects = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var extra = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    return _objectSpread({
      id: 'akyuu-return:' + key,
      text: text,
      effects: effects,
      weight: 1,
      repeat: 1,
      apply: apply,
      scene: '阿求 · 归途'
    }, extra);
  }
  function remember(s, key, text) {
    var r = s.relations.akyuu;
    r.history.push({
      key: 'return:' + key,
      age: s.age,
      text: text,
      status: r.status,
      label: r.label
    });
  }
  function onDeath(s, p) {
    p.deadAt = p.leaveAt;
    var q = s.akyuuReturn;
    if ((q === null || q === void 0 ? void 0 : q.stage) === 'ready' && !q.attempted && bonded(s)) {
      q.stage = 'departed';
      q.attempted = true;
      q.deathAt = p.deadAt;
      q.ownDeathAge = p.ageAtMeet + p.deadAt - p.metAt - p.suspendedYears;
      q.married = s.married;
      q.courtshipAt = s.courtshipAt;
      q.label = s.relations.akyuu.label;
    }
  }
  function pending(s) {
    var _s$akyuuReturn2;
    return embodied(s) && active.has((_s$akyuuReturn2 = s.akyuuReturn) === null || _s$akyuuReturn2 === void 0 ? void 0 : _s$akyuuReturn2.stage);
  }
  function fail(s, reason) {
    s.akyuuReturn.stage = 'failed';
    s.akyuuReturn.failure = reason;
    s.akyuuReturn.finishedAt = s.age;
  }
  function failure(s, reason, text) {
    return event('failed', text, function (x) {
      fail(x, reason);
      x.injured = true;
      remember(x, 'failed', text);
    }, {
      health: -4
    }, {
      wear: 6
    });
  }
  function select(s, rng) {
    var _s$people$komachi, _s$people$eiki;
    if (!pending(s)) return null;
    var q = s.akyuuReturn,
      p = s.people.akyuu;
    if (p.alive || s.firstPartnerId !== 'akyuu') throw Error('阿求归途与同伴状态不一致。');
    if (!strength(s) || s.injured || s.stats.health < 10 || ((_s$people$komachi = s.people.komachi) === null || _s$people$komachi === void 0 ? void 0 : _s$people$komachi.alive) === false || ((_s$people$eiki = s.people.eiki) === null || _s$people$eiki === void 0 ? void 0 : _s$people$eiki.alive) === false) return failure(s, 'unfit', '你带着阿求的愿书走到河岸，试着接续归途，护魂符契却在途中散去。反冲的术力伤了身体，你收好她的笔迹，独自返回。');
    if (q.stage === 'departed') return event('river', '你携阿求亲笔写下的归愿踏上三途河。小町横桨提醒生者的风险，你仍执意渡河，握紧了护魂的符契。', function (x) {
      E().meet(x, 'komachi', rng);
      x.akyuuReturn.stage = 'river';
    }, {
      fortune: -3,
      health: -1
    }, {
      scene: '三途河 · 渡船'
    });
    if (q.stage === 'river') return event('office', '彼岸案前，映姬核对阿求的愿书，指明她正在地狱役所待命。你留下一份担责书，转身循她的笔迹闯入役所。', function (x) {
      E().meet(x, 'eiki', rng);
      x.akyuuReturn.stage = 'office';
    }, {
      health: -1
    }, {
      scene: '彼岸 · 阎魔案前'
    });
    if (q.stage === 'office') return event('gate', '役所的拦路术阵层层压来，你护住阿求留下的字迹，强行开出一条路。她辨出你的脚步，在纸上写下「我愿回去」。', function (x) {
      x.akyuuReturn.stage = 'gate';
    }, {
      health: -2
    }, {
      wear: 3,
      scene: '地狱 · 役所归魂阵'
    });
    var chance = Math.min(q.sealUsed ? .95 : .9, .45 + (s.stats.health - 14) * .015 + (s.stats.insight - 18) * .025 + (s.xp - 40) * .006 + (q.sealUsed ? .25 : 0));
    if (rng() >= chance) return failure(s, 'barrier', '归魂阵骤然合拢，你护着阿求的愿书负伤退回河岸。她的魂魄仍留在役所，这一次未能随你回家。');
    var text = '你顶住回卷的术阵，将阿求的魂魄护送回原身。她睁眼认出你，紧握你的手，仍记得两人相恋以来的每一件事。';
    return event('returned', text, function (x) {
      var a = x.people.akyuu,
        r = x.relations.akyuu,
        z = x.akyuuReturn;
      a.suspendedYears += x.age - a.deadAt;
      a.alive = true;
      a.returnedAt = x.age;
      a.leaveAt = x.age + 12;
      a.deadAt = null;
      a.species = 'human';
      a.life = 'human';
      a.ageless = false;
      r.status = 'lover';
      r.previousStatus = null;
      r.label = z.label;
      x.partnerId = 'akyuu';
      x.married = z.married;
      x.courtshipAt = z.courtshipAt;
      z.stage = 'returned';
      z.returnedAt = x.age;
      z.extensionYears = 12;
      remember(x, 'returned', text);
    }, {
      health: -3,
      fortune: -2
    }, {
      wear: 5,
      scene: '稗田邸 · 归来',
      relationshipMoment: {
        kind: 'reunion',
        title: '彼岸归来',
        person: '稗田阿求',
        status: q.married ? '夫妻重逢' : '恋人重逢',
        impact: '原来的记忆与约定仍在，两人一起照顾续来的时日。'
      }
    });
  }
  function candidate(s) {
    if (!embodied(s)) return null;
    var q = s.akyuuReturn;
    if (!q && canPrepare(s) && s.people.akyuu.leaveAt - s.age <= 8) return {
      due: s.age,
      chance: .7,
      get: function get() {
        return event('wish', '阿求谈起御阿礼之子的短寿，认真说想与你继续生活。你问清她的愿望，她亲笔写下归愿，托你备好通往彼岸的路。', function (x) {
          if (!canPrepare(x) || x.akyuuReturn) throw Error('阿求归愿前置已改变。');
          x.akyuuReturn = {
            stage: 'agreed',
            since: x.age,
            attempted: false
          };
        }, {
          bond: 1
        });
      }
    };
    if ((q === null || q === void 0 ? void 0 : q.stage) === 'agreed' && canPrepare(s)) return {
      due: q.since + 1,
      chance: .7,
      get: function get() {
        return event('prepared', s.flags.has('legend:soul-seal') ? '你将红色护魂印炼入符契，阿求亲自校正其上的名与旧事。余火封进她的归愿，两人约定若她先行离世，你便亲赴彼岸接她。' : '你依多年修为炼好护魂符契，阿求亲自校正其上的名与旧事。两人备妥归魂用料，约定若她先行离世，你便亲赴彼岸接她。', function (x) {
          if (!canPrepare(x) || x.akyuuReturn.stage !== 'agreed') throw Error('阿求归途准备失效。');
          if (x.flags.has('legend:soul-seal')) {
            x.flags["delete"]('legend:soul-seal');
            x.akyuuReturn.sealUsed = true;
          }
          x.akyuuReturn.stage = 'ready';
          x.akyuuReturn.preparedAt = x.age;
        }, {
          fortune: -2
        });
      }
    };
    if ((q === null || q === void 0 ? void 0 : q.stage) === 'returned' && s.partnerId === 'akyuu' && s.people.akyuu.alive) return {
      due: q.returnedAt + 1,
      chance: .6,
      get: function get() {
        return event('aftercare', '阿求照自己的步调恢复写作，你承担地府约定的抄录差事。她把归来的经过添进两人的私记，约好这十二年慢慢过。', function (x) {
          x.akyuuReturn.stage = 'settled';
          remember(x, 'aftercare', '两人照顾续来的身体，也一同承担归返的代价。');
        }, {
          fortune: -1
        }, {
          wear: 1
        });
      }
    };
    return null;
  }
  function finish(s) {
    var _s$akyuuReturn3;
    if (active.has((_s$akyuuReturn3 = s.akyuuReturn) === null || _s$akyuuReturn3 === void 0 ? void 0 : _s$akyuuReturn3.stage)) fail(s, 'protagonist-departed');
  }
  globalThis.TouhouAkyuu = {
    initPerson: initPerson,
    age: age,
    annual: annual,
    strength: strength,
    canPrepare: canPrepare,
    onDeath: onDeath,
    pending: pending,
    select: select,
    candidate: candidate,
    finish: finish
  };
})();
