(function ( exports, PubSub ) {

    var that;

    function Game ( ) {

        PubSub.call( this );

        this.storagePanzerAndBullets = [];
        this.numberLevel = 0;
        this.counter = 1;
        this.walls = [];
        this.panzer1;
        this.panzer2;
        this.process;
        that = this;

        
        this.subscribe( 'move', this.move.bind( this ) );
        this.subscribe( 'checkCounter', this.checkCounter.bind( this ) );
        this.subscribe( 'removePanzerDirection', this.removePanzerDirection.bind( this ) );
        
    };


    Game.prototype = Object.create( PubSub.prototype );
    Game.fn = Game.prototype;

    

    Game.fn.start = function (  ) {
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

        that.storagePanzerAndBullets.forEach( function ( item, i ) {
            Y = item.coord.y,
            X = item.coord.x;
            if ( item.name  === 'panzer' && that.counter % 2 !== 0 ) {
                i++/////
            } else {  
                if ( item.direction === 'up' && item.coord.y > 0 ) {
                    that.level[ that.numberLevel ][Y].splice( X, 1, '.' );
                    item.coord.y -= 1;
                    that.checkNextCell( item, i, { Y : Y, X : X} );
                } else {
                    if ( item.direction === 'down' && item.coord.y < 9 ) {
                        that.level[ that.numberLevel ][Y].splice( X, 1, '.' );
                        item.coord.y += 1;
                        that.checkNextCell( item, i, { Y : Y, X : X } );
                    } else {
                        if ( item.direction === 'left' && item.coord.x > 0 ) {
                            that.level[ that.numberLevel ][Y].splice( X, 1, '.' );
                            item.coord.x -= 1;
                            that.checkNextCell( item, i, { Y : Y, X : X } );
                        } else {
                            if ( item.direction === 'right' && item.coord.x < 9 ) {
                                that.level[ that.numberLevel ][Y].splice( X, 1, '.' );
                                item.coord.x += 1;
                                that.checkNextCell( item, i, { Y : Y, X : X } );
                            } else {
                                if ( item.name === 'bullet' && item.coord.y === 0 ||  item.name === 'bullet' && item.coord.y === 9 || 
                                     item.name === 'bullet' && item.coord.x === 0 ||  item.name === 'bullet' && item.coord.x === 9 ) {
                                        
                                        that.level[ that.numberLevel ][Y].splice( X, 1, '.' );
                                        that.storagePanzerAndBullets.splice( i, 1 );                                    
                                } else {
                                    if ( item.name === 'panzer' && item.coord.y === 0 ||  item.name === 'panzer' && item.coord.y === 9 ||
                                         item.name === 'panzer' && item.coord.x === 0 ||  item.name === 'panzer' && item.coord.x === 9  ) {

                                            return;
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
        this.publish( 'removePanzerDirection' )
    };

   
    Game.fn.createBullets = function ( o ) {
        var y = o.coord.y;
        var x = o.coord.x;
        var bullet;
    
        if ( o.directFire === 'up' && o.coord.y > 1 ) {

            bullet = new Bullet( { y : y -1, x : x },  o.directFire  );
            this.level[ this.numberLevel ][y-1].splice( o.coord.x, 1, bullet );
            this.storagePanzerAndBullets.push( bullet );
        } else {
            if ( o.directFire === 'down' && o.coord.y < 9 ) {

                bullet = new Bullet( { y : y +1, x : x },  o.directFire  );
                this.level[ this.numberLevel ][y+1].splice( o.coord.x, 1, bullet );
                this.storagePanzerAndBullets.push( bullet );
            } else {
                if ( o.directFire === 'left' && o.coord.x > 1 ) {

                    bullet = new Bullet( { y : y, x : x -1 },  o.directFire  );
                    this.level[ this.numberLevel ][y].splice( bullet.coord.x, 1, bullet );
                    this.storagePanzerAndBullets.push( bullet );
                } else {
                    if ( o.directFire === 'right' && o.coord.x < 9 ) {

                        bullet = new Bullet( { y : y, x : x +1 },  o.directFire  );
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
                this.level[ this.numberLevel ][y].splice( x, 1, o )
            } else {
                if ( nextCell.name === 'wall' && o.name === 'bullet' ) {
                    nextCell.count++;
                    this.storagePanzerAndBullets.splice( i, 1 );
                } else {
                    if ( nextCell.name === 'panzer' &&  o.name === 'bullet' ) {
                        nextCell.count++;
                        this.storagePanzerAndBullets.splice( i, 1 );
                    } else {
                        if ( nextCell.name === 'wall' && o.name === 'panzer' ) {
                            o.coord.y = oldCoord.Y;
                            o.coord.x = oldCoord.X;
                            this.level[ this.numberLevel ][ oldCoord.Y ].splice( oldCoord.X, 1, o );
                        } else {
                            if ( nextCell.name === 'panzer' && o.name === 'panzer' ) {
                                o.coord.y = oldCoord.Y;
                                o.coord.x = oldCoord.X;
                                this.level[ this.numberLevel ][ oldCoord.Y ].splice( oldCoord.X, 1, o );
                            };
                        };
                    };

                };
            };
    };


    Game.fn.checkCounter = function ( ) {
        var y,x;
        this.storagePanzerAndBullets.forEach( function ( item, i ) {

            if ( item.name === 'panzer' && item.count > 5 ) {
                that.publish( 'Game Over' );
            };

        }); 

        this.walls.forEach( function( item, i ) {
            y = item.coord.y;
            x = item.coord.x;
            if( item.name === 'wall' && item.count > 3   ) { 
                that.walls.splice( i, 1 );
                that.level[ that.numberLevel ][y].splice( x, 1, '.' );
            };
        });

    };

    Game.fn.removePanzerDirection = function ( ) {

        this.panzer1.direction = '';
        this.panzer2.direction = '';
    };
   

    Game.fn.level = [

        [ 

            ['.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','T1','|','.','.','.'],
            ['.','T2','.','.','.','.','|','.','.','.'],
            ['.','.','.','|','.','.','|','.','.','.'],
            ['.','.','.','|','.','.','|','.','.','.'],
            ['.','.','.','|','.','.','.','.','.','.'],
            ['.','.','.','|','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.'],
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

  
    function  Panzer ( o ) {
        this.name = 'panzer'
        this.count = 1;
        this.coord = o;
        this.direction;
        this.directFire;
       
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

    
    exports.Game = Game;

})( window, PubSub );
            


