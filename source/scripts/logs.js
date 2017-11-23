let logs = module.exports = {

    memory:{},

    render:(element,keys)=>{
        //render function ()
        if(!keys) element.innerHTML='';
        keys = keys || Object.keys(logs.memory);
        // create mdn
        console.log(keys)
        if (keys.length == 0)
            return; //guard
       
        let key = keys.pop(),
            collection = key.split('_')[0],
            item = root[collection].memory[key];

        element.innerHTML += `
          <div>${moment(item.ended).diff(item.created, 'milisecond')}</div>
            
        `;

        logs.render(element, keys);
    }
}
