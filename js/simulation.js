


function _Simulation() {
	this.world = {
		size: new Vector(800, 700),
		tileSize: 50
	}

	this.tileGrid = new _Simulation_tileGrid(this.world, .5);
}



function _Simulation_tileGrid(_world, _defaultValue) {
	let tileGrid = [];
	let xTiles = Math.ceil(_world.size.value[0] / _world.tileSize);
	let yTiles = Math.ceil(_world.size.value[1] / _world.tileSize);

	for (let x = 0; x < xTiles; x++) 
	{
		tileGrid[x] = []; 
		for (let y = 0; y < yTiles; y++) 
		{
			tileGrid[x][y] = _defaultValue * Math.random();
		}
	}

	return tileGrid;
} 