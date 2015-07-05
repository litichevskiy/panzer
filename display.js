
        
            
             (function ( exports, Game ) {




    var SPEED_TO_FRAME_RATE = {

            4 : 400,
            5 : 300
    };


    function xGame ( o ) {

        this.xGame = new Game;
        this.start
       
    };


       
    
    document.onkeydown = function ( event ) {

    var code = event.keyCode;
     
    var direction =  function ( code ) { 

        var numberCode = {

            38 : 'up',
            40 : 'down',
            37 : 'left',
            39 : 'right',
                            
        };
       
        return numberCode[code] || null;

    }(code) 

   

   

    };
    
    
    exports.xGame = xGame;

 })( window, Game );
    