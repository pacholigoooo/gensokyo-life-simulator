function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* Shared years change the tone of authored scenes; circles never establish another romance. */
(function () {
  var routes = function routes() {
    return globalThis.TouhouRelationshipData;
  };
  function settled(s, r) {
    var _s$magic;
    var p = s.people[r.id],
      shared = s.age - r.loveAt;
    var aging = s.life === 'human' || s.species === 'magician' && !((_s$magic = s.magic) !== null && _s$magic !== void 0 && _s$magic.ageless);
    return shared >= 30 || aging && s.bodyAge >= 60 || r.id === 'akyuu' && globalThis.TouhouAkyuu.age(s) >= 28 || r.id !== 'akyuu' && !p.ageless && p.life === 'human' && p.leaveAt - s.age <= 8;
  }
  function text(s, r, item) {
    return settled(s, r) ? item.settledText : item.text;
  }
  var localScenes = [{
    key: 'walk',
    text: '晚饭后，你们沿着村边散步。伴侣向你摊开手掌，你握上去，两人放慢脚步，商量下回赶集想买什么。',
    settledText: '散步走到熟悉的岔口，你伸手等了等。伴侣与你十指相扣，说今天想走短些，你们便转向回家的小路。'
  }, {
    key: 'cheek',
    text: '伴侣端着空碗凑过来，夸你今天的汤调得好。你放下汤勺，笑着亲了亲近在眼前的脸；对方用额头轻碰你一下，又把碗递来讨半碗汤。',
    settledText: '早饭时，伴侣靠过来替你拨开不爱吃的配料，你顺势亲了一下对方的脸。那只手顿了顿，随即笑着点点你的额头，催你趁热吃。'
  }, {
    key: 'embrace',
    text: '你说起那桩难事，声音渐渐低下去。伴侣搁下手里的活，伸手环住你；你把脸埋进对方肩窝，抱紧了一会儿，才接着往下说。',
    settledText: '说起年轻时的糗事，你们笑了好一阵。伴侣笑累了靠进你怀里，你揽住对方的肩，谁也没急着把旧话讲完。'
  }, {
    key: 'kiss',
    text: '收拾完饭桌，伴侣挽着你的腰追问笑话的后半句。你笑着吻住对方，怀里的人搂紧你，认真吻回来；等两人分开，那句追问已经变了调。',
    settledText: '临睡前，你们说好明早一起去看新开的花。伴侣抚平你的衣领，俯近吻你；你轻揽住对方的背，回吻之后又靠在一起坐了一会儿。'
  }, {
    key: 'market',
    text: '赶集时，你们各看中一块不同花色的布。伴侣把两块并在一起，请你说说想做什么，听完便商量一人留一半。',
    settledText: '集市上又见到以前常买的糕点，你买来与伴侣分食。对方尝了一口，认真分辨味道变没变，你们一路争论着回去。'
  }, {
    key: 'mending',
    text: '你替伴侣补衣角，对方看着歪掉的针脚笑出声。你也笑了，把衣服转过去请教，两人拆了那几针，挨着重新缝好。',
    settledText: '一件旧衣又磨薄了，你说舍不得扔。伴侣找来颜色相近的布，与你一起补好，还记得当年买下它的那场雨。'
  }, {
    key: 'rain',
    text: '雨把出门的打算打断了。你们留在檐下轮流讲小时候的事，伴侣听得入神，忘了喝茶，直到你提醒才笑着端起杯子。',
    settledText: '雨声渐密，你们坐在窗边。伴侣说起这几日的小烦恼，你听完提了个办法；对方想了想，又问你近来有没有心事。'
  }, {
    key: 'plan',
    text: '伴侣想挪出一天去看看村外的风景，你却惦记着几件杂事。两人一件件排好，终于空出同一天，相视笑了起来。',
    settledText: '整理旧物时，你们翻到婚礼留下的红纸。伴侣想起那桌喜饭，你还记得街坊说的笑话，两人约好今晚再做一道当年的菜。'
  }];
  function localMarriage(s, record) {
    if (s.character || s.ended || s.afterlife || s.dormant || s.injured || s.pendingCause || s.stats.health <= 0 || s.age < 20 || s.body !== 'humanoid' || s.realm !== 'gensokyo' || !s.married && s.unwedAt === null || s.partnerId !== 'local:spouse' || s.firstPartnerId !== s.partnerId) return null;
    var p = s.people[s.partnerId];
    if (!p.alive || p.leaveAt <= s.age) return null;
    var wedding = s.log.find(function (e) {
      return e.id === (s.married ? 'common:marry' : 'common:unwed-promise');
    });
    if (!wedding || s.age < wedding.age + 1) return null;
    var prefix = 'local:marriage:',
      scenes = s.log.filter(function (e) {
        return e.id.startsWith(prefix);
      });
    var last = s.log.filter(function (e) {
      return e.id.startsWith(prefix) || e.id.startsWith('common:spouse-');
    }).at(-1);
    if (last && s.age - last.age < 2) return null;
    // These extra scenes use the saved timeline, so they neither redraw a spouse nor consume annual RNG.
    var scene = localScenes[scenes.length % localScenes.length],
      body = !s.married && scene.key === 'plan' ? '你们把各自想去的地方写在一张纸上，挑出都感兴趣的一处。恋人收好纸，与你商量哪一天出门最合适。' : text(s, {
        id: s.partnerId,
        loveAt: s.courtshipAt
      }, scene);
    return record(s, prefix + scene.key + ':' + scenes.length, body, {}, {
      scene: s.married ? '村里 · 婚后相伴' : '村里 · 恋人相伴',
      "with": [s.partnerId]
    });
  }
  // A year can contain a date as well as its main event; these scenes do not move the annual clock.
  function courtship(s, record) {
    var _r$marriage;
    if (s.character || s.ended || s.afterlife || s.dormant || s.injured || s.pendingCause || s.stats.health <= 0 || s.age < 20 || s.body !== 'humanoid' || s.realm !== 'gensokyo' || s.married || !s.partnerId || s.firstPartnerId !== s.partnerId || s.partnerId === 'local:spouse' || globalThis.TouhouAkyuu.pending(s)) return null;
    var r = s.relations[s.partnerId],
      p = s.people[r.id];
    if (r.status !== 'lover' || r.next !== null || !p.alive || p.leaveAt <= s.age || s.age <= r.loveAt || ((_r$marriage = r.marriage) === null || _r$marriage === void 0 ? void 0 : _r$marriage.stage) === 3) return null;
    var route = routes().find(function (x) {
        return x.id === r.id;
      }),
      prefix = 'relation:' + r.id + ':courtship:',
      dates = s.log.filter(function (e) {
        return e.id.startsWith(prefix);
      });
    if (dates.some(function (e) {
      return e.age === s.age;
    })) return null;
    if (dates.length === 1 && !r.marriage) return null;
    var scene = route.marriage.courtship.find(function (d) {
      return !dates.some(function (e) {
        return e.id === prefix + d.key;
      });
    });
    if (!scene) return null;
    return record(s, prefix + scene.key, scene.text, {}, {
      scene: r.scene,
      contactMedium: r.medium,
      "with": [r.id],
      relationship: {
        id: r.id,
        name: p.name,
        from: 'lover',
        to: 'lover',
        stage: '恋人日常',
        visits: r.visits
      }
    });
  }
  function fresh(s, r, body) {
    var scenes = r.history.filter(function (h) {
      return h.key.startsWith('echo:love:') || h.key.startsWith('marriage:daily:') || h.key.startsWith('circle:');
    });
    return !scenes.slice(-6).some(function (h) {
      return h.text === body;
    }) && !scenes.some(function (h) {
      return h.text === body && s.age - h.age < 12;
    });
  }
  function eligibleVisit(s, r, v) {
    // 梦篇和回忆只叙述亲友，不能据此把异时代人物登记为现实来客或开放通路。
    if (r.medium === 'dream' || v.memoryOnly) return true;
    var p = s.people[v.person],
      route = routes().find(function (x) {
        return x.id === v.person;
      }),
      R = globalThis.TouhouRelationships;
    if (!s.relations[v.person] && (R.activeCount(s) >= R.maxActive || !R.matches(s, null, route.entry))) return false;
    return (!p || p.alive && p.leaveAt > s.age) && globalThis.TouhouContacts.mode(route) === 'visit' && globalThis.TouhouContacts.canMeet(s, route);
  }
  function candidate(s) {
    if (!s.firstPartnerId || s.character || s.ended || s.afterlife || s.dormant || s.body !== 'humanoid' || s.realm !== 'gensokyo') return null;
    if (s.firstPartnerId === 'local:spouse') {
      var _p = s.people['local:spouse'];
      return !_p.alive && !s.seen['remembrance:local:spouse'] ? {
        due: _p.leaveAt + 3,
        chance: .25,
        get: function get() {
          return {
            id: 'remembrance:local:spouse',
            text: '街上有人谈起往年的集市，你想起那次互明心意。回家路上，你慢慢走过当年同行的小径，留了一会儿神。',
            effects: {
              bond: 1
            },
            weight: 1,
            repeat: 1,
            scene: '旧日相伴'
          };
        }
      } : null;
    }
    var r = s.relations[s.firstPartnerId];
    var route = routes().find(function (x) {
        return x.id === r.id;
      }),
      p = s.people[r.id];
    if (!p.alive) {
      if (r.remembranceAt !== null || globalThis.TouhouAkyuu.pending(s)) return null;
      return {
        due: r.lastAt + 3,
        chance: .25,
        get: function get() {
          return {
            id: 'remembrance:' + r.id,
            text: route.marriage.memory,
            effects: {
              bond: 1
            },
            weight: 1,
            repeat: 1,
            scene: '旧日相伴',
            apply: function apply(x) {
              r.remembranceAt = x.age;
              r.history.push({
                key: 'remembrance',
                age: x.age,
                text: route.marriage.memory,
                status: r.status,
                label: r.label
              });
            }
          };
        }
      };
    }
    if (p.leaveAt <= s.age || s.partnerId !== r.id || r.status !== 'lover' || r.next !== null) return null;
    var visits = route.circle.visits.filter(function (v) {
        return eligibleVisit(s, r, v) && (r.medium === 'dream' || v.memoryOnly || s.relations[v.person] || s.age >= globalThis.TouhouRelationships.introductionDueAt(s));
      }),
      visit = visits.find(function (v) {
        return v.key !== r.circleKey;
      }) || visits[0];
    if (!visit) return null;
    var count = r.history.filter(function (h) {
      return h.key.startsWith('circle:' + visit.key + ':');
    }).length;
    var scene = count === 0 ? {
      key: 'first',
      text: visit.text
    } : visit.scenes[(count - 1) % visit.scenes.length];
    if (!fresh(s, r, scene.text)) return null;
    return {
      due: r.circleAt === null ? r.loveAt + 6 : r.circleAt + 12,
      chance: .12,
      get: function get() {
        var introduces = r.medium !== 'dream' && !visit.memoryOnly && !s.relations[visit.person];
        return _objectSpread(_objectSpread({
          id: introduces ? 'relation:' + visit.person + ':intro' : 'circle:' + r.id + ':' + visit.key + ':' + scene.key + ':' + count,
          text: scene.text,
          effects: {
            bond: 1
          },
          weight: 1,
          repeat: 1,
          scene: r.scene,
          contactMedium: r.medium,
          circleOf: r.id
        }, introduces ? {
          "with": [visit.person]
        } : {}), {}, {
          apply: function apply(x) {
            if (!eligibleVisit(x, r, visit) || x.partnerId !== r.id || !x.people[r.id].alive) throw Error('亲友来往的状态已经改变。');
            if (introduces) {
              var target = routes().find(function (row) {
                return row.id === visit.person;
              });
              globalThis.TouhouRelationships.begin(x, target, false, _objectSpread(_objectSpread({}, target.intro), {}, {
                text: scene.text,
                label: '经' + x.people[r.id].name + '相识'
              }));
            }
            r.circleAt = x.age;
            r.circleKey = visit.key;
            r.history.push({
              key: 'circle:' + visit.key + ':' + scene.key,
              age: x.age,
              text: scene.text,
              status: r.status,
              label: r.label
            });
          }
        });
      }
    };
  }
  globalThis.TouhouCompanionship = {
    settled: settled,
    text: text,
    courtship: courtship,
    localMarriage: localMarriage,
    fresh: fresh,
    eligibleVisit: eligibleVisit,
    candidate: candidate
  };
})();
