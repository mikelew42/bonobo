;(function($, _){

	if (typeof MPL !== "object")
		MPL = {};

	var Attribute = MPL.Attribute = function Attribute(name, value){
		MPL.Bonobo.call(this);
		this.initialize(name, value);
	};

	Attribute.prototype = Object.create(MPL.Bonobo.prototype);
	Attribute.prototype.constructor = MPL.Attribute;
	Attribute.prototype.initialize = function(name, value){
		this.addProperty('name');
		this.name = name;
		this.addProperty('value');
		this.value = value;
		this.view = new AttributeView(this);
	};

	var AttributeView = MPL.AttributeView = function AttributeView(attribute){
		this.attribute = attribute;
		this.$el = $('#attribute-view').clone().attr('id', null).removeClass('template');
		// these could be auto-initializers also...  If more than one of a class is found, make an array
		// this['$'+name] = this.$el.find('.'+name);
		this.$name = this.$el.find('.name').edit();
		this.$value = this.$el.find('.value').edit();

		this.attribute.bind('name', this.$name);
		this.attribute.bind('value', this.$value);
	};

	AttributeView.prototype = Object.create(MPL.View.prototype);
	AttributeView.prototype.constructor = MPL.AttributeView;

	var Element = MPL.Element = function Element(tag){
		MPL.Bonobo.call(this);
		this.initialize(tag);
	};

	Element.prototype = Object.create(MPL.Bonobo.prototype);
	Element.prototype.constructor = MPL.Element;
	Element.prototype.initialize = function(tag){
		this.addProperty('tag');
		this.tag = tag;
		this.attributes = [];

		this.view = new ElementView(this);
		this.view.$el.appendTo('body');

		var element = this;
		this.$addAttributeBtn = $('#add-attribute-view').clone().attr('id', null).removeClass('template').click(function(){
			element.addAttribute('name', 'value');
		});
		this.$addAttributeBtn.appendTo(this.view.$attributes);
	};
	Element.prototype.addAttribute = function(name, value){
		var newAttribute = new Attribute(name, value);
		newAttribute.view.$el.appendTo(this.view.$attributes);
		this.$addAttributeBtn.appendTo(this.view.$attributes);
		this.attributes.push(newAttribute);
	};

	var ElementView = MPL.ElementView = function ElementView(element){
		this.element = element;
		this.$el = $('#element-view').clone().attr('id', null).removeClass('template');
		this.$tag = this.$el.find('.tag');
		this.$attributes = this.$el.find('.attributes');

		// this could be a 'standard bindings' loop... bind('value', this['$'+value]
		this.element.bind('tag', this.$tag);
	};

	ElementView.prototype = Object.create(MPL.View.prototype);
	ElementView.prototype.constructor = MPL.ElementView;

	var AddAttributeBtn = MPL.AddAttributeBtn = function AddAttributeBtn(element){
		this.view = {};
		this.view.$el = $('#add-attribute-view').clone().attr('id', null).removeClass('template').click(function(){

		});
	}

	var isProperty = function(prop){
		return prop instanceof Property;
	};

	var focus = function(){
		console.log('focus');
		setTimeout(function(){
			document.execCommand('selectAll', false, null);
		}, 0);
	};
	$.fn.edit = function(end){
		/* if (end || end == 'end'){
		 return this.off('focus', focus).attr('contenteditable', null);
		 }
		 return this.off('focus', focus).attr('contenteditable', true).on('focus', focus).focus(); */
		var clickFunc = function(){
			$(this).attr('contenteditable', true).off('click', clickFunc).blur(function(){
				$(this).attr('contenteditable', null).on('click', clickFunc);
			});
		};
		return this.on('click', clickFunc);
	};

	$.fn.hoverEdit = function(){
		return this.click(function(){
			$(this).edit();
		});
	};

})(jQuery, _);