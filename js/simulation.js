


function _Simulation() {
	this.world = {
		size: new Vector(600, 400),
		tileSize: 50,
		diffusionConstant: 5
	}

	this.tileGrid = new _Simulation_tileGrid(this.world, "random");



	this.update = function(_dt) {
		let deltaGrid = new _Simulation_tileGrid(this.world, 0);

		for (let x = 0; x < this.tileGrid.width; x++) 
		{
			for (let y = 0; y < this.tileGrid.height; y++) 
			{
				if (this.tileGrid[x][y].type != "none") continue;

				let ownValue = this.tileGrid[x][y].value;
				let neighbours = this.tileGrid.getNeighboursByCoord(x, y);

				for (let n = 0; n < neighbours.length; n++)
				{
					if (neighbours[n].type != "none") continue;
					deltaGrid[x][y].value += diffusionFormula(ownValue, neighbours[n].value, _dt);
				}
			}
		}

		this.tileGrid.addGrid(deltaGrid);
	}



	function diffusionFormula(_ownValue, _otherValue, _dt) {
		return Simulation.world.diffusionConstant * (_otherValue - _ownValue) * _dt;
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
				
				if (Math.random() > .7) curObj.type = "wall";
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


	return tileGrid;
} 