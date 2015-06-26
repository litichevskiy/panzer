
(function ( exports, Game, PubSub ) { 


	function GamePlay () {

		//PubSub.call(this)

		this.GAME  = new Game;
		this.PANZER = this.GAME.panzer;
		this._F = this.GAME.field.getField();
		this.FIELD = this._F[0];
	};

	document.onkeydown = function ( event ) {
		var target = event.keyCode;
		
		movePanzer.removeCoord( movePanzer.setDirection( target ) )

	};

	var fields = {

		field_    : this.FIELD,
		fieldLine : this.fieldLine,

		getElemField : function ( arg, arg1 ) {
			this.FIELD = arg;
			this.fieldLine = arg1;
		},

		removeCell : function ( coord,direction, panzer ) {

			if ( direction === 'up' ) {
				//var y = coord.y
				var x = coord.x -1 ;
				var u = this.FIELD[x][coord.y];//
				 console.log( typeof(this.FIELD[x][coord.y]) )  //var u1 = this.FIELD[coord.y][coord.x]				 
				if ( this.FIELD[x][coord.y] === '.' ||  typeof(this.FIELD[x][coord.y]) === 'object' ) {
					var i = this.fieldLine[coord.x][coord.y]//
					this.FIELD[coord.x][coord.y] = '.';
					this.fieldLine[coord.x][coord.y].classList.remove('panzer');
					panzer.coord = { x:x,y:coord.y }
					this.FIELD[x][coord.y] = panzer;
					this.fieldLine[x][coord.y].classList.add('panzer');
					// this.FIELD[coord.x].splice(x)
					return panzer;

				}

			}; 

				if ( direction === 'down' ) {
					//var y = coord.y
					var x = coord.x +1;
					var u = this.FIELD[x][coord.y];//
					if ( this.FIELD[x][coord.y] === '.' ||  typeof(this.FIELD[x][coord.y]) === 'object' ) {
						var i = this.fieldLine[coord.x][coord.y]//
						this.FIELD[coord.x][coord.y] = '.';
						this.fieldLine[coord.x][coord.y].classList.remove('panzer');
						panzer.coord = { x:x,y:coord.y }
						this.FIELD[x][coord.y] = panzer;
						this.fieldLine[x][coord.y].classList.add('panzer');
						return panzer;
					}


				}; 

						

								
			}
	

	}; 


		
		

	

	var movePanzer = {

		panzer : this.panzer,

		pushPanzer : function ( panzer ) {
			this.panzer = panzer;
		},

		removeCoord : function (  ) {

			var coord = this.panzer.coord;
			var direction = this.panzer.direction;
			fields.removeCell( coord, direction, this.panzer )
		},

		setDirection : function ( target ) {
			if ( target === 37 ) {
				this.panzer.direction = 'left'; 
			} else {
				if ( target === 38 ) {
					this.panzer.direction = 'up';
				} else {
					if ( target === 39 ) {
						this.panzer.direction = 'right';
					} else {
						if ( target === 40 ) {
							this.panzer.direction = 'down';
						}
					}
				}
			}

			 			
		},
	}

	GamePlay.fn = GamePlay.prototype;

	GamePlay.fn.start = function ( o ) {
		var line,
			row,
			cell,
			elem;
			line = [],
			p = [];
		for ( var y = 0; y < this.FIELD.length; y++ ) {
			line = [],
			p.push(line)	
			row = document.createElement('div');

			for ( var x = 0; x < 10; x++ ) {

				cell = document.createElement('span');
						elem = this.FIELD[y][x];

				if ( elem === 'w' ) {
					cell.classList.add('wall');
				}
				if ( elem === 'p' ){
					cell.classList.add('panzer');
					//cell.innerText = 0;
					 this.PANZER.coord.y = x;
					 this.PANZER.coord.x = y;
					 console.dir( this.FIELD )
					 this.FIELD[y][x] = this.PANZER;
					 movePanzer.pushPanzer( this.PANZER )
				}
				row.appendChild( cell );
				line.push( cell );
				//p.push()
			}

			o.htmlElement.appendChild( row );
			p.push()
			
		}
		fields.getElemField( this.FIELD, p );
	};




	exports.GamePlay = GamePlay;


})(window, Game, PubSub);
