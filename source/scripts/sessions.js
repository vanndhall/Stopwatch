module.exports = {

  memory: {},
  
  load: function load(){

    root.main = document.querySelector('main');

    if(!root.main) return setTimeout(load, 0);

    root.sessions.load_page(null, { replace: true });

  },
  
  load_page: (elem, options) => {

    if(!root.main) return setTimeout(root.main, 0, elem, options);

    if(!elem && !history.state) root.sessions.url('/start');

    let page = elem ? elem.dataset.page : history.state.page;

    document.body.classList.forEach((c) => {

      if(c.indexOf('-page') == -1) return;

      document.body.classList.remove(c);

    });

    document.body.classList.add(page + '-page');
    
    root.main.dataset.load = page + '.html';

    if(!options || !options.prevent_url) root.sessions.url('/' + page);

    window.scrollTo(0, 0);

  },

  url: (state, options) => {

    let operation = options && options.replace ? 'replaceState' : 'pushState';

    let url = typeof state == 'string' ? decode() : location.pathname;

    return history[operation](state ? state : decode(), options ? options.title : document.title, state ? encode() : pathname);

    function encode() {

      let page = state ? state.page || 'start' : 'start';

      return Object.keys(state).reduce((url,key)=>{

        if (key == 'page') return url;

        return `${url}/${key}/${state[key]}`;

      }
      , `/${page}`);

    }

    function decode() {

      let parts = (state || location.pathname).split(/\//g);

      state = {};

      for (let i = 0; i < parts.length; i += 2) {

        state[parts[i] || 'page'] = parts[i + 1];

      }

      state.page = state.page || 'start';
      
      return state;

    }

  }

};