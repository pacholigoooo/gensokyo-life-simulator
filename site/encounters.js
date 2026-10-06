function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* Unnamed glimpses and lasting clues for ordinary lives in Gensokyo. */
(function () {
  var events = [];
  var ordinary = function ordinary(s) {
    return !s.character && s.realm === 'gensokyo';
  };
  var here = function here(s) {
    for (var _len = arguments.length, places = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      places[_key - 1] = arguments[_key];
    }
    return places.includes(s.habitat);
  };
  var has = function has(s) {
    for (var _len2 = arguments.length, ids = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      ids[_key2 - 1] = arguments[_key2];
    }
    return ids.some(function (id) {
      return s.talents.includes(id);
    });
  };
  var hands = function hands(s) {
    return s.body === 'humanoid';
  };
  var human = function human(s) {
    return s.species === 'human';
  };
  var nearby = function nearby(s) {
    return here(s, 'village', 'outskirts');
  };
  var settled = function settled(s) {
    return here(s, 'village', 'outskirts', 'mansion');
  };
  var woodland = function woodland(s) {
    return here(s, 'outskirts', 'forest') || has(s, 'forest', 'wander', 'herbal');
  };
  var mountain = function mountain(s) {
    return here(s, 'mountain') || has(s, 'forest', 'wander');
  };
  var lakeside = function lakeside(s) {
    return here(s, 'village', 'outskirts', 'forest') || has(s, 'wander');
  };
  function event(id, text) {
    var effects = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var rules = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var qualify = rules.when;
    events.push(_objectSpread(_objectSpread({
      id: 'encounter:' + id,
      text: text,
      effects: effects,
      weight: 2,
      repeat: 1,
      minAge: 6
    }, rules), {}, {
      when: function when(s) {
        return ordinary(s) && (!qualify || qualify(s));
      }
    }));
  }

  // A riverside landmark lasts longer than the passing red-and-white figure.
  event('river-mark', '溪边一抹红白掠过，你记住了那块带苔的石。', {}, {
    when: nearby,
    excludes: ['encounter:river-mark'],
    set: ['encounter:river-mark'],
    talentBoost: ['neighborly', 'wander']
  });
  event('river-way', '你循旧石旁的浅槽，认出一条绕雾回村的路。', {
    insight: 1
  }, {
    minAge: 12,
    when: nearby,
    min: {
      insight: 5
    },
    requires: ['encounter:river-mark'],
    excludes: ['encounter:river-way'],
    set: ['encounter:river-way'],
    talentBoost: ['forest', 'wander']
  });
  event('river-return', '又一回雾起，你沿记熟的水声带迷路人返村。', {
    bond: 1
  }, {
    minAge: 18,
    when: function when(s) {
      return nearby(s) && hands(s);
    },
    min: {
      health: 4
    },
    requires: ['encounter:river-way'],
    excludes: ['encounter:river-return'],
    set: ['encounter:river-return'],
    talentBoost: ['neighborly', 'forest']
  });

  // Stone marks lead back to a light; medicine is supplied on the later visit.
  event('bamboo-light', '竹林深处有盏不动的灯，你记住灯旁的石痕。', {}, {
    minAge: 18,
    when: woodland,
    min: {
      health: 3
    },
    excludes: ['encounter:bamboo-mark'],
    set: ['encounter:bamboo-mark'],
    talentBoost: ['forest', 'wander', 'herbal']
  });
  event('bamboo-way', '你认出石痕对着低谷，绕过了最密的竹丛。', {
    insight: 1
  }, {
    minAge: 18,
    when: woodland,
    min: {
      insight: 5
    },
    requires: ['encounter:bamboo-mark'],
    excludes: ['encounter:bamboo-way'],
    set: ['encounter:bamboo-way'],
    talentBoost: ['forest', 'herbal']
  });
  event('bamboo-medicine', '再访灯下小屋，无名药师递来一包新配的药。', {}, {
    minAge: 18,
    when: function when(s) {
      return woodland(s) && human(s) && !s.remedy;
    },
    requires: ['encounter:bamboo-way'],
    excludes: ['encounter:bamboo-medicine'],
    set: ['encounter:bamboo-medicine'],
    apply: function apply(s) {
      return s.remedy = true;
    },
    talentBoost: ['herbal', 'neighborly']
  });

  // Nothing is promised for tomorrow: a recurring dream leaves a remembered turn.
  event('umbrella-shadow', '雨夜门缝露出一角伞影，门外却没有脚印。', {}, {
    when: settled,
    excludes: ['encounter:umbrella-shadow'],
    set: ['encounter:umbrella-shadow'],
    talentBoost: ['boundary', 'spirit-eye']
  });
  event('umbrella-turn', '你记住梦里少掉的台阶，醒后认出了旧岔口。', {
    insight: 1
  }, {
    minAge: 12,
    when: settled,
    min: {
      insight: 6
    },
    requires: ['encounter:umbrella-shadow'],
    excludes: ['encounter:umbrella-turn'],
    set: ['encounter:umbrella-turn'],
    talentBoost: ['boundary', 'stargaze']
  });
  event('umbrella-road', '重过旧岔口，你绕开少掉的台阶，走向了灯火。', {
    insight: 1
  }, {
    minAge: 18,
    when: settled,
    requires: ['encounter:umbrella-turn'],
    excludes: ['encounter:umbrella-road'],
    set: ['encounter:umbrella-road'],
    talentBoost: ['boundary', 'wander']
  });

  // A sound and a shelter can be recognised on another journey many years later.
  event('mountain-chime', '山口风铃无风自响，你记下云间的一条窄路。', {}, {
    minAge: 18,
    when: mountain,
    min: {
      health: 5
    },
    excludes: ['encounter:mountain-chime'],
    set: ['encounter:mountain-chime'],
    talentBoost: ['wander', 'forest', 'stargaze']
  });
  event('mountain-weather', '你听出铃声急缓，记住不迎落雷的低处。', {
    insight: 1
  }, {
    minAge: 18,
    when: mountain,
    min: {
      insight: 6
    },
    requires: ['encounter:mountain-chime'],
    excludes: ['encounter:mountain-weather'],
    set: ['encounter:mountain-weather'],
    talentBoost: ['stargaze', 'forest']
  });
  event('mountain-shelter', '山云又压来，你循认出的铃声走到干燥石檐下。', {
    health: 1
  }, {
    minAge: 18,
    when: mountain,
    requires: ['encounter:mountain-weather'],
    excludes: ['encounter:mountain-shelter'],
    set: ['encounter:mountain-shelter'],
    talentBoost: ['wander', 'stargaze']
  });

  // A bay, then an ice pattern, then a small ridiculous sight beyond the reeds.
  event('lake-shadow', '湖雾后掠过蓝色翅影，你记住了斜长的芦湾。', {}, {
    when: lakeside,
    excludes: ['encounter:lake-bay'],
    set: ['encounter:lake-bay'],
    talentBoost: ['forest', 'spirit-eye']
  });
  event('lake-pattern', '你循记熟的湾角绕行，认出冰纹里一处缺口。', {
    insight: 1
  }, {
    minAge: 18,
    when: lakeside,
    min: {
      insight: 5
    },
    requires: ['encounter:lake-bay'],
    excludes: ['encounter:lake-pattern'],
    set: ['encounter:lake-pattern'],
    talentBoost: ['forest', 'wander']
  });
  event('lake-crown', '重到芦湾，你从冰纹缺口望见歪冰冠，笑出了声。', {
    health: 1
  }, {
    minAge: 18,
    when: lakeside,
    requires: ['encounter:lake-pattern'],
    excludes: ['encounter:lake-crown'],
    set: ['encounter:lake-crown'],
    talentBoost: ['spirit-eye', 'neighborly']
  });

  // The route and the missing beat remain; the food belongs to this new visit.
  event('stall-lamps', '村外炭香追着歌声转弯，你记下双灯的岔口。', {}, {
    minAge: 18,
    when: function when(s) {
      return nearby(s) || woodland(s);
    },
    excludes: ['encounter:stall-lamps'],
    set: ['encounter:stall-lamps'],
    talentBoost: ['wander', 'neighborly']
  });
  event('stall-song', '你听出歌里总少一拍，沿双灯找到烤鳗的小棚。', {
    insight: 1
  }, {
    minAge: 18,
    when: function when(s) {
      return nearby(s) || woodland(s);
    },
    min: {
      insight: 5
    },
    requires: ['encounter:stall-lamps'],
    excludes: ['encounter:stall-song'],
    set: ['encounter:stall-song'],
    talentBoost: ['neighborly', 'spirit-eye']
  });
  event('stall-supper', '再到小棚，你敲准漏拍，买鳗时多得一串。', {
    health: 1,
    fortune: -1
  }, {
    minAge: 18,
    when: function when(s) {
      return (nearby(s) || woodland(s)) && hands(s);
    },
    min: {
      fortune: 2
    },
    requires: ['encounter:stall-song'],
    excludes: ['encounter:stall-supper'],
    set: ['encounter:stall-supper'],
    talentBoost: ['neighborly', 'wander']
  });

  // Independent sightings add everyday room between the six clue lines.
  event('shrine-paper', '风把符纸吹到篱上，你看见字背粘着松针。', {
    insight: 1
  }, {
    when: settled,
    min: {
      insight: 4
    },
    talentBoost: ['scroll', 'boundary']
  });
  event('paper-crane', '纸鹤掠过学堂窗，你跟同伴追到晒谷场。', {
    bond: 1
  }, {
    maxAge: 17,
    when: function when(s) {
      return human(s) && nearby(s);
    },
    min: {
      health: 4
    },
    weight: 3,
    talentBoost: ['neighborly', 'forest']
  });
  event('half-bell', '远钟敲到半声便停，一群妖精落在稻田边。', {}, {
    when: nearby,
    bias: {
      insight: 1
    },
    talentBoost: ['spirit-eye', 'neighborly']
  });
  event('missing-sock', '晾好的袜子少了一只，树梢响起压低的笑声。', {}, {
    when: function when(s) {
      return settled(s) && hands(s);
    },
    bias: {
      bond: -1
    },
    talentBoost: ['neighborly', 'spirit-eye']
  });
  event('star-book', '你买回空白旧册，末页却藏着一张星图。', {
    insight: 1,
    fortune: -1
  }, {
    minAge: 12,
    when: function when(s) {
      return nearby(s) && hands(s);
    },
    min: {
      insight: 6,
      fortune: 2
    },
    talentBoost: ['scroll', 'stargaze']
  });
  event('cat-tails', '你看见猫影分成两条尾，回头只剩一根草绳。', {}, {
    when: function when(s) {
      return nearby(s) || here(s, 'forest');
    },
    bias: {
      insight: 1
    },
    talentBoost: ['spirit-eye', 'boundary']
  });
  event('cucumber-cart', '你替山脚小贩推车，她用黄瓜付了车费。', {
    fortune: 1
  }, {
    minAge: 18,
    when: function when(s) {
      return hands(s) && (nearby(s) || mountain(s));
    },
    min: {
      health: 5
    },
    talentBoost: ['neighborly', 'wander']
  });
  event('torii-shade', '山脚鸟居的影子分成两重，你停步等云走开。', {
    insight: 1
  }, {
    minAge: 18,
    when: mountain,
    bias: {
      insight: 1
    },
    talentBoost: ['boundary', 'spirit-eye']
  });
  event('wind-news', '一张小报迎风贴住脸，标题全是没听过的怪事。', {
    insight: 1
  }, {
    minAge: 8,
    when: hands,
    min: {
      insight: 5
    },
    talentBoost: ['scroll', 'neighborly']
  });
  event('empty-concert', '空屋传来三种乐器声，窗里却只有月光。', {}, {
    minAge: 18,
    when: woodland,
    bias: {
      bond: 1
    },
    talentBoost: ['spirit-eye', 'wander']
  });
  event('silent-ferry', '渡口多了一条空船，岸上摆着擦亮的铜钱。', {}, {
    minAge: 18,
    when: nearby,
    bias: {
      insight: 1
    },
    talentBoost: ['spirit-eye', 'boundary']
  });
  event('snow-footprints', '新雪上有两行脚印，一行走到篱边就不见了。', {}, {
    when: settled,
    bias: {
      insight: 1
    },
    talentBoost: ['spirit-eye', 'boundary']
  });
  event('knocking-kettle', '旧壶半夜敲了三声，添水后又装作没动。', {
    health: 1
  }, {
    when: function when(s) {
      return settled(s) && hands(s);
    },
    min: {
      insight: 4
    },
    talentBoost: ['craft', 'neighborly', 'spirit-eye']
  });
  event('late-sunflower', '枯田里开出一株向日葵，花盘朝着未升起的光。', {}, {
    when: function when(s) {
      return nearby(s) || here(s, 'forest');
    },
    bias: {
      insight: 1
    },
    talentBoost: ['herbal', 'forest', 'stargaze']
  });
  event('bird-flame', '灯笼里的火跳成鸟形，你眨眼时又只剩一豆。', {
    insight: 1
  }, {
    when: settled,
    max: {
      fortune: 5
    },
    talentBoost: ['spirit-eye', 'scroll']
  });
  event('silk-sleeve', '陌生客人的袖里掉出蛛丝，摊主仍照旧找钱。', {
    bond: 1
  }, {
    minAge: 18,
    when: nearby,
    min: {
      bond: 5
    },
    talentBoost: ['neighborly', 'invited']
  });
  event('paper-butterflies', '旧纸背画着双蝶，一掀页，它们就挪到下一页。', {
    insight: 1
  }, {
    minAge: 12,
    when: function when(s) {
      return settled(s) && hands(s);
    },
    min: {
      insight: 7
    },
    talentBoost: ['scroll', 'boundary']
  });
  event('held-leaf', '一枚落叶忽然悬住，你等了一会，雨点先落下来。', {}, {
    minAge: 18,
    bias: {
      insight: 1
    },
    talentBoost: ['boundary', 'stargaze']
  });
  globalThis.TouhouEncounters = {
    events: events
  };
})();
