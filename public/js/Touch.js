function Touch(dom) {
	this.dom = dom;
	dom.obj = this;
	this._add_event_listeners();
}

Touch.prototype = {
	is_click:	null,

	_add_event_listeners:	function() {
		this.dom.addEventListener('touchstart', function(event) {
			this.obj.is_click = true;
		});
		this.dom.addEventListener('touchmove', function(event) {
			this.obj.is_click = false;
		});
		this.dom.addEventListener('touchend', function(event) {
			if(this.obj.is_click) this.obj.tap(event);
		});
	},
	tap:	function(event) {
		if(this.dom && this.dom.ontap && this.dom.ontap.constructor == Function) {
			this.dom.ontap(event);
		}
	}
};
