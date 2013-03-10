function Value(obj) {
	this.dom = obj;
	obj.get(0).valueObj = this;
	obj.keyup(this.onKeyUp);
	obj.hide();
}
Value.getIntValue = function(value) {
	return parseInt(value.replace(/\D/, ""));
};
Value.prototype = {
	swiping:	false,
	startPosition:	null,
	lastPosition:	null,
	toInt:		function() {
		return parseInt(this.dom.val().replace(/\D/, ""));
	},
	prepareValue:	function(val) {
		val = parseInt(val);
		val = "" + val;
		if(parseInt(val) <= 0)
			val = "0";
		var zeros = 3 - val.length;
		for(var i = 0; i < zeros; i++) {
			val = "0" + val;
		}
		return val.replace(/\d{1,2}$/, function(data){return "," + data});
	},
	setValue:	function(val) {
		this.dom.val(this.prepareValue(val));
	},
	onKeyUp:	function() {
		var val = Value.getIntValue($(this).val());
		$(this).val(Value.prototype.prepareValue.call(this, val));
	},
	registerTap:		function(obj, func) {
		obj.get(0).addEventListener('touchend', function(event) {
			func.call(obj);
		});
	},
	addSwipe:	function(obj, func, interval) {
		interval = interval ? interval : 5;
		obj.get(0).addEventListener('touchstart',function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.swiping = true;
			this.startPosition = event.pageY;
			this.lastPosition = event.pageY;
		}, false);
		obj.get(0).addEventListener('touchmove',function(event) {
			event.preventDefault();
			event.stopPropagation();
			var distance = this.lastPosition - event.pageY;
			distance *= distance < 0 ? -1 : 1;
			if(distance >= interval) {
				var totalDistance = this.startPosition - event.pageY;
				func.call(obj.get(0), event, parseInt(totalDistance));
				this.lastPosition = event.pageY;
			}
		},false);
		obj.get(0).addEventListener('touchend',function(event) {
			event.preventDefault();
			event.stopPropagation();
			this.swiping		= false;
			this.startPosition	= null;
			this.lastPosition	= null;
		},false);
	}
};
