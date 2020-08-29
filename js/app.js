
let Simulation;
let Renderer;
const App = new function() {

	this.setup = function() {
		Simulation 	= new _Simulation();
		Renderer 	= new _Renderer(renderCanvas);

		this.update();
	}


	this.update = function() {
		Renderer.draw(Simulation.tileGrid);

		requestAnimationFrame(App.update);
	}
}


App.setup();