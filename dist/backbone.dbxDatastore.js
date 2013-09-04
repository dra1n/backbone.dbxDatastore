(function() {
  "use strict";
  (function(root, factory) {
    var Backbone, _;
    if (typeof exports !== "undefined" && exports !== null) {
      _ = require('underscore');
      Backbone = require('backbone');
      return module.exports = factory(_, Backbone);
    } else if (typeof define !== "undefined" && define !== null ? define.amd : void 0) {
      return define(['underscore', 'backbone'], function(_, Backbone) {
        return factory(_ || root._, Backbone || root.Backbone);
      });
    } else {
      return factory(root._, root.Backbone);
    }
  })(this, function(_, Backbone) {
    Backbone.DbxDatastore = (function() {
      function DbxDatastore(datastore, name) {
        'rofl';
      }

      DbxDatastore.prototype.save = function() {};

      DbxDatastore.prototype.create = function() {};

      DbxDatastore.prototype.update = function() {};

      DbxDatastore.prototype.find = function() {};

      DbxDatastore.prototype.findAll = function() {};

      DbxDatastore.prototype.destroy = function() {};

      DbxDatastore.sync = function(method, model, options) {};

      return DbxDatastore;

    })();
    Backbone.ajaxSync = Backbone.sync;
    Backbone.getSyncMethod = function(model) {
      var _ref;
      if (model.dbxDatastore || ((_ref = model.collection) != null ? _ref.dbxDatastore : void 0)) {
        return Backbone.dbxDatastore.sync;
      } else {
        return Backbone.ajaxSync;
      }
    };
    Backbone.sync = function(method, model, options) {
      return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
    };
    return Backbone.DbxDatastore;
  });

}).call(this);
