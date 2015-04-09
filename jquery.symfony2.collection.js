(function($){
    var Collection = function(element, options) {
      this.element = element;
      this.settings = $.extend({
          collectionHolder: element,
          addButton: $('<a href="#" class="add-collection-item">Add</a>'),
          deleteButton: $('<a href="#" class="delete-collection-item">Delete</a>'),
          deleteButtonPath: null,
          addButtonContainer: null,
          newChildrenContainer: null,
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
        // Attach delete buttons
        this.settings.collectionHolder.find('> div, .collection-child').each(function() {
          collection._addDeleteLink.call(collection, this);
        });

        this.settings.addButton.on('click', function(e){
            e.preventDefault();
            collection.add();
        });

        if (this.settings.addButtonContainer) {
          this.settings.addButtonContainer.append(this.settings.addButton);
        } else {
          this.settings.collectionHolder.append(this.settings.addButton);
        }
      },

      /**
       * Appends the delete link to an element of the list
       */
      _addDeleteLink: function(child){
        console.log(this);
        var collection = this;

        var button = this.settings.deleteButton.clone();

        if (this.settings.deleteButtonPath) {
            child.find(this.settings.deleteButtonPath).append(button);
        } else {
            child.append(button);
        }

        button.on('click', function(e) {
            e.preventDefault();
            collection.remove.call(collection, child);
        });
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
          // Get the data-prototype we explained earlier
          var collectionHolder = this.settings.collectionHolder;
          var addButton = this.settings.addButton;
          var prototype = this.settings.collectionHolder.attr('data-prototype');

          var childrenContainer = this.settings.newChildrenContainer ? this.settings.newChildrenContainer : collectionHolder;

          // Replace '__name__' in the prototype's HTML to
          // instead be a number based on the current collection's length.
          var newForm = prototype.replace(/__name__label__/g, name + childrenContainer.children('.collection-child').length);
          newForm = newForm.replace( /__name__/g, childrenContainer.children('.collection-child').length );
          newForm = $( newForm );
          newForm.addClass('collection-child');

          this._addDeleteLink(newForm);

          if (this.settings.newChildrenContainer) {
              $(this.settings.newChildrenContainer).append(newForm);
          } else {
              addButton.before(newForm);
          }

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
