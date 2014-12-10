function Pendulum(options) {
	this.options		= options;
	this.canvas			= document.createElement('canvas');
	this.fromColor		= this.parseColor(options.color1);
	this.toColor		= this.parseColor(options.color0);
	this.timeStep		= 0;
	this.context		= this.canvas.getContext('2d');
	this.diffR			= this.toColor.r - this.fromColor.r;
	this.diffG			= this.toColor.g - this.fromColor.g;
	this.diffB			= this.toColor.b - this.fromColor.b;
	this.clearFillStyle	= 'rgba(255,255,255,' + (this.options.fadeout) + ')';

	var height	= options.ballHeight + options.ballRadius * 4,
		width	= (options.ballRadius * 2 + 1) * options.numBalls +
				 options.ballRadius;

	var pixelRatio = window.devicePixelRatio || 1;
	this.canvas.width			= width * pixelRatio;
	this.canvas.height			= height * pixelRatio;
	this.canvas.style.width		= width;
	this.canvas.style.height	= height;

	this.context.strokeStyle = 'rgba(0, 0, 0, 0)';
	this.context.scale(pixelRatio, pixelRatio);

	this.play();

	var ieOption = 'dontDisplayHorrendousMessageBoxOnIE8EvenThoughItsAShitty' + 
		'BrowserNobodyShouldNeverEverUse';
	if (navigator.userAgent.match(/MSIE 8/i) && options[ieOption] !== true) {
		alert('Please consider upgrading your browser. It\'s really old.');
	}
}

Pendulum.prototype.play = function() {
	if (this.interval) return;

	this.tick();
	this.interval = setInterval(this.tick.bind(this), 16);
};

Pendulum.prototype.pause = function() {
	clearInterval(this.interval);
	this.interval = null;
};

Pendulum.prototype.clear = function(num) {
	this.context.fillStyle = 'rgba(255,255,255,1)';
	this.context.globalCompositeOperation = 'destination-out';
	this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Pendulum.prototype.step = function(num) {
	this.clear();
	this.timeStep = num;
	this.tick();
};

Pendulum.prototype.parseColor = function(color) {
	if (typeof color === 'number') {
		return {
			r: Math.floor(color / 256 / 256) % 256,
			g: Math.floor(color / 256) % 256,
			b: color % 256
		};
	} else {
		if (color.substr(0, 1) === '#') {
			color = color.substr(1);
		}
		return {
			r: parseInt(color.substr(0, 2), 16),
			g: parseInt(color.substr(2, 2), 16),
			b: parseInt(color.substr(4, 2), 16)
		};
	}
};

Pendulum.prototype.getCanvas = function() {
	return this.canvas;
};

Pendulum.prototype.getY = function (i, t) {
	return this.options.ballHeight/2 *
		   (1 + Math.sin((this.timeStep * (i/500 + 0.02)) % 2*Math.PI));
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
			Math.floor(this.fromColor.r + this.diffR * brightness) + ',' +
			Math.floor(this.fromColor.g + this.diffG * brightness) + ',' +
			Math.floor(this.fromColor.b + this.diffB * brightness) +
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
		color0		: '#000000',
		color1		: '#000000',
		fadeout		: 0.2
	};

	for (var key in options) defaults[key] = options[key];

	var pendulum = new Pendulum(defaults);
	return {
		canvas	: pendulum.getCanvas(),
		play	: pendulum.play.bind(pendulum),
		pause	: pendulum.pause.bind(pendulum),
		step	: pendulum.step.bind(pendulum)
	};
};
