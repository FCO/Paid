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
		switch(event.keyCode) {
			case 39:
				this.obj.increment(+5);
				break;
			case 37:
				this.obj.increment(-5);
				break;
			case 40:
				this.obj.increment(-100);
				break;
			case 38:
				this.obj.increment(+100);
				break;
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
			this.obj.swiping	= true;
			this.obj.startPositionX	= event.pageX;
			this.obj.lastPositionX	= event.pageX;
			this.obj.startPositionY	= event.pageY;
			this.obj.lastPositionY	= event.pageY;
			this.obj.origValue   	= this.obj.getValue();
		}, false);
		this.dom.addEventListener('touchmove', function(event) {
			event.preventDefault();
			event.stopPropagation();
			if(this.obj.swiping) {
				var totalDistanceX = event.pageX - this.obj.startPositionX;
				var totalDistanceY = this.obj.startPositionY - event.pageY;

				var value = this.obj.origValue;

				value += parseInt(totalDistanceX / 10) * 5;
				value += parseInt(totalDistanceY / 10) * 100;

				this.obj.setValue(value);

				this.obj.lastPositionX = event.pageX;
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
