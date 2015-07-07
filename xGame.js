         
(function ( exports, Game ) {


    var SPEED_TO_FRAME_RATE = {

            1 : 200,
            2 : 100
    };

    var that;

    function xGame ( o ) {

        this.xGame = new Game;
        this.start = this.xGame.start( );
        that = this;
        that.speed = 1;
        that.storageCell = [];
        this.field = new Field( {

            storageCell : that.storageCell,
            level : this.xGame.level[ this.xGame.numberLevel ],
            containerField : document.getElementById('field')

        } );

        this.xGame.subscribe( 'Game Over', this.game_over );

        that.process = setInterval( function( ) {

            that.removeClass( that.xGame.level[ that.xGame.numberLevel ], that.storageCell );   
            that.xGame.move(  )
            that.addClass( that.xGame.level[ that.xGame.numberLevel ], that.storageCell );

        }, SPEED_TO_FRAME_RATE[ that.speed ] );
            

    };


    xGame.fn = xGame.prototype;


    xGame.fn.removeClass = function ( level, storageCell ) {
        var elemGame;

        for ( var y = 0; y < level.length; y++ ) {

            for ( var x = 0; x < level.length; x++ ) {
                elemGame = level[y][x];
                if ( typeof elemGame === 'object' && elemGame.name === 'wall') {
                    that.storageCell[y][x].classList.remove('wall')
                } else {
                    if ( typeof elemGame === 'object' && elemGame.name === 'panzer') {
                        that.storageCell[y][x].classList.remove('panzer')
                    } else {
                        if ( typeof elemGame === 'object' && elemGame.name === 'bullet') {
                            that.storageCell[y][x].classList.remove('bullet')
                        };
                    };
                };
                   
            };
        };
       
    };


    xGame.fn.addClass = function ( level, storageCell ) {
        var elemGame;

        for ( var y = 0; y < level.length; y++ ) {

            for ( var x = 0; x < level.length; x++ ) {
                elemGame = level[y][x];
                if ( typeof elemGame === 'object' && elemGame.name === 'wall') {
                    that.storageCell[y][x].classList.add('wall');
                } else {
                    if ( typeof elemGame === 'object' && elemGame.name === 'panzer') {
                        that.storageCell[y][x].classList.add('panzer');
                    } else {
                        if ( typeof elemGame === 'object' && elemGame.name === 'bullet') {
                            that.storageCell[y][x].classList.add('bullet');
                        };
                    };
                };
                   
            };
        };
       
    };   

    xGame.fn.game_over = function ( ) {

        clearInterval( that.process ); 
        alert( 'Game Over' );
    };

     
    document.onkeydown = function ( event ) {

        var code = event.keyCode;
        
            var moveAndGun = {

                38  : (function ( ) { this.panzer1.direction = 'up'    , this.panzer1.directFire = 'up'    }), 
                40  : (function ( ) { this.panzer1.direction = 'down'  , this.panzer1.directFire = 'down'  }),
                37  : (function ( ) { this.panzer1.direction = 'left'  , this.panzer1.directFire = 'left'  }),
                39  : (function ( ) { this.panzer1.direction = 'right' , this.panzer1.directFire = 'right' }),
                87  : (function ( ) { this.panzer2.direction = 'up'    , this.panzer2.directFire = 'up'    }),
                83  : (function ( ) { this.panzer2.direction = 'down'  , this.panzer2.directFire = 'down'  }),
                65  : (function ( ) { this.panzer2.direction = 'left'  , this.panzer2.directFire = 'left'  }),
                68  : (function ( ) { this.panzer2.direction = 'right' , this.panzer2.directFire = 'right' }),


                27  : (function ( ) { return this.createBullets( this.panzer2 ) }),
                17  : (function ( ) { return this.createBullets( this.panzer1 ) }),
 
                get : function( code ) { return moveAndGun[code] || null }
                
            };
    
            var nextActions = moveAndGun.get( code );

            if ( nextActions === null ) { return };

            nextActions.call( that.xGame );
    };


    function Field ( o ) {

        var containerField = o.containerField,
            storageCell = o.storageCell,
            line,
            cell,
            row;    

        for ( var y = 0; y < o.level.length; ++y ) {
            row = document.createElement('li');
            line = [];

            for( var x = 0; x < o.level.length; ++x ) {

                cell = document.createElement('span');
                row.appendChild( cell );
                line.push( cell );
            };
            
            containerField.appendChild( row );
            storageCell.push( line );
        };
 
    };
    
    
    exports.xGame = xGame;

 })( window, Game );
    