function Money(dom, touch, defaults) {
	for(var attr in defaults)
		this[attr] = defaults[attr];
	this.dom = dom;
	dom.obj = this;
	dom.type = "tel";
	dom.onkeyup  = function(){this.obj.update()};
	dom.onchange = function(){this.obj.update()};
	this.setValue(this.getValue());
	if(touch || touch !== null)
		this.registerTouchEvents();
	dom.onkeydown = function(event) {
		var arrows = false;
		switch(event.keyCode) {
			case 39:
				this.obj.increment(this.obj.cents2increment);
				arrows = true;
				break;
			case 37:
				this.obj.increment(-this.obj.cents2increment);
				arrows = true;
				break;
			case 40:
				this.obj.increment(-100);
				arrows = true;
				break;
			case 38:
				this.obj.increment(+100);
				arrows = true;
				break;
		}
		if(arrows) {
			if(this.obj.isTimedOut(this.obj.interval2decrease)) {
				this.obj.cents2increment = 1;
			} else if(!this.obj.isTimedOut(this.obj.interval2increase)) {
				this.obj.cents2increment = 5;
			}
			this.obj.setTime();
		}
	};
}

Money.list = [];

Money.use = function(touch, defaults) {
	var inputs = document.querySelectorAll("input[type=money]");
	if(inputs) {
		for(var i = 0; i < inputs.length; i++) {
			var tmp = new Money(inputs[i], true);
			Money.list.push(tmp);
		}
	}
};

Money.prototype = {
	prefix:			"R$",
	fractionalDivisor:	",",
	interval:		5,
	cents2increment:	5,
	interval2decrease:	300,
	interval2increase:	200,

	setTime:	function() {
		this.lastMove = new Date().getTime()
	},
	isTimedOut:	function(time) {
		if(!this.lastMove) return true;
		now = new Date().getTime()
		return this.lastMove + time < now;
	},
	toInt:		function(val) {
		return parseInt(val.replace(/\D+/g, ""));
	},
	toString:	function(val) {
		val = "" + val;
		var zeros = 3 - val.length;
		for(var i = 0; i < zeros; i++) {
			val = "0" + val;
		}
		return this.prefix + val.replace(/\d{1,2}$/, function(data){return "," + data});
	},
	getValue:	function(val) {
		return this.toInt(this.dom.value);
	},
	setValue:	function(val) {
		if(val < 0) val = 0;
		this.value = this.toString(val);
		this.dom.value = this.value;
	},
	update:		function() {
		this.setValue(this.getValue());
	},

	increment:	function(value) {
		this.setValue(this.getValue() + value);
	},

	registerTouchEvents:	function() {
		this.dom.addEventListener('touchstart', function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.obj.cents2increment	= 5;
			this.obj.swiping		= true;
			this.obj.startPositionX		= event.pageX;
			this.obj.lastPositionX		= event.pageX;
			this.obj.startPositionY		= event.pageY;
			this.obj.lastPositionY		= event.pageY;
			this.obj.origValue   		= this.obj.getValue();
			//this.setTime();
		}, false);
		this.dom.addEventListener('touchmove', function(event) {
			event.preventDefault();
			event.stopPropagation();
			if(this.obj.swiping) {
				var totalDistanceX = event.pageX - this.obj.startPositionX;
				var totalDistanceY = event.pageY - this.obj.startPositionY;

				var value = this.obj.origValue;

				value += parseInt(totalDistanceX / 10) * this.obj.cents2increment;
				value += parseInt(totalDistanceY / 10) * 100;

				this.obj.setValue(value);

				if(Math.abs(event.pageX - this.obj.lastPositionX) > 15) {
					if(this.obj.isTimedOut(this.obj.interval2decrease)) {
						this.obj.cents2increment = 1;
					} else if(!this.obj.isTimedOut(this.obj.interval2increase)) {
						this.obj.cents2increment = 5;
					}
					this.obj.setTime();
					this.obj.lastPositionX = event.pageX;
				}
				this.obj.lastPositionY = event.pageY;
			}
		},false);
		this.dom.addEventListener('touchend', function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.obj.swiping	= false;
			this.obj.startPositionX	= null;
			this.obj.lastPositionX	= null;
			this.obj.startPositionY	= null;
			this.obj.lastPositionY	= null;
		},false);
	}
};
