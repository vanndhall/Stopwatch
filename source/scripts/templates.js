var clsStopwatch = function(){
    //private vars
    var startAt,endedAt;
    var lapTime = 0;

    var now = function()                        
    {                                          // c# perversion, sorry         "                                                 
        return (new Date()).getTime();        // with this i know where is start box
    };                                       // and end box   i also love clean and organize code in my project :P

        //Public methods

        //Start or resume
         this.start = function()
         {
            startAt = startAt ? startAt : now();
         };

        //Stop or pause
        this.stop = function()
        {
            //if running, update elapsed time otherwise keep it
            endedAt = now();
            lapTime = startAt ? lapTime + endedAt - startAt : lapTime;
            //paused
        };

        //Reset
        this.reset = function()
        {
           lapTime = startAt = 0; 
        };

        //Duration
        this.time = function(){
           return lapTime + (startAt ? now() - startAt : 0); 
        };

        this.log = function(){
        	return {
        	key:`logs_${Math.random()}`,
        	created:startAt,
        	ended: endedAt 	
        	};
        }
};


 //public variables
 var x = new clsStopwatch();

 var $time;
 var clocktimer;

let templates = module.exports = {

 pad:(num, size)=>
 {
     var s = "0000" + num;
     return s.substr(s.length - size);
 }, // ; potrzebny?

 formatTime:(time)=>
 {
    var h = 0,m=0,s = 0, ms = 0;
    var newTime = '';

    h = Math.floor( time / (60*60*1000)); // time / 60 minutes / 60 secounds / 1000 ms
    time = time % (6*60*1000);

    m = Math.floor(time / (60*1000) ); // time / 60secounds / 1000 ms
    time = time % (60*1000);

    s = Math.floor(time / 1000); //  time / 1000ms

    ms = time % 1000;  // 1s have 10000 ms

    newTime = templates.pad(h, 2) + ':' + templates.pad(m, 2) + ':' + templates.pad(s, 2) + ':' + templates.pad(ms, 3); // ms 2/3
    return newTime;
 },

 //SHOW   
 show:()=>
 {
   $time = document.getElementById('time');
   templates.update();  
 }, // using ; ?


 //UPDATE
 update:()=>
 {
     $time.innerHTML = templates.formatTime(x.time());
 },

 //START
 start:()=> 
 {
    clocktimer = setInterval(templates.update, 1);
    x.start();
 },

 //STOP
 stop:()=> 
 {
    x.stop(); 
    clearInterval(clocktimer);
    let log = x.log();
    root.logs.memory[log.key] = log;
    console.log(root.logs.memory);
    document.querySelector(`[data-load="logs.render"]`).dataset.load=`logs.render`;
 },


 //RESET
 reset:()=> 
 {
     templates.stop();
     x.reset();
     templates.update();
 }

};

 
