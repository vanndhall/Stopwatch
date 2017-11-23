window.root = {

  config: init(),

  socket: require('./socket.js'),
  
  templates: require('./templates.js'),

  sessions: require('./sessions.js'),

  labels: require('./labels.js'),

  logs: require('./logs.js')
};

function updater(){

  if(!root.updated) return setTimeout(updater, 1000);

  // do something
  
  root.updated = false;

  updater();

}

function init(){

  require('./polyfill.js');

  require('./listeners.js')();

  requestAnimationFrame(()=>{

  	root.sessions.load();

  	updater();

  });

  return {

    user: '',

    session: '',

    error: (element) => {

	  if(element && element.dataset) return console.error(element.dataset.message);

	  console.error(arguments);

	},

    query: location.search.slice(1).split('&').reduce((memo, pair) => {

	  let p = pair.split('=');

	  memo[p[0]] = p[1];

	  return memo;

	}, {})

  };

};
