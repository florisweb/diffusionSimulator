
function _Renderer(_canvas) {
	let Canvas 	= _canvas;
	let ctx 	= Canvas.getContext("2d");


	this.clear = function() {
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
	}

	this.draw = function(_tileGrid) {
		this.clear();
		
		for (let x = 0; x < _tileGrid.length; x++) 
		{
			for (let y = 0; y < _tileGrid[x].length; y++) 
			{
				this.drawTile(x, y, _tileGrid[x][y]);
			}
		}
	}


	this.drawTile = function(_x, _y, _value) {
		let canvasX = Simulation.world.tileSize * _x;
		let canvasY = Simulation.world.tileSize * _y;

		ctx.strokeStyle = "#aaa";
		ctx.fillStyle = "rgba(255, 0, 0, " + (_value / 10) + ")";
		
		ctx.beginPath();
		ctx.rect(canvasX, canvasY, Simulation.world.tileSize, Simulation.world.tileSize);
		ctx.closePath();
		
		ctx.stroke();
		ctx.fill();
	}



}