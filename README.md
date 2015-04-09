jquery-symfony2-collection
==========================

This jQuery plugin makes it easy to provide forms containing collections. It creates
buttons to add and remove elements inside a collection.

You can read mode about the server side here :
http://symfony.com/doc/current/reference/forms/types/collection.html

This plugin replaces the javascript at the end of the documentation with a more
flexible solution.

On the client side, it's as easy as :

```js
$(function() {
  $("#tags").collection();
});
```

"#tags" can be replaced by the name of your collection, some examples: "#user_tags", "#order_items"

Advanced use:

```js
$("#collection").collection{
  addButton: $('<a href="#" class="add-collection-item">Add</a>'),
  addButtonPath: null,
  deleteButton: $('<a href="#" class="delete-collection-item">Delete</a>'),
  deleteButtonPath: null,
  newChildPath: null,
  childrenSelector: "> div",
  replacements: {
    '__name__label__': function(collection) {
      return collection.index;
    },
    '__name__': function(collection) {
      return collection.index;
    },
  }
}
```

The parameters are as follow :

| Parameter        | Value                                                              |
| ---------------- | ------------------------------------------------------------------ |
| addButton        | The element to be added as the add button.                         |
| addButtonPath    | The path, relative to ```#collection```, to place the add button.  |
| deleteButton     | The element to be added to each child as the delete button.        |
| deleteButtonPath | The path, relative to the child, to place the delete button.       |
| newChildPath     | The path, relative to ```#collection```, to place new children.    |
| childrenSelector | The selector, relative to ```#collection```, to find children.     |
| replacements     | List of function to replace values in the prototype of a child.    |


Methods
-------

```js
// Add an element to a collection
$("#collection").collection('add');

// Remove an element from a collection
$("#collection").collection('remove', $('#collection > div').eq(1));

// Disable the plugin
$("#collection").collection('destroy');
```

Events
------

Events are triggered when the collection is manipulated :

- ```collectionadd``` is triggered after a child has been added to the collection
- ```collectionremove``` is triggered before a child is removed from the collection

These events have two properties :

- ```event.child``` is the DOM element being manipulated
- ```event.collection``` is the current collection object

A call of ```event.preventDefault()``` on a ```collectionremove``` event
will cancel the child removal.

```js
$("#collection")
  .on('collectionadd', function(event) {
    $(event.child).find('select').select2();
    $(event.child).find('.datetime').datepicker();
  })
  .on('collectionremove', function(event) {
    if (event.collection.getChildren().length == 1) {
      event.preventDefault();
      console.log("You need at least one item !");
    }
    else {
      $(event.child).find('select').select2('destroy');
      $(event.child).find('.datetime').datepicker('destroy');
    }
  }).collection();
```
