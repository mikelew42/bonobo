;(function($, _, angular){

	if (typeof MPL !== "object")
		MPL = {};

	var App = angular.module('App', [])

	.controller('Ctrl', ['$scope', function($scope){
		var tree = $scope.tree = new Tree();


		$scope.newItem = function(name){
			var item = new Item(name);
			tree.addItem(item);
		};

		$scope.keypress = function($event){
			if ($event.keyCode === 13){
				tree.addItem(new Item($scope.newItemName));
				$scope.newItemName = '';
				$scope.showNewItem = false;
			}
		};
	}]);

	/*
	To test:If I can get the string to act like a string, and still have methods and shit
To define Properties on the prototype?
	To see what happens if I use getters/setters that act on the prototype?


	*/
	var Value = MPL.Value = function Value(opts){
		$.extend(this, opts);
	};

	Value.prototype = $.extend(Object.create(MPL.Events.prototype), {
		constructor: Value,
		_value: undefined,
		bindTo: function(bindTo){
			var self = this;
			if (bindTo instanceof jQuery){
				// self --> bindTo
				self.change(function(){
					bindTo.setValue(self.value);
				});
				// bindTo --> self
				bindTo.on('keypress', function(){
					self.value = bindTo.getValue();
				});
				// start synced? but which way? shouldn't matter, you're likely to set this value after binding
			} else if (bindTo instanceof Value) {
				// self --> bindTo
				self.change(function(){
					bindTo.value = self.value;
				});
				// bindTo --> self
				bindTo.change(function(){
					self.value = bindTo.value;
				});
			}
		},
		valueOf: function(){
			return this.value;
		},
		toString: function(){
			return '' + this.value;
		},
		fork: function(){
			return Object.create(this);
		},
		del: function(){
			delete this.value;
		}
	});

	Object.defineProperty(Value.prototype, 'value', {
		get: function(){ return this._value; },
		set: function(val){ this._value = val; this.change(); }
	});

	var aliasEvent = function(eventName){
		return function(cb){
			if (typeof cb === 'function') this.on(eventName, cb);
			else this.trigger(eventName);
		};
	};

	['change'].forEach(function(v, i){
		Value.prototype[v] = aliasEvent(v);
	});

	var Test = MPL.Test = function Test(){
		this.properties = [];
	};

	Test.prototype = $.extend(Object.create(MPL.Events.prototype), {
		constructor: Test,
		v: function(name){
			this.createAndAddValue({name: name});
		},
		createAndAddValue: function(opts){
			var value = new Value(opts);
			this.addValue(value);
		},
		addValue: function(value){
			this.properties.push(value);
			Object.defineProperty(this, value.name, {
				get: function(){ return value; },
				set: function(val){ value.value = val; }
			});
		},
		fork: function(){
			var fork = Object.create(this);
			this.properties.forEach(function(v, i){
				fork.addValue(v.fork());
			});
			return fork;
		}
	});

	MPL.testCase1 = function(){
		var test = new Test();
		test.v('mike');
		test.mike = 'lewis';
		var fork = test.fork();

	};



	var Variable = MPL.Variable = function Variable(){

	};

	Variable.prototype._value = undefined;
	Object.defineProperty(Variable.prototype, 'value', {
		get: function(){ return this._value; },
		set: function(val){ this._value = val; }
	});

	//Object.defineProperty();

// can't extend from Variable AND from String...
// I could work around this by just reusing Variable prototype functions.
window.lastString = '';

	MPL.String = function MPLString(str){
		if (!(this instanceof MPL.String))
			return new MPL.String(str);
		
		var ret = String.prototype.constructor.apply(this, arguments);

		this.value = str;
		console.log(ret);
		window.lastString = ret;
		return ret;
	};

	MPL.String.prototype = Object.create(String.prototype);

	MPL.String.prototype.myStringMethod = function(){
		console.log('myStringMethod !!!!!!!!!!!!!!!!!!!');
	};

	MPL.String.prototype.valueOf = MPL.String.prototype.toString = function(){
		return this.value;
	};

	var Item = MPL.Item = function Item(name){
		MPL.Bonobo.call(this);
		this._children = [];
		this.initialize(name);
	};

	Item.prototype = Object.create(MPL.Bonobo.prototype);
	Item.prototype.constructor = MPL.Item;
	Item.prototype.initialize = function(name){
		this.addProperty('name');
		this.name = name;
	};	
	Item.prototype.addItem = function(item){
		item.setParent(this);
		this._children.push(item);
	};
	Item.prototype.setParent = function(item){
		this._parent = item;
	};

	var Tree = MPL.Tree = function Tree(){
		MPL.Item.call(this);
	};

	Tree.prototype = Object.create(MPL.Item.prototype);
	Tree.prototype.constructor = MPL.Tree;
	Tree.prototype.initialize = function(){

	};

})(jQuery, _, angular);