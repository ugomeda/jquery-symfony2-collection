(function($){
  var find = function(item, selector) {
    if (selector === null || typeof selector === "undefined") {
      return item;
    }
    else {
      return item.find(selector);
    }
  };

  var Collection = function(element, options) {
    this.element = element;
    this.settings = $.extend({
      // Element for the add button (appended once)
      addButton: $('<a href="#" class="add-collection-item">Add</a>'),

      // Path (relative to the collection) to place the add button
      addButtonPath: null,

      // Element for the delete button (appended on each children)
      deleteButton: $('<a href="#" class="delete-collection-item">Delete</a>'),

      // Path (relative to the child) to place the delete button
      deleteButtonPath: null,

      // Path (relative to the collection) to place a new child
      newChildPath: null,

      // Path (relative to the collection) to find the children
      childrenSelector: "> div",

      // Replacement providers for the prototype
      replacements: {
        '__name__label__': function(collection) { return "#" + collection.index; },
        '__name__': function(collection) { return collection.index; },
      }
    }, options);

    this._init();
  };

    Collection.prototype = {
      /**
       * Attaches the delete link to all the elements, and adds the add button
       */
      _init: function() {
        var collection = this;

        // Find the length of the collection
        var children = this.getChildren();
        this.index = children.length;

        // Attach delete buttons
        children.each(function() {
          collection._addDeleteLink.call(collection, this);
        });

        // Attach add button
        this.addButton = this.settings.addButton.clone();
        this.addButton.on('click', function(e){
            e.preventDefault();
            collection.add();
        });
        find(this.element, this.settings.addButtonPath).append(this.addButton);
      },

      /**
       * Appends the delete link to an element of the list
       */
      _addDeleteLink: function(child){
        var collection = this;

        var button = this.settings.deleteButton.clone();
        button.on('click', function(e) {
            e.preventDefault();
            collection.remove.call(collection, child);
        });
        find(child, this.settings.deleteButtonPath).append(button);
      },

      /**
       * Removes the child from the list
       */
      remove: function(child) {
        if (! child[0]) {
          $.error("Calling remove on non existant item");
        }

        var event = jQuery.Event('collectionremove', {
          child: child[0],
          collection: this
        });
        this.element.trigger(event);

        if (! event.isDefaultPrevented()) {
          child.remove();
        }
      },

      /**
       * Adds an element to the list
       */
      add: function(){
        var collection = this;
        var prototype = this.element.attr('data-prototype');

        $.each(this.settings.replacements, function(property, fct) {
          prototype = prototype.replace(new RegExp(property, 'g'), fct(collection));
        });
        child = $(prototype);

        this._addDeleteLink(child);
        find(this.element, this.settings.newChildPath).append(child);
        this.index++;

        var event = jQuery.Event('collectionadd', {
          child: child[0],
          collection: this
        });
        this.element.trigger(event);
      },

      getChildren: function() {
        return this.element.find(this.settings.childrenSelector);
      }
    };

    $.fn.collection = function(method) {
      var args = arguments;

      if ( typeof method === 'string' || method instanceof String ) {
        var instance = this.data('jquery-collection');
        if (! instance) {
          $.error("No collection initialized for this element");
        }

        if(typeof instance[method] !== 'function') {
          $.error("Method " + method + " does not exists");
        }
        instance[method].apply(instance, Array.prototype.slice.call(args, 1));

        return this;
      } else {
        return $(this).each(function() {
          var el = $(this);
          var instance = new Collection(el, args[0]);
          el.data('jquery-collection', instance);
        });
      }
    };
})( jQuery );
