There are three things in life that people like to stare at: a flowing stream, a crackling fire and a swinging pendulum.

The chaotic-yet-patterny effect created by attaching 20 pendulums together is now available for you to embed using a single line of code!

[Demo here](//dutzi.github.io/pendulum)

> * Highly customizable!

> * Very modern!

> * Pretty and nice!

Pendulum is a pretty customizable pendulum-based spinner.

#### Installing

```
npm install pendulumjs
```

Or download the [minified package](https://github.com/dutzi/pendulum/blob/master/dist/pendulum.min.js) and insert a &lt;script&gt; tag that points to it.

#### Usage

```javascript
pendulum = new Pendulum({
    numBalls    : 40,           // # balls (>0)
    ballHeight  : 40,           // Canvas height (>0)
    ballRadius  : 5,            // Ball's radius (>0)
    color0      : '#FFFFFF',    // Ball's color when far from center (string)
    color1      : '#000000',    // Ball's color when close to center (string)
    fadeout     : 1.0           // Ball's fadeout speed (0.0 - 1.0)
});
document.querySelector('body').appendChild(pendulum.canvas);
```

##### Methods

* `play()` - Start animation
* `pause()` - Pause animation
* `step(num)` - Go to frame # num

#### Credits

Based on a a [post I saw on reddit](http://www.reddit.com/r/gifs/comments/2on8si/connecting_to_server_so_mesmerizing/) (specifically, on [this guy's comment](http://www.reddit.com/r/gifs/comments/2on8si/connecting_to_server_so_mesmerizing/cmow0sz))

#### Support

Pendulum doesn't and will never ever support IE8. In fact, when running on IE8, Pendulum will display a message box asking the user to upgrade his browser. (This can be controlled by setting the `dontDisplayHorrendousMessageBoxOnIE8EvenThoughItsAShittyBrowserNobodyShouldNeverEverUse` to true.)
