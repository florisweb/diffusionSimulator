


function _Simulation() {
	this.world = {
		size: new Vector(600, 480),
		tileSize: 30,
		diffusionConstant: 5
	}

	this.tileGrid = new _Simulation_tileGrid(this.world, 1);

	this.types = {
		"none": {conductivity: 1},
		"wall": {conductivity: 0},
	}



	this.object = new function() {
		// this.shape = [
		// 	new Vector(0, 0),
		// 	new Vector(1, 1),
		// 	new Vector(2, 2),

		// 	new Vector(0, 1),
		// 	new Vector(0, 2),

		// 	new Vector(0, 3),
		// 	new Vector(1, 2),
		// 	new Vector(1, 3),
		// 	new Vector(0, 4),
		// ];

		this.shape = [
			new Vector(1, 0),
			new Vector(2, 1),

			new Vector(0, 0),
			new Vector(0, 1),

			new Vector(0, 2),
			new Vector(1, 1),
			new Vector(1, 2),
		];




		// this.shape = [
		// 	new Vector(1, 0),
		// 	new Vector(2, 0),
		// 	new Vector(1, 9),
		// 	new Vector(2, 9)
		// ];
		// for (let i = 0; i < 10; i++) this.shape.push(new Vector(0, i));



		this.ySlices = createSliceArray(this.shape);



		this.position = new Vector(12, Math.floor(16 / 2 - this.ySlices.length / 2));



		this.velocity = 0;
		this.mass = this.shape.length;


		let framesSinceLastMove = 0;

		this.curAirResistance = 0;
		this.update = function(_dt) {
			this.curAirResistance = this.calcAirResistance();
			let fres = 9.81 * this.mass - this.curAirResistance;

			this.velocity += fres / this.mass * _dt;

			if (this.velocity < 0) this.velocity = 0;

			let framesPerTile = 60 / this.velocity;

			framesSinceLastMove++;

			if (framesSinceLastMove < framesPerTile) return;

			let tileMoves = Math.floor(framesSinceLastMove / framesPerTile);
			if (tileMoves == 0) return;
			
			framesSinceLastMove -= framesPerTile * tileMoves;

			this.move(tileMoves);
		}




		this.move = function(_dx) {
			Simulation.tileGrid.shiftXAxis(_dx);
			

			for (tile of this.shape)
			{
				let position = this.position.copy().add(tile);
				Simulation.tileGrid[position.value[0]][position.value[1]].type = "none";
			}

			for (tile of this.shape)
			{
				let position = this.position.copy().add(tile);

				Simulation.tileGrid[position.value[0] + _dx][position.value[1]].type = "wall";
				Simulation.tileGrid[position.value[0] + _dx + 1][position.value[1]].value += Simulation.tileGrid[position.value[0] + _dx][position.value[1]].value;
				Simulation.tileGrid[position.value[0] + _dx][position.value[1]].value = 0;
			}
		}



		this.calcAirResistance = function() {
			let pressureDifference = 0;
			for (let y = 0; y < this.ySlices.length; y++)
			{
				let dPressure = Simulation.tileGrid[this.position.value[0] + this.ySlices[y][1] + 2][this.position.value[1] + y].value - 
								Simulation.tileGrid[this.position.value[0] + this.ySlices[y][0] - 1][this.position.value[1] + y].value;

				pressureDifference += dPressure;
			}

			return pressureDifference;
		}



		function createSliceArray(_shape) {
			let ySlices = [];
			for (let s = 0; s < _shape.length; s++)
			{
				let xIndex = _shape[s].value[0];
				let yIndex = _shape[s].value[1];
				
				if (!ySlices[yIndex]) ySlices[yIndex] = [Infinity, -Infinity];
			
				if (xIndex < ySlices[yIndex][0]) ySlices[yIndex][0] = xIndex;
				if (xIndex > ySlices[yIndex][1]) ySlices[yIndex][1] = xIndex;
			}

			return ySlices;
		}

	}








	this.update = function(_dt) {
		Simulation.object.update(_dt);


		let deltaGrid = new _Simulation_tileGrid(this.world, 0);

		for (let x = 0; x < this.tileGrid.width; x++) 
		{
			for (let y = 0; y < this.tileGrid.height; y++) 
			{
				let neighbours = this.tileGrid.getNeighboursByCoord(x, y);

				for (let n = 0; n < neighbours.length; n++)
				{
					deltaGrid[x][y].value += diffusionFormula(this.tileGrid[x][y], neighbours[n], _dt);
				}
			}
		}

		this.tileGrid.addGrid(deltaGrid);
	}



	function diffusionFormula(_self, _other, _dt) {
		let dT = _other.value - _self.value;
		let conductivity = Simulation.types[_self.type].conductivity * Simulation.types[_other.type].conductivity;


		return Simulation.world.diffusionConstant * dT * conductivity * _dt;
	}

}












function _Simulation_tileGrid(_world, _defaultValue) {
	let tileGrid = [];
	tileGrid.width = Math.ceil(_world.size.value[0] / _world.tileSize);
	tileGrid.height = Math.ceil(_world.size.value[1] / _world.tileSize);

	for (let x = 0; x < tileGrid.width; x++) 
	{
		tileGrid[x] = []; 
		for (let y = 0; y < tileGrid.height; y++) 
		{
			let curObj = {
				type: "none",
				value: _defaultValue
			}
			tileGrid[x][y] = curObj;
		}
	}


	tileGrid.getNeighboursByCoord = function(x, y) {
		let neighbours = [];

		if (x - 1 >= 0) neighbours.push(this[x - 1][y]);
		if (x + 1 < this.width) neighbours.push(this[x + 1][y]);
		if (y - 1 >= 0) neighbours.push(this[x][y - 1]);
		if (y + 1 < this.height) neighbours.push(this[x][y + 1]);


		// for (let dx = -1; dx < 2; dx++) 
		// {
		// 	for (let dy = -1; dy < 2; dy++) 
		// 	{
		// 		if (dx == 0 && dy == 0) continue;
		// 		if (x + dx < 0 || x + dx > this.width - 1) continue;
		// 		if (y + dy < 0 || y + dy > this.height - 1) continue;

		// 		neighbours.push(this[x + dx][y + dy]);
		// 	}
		// }

		return neighbours;
	}

	tileGrid.addGrid = function(_grid) {
		for (let x = 0; x < this.width; x++) 
		{
			for (let y = 0; y < this.height; y++) this[x][y].value += _grid[x][y].value;
		}
	}


	tileGrid.getAverageValue = function() {
		let sum = 0;
		for (let x = 0; x < this.width; x++) 
		{
			for (let y = 0; y < this.height; y++) sum += this[x][y].value;
		}

		return sum / this.width / this.height;
	}


	tileGrid.shiftXAxis = function(_dx) {
		let direction = _dx > 0 ? 1 : -1;
		for (let i = 0; i < Math.abs(_dx); i++) shift1XTile(direction)
	}


	function shift1XTile(_direction) {
		let newRow = [];

		for (let y = 0; y < tileGrid.height; y++) 
		{
			let curObj = {
				type: "none",
				value: _defaultValue
			}
			newRow[y] = curObj;
		}


		if (_direction > 0) 
		{
			tileGrid.shift();
			tileGrid.push(newRow);
			return;
		}
		tileGrid.splice(0, 0, newRow);
		tileGrid.splice(tileGrid.width - 1, 1);
	}


	return tileGrid;
} 