(function ( exports, PubSub ) {

    
    function Game ( ) {

        PubSub.call( this );

        this.storagePanzerAndBullets = [];
        this.numberLevel = 0;
        this.counter = 1;
        this.walls = [];
        this.panzer1;
        this.panzer2;
        this.process////////
     

        this.subscribe( 'move', this.move );
        this.subscribe( 'checkCounter', this.checkCounter );
        this.subscribe( 'gameOver', this.game_over );
        
    };


    Game.prototype = Object.create( PubSub.prototype );
    Game.fn = Game.prototype;

    

    Game.fn.start = function ( o ) {
        var elementGame;

        for ( var y = 0; y < this.level[ this.numberLevel ].length; y++ ) {

            for ( var x = 0; x < this.level[ this.numberLevel ].length; x++ ) {

                elementGame = this.level[ this.numberLevel ][y][x];

                if ( elementGame === '|' ) {

                    elementGame = new Wall ( { y : y, x : x } );
                    this.walls.push( elementGame );
                    this.level[ this.numberLevel ][y].splice( x, 1, elementGame );

                };

                if ( elementGame === 'T1' ) {

                    this.panzer1 = new Panzer( { y : y, x : x } );
                    this.level[ this.numberLevel ][y].splice( x, 1,  this.panzer1 );
                    this.storagePanzerAndBullets.push( this.panzer1 );
                };

                if (  elementGame === 'T2' ) {

                    this.panzer2 = new Panzer( { y : y, x : x } );
                    this.level[ this.numberLevel ][y].splice( x, 1,  this.panzer2 );
                    this.storagePanzerAndBullets.push( this.panzer2 );
                };
                

            };
        };
        this.publish( 'move' );  

    };


    Game.fn.move = function (  ) {
        var Y,X;

        this.storagePanzerAndBullets.forEach( function ( item, i ) {
            Y = item.coord.y,
            X = item.coord.x;
            if ( item.name  === 'panzer' && this.counter % 2 !== 0 ) {
                i++/////
            } else {  
                if ( item.direction === 'up' && item.coord.y > 0 ) {
                    this.level[ this.numberLevel ][Y].splice( X, 1, '.' );
                    item.coord.y -= 1;
                    this.checkNextCell( item, i, { Y : Y, X : X} );
                } else {
                    if ( item.direction === 'down' && item.coord.y < 9 ) {
                        this.level[ this.numberLevel ][Y].splice( X, 1, '.' );
                        item.coord.y += 1;
                        this.checkNextCell( item, i, { Y : Y, X : X } );
                    } else {
                        if ( item.direction === 'left' && item.coord.x > 0 ) {
                            this.level[ this.numberLevel ][Y].splice( X, 1, '.' );
                            item.coord.x -= 1;
                            this.checkNextCell( item, i, { Y : Y, X : X } );
                        } else {
                            if ( item.direction === 'right' && item.coord.x < 9 ) {
                                this.level[ this.numberLevel ][Y].splice( X, 1, '.' );
                                item.coord.x += 1;
                                this.checkNextCell( item, i, { Y : Y, X : X } );
                            } else {
                                if ( item.name === 'panzer' && item.coord.y === 0 || item.coord.x === 0 || item.coord.y === 9 || item.coord.x === 9 ) {
                                    return;
                                } else {
                                    if ( item.name === 'bullet' && item.coord.y === 0 || item.coord.x === 0 || item.coord.y === 9 || item.coord.x === 9 ) {
                                        this.level[ this.numberLevel ][Y].splice( X, 1, '.' );
                                        this.storagePanzerAndBullets.splice( i, 1 );
                                    };
                                };
                            };
                        };
                    };
                };
               
            };

        });
        this.counter++
        this.publish( 'checkCounter' );  
    };

   
    Game.fn.createBullets = function ( o ) {
        var y = o.coord.y;
        var x = o.coord.x;
        var bullet;

        if ( o.direction === 'up' && o.coord.y > 1 ) {

            bullet = new Bullet( { y : y -1, x : x },  o.direction  );
            this.level[ this.numberLevel ][y-1].splice( o.coord.x, 1, bullet );
            this.storagePanzerAndBullets.push( bullet );
        } else {
            if ( o.direction === 'down' && o.coord.y < 9 ) {

                bullet = new Bullet( { y : y +1, x : x },  o.direction  );
                this.level[ this.numberLevel ][y+1].splice( o.coord.x, 1, bullet );
                this.storagePanzerAndBullets.push( bullet );
            } else {
                if ( o.direction === 'left' && o.coord.x > 1 ) {

                    bullet = new Bullet( { y : y, x : x -1 },  o.direction  );
                    this.level[ this.numberLevel ][y].splice( bullet.coord.x, 1, bullet );
                    this.storagePanzerAndBullets.push( bullet );
                } else {
                    if ( o.direction === 'right' && o.coord.x < 9 ) {

                        bullet = new Bullet( { y : y, x : x +1 },  o.direction  );
                        this.level[ this.numberLevel ][y].splice( bullet.coord.x, 1, bullet );
                        this.storagePanzerAndBullets.push( bullet );
                    };
                };
            };
        };   
  
    };


    Game.fn.checkNextCell = function ( o, i, oldCoord ) { 
        var y = o.coord.y,
            x = o.coord.x,
            nextCell = this.level[ this.numberLevel ][y][x];

            if ( nextCell === '.' ) {
                this.level[ this.numberLevel ][y].splice( x, 1, o );
            } else {
                if ( nextCell.name === 'wall' && o.name === 'bullet' ) {
                    nextCell.count++;
                    this.storagePanzerAndBullets.splice( i, 1 );//проверть удаление
                } else {
                    if ( nextCell.name === 'panzer' &&  o.name === 'bullet' ) {
                        nextCell.count++;
                        this.storagePanzerAndBullets.splice( i, 1 );//проверть удаление
                    } else {
                        if ( nextCell.name === 'wall' && o.name === 'panzer' ) {
                            o.coord.y = oldCoord.Y;
                            o.coord.x = oldCoord.X;
                        } else {
                            if ( nextCell.name === 'panzer' && o.name === 'panzer' ) {
                                o.coord.y = oldCoord.Y;
                                o.coord.x = oldCoord.X;
                            };
                        };
                    };

                };
            };
    };

    Game.fn.checkCounter = function ( ) {
        var y,x;
        this.storagePanzerAndBullets.forEach( function ( item, i ) {

            y = item.coord.y;
            x = item.coord.x;
            if( item.name === 'wall' && item.count > 3   ) { 
                this.storagePanzerAndBullets.splice( i, 1 );
                this.level[ this.numberLevel ][y].splice( x, 1, '.' );
            };
            if ( item.name === 'panzer' && item.count > 5 ) {
                this.publish( 'gameOver' );
            };

        }); 

    };
   

    Game.fn.game_over = function ( ) {

        clearInterval( this.process ); ///
        alert( 'Game Over' );
    };


    Game.fn.level = [

        [ 

            ['.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','|','.','.','.'],
            ['.','.','.','.','.','.','|','.','.','.'],
            ['.','.','.','|','.','.','|','.','.','.'],
            ['.','.','.','|','.','.','|','|','.','.'],
            ['.','.','.','|','.','.','.','.','.','.'],
            ['.','.','|','|','.','.','.','.','.','.'],
            ['.','T1','.','.','.','.','.','T2','.','.'],
            ['.','.','.','.','.','.','.','.','.','.'],

        ],

        [ 

            ['.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','T2','.','.','.','.'],
            ['.','.','.','.','.','.','|','.','.','.'],
            ['.','.','.','.','.','.','|','.','.','.'],
            ['.','.','.','.','.','.','|','.','.','.'],
            ['.','.','|','.','.','.','.','.','.','.'],
            ['.','.','|','.','.','.','.','.','.','.'],
            ['.','.','|','.','.','.','.','.','.','.'],
            ['.','.','.','T1','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.'],

        ],        
        
    ];

    
    // setInterval( function(){
    //     game.move();
    // },2000 );
    
  
    function  Panzer ( o ) {
        this.name = 'panzer'
        this.count = 1;
        this.coord = o;
        this.direction = 'up';
    
    };


    function Wall ( o ) {
        this.name = 'wall'
        this.coord = o;
        this.count = 1;
    };


    function Bullet ( coord, direction ) {
        this.name = 'bullet'
        this.direction = direction;
        this.coord = coord;
    };

    
    document.onkeydown = function ( event ) {
        var code = event.keyCode;

        if ( code === 13 ) { return this.createBullets( this.panzer1 ) };
        if ( code === 27 ) { return this.createBullets( this.panzer2 ) };
    };
   
    
    



    exports.Game = Game;

})( window, PubSub );
            


