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
      function DbxDatastore(tableName) {
        this.tableName = tableName;
      }

      DbxDatastore.prototype.create = function(model) {
        var record;
        record = this._getTable().insert(model.toJSON());
        model.id = record.getId();
        model.set(model.idAttribute, model.id);
        return this.find(model);
      };

      DbxDatastore.prototype.update = function(model) {
        this._getRecord(model).update(model.toJSON());
        return this.find(model);
      };

      DbxDatastore.prototype.find = function(model) {
        return this.jsonData(this._getRecord(model));
      };

      DbxDatastore.prototype.findAll = function() {
        var _this = this;
        return _(this._getTable().query()).map(function(r) {
          return _this.jsonData(r);
        });
      };

      DbxDatastore.prototype.destroy = function(model) {
        if (model.isNew()) {
          return false;
        }
        this._getRecord(model).deleteRecord();
        return model;
      };

      DbxDatastore.prototype.jsonData = function(record) {
        var data;
        if (record != null) {
          data = record.getFields();
          data.id = record.getId();
        }
        return data;
      };

      DbxDatastore.prototype._getRecord = function(model) {
        return this._getTable().get(model.id);
      };

      DbxDatastore.prototype._getTable = function() {
        return this._table || (this._table = Backbone.DbxDatastore.datastore.getTable(this.tableName));
      };

      DbxDatastore.sync = function(method, model, options) {
        var datastore, error, errorMessage, resp, store, syncDfd;
        datastore = Backbone.DbxDatastore.datastore;
        store = model.dbxDatastore || model.collection.DbxDatastore;
        syncDfd = Backbone.$.Deferred && Backbone.$.Deferred();
        try {
          switch (method) {
            case 'read':
              resp = model.id != null ? store.find(model) : store.findAll();
              break;
            case 'create':
              resp = store.create(model);
              break;
            case 'update':
              resp = store.update(model);
              break;
            case 'delete':
              resp = store.destroy(model);
          }
        } catch (_error) {
          error = _error;
          errorMessage = error.message;
        }
        if (resp != null) {
          if ((options != null ? options.success : void 0)) {
            if (Backbone.VERSION === '0.9.10') {
              options.success(model, resp, options);
            } else {
              options.success(resp);
            }
          }
          if (syncDfd != null) {
            syncDfd.resolve(resp);
          }
        } else {
          errorMessage = errorMessage != null ? errorMessage : 'Record Not Found';
          if (options != null ? options.error : void 0) {
            if (Backbone.VERSION === '0.9.10') {
              options.error(model, errorMessage, options);
            } else {
              options.error(errorMessage);
            }
          }
          if (syncDfd != null) {
            syncDfd.reject(errorMessage);
          }
        }
        if ((options != null ? options.complete : void 0)) {
          options.complete(resp);
        }
        return syncDfd != null ? syncDfd.promise() : void 0;
      };

      DbxDatastore.datastore = null;

      return DbxDatastore;

    })();
    Backbone.ajaxSync = Backbone.sync;
    Backbone.getSyncMethod = function(model) {
      var _ref;
      if (model.dbxDatastore || ((_ref = model.collection) != null ? _ref.dbxDatastore : void 0)) {
        return Backbone.DbxDatastore.sync;
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
