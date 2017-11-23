let qs = require('querystring'),
    ws = require('ws'),
    server;

module.exports = (wss) => {

  server = wss;

  return Connection;

};

function handler(request) {

  return {

    broadcast: (ws, msg, session) => {

      server.clients.forEach(function each(client) {

        if (client !== ws && client.readyState === ws.OPEN) {

          client.send(JSON.stringify(msg));

        }

      });

    }

  }[request];

}

function Connection(ws) {

  let session = {};

  if(!ws.upgradeReq) return console.log('no upgrade req');

  session.storage = qs.parse(ws.upgradeReq.url.slice(2));

  ws.on('message', (message) => {

    let msg = JSON.parse(message),
        func = handler(msg.request);

    if(!func) return console.log(msg, session);

    func(ws, msg, session, (new_session) => {

      session = new_session;

    });;

  });

}