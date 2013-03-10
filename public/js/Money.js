function Money(dom, touch) {
	this.dom = dom;
	dom.obj = this;
	dom.type = "tel";
	dom.onkeyup  = function(){this.obj.update()};
	dom.onchange = function(){this.obj.update()};
	this.setValue(this.getValue());
	if(touch || touch !== null)
		this.registerTouchEvents();
	dom.onkeydown = function(event) {
		if(event.keyCode == 39) return this.obj.increment(+5);
		if(event.keyCode == 37) return this.obj.increment(-5);
		if(event.keyCode == 40) return this.obj.increment(-100);
		if(event.keyCode == 38) return this.obj.increment(+100);
	};
}

Money.list = [];

Money.use = function() {
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
			this.obj.startPosition	= event.pageY;
			this.obj.lastPosition	= event.pageY;
			this.obj.origValue   	= this.obj.getValue();
		}, false);
		this.dom.addEventListener('touchmove', function(event) {
			event.preventDefault();
			event.stopPropagation();
			if(this.obj.swiping) {
				var distance = this.obj.lastPosition - event.pageY;
				distance *= distance < 0 ? -1 : 1;
				if(distance >= this.obj.interval) {
					var totalDistance = this.obj.startPosition - event.pageY;
					this.obj.setValue(this.obj.origValue + (parseInt(totalDistance / 10) * 5));
					this.obj.lastPosition = event.pageY;
				}
			}
		},false);
		this.dom.addEventListener('touchend', function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.obj.swiping	= false;
			this.obj.startPosition	= null;
			this.obj.lastPosition	= null;
		},false);
	}
};
