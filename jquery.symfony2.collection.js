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

      this.init();
    };

    Collection.prototype = {
      init: function() {
        var collection = this;
        // Attach delete/add buttons
        this.settings.collectionHolder.find('> div, .collection-child').each(function() {
          collection.addDeleteLink(this);
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

      addDeleteLink: function(child){
        var collection = this;

        var $removeFormA = this.settings.deleteButton.clone();

        if (this.settings.deleteButtonPath) {
            child.find(this.settings.deleteButtonPath).append($removeFormA);
        } else {
            child.append($removeFormA);
        }

        $removeFormA.on('click', function(e) {
            e.preventDefault();
            collection.element.trigger('collectionremove', [child[0]]);
            child.remove();
        });
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

          this.addDeleteLink(newForm);

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
      // Method calling logic
      if ( typeof method == 'string' || method instanceof String ) {
        var instance = this.data('jquery-collection');
        instance[method].apply(instance, Array.prototype.slice.call( arguments, 1 ));
        return this;
      } else if ( typeof method === 'object' || ! method ) {
        return $(this).each(function() {
          var el = $(this);
          var instance = new Collection(el, args[0]);
          el.data('jquery-collection', instance);
        });
      } else {
        $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
      }
    };
})( jQuery );
