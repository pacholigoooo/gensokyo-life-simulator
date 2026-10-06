function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/* Stream from NetEase's official external link; no recording is bundled. */
(function () {
  var audio = document.getElementById('background-music'),
    toggle = document.getElementById('music-toggle');
  var menu = document.getElementById('music-menu'),
    settings = document.getElementById('music-settings');
  var status = document.getElementById('music-status'),
    track = document.getElementById('music-track');
  var input = document.getElementById('music-file'),
    volume = document.getElementById('music-volume');
  var frame = document.getElementById('music-embed'),
    volumeLabel = document.getElementById('music-volume-label');
  var defaultTrack = {
    src: 'https://music.163.com/song/media/outer/url?id=730631.mp3',
    title: '碎月 · 八音盒与钢琴'
  };
  var embedUrl = 'https://music.163.com/outchain/player?type=2&id=730631&auto=1&height=66';
  var objectUrl = null,
    wanted = true,
    attempt = 0,
    autoplayBlocked = false,
    embedded = false,
    online = true,
    playingConfirmed = false;
  audio.volume = .18;
  function showMenu(open) {
    menu.hidden = !open;
    settings.setAttribute('aria-expanded', String(open));
  }
  function render() {
    var playing = !embedded && !audio.paused && !audio.ended;
    toggle.classList.toggle('playing', playing);
    if (embedded) toggle.removeAttribute('aria-pressed');else toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', embedded ? '打开网易云播放器' : playing ? '暂停背景音乐' : '播放背景音乐');
    toggle.title = embedded ? '网易云播放器' : status.textContent;
    volumeLabel.hidden = embedded;
  }
  function play() {
    return _play.apply(this, arguments);
  }
  function _play() {
    _play = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var current, playback, hasPromise, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (!(embedded || !audio.getAttribute('src'))) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            current = ++attempt;
            _context.p = 2;
            playback = audio.play(), hasPromise = playback && typeof playback.then === 'function';
            if (!hasPromise) {
              _context.n = 3;
              break;
            }
            _context.n = 3;
            return playback;
          case 3:
            if (!(current !== attempt || !wanted)) {
              _context.n = 4;
              break;
            }
            if (!wanted) audio.pause();
            return _context.a(2);
          case 4:
            if (hasPromise) {
              _context.n = 5;
              break;
            }
            autoplayBlocked = audio.paused;
            if (autoplayBlocked) status.textContent = '轻触音符或开始按钮播放。';else if (!playingConfirmed) status.textContent = '正在载入';
            render();
            return _context.a(2);
          case 5:
            autoplayBlocked = false;
            status.textContent = '循环播放';
            render();
            _context.n = 8;
            break;
          case 6:
            _context.p = 6;
            _t = _context.v;
            if (!(current !== attempt)) {
              _context.n = 7;
              break;
            }
            return _context.a(2);
          case 7:
            if (_t.name === 'NotAllowedError') {
              autoplayBlocked = true;
              status.textContent = '轻触音符或开始按钮播放。';
            } else if (_t.name === 'AbortError') status.textContent = '已暂停';else {
              wanted = false;
              status.textContent = online ? '网易云暂时无法播放，可重试或打开下方播放器。' : '这份音频未能播放，请重新选取。';
            }
            render();
          case 8:
            return _context.a(2);
        }
      }, _callee, null, [[2, 6]]);
    }));
    return _play.apply(this, arguments);
  }
  function clearSource() {
    attempt++;
    audio.pause();
    frame.removeAttribute('src');
    frame.hidden = true;
    embedded = false;
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
    autoplayBlocked = false;
    playingConfirmed = false;
  }
  function useOnline() {
    clearSource();
    online = true;
    audio.src = defaultTrack.src;
    track.textContent = defaultTrack.title;
    wanted = true;
    status.textContent = '正在连接网易云';
    render();
    play();
  }
  toggle.addEventListener('click', function () {
    if (embedded) {
      showMenu(true);
      return;
    }
    wanted = autoplayBlocked ? true : !wanted;
    autoplayBlocked = false;
    if (wanted) play();else {
      attempt++;
      audio.pause();
      status.textContent = '已暂停';
      render();
    }
  });
  settings.addEventListener('click', function () {
    return showMenu(menu.hidden);
  });
  document.getElementById('music-close').addEventListener('click', function () {
    return showMenu(false);
  });
  document.getElementById('music-online').addEventListener('click', useOnline);
  document.getElementById('music-use-embed').addEventListener('click', function () {
    clearSource();
    embedded = true;
    online = true;
    wanted = false;
    audio.removeAttribute('src');
    audio.load();
    frame.src = embedUrl;
    frame.hidden = false;
    track.textContent = defaultTrack.title;
    status.textContent = '在下方网易云播放器播放或暂停。';
    showMenu(true);
    render();
  });
  input.addEventListener('change', function () {
    if (!input.files.length) return;
    clearSource();
    online = false;
    var file = input.files[0];
    objectUrl = URL.createObjectURL(file);
    audio.src = objectUrl;
    track.textContent = file.name;
    wanted = true;
    status.textContent = '正在载入';
    render();
    play();
    showMenu(false);
  });
  volume.addEventListener('input', function () {
    audio.volume = Number(volume.value) / 100;
  });
  audio.addEventListener('playing', function () {
    if (!wanted || embedded) {
      audio.pause();
      return;
    }
    playingConfirmed = true;
    autoplayBlocked = false;
    status.textContent = '循环播放';
    render();
  });
  audio.addEventListener('pause', function () {
    playingConfirmed = false;
    render();
  });
  audio.addEventListener('error', function () {
    wanted = false;
    playingConfirmed = false;
    status.textContent = online ? '网易云暂时无法播放，可重试或打开下方播放器。' : '这份音频未能播放，请重新选取。';
    render();
  });
  document.querySelector('.music-control').addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      showMenu(false);
      settings.focus();
    }
  });
  document.getElementById('start').addEventListener('click', function () {
    if (wanted && audio.paused) play();
  });
  useOnline();
})();
