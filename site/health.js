/* Bodily wear is accumulated by lived years, illness, work and care. */
(function () {
  var flesh = function flesh(s) {
    var _s$hermit;
    return !s.afterlife && !s.dormant && !((_s$hermit = s.hermit) !== null && _s$hermit !== void 0 && _s$hermit.ageless) && (s.life === 'human' || !!s.hermit || globalThis.TouhouSpiritual.agingMagic(s));
  };
  function init(s, rng) {
    s.bodyAge = 0;
    s.vitality = 34 + s.initial.health * 1.8 + Math.floor(rng() * 13);
    s.wear = 0;
    s.illness = null;
    s.healthHistory = [];
  }
  function strain(s, amount, reason) {
    var before = s.wear;
    s.wear = Math.max(0, s.wear + amount);
    if (s.wear !== before) s.healthHistory.push({
      turn: s.turn,
      age: s.age,
      reason: reason,
      wear: Number((s.wear - before).toFixed(3))
    });
  }
  function year(s, elapsed, rng, record) {
    var _s$hermit2, _s$magic;
    if (s.afterlife || s.dormant || (_s$hermit2 = s.hermit) !== null && _s$hermit2 !== void 0 && _s$hermit2.ageless) return;
    // 行年照常流逝，但仙人肉身缓慢老化、完成舍虫后停止老化；日常风险仍有各自入口。
    var bodilyYears = elapsed * ((_s$magic = s.magic) !== null && _s$magic !== void 0 && _s$magic.ageless ? 0 : s.hermit ? .12 : 1);
    s.bodyAge += bodilyYears;
    if (!flesh(s) && !s.illness) return;
    var age = s.bodyAge;
    var base = age < 20 ? .08 : age < 40 ? .3 : age < 60 ? .7 : 1 + (age - 60) * .055;
    var factor = Math.max(.35, 1.3 - s.stats.health * .045);
    if (s.talents.includes('restful')) factor *= .92;
    if (s.talents.includes('healthful')) factor *= .88;
    if (s.stats.fortune >= 5 && s.stats.insight >= 8) factor *= .93;
    var labor = !s.retired && age >= 20 && ['garden', 'guard', 'travel'].includes(s.career) ? .12 : 0;
    if (flesh(s)) strain(s, (base * factor + labor) * bodilyYears, labor ? '年岁与劳作' : '年岁与体魄');
    if (s.illness) {
      var years = s.turn - s.illness.since;
      // 病痛仍逐年耗损肉身；轻调严重度增量，让长期患病的寿程只得到小幅缓和。
      strain(s, (1 + s.illness.severity * .6) * bodilyYears, '未愈的病痛');
      if (years > 0 && years % 3 === 0) record(s, 'illness-worse', '咳疾反复，你的气力又弱了一些。', {
        health: -1
      });
      var care = s.remedy ? .85 : s.career === 'medicine' ? .65 : s.stats.fortune >= 6 ? .3 : s.stats.insight >= 10 ? .18 : .06;
      if (years >= 1 && rng() < care) {
        var medicine = s.remedy;
        s.remedy = false;
        s.illness = null;
        strain(s, -1.5, '医治与休养');
        record(s, 'illness-treated', medicine ? '备好的药材用上了，按时调养后，咳疾渐渐退去。' : '你寻医调养了一阵，终于摆脱反复的咳疾。', {
          health: 2,
          fortune: medicine ? 0 : -2
        });
      }
    } else if (flesh(s) && age >= 18) {
      var risk = .008 + (age >= 45 ? .012 : 0) + (age >= 65 ? .012 : 0) + (s.stats.health <= 5 ? .015 : 0);
      if (s.talents.includes('herbal') || s.talents.includes('tough')) risk *= .8;
      if (rng() < 1 - Math.pow(1 - risk, bodilyYears)) {
        s.illness = {
          since: s.turn,
          severity: s.stats.health <= 5 ? 2 : 1
        };
        strain(s, 2, '病后耗损');
        record(s, 'illness-onset', '一场病留下久咳，你不得不放缓手边的事。', {
          health: -2
        });
      }
    }
    if (flesh(s) && age >= 16 && !s.injured) {
      var exposed = ['forest', 'mountain'].includes(s.habitat) ? .006 : 0;
      var work = !s.retired && ['travel', 'guard'].includes(s.career) ? .01 : 0;
      var _risk = Math.max(.001, .006 + exposed + work + (s.talents.includes('wander') ? .004 : 0) - s.stats.insight * .00035 - s.stats.health * .00015);
      if (rng() < 1 - Math.pow(1 - _risk, Math.min(elapsed, 5))) {
        s.injured = true;
        strain(s, Math.max(2, 7 - s.stats.insight * .12 - s.xp * .05), '途中遇险');
        record(s, 'travel-accident', '赶路时遇上险情，你带伤回到住处，歇了许久。', {
          health: -3,
          fortune: -1
        });
      }
    }
  }
  function event(s, e) {
    if (e.wear !== undefined) strain(s, e.wear, '事件：' + e.id);
    if (['common:injury', 'common:beast-injury'].includes(e.id)) strain(s, 4, '伤后耗损');
    if (e.id === 'common:work-hard') strain(s, .8, '繁重劳作');
    if (e.id === 'common:work' && ['garden', 'guard', 'travel'].includes(s.career)) strain(s, .35, '职业劳作');
    if (['common:sleep', 'common:rest', 'common:sun'].includes(e.id)) strain(s, -.35, '安稳休养');
    if (e.id === 'common:learn' && s.stats.insight >= 8) strain(s, -.25, '学会调养');
  }
  // 明定短寿的人物由引擎按 lifeYears 收束，避免另一个耗损寿限提前覆盖该设定。
  function spent(s) {
    var _s$character;
    return flesh(s) && !((_s$character = s.character) !== null && _s$character !== void 0 && _s$character.lifeYears) && s.wear >= s.vitality;
  }
  globalThis.TouhouHealth = {
    init: init,
    year: year,
    strain: strain,
    event: event,
    spent: spent
  };
})();
