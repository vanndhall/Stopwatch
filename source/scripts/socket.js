let query = '',
    callbacks = [];

for(let i in localStorage)
  query += (query ? '&' : '?') + encodeURIComponent(i) + '=' +  encodeURIComponent(localStorage.getItem(i));

let ws = new WebSocket(
  `ws://localhost:443/${ query }`
//  `wss://academy.fearless-apps.com/${ query }`
).addEventListener('message', (e) => incoming(JSON.parse(e.data), callbacks));

module.exports = {

  incoming: incoming,

  send: Send(ws, callbacks)

};

function Send(ws, callbacks) {

  return function send(data, callback) {

    let cb = `cb_${ Math.floor(Math.random() * 10000) }`;

    data.callback = cb;

    callbacks[cb] = callback;

    ws.send(JSON.stringify(data));

  };

}

function incoming(message, callbacks){

  if(message instanceof Array) {

	if(Object.keys(root.orders.memory).length) root.updated = true;

  	for(let m in message) merge(message[m]);

	return;

  }

  merge(message);

  if(!message.callback || !callbacks[message.callback]) return;

  callbacks[message.callback](message);

  delete callbacks[message.callback];
  
}

function merge(message){

  if(!message.key) return;

  let collection = message.key.split('_').slice(0, -1).join('_');

  root[collection].memory[message.key] = Object.assign(root[collection].memory[message.key] || {}, message);

  root[collection].updated = true;
  
}