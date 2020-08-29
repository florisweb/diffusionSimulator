
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


	this.drawTile = function(_x, _y, _object) {
		let canvasX = Simulation.world.tileSize * _x;
		let canvasY = Simulation.world.tileSize * _y;



		ctx.strokeStyle = "#aaa";
		

		if (_object.type == "none") 
		{
			ctx.fillStyle = "rgba(255, 0, 0, " + (_object.value / 10) + ")";
		} else {
			ctx.fillStyle = "#555";
		}


		
		ctx.beginPath();
		ctx.rect(canvasX, canvasY, Simulation.world.tileSize, Simulation.world.tileSize);
		ctx.closePath();
		
		ctx.stroke();
		ctx.fill();


		ctx.fillStyle = "#000";
		ctx.fillText(
			Math.round(_object.value * 100) / 100, 
			canvasX + Simulation.world.tileSize / 2 - 10, 
			canvasY + Simulation.world.tileSize / 2 + 3
		);
	}



}