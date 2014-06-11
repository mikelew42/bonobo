;(function($, _){

	if (typeof MPL !== "object")
		MPL = {};

	var Variable = MPL.Variable = function Variable(){
		
	};

	var Property = MPL.Property = function Property(name){
		var self = this;
		this.name = name;
		this.getValue = function(){
			return self._value;
		};

		this.setValue = function(newValue){
			self._value = newValue;
			self.type = typeof newValue;
			self.trigger('change');
		};

		this.getType = function(){
			return self.type;
		};

		this.hasProperty = function(prop){
			return typeof self.getValue()[prop] !== 'undefined';
		};

		this.getProperty = function(prop){
			return self.hasProperty(prop) && self.getValue()[prop];
		};

		this.bind = function(bindTo){
			// this would be different for object properties.  Bonobo is the object property?
			// should Property be allowed for objects and literals?
			// should Bonobo extend from Property?
			// .prop('propName') to get the Property, instead of getProperty?
			if (self.getValue())


			property.on('change', function(){
				self.setValue(property.getValue());
			});
		};
	};

	Property.prototype = Object.create(MPL.Events.prototype);
	Property.prototype.constructor = MPL.Events;
	Property.prototype.valueOf = function(){
		return this._value;
	};


	var Bonobo = MPL.Bonobo = function Bonobo(){
		this._properties = [];
	};

	Bonobo.prototype = Object.create(MPL.Events.prototype);
	Bonobo.prototype.constructor = MPL.Bonobo;

	Bonobo.prototype.addProperty = function(prop){
		var property = new Property(prop);

		Object.defineProperty(this, prop, {
			get: property.getValue,
			set: property.setValue
		});

		this._properties[prop] = property;
	};

	Bonobo.prototype.isSet = function(prop){
		return typeof this[prop] !== 'undefined';
	};

	Bonobo.prototype.hasProperty = function(prop){
		return typeof this._properties[prop] !== 'undefined';
	};

	Bonobo.prototype.isProperty = function(prop){
		return this._properties[prop] instanceof Property;
	};

	Bonobo.prototype.getProperty = function(prop){
		if (this.hasProperty(prop) && this.isProperty(prop))
			return this._properties[prop];
		else
			return undefined;
	};

	Bonobo.prototype.bind = function(prop, bindTo){
		var property;
		if (property = this.getProperty(prop)){
			// push property's changes to bindTo
			property.on('change', function(){
				bindTo.setValue(property.getValue());
			});

			// for bindTo's changes, check what it is
			var event;
			if (isProperty(bindTo)){
				event = 'on';
			} else if (bindTo instanceof jQuery){
				event = 'keypress';
			}

			// push bindTo's changes to property
			bindTo.on(event, function(){
				property.setValue(bindTo.getValue());
			});

			// start syncd
			bindTo.setValue(property.getValue());
		}
	};

	$.fn.getValue = function(){
		var $first = this.first();
		return $first.html() || $first.val();
	};

	$.fn.setValue = function(value){
		return this.each(function(){
			var $self = $(this);
			$self.html(value);
			if ($self.html() != value){
				$self.val(value);
				if ($self.val() != value){
					console.log('Could not $().setValue()');
				}
			}
		});
	};

	$.fn.bind = function($el){
		return this.each(function(){
			var $self = $(this),
				oldValue = $self.getValue();

			$self.on('keydown keyup change', function(){
				$el.setValue($self.getValue());
			});
			$el.on('keydown keyup change', function(){
				$self.setValue($el.getValue());
			});
			$el.setValue($self.getValue());
		});
	};

	var isProperty = function(prop){
		return prop instanceof Property;
	};

	/*
	obj.is('propName').true() // obj.propName === true
	obj.is('propName').truthy() // obj.propName == true // obj.propName
	obj.is('propName').defined() // typeof obj.propName !== 'undefined'
 ----->!!! This will make logging/testing really easy.  ENCAPSULATED, OO JAVASCRIPT LOGIC


	Learn by example:
	2people // BAD VARIABLE NAME

	obj.Lastpropforperson // BAD CAMEL CASE

	 */


	var View = MPL.View = function View(){

	};

	View.prototype = Object.create(MPL.Events.prototype);
	View.prototype.constructor = MPL.View;


})(jQuery, _);