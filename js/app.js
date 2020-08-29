
let Simulation;
let Renderer;
const App = new function() {

	this.setup = function() {
		Simulation 	= new _Simulation();
		Renderer 	= new _Renderer(renderCanvas);

		Simulation.tileGrid[13][10].value = 500;
		this.update();
	}


	let lastFrame = new Date();
	this.update = function() {
		let dt = (new Date() - lastFrame) / 1000;;
		Simulation.update(dt);
		Renderer.draw(Simulation.tileGrid);

		
		lastFrame = new Date();
		requestAnimationFrame(App.update);
	}
}


App.setup();