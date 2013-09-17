# Backbone Dropbox Datastore API Adapter

It's a drop-in replacement for Backbone.Sync() to handle saving to a Dropbox Datastore. Inspired by [Backbone.localStorage](https://github.com/jeromegn/Backbone.localStorage)

## Usage

Include Backbone.dbxDatastore after having included Backbone.js:

```html
<script type="text/javascript" src="https://www.dropbox.com/static/api/1/dropbox-datastores-0.1.0-b5.js"></script>
<script type="text/javascript" src="backbone.js"></script>
<script type="text/javascript" src="backbone.dbxDatastore.js"></script>
```

Obtain datastore object (example from  [Dropbox Datastore API Tutorial](https://www.dropbox.com/developers/datastore/tutorial/js)) and
save it to Backbone.dbxDatastore.datastore. From that moment you are
ready to create model or collection instances and sync them.

```javascript
var client = new Dropbox.Client({key: APP_KEY});

client.authenticate({interactive: false}, function (error) {
    if (error) {
        alert('Authentication error: ' + error);
    }
});

if (client.isAuthenticated()) {
  var datastoreManager = client.getDatastoreManager();
  datastoreManager.openDefaultDatastore(function (error, datastore) {
      if (error) {
          alert('Error opening default datastore: ' + error);
      }

      // Now you have a datastore. Time to resolve deferred object
      Backbone.DbxDatastore.datastore.resolve(datastore);
  });
}
```

Create your collections like so:

```javascript
window.SomeCollection = Backbone.Collection.extend({
  
  dbxDatastore: new Backbone.DbxDatastore("some_collection"), // Table name for Dropbox Datastore.
  
  // ... everything else is normal.
  
});
```
### Bower and RequireJS 

Add dependency to bower.json

```
"backbone.dbxDatastore": "~0.2.0"
```

Include [RequireJS](http://requirejs.org):

```html
<!-- build:js scripts/main.js -->
  <script data-main="scripts/main" src="bower_components/requirejs/require.js"></script>
<!-- endbuild -->
```

RequireJS config: 
```javascript
require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        underscore: '../bower_components/underscore/underscore',
        backbone: '../bower_components/backbone/backbone',
        dropbox: 'vendor/dropbox-datastores',
        dbxDatastore: '../bower_components/backbone.dbxDatastore/dist/backbone.dbxDatastore'
    }
});
```

Define your collection as a module:
```javascript
define("someCollection", ["dbxDatastore"], function() {
    var SomeCollection = Backbone.Collection.extend({
        dbxDatastore: new Backbone.DbxDatastore("some_collection") // Table name for Dropbox Datastore.
    });
  
    return new SomeCollection();
});
```

Require your collection:
```javascript
require(["someCollection"], function(someCollection) {
  // ready to use someCollection
});
```

### CommonJS

If you're using [browserify](https://github.com/substack/node-browserify).

```javascript
var Backbone.DbxDatastore = require("backbone.dbxdatastore");
```
