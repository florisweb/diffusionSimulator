
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


		ctx.fillStyle = "#aaa";
		ctx.fillText(
			"Velocity: " + Math.round(Simulation.object.velocity * 10) / 10 + " m/s",
			10, 20
		);
		ctx.fillText(
			"Air resistance: " + Math.round(Simulation.object.curAirResistance * 100) / 100 + " N?",
			10, 35
		);

	}


	this.drawTile = function(_x, _y, _object) {
		let canvasX = Simulation.world.tileSize * _x;
		let canvasY = Simulation.world.tileSize * _y;



		ctx.strokeStyle = "#aaa";
		

		if (_object.type == "none") 
		{
			ctx.fillStyle = valueToColor(_object.value); 
		} else {
			ctx.fillStyle = "#eee";
		}


		
		ctx.beginPath();
		ctx.rect(canvasX, canvasY, Simulation.world.tileSize, Simulation.world.tileSize);
		ctx.closePath();
		
		// ctx.stroke();
		ctx.fill();


		// ctx.fillStyle = "#aaa";
		// ctx.fillText(
		// 	Math.round(_object.value * 100) / 100, 
		// 	canvasX + Simulation.world.tileSize / 2 - 10, 
		// 	canvasY + Simulation.world.tileSize / 2 + 3
		// );
	}


	function valueToColor(_value) {
		return "rgb(" + _value * 51 + ", 0, 0)";
	}



}