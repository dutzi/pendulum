!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Pendulum=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function Pendulum(options) {
	var ieOption = 'dontDisplayHorrendousMessageBoxOnIE8EvenThoughItsAShitty' + 
		'BrowserNobodyShouldNeverEverUse';
	if (navigator.userAgent.match(/MSIE 8/i) && options[ieOption] !== true) {
		alert('Please consider upgrading your browser. It\'s really old.');
	}

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
	this.canvas.style.width		= width + 'px';
	this.canvas.style.height	= height + 'px';

	this.context.strokeStyle = 'rgba(0, 0, 0, 0)';
	this.context.scale(pixelRatio, pixelRatio);

	this.play();
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

},{}]},{},[1])(1)
});