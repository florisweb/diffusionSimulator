


function _Simulation() {
	this.world = {
		size: new Vector(1000, 700),
		tileSize: 30,
		diffusionConstant: 5
	}

	this.tileGrid = new _Simulation_tileGrid(this.world, "random");

	this.types = {
		"none": {conductivity: 1},
		"wall": {conductivity: .01},
	}



	this.update = function(_dt) {
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
			if (_defaultValue == "random") 
			{
				
				if (Math.random() > .8) curObj.type = "wall";
				curObj.value = 1;// Math.random() * 10;
			

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


	return tileGrid;
} 