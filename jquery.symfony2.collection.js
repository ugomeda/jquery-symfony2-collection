(function($){
  var find = function(item, selector) {
    if (selector === null || typeof selector === "undefined") {
      console.log("undefined");
      return item;
    }
    else {
      console.log(selector, typeof selector);
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

      // Woot
      name: '[Element Name]'
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
        var children = this.element.find(this.settings.childrenSelector);
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
        console.log(this.addButton);
        console.log(find(this.element, this.settings.addButtonPath).length);
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

        this.element.trigger('collectionremove', [child[0]]);
        child.remove();
      },

      /**
       * Adds an element to the list
       */
      add: function(){
          var prototype = this.element.attr('data-prototype');

          // Replace '__name__' in the prototype's HTML to
          // instead be a number based on the current collection's length.
          var newForm = prototype.replace(/__name__label__/g, this.settings.name + this.index);
          newForm = newForm.replace( /__name__/g, this.index);
          newForm = $( newForm );

          this._addDeleteLink(newForm);
          find(this.element, this.settings.newChildPath).append(newForm);
          this.index++;
          this.element.trigger('collectionadd', [newForm[0]]);
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
