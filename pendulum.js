function Pendulum(options) {
	this.options		= options;
	this.canvas			= document.createElement('canvas');
	this.fromColor		= this.parseColor(options.color2);
	this.toColor		= this.parseColor(options.color1);
	this.timeStep		= 0;
	this.context		= this.canvas.getContext('2d');
	this.diffR			= this.toColor.r - this.fromColor.r;
	this.diffG			= this.toColor.g - this.fromColor.g;
	this.diffB			= this.toColor.b - this.fromColor.b;
	this.clearFillStyle	= 'rgba(255,255,255,' + (this.options.fadeout) + ')';

	this.canvas.height	= options.ballHeight + options.ballRadius * 4;
	this.canvas.width	= (options.ballRadius * 2 + 1) * options.numBalls +
						  options.ballRadius;

	this.context.strokeStyle = 'rgba(0,0,0,0)';

	this.play();
}

Pendulum.prototype.play = function() {
	this.interval = setInterval(this.tick.bind(this), 16);
};

Pendulum.prototype.pause = function() {
	clearInterval(this.interval);
};

Pendulum.prototype.parseColor = function(hexColor) {
	if (hexColor.substr(0, 1) === '#') {
		hexColor = hexColor.substr(1);
	}
	return {
		r: parseInt(hexColor.substr(0, 2), 16),
		g: parseInt(hexColor.substr(2, 2), 16),
		b: parseInt(hexColor.substr(4, 2), 16)
	};
};

Pendulum.prototype.getCanvas = function() {
	return this.canvas;
};

Pendulum.prototype.getY = function (i, t) {
	return this.options.ballHeight/2 *
		   (1 + Math.sin((this.timeStep * (i/500 + 0.01)) % 2*Math.PI));
};

Pendulum.prototype.tick = function () {

	// Clear previous frame

	this.context.fillStyle = this.clearFillStyle;
	this.context.globalCompositeOperation = 'destination-out';
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

	// Paint next frame

	this.context.globalCompositeOperation = 'source-over';

	for (var i = 0; i < this.options.numBalls; i++ ) {

		var y = this.getY(i, this.timeStep);
		var brightness = Math.abs(y - this.options.ballHeight / 2) /
			(this.options.ballHeight / 2);

		this.context.fillStyle = 'rgb(' + 
			Math.trunc(this.fromColor.r + this.diffR * brightness) + ',' +
			Math.trunc(this.fromColor.g + this.diffG * brightness) + ',' +
			Math.trunc(this.fromColor.b + this.diffB * brightness) +
		')';

		this.context.beginPath();
		this.context.arc(
			(this.options.ballRadius * 2 + 1) * i + this.options.ballRadius * 2,
			this.options.ballRadius * 2 + y, 
			this.options.ballRadius, 0, Math.PI * 2, false
		);
		this.context.fill();
	}

	this.timeStep++;
};

module.exports = function (options) {
	var defaults = {
		numBalls	: 40,
		ballHeight	: 40,
		ballRadius	: 2,
		color1		: '#000000',
		color2		: '#000000',
		fadeout		: 0.2
	};

	for (var key in options) defaults[key] = options[key];

	var pendulum = new Pendulum(defaults);

	return {
		canvas	: pendulum.getCanvas(),
		pause	: pendulum.pause(),
		play	: pendulum.play()
	};
};
