(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("source/scripts/labels.js", function(exports, require, module) {
'use strict';

var LANGS = ['en', 'nl'];

var index = LANGS.indexOf(localStorage.getItem('language'));

if (index == -1) index = 0;

var labels = {
  english: ['English', 'Engels'],
  dutch: ['Dutch', 'Nederlands'],
  intro: ['\n      hello world!\n    ', '\n      hallo wereld!\n    ']
};

for (var n in labels) {

  if (!labels.hasOwnProperty(n)) continue;

  if (labels[n] == false) labels[n] = n;else labels[n] = labels[n][index];
}

module.exports = labels;

function placeholder(label) {

  return function (el) {
    return el.setAttribute('placeholder', label);
  };
}

function title(label) {

  return function (el) {
    return el.setAttribute('data-title', label);
  };
}
});

;require.register("source/scripts/listeners.js", function(exports, require, module) {
'use strict';

var updates = [];

module.exports = init;

function init() {

  bind();

  document.documentElement.addEventListener('click', listener);

  document.documentElement.addEventListener('change', listener);

  document.documentElement.addEventListener('input', listener);

  document.documentElement.addEventListener('keyup', listener);

  document.documentElement.addEventListener('keydown', listener);

  document.documentElement.addEventListener('mousedown', listener);

  document.documentElement.addEventListener('mouseup', listener);

  document.documentElement.addEventListener('submit', listener);
}

function listener(e, element) {

  element = element || e.target;

  if (e.type.toLowerCase() == 'submit') e.preventDefault();

  if (!element.dataset || !element.dataset[e.type]) {

    if (!element.parentElement) return;

    return listener(e, element.parentElement);
  }

  var target = root;

  for (var i = 0, parts = element.dataset[e.type].split('.'); i < parts.length; i++) {

    if (!target) return console.error(element.dataset[e.type] || e.type, 'does not exist');

    target = target[parts[i]];
  }

  target(element);
}

function bind() {

  (function loop() {

    if (!updates.length) return requestAnimationFrame(loop);

    var elements = updates.splice(0, updates.length);

    for (var i = 0; i < elements.length; i++) {

      [].map.call(elements[i].querySelectorAll('[data-bind], [data-load]'), bind_one);
    }

    requestAnimationFrame(loop);
  })();

  new MutationObserver(observer).observe(document.documentElement, {
    attributes: true,
    subtree: true,
    childList: true,
    characterData: true
  });
}

function observer(mutations) {

  for (var i = 0; i < mutations.length; i++) {

    if (mutations[i].type == 'attributes') {

      if (mutations[i].attributeName == 'data-load') load(mutations[i].target);

      continue;
    }

    if (mutations[i].type != 'childList') return;

    if (updates.indexOf(mutations[i].target) == -1) updates.push(mutations[i].target);
  }
}

function bind_one(element) {

  var d = element.dataset,
      key = d.bind == 'me' ? root.config.user : d.bind,
      collection = void 0;

  if (d.load) return load(element);

  if (!key) return collection.error(d);

  collection = root[key.split('_').slice(0, -1).join('_')];

  if (!collection || !collection.memory[key]) return console.error(key);

  var prop = d.value || d.text || d.bg || d.html,
      obj = collection.memory[key];

  if (d.value) element.value = obj[d.value] || '';

  if (d.html) element.innerHTML = obj[d.html] || '';

  if (d.text) element.innerHTML = (obj[d.text] || '').replace(/(>|<)/g, escape);

  if (d.bg) element.style.backgroundImage = 'url("' + (obj[d.bg] || '');
}

function load(element) {

  var target = root;

  for (var i = 0, parts = element.dataset.load.split('.'); i < parts.length; i++) {

    target = target[parts[i]];

    if (!target) {

      if (element.dataset.load.indexOf('.html') != -1) return load_file(element);

      return console.error(element.dataset.load, 'does not exist');
    }
  }

  if (element.dataset.load.substring(0, 11) == 'labels.user') {

    var user = root.users.memory[root.config.user],
        str = element.dataset.load;

    str = str.substring(12);

    if (user && typeof str == 'string' && user[str]) return element.value = user[str];
  }

  if (typeof target == 'string') return element.innerHTML = target;

  if (typeof target == 'function') return target(element);
}

function load_file(element) {

  var xhr = new XMLHttpRequest();

  xhr.open('GET', element.dataset.load, true);

  xhr.onreadystatechange = function (e) {

    if (this.readyState != 4 || this.status != 200) return;

    root.templates = root.templates || {};

    var target = root.templates;

    for (var i = 0, parts = element.dataset.load.split('.'); i + 1 < parts.length; i++) {

      if (!target) return;

      target[parts[i]] = target[parts[i]] || {};

      target = target[parts[i]];
    }

    element.innerHTML = target.html = this.responseText;
  };

  xhr.send();
}

function escape(match) {

  return match == '>' ? '&gt;' : '&lt;';
}
});

;require.register("source/scripts/logs.js", function(exports, require, module) {
'use strict';

var logs = module.exports = {

    memory: {},

    render: function render(element, keys) {
        //render function ()
        if (!keys) element.innerHTML = '';
        keys = keys || Object.keys(logs.memory);
        // create mdn
        console.log(keys);
        if (keys.length == 0) return; //guard

        var key = keys.pop(),
            collection = key.split('_')[0],
            item = root[collection].memory[key];

        element.innerHTML += '\n          <div>' + moment(item.ended).diff(item.created, 'milisecond') + '</div>\n            \n        ';

        logs.render(element, keys);
    }
};
});

;require.register("source/scripts/polyfill.js", function(exports, require, module) {
'use strict';

if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(target) {
      'use strict';

      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}

(function () {

  if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

  var prototype = Array.prototype,
      push = prototype.push,
      splice = prototype.splice,
      join = prototype.join;

  function DOMTokenList(el) {
    this.el = el;
    // The className needs to be trimmed and split on whitespace
    // to retrieve a list of classes.
    var classes = el.className.replace(/^\s+|\s+$/g, '').split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      push.call(this, classes[i]);
    }
  };

  DOMTokenList.prototype = {
    add: function add(token) {
      if (this.contains(token)) return;
      push.call(this, token);
      this.el.className = this.toString();
    },
    contains: function contains(token) {
      return this.el.className.indexOf(token) != -1;
    },
    item: function item(index) {
      return this[index] || null;
    },
    remove: function remove(token) {
      if (!this.contains(token)) return;
      for (var i = 0; i < this.length; i++) {
        if (this[i] == token) break;
      }
      splice.call(this, i, 1);
      this.el.className = this.toString();
    },
    toString: function toString() {
      return join.call(this, ' ');
    },
    toggle: function toggle(token) {
      if (!this.contains(token)) {
        this.add(token);
      } else {
        this.remove(token);
      }

      return this.contains(token);
    }
  };

  window.DOMTokenList = DOMTokenList;

  function defineElementGetter(obj, prop, getter) {
    if (Object.defineProperty) {
      Object.defineProperty(obj, prop, {
        get: getter
      });
    } else {
      obj.__defineGetter__(prop, getter);
    }
  }

  defineElementGetter(Element.prototype, 'classList', function () {
    return new DOMTokenList(this);
  });
})();
});

require.register("source/scripts/root.js", function(exports, require, module) {
'use strict';

window.root = {

  config: init(),

  socket: require('./socket.js'),

  templates: require('./templates.js'),

  sessions: require('./sessions.js'),

  labels: require('./labels.js'),

  logs: require('./logs.js')
};

function updater() {

  if (!root.updated) return setTimeout(updater, 1000);

  // do something

  root.updated = false;

  updater();
}

function init() {
  var _arguments = arguments;


  require('./polyfill.js');

  require('./listeners.js')();

  requestAnimationFrame(function () {

    root.sessions.load();

    updater();
  });

  return {

    user: '',

    session: '',

    error: function error(element) {

      if (element && element.dataset) return console.error(element.dataset.message);

      console.error(_arguments);
    },

    query: location.search.slice(1).split('&').reduce(function (memo, pair) {

      var p = pair.split('=');

      memo[p[0]] = p[1];

      return memo;
    }, {})

  };
};
});

require.register("source/scripts/sessions.js", function(exports, require, module) {
'use strict';

module.exports = {

    memory: {},

    load: function load() {

        root.main = document.querySelector('main');

        if (!root.main) return setTimeout(load, 0);

        root.sessions.load_page(null, { replace: true });
    },

    load_page: function load_page(elem, options) {

        if (!root.main) return setTimeout(root.main, 0, elem, options);

        if (!elem && !history.state) root.sessions.url('/start');

        var page = elem ? elem.dataset.page : history.state.page;

        document.body.classList.forEach(function (c) {

            if (c.indexOf('-page') == -1) return;

            document.body.classList.remove(c);
        });

        document.body.classList.add(page + '-page');

        root.main.dataset.load = page + '.html';

        if (!options || !options.prevent_url) root.sessions.url('/' + page);

        window.scrollTo(0, 0);
    },

    url: function url(state, options) {

        var operation = options && options.replace ? 'replaceState' : 'pushState';

        var url = typeof state == 'string' ? decode() : location.pathname;

        return history[operation](state ? state : decode(), options ? options.title : document.title, state ? encode() : pathname);

        function encode() {

            var page = state ? state.page || 'start' : 'start';

            return Object.keys(state).reduce(function (url, key) {

                if (key == 'page') return url;

                return url + '/' + key + '/' + state[key];
            }, '/' + page);
        }

        function decode() {

            var parts = (state || location.pathname).split(/\//g);

            state = {};

            for (var i = 0; i < parts.length; i += 2) {

                state[parts[i] || 'page'] = parts[i + 1];
            }

            state.page = state.page || 'start';

            return state;
        }
    }

};
});

require.register("source/scripts/socket.js", function(exports, require, module) {
'use strict';

var query = '',
    callbacks = [];

for (var i in localStorage) {
  query += (query ? '&' : '?') + encodeURIComponent(i) + '=' + encodeURIComponent(localStorage.getItem(i));
}var ws = new WebSocket('ws://localhost:443/' + query
//  `wss://academy.fearless-apps.com/${ query }`
).addEventListener('message', function (e) {
  return incoming(JSON.parse(e.data), callbacks);
});

module.exports = {

  incoming: incoming,

  send: Send(ws, callbacks)

};

function Send(ws, callbacks) {

  return function send(data, callback) {

    var cb = 'cb_' + Math.floor(Math.random() * 10000);

    data.callback = cb;

    callbacks[cb] = callback;

    ws.send(JSON.stringify(data));
  };
}

function incoming(message, callbacks) {

  if (message instanceof Array) {

    if (Object.keys(root.orders.memory).length) root.updated = true;

    for (var m in message) {
      merge(message[m]);
    }return;
  }

  merge(message);

  if (!message.callback || !callbacks[message.callback]) return;

  callbacks[message.callback](message);

  delete callbacks[message.callback];
}

function merge(message) {

  if (!message.key) return;

  var collection = message.key.split('_').slice(0, -1).join('_');

  root[collection].memory[message.key] = Object.assign(root[collection].memory[message.key] || {}, message);

  root[collection].updated = true;
}
});

;require.register("source/scripts/templates.js", function(exports, require, module) {
'use strict';

var clsStopwatch = function clsStopwatch() {
    //private vars
    var startAt, endedAt;
    var lapTime = 0;

    var now = function now() {
        // c# perversion, sorry         "                                                 
        return new Date().getTime(); // with this i know where is start box
    }; // and end box   i also love clean and organize code in my project :P

    //Public methods

    //Start or resume
    this.start = function () {
        startAt = startAt ? startAt : now();
    };

    //Stop or pause
    this.stop = function () {
        //if running, update elapsed time otherwise keep it
        endedAt = now();
        lapTime = startAt ? lapTime + endedAt - startAt : lapTime;
        //paused
    };

    //Reset
    this.reset = function () {
        lapTime = startAt = 0;
    };

    //Duration
    this.time = function () {
        return lapTime + (startAt ? now() - startAt : 0);
    };

    this.log = function () {
        return {
            key: 'logs_' + Math.random(),
            created: startAt,
            ended: endedAt
        };
    };
};

//public variables
var x = new clsStopwatch();

var $time;
var clocktimer;

var templates = module.exports = {

    pad: function pad(num, size) {
        var s = "0000" + num;
        return s.substr(s.length - size);
    }, // ; potrzebny?

    formatTime: function formatTime(time) {
        var h = 0,
            m = 0,
            s = 0,
            ms = 0;
        var newTime = '';

        h = Math.floor(time / (60 * 60 * 1000)); // time / 60 minutes / 60 secounds / 1000 ms
        time = time % (6 * 60 * 1000);

        m = Math.floor(time / (60 * 1000)); // time / 60secounds / 1000 ms
        time = time % (60 * 1000);

        s = Math.floor(time / 1000); //  time / 1000ms

        ms = time % 1000; // 1s have 10000 ms

        newTime = templates.pad(h, 2) + ':' + templates.pad(m, 2) + ':' + templates.pad(s, 2) + ':' + templates.pad(ms, 3); // ms 2/3
        return newTime;
    },

    //SHOW   
    show: function show() {
        $time = document.getElementById('time');
        templates.update();
    }, // using ; ?


    //UPDATE
    update: function update() {
        $time.innerHTML = templates.formatTime(x.time());
    },

    //START
    start: function start() {
        clocktimer = setInterval(templates.update, 1);
        x.start();
    },

    //STOP
    stop: function stop() {
        x.stop();
        clearInterval(clocktimer);
        var log = x.log();
        root.logs.memory[log.key] = log;
        console.log(root.logs.memory);
        document.querySelector('[data-load="logs.render"]').dataset.load = 'logs.render';
    },

    //RESET
    reset: function reset() {
        templates.stop();
        x.reset();
        templates.update();
    }

};
});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

'use strict';

/* jshint ignore:start */
(function () {
  var WebSocket = window.WebSocket || window.MozWebSocket;
  var br = window.brunch = window.brunch || {};
  var ar = br['auto-reload'] = br['auto-reload'] || {};
  if (!WebSocket || ar.disabled) return;
  if (window._ar) return;
  window._ar = true;

  var cacheBuster = function cacheBuster(url) {
    var date = Math.round(Date.now() / 1000).toString();
    url = url.replace(/(\&|\\?)cacheBuster=\d*/, '');
    return url + (url.indexOf('?') >= 0 ? '&' : '?') + 'cacheBuster=' + date;
  };

  var browser = navigator.userAgent.toLowerCase();
  var forceRepaint = ar.forceRepaint || browser.indexOf('chrome') > -1;

  var reloaders = {
    page: function page() {
      window.location.reload(true);
    },

    stylesheet: function stylesheet() {
      [].slice.call(document.querySelectorAll('link[rel=stylesheet]')).filter(function (link) {
        var val = link.getAttribute('data-autoreload');
        return link.href && val != 'false';
      }).forEach(function (link) {
        link.href = cacheBuster(link.href);
      });

      // Hack to force page repaint after 25ms.
      if (forceRepaint) setTimeout(function () {
        document.body.offsetHeight;
      }, 25);
    },

    javascript: function javascript() {
      var scripts = [].slice.call(document.querySelectorAll('script'));
      var textScripts = scripts.map(function (script) {
        return script.text;
      }).filter(function (text) {
        return text.length > 0;
      });
      var srcScripts = scripts.filter(function (script) {
        return script.src;
      });

      var loaded = 0;
      var all = srcScripts.length;
      var onLoad = function onLoad() {
        loaded = loaded + 1;
        if (loaded === all) {
          textScripts.forEach(function (script) {
            eval(script);
          });
        }
      };

      srcScripts.forEach(function (script) {
        var src = script.src;
        script.remove();
        var newScript = document.createElement('script');
        newScript.src = cacheBuster(src);
        newScript.async = true;
        newScript.onload = onLoad;
        document.head.appendChild(newScript);
      });
    }
  };
  var port = ar.port || 9485;
  var host = br.server || window.location.hostname || 'localhost';

  var connect = function connect() {
    var connection = new WebSocket('ws://' + host + ':' + port);
    connection.onmessage = function (event) {
      if (ar.disabled) return;
      var message = event.data;
      var reloader = reloaders[message] || reloaders.page;
      reloader();
    };
    connection.onerror = function () {
      if (connection.readyState) connection.close();
    };
    connection.onclose = function () {
      window.setTimeout(connect, 1000);
    };
  };
  connect();
})();
/* jshint ignore:end */
;require('source/scripts/root.js');
//# sourceMappingURL=script.js.map