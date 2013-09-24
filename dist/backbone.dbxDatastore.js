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
        this.datastoreDfr = Backbone.DbxDatastore.datastore;
      }

      DbxDatastore.prototype.create = function(model) {
        var _this = this;
        return this._withDatastore(function(datastore) {
          var record;
          record = _this._getTable(datastore).insert(model.toJSON());
          model.id = record.getId();
          model.set(model.idAttribute, model.id);
          return _this.jsonData(_this._getRecord(datastore, model));
        });
      };

      DbxDatastore.prototype.update = function(model) {
        var _this = this;
        return this._withDatastore(function(datastore) {
          _this._getRecord(datastore, model).update(model.toJSON());
          return _this.jsonData(_this._getRecord(datastore, model));
        });
      };

      DbxDatastore.prototype.find = function(model) {
        var _this = this;
        return this._withDatastore(function(datastore) {
          return _this.jsonData(_this._getRecord(datastore, model));
        });
      };

      DbxDatastore.prototype.findAll = function() {
        var _this = this;
        return this._withDatastore(function(datastore) {
          return _(_this._getTable(datastore).query()).map(function(r) {
            return _this.jsonData(r);
          });
        });
      };

      DbxDatastore.prototype.destroy = function(model) {
        var _this = this;
        if (model.isNew()) {
          return false;
        }
        return this._withDatastore(function(datastore) {
          _this._getRecord(datastore, model).deleteRecord();
          return model;
        });
      };

      DbxDatastore.prototype.jsonData = function(record) {
        var data;
        if (record != null) {
          data = this._convertList(record.getFields());
          data.id = record.getId();
        }
        return data;
      };

      DbxDatastore.prototype._withDatastore = function(action) {
        return this.datastoreDfr.then(action);
      };

      DbxDatastore.prototype._getRecord = function(datastore, model) {
        return this._getTable(datastore).get(model.id);
      };

      DbxDatastore.prototype._getTable = function(datastore) {
        return this._table || (this._table = datastore.getTable(this.tableName));
      };

      DbxDatastore.prototype._convertList = function(data) {
        _(data).each(function(v, k) {
          if (v instanceof Dropbox.Datastore.List) {
            return data[k] = v.toArray();
          }
        });
        return data;
      };

      DbxDatastore.sync = function(method, model, options) {
        var error, errorMessage, resp, store, syncDfd;
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
        resp.done(function(result) {
          if ((options != null ? options.success : void 0)) {
            if (Backbone.VERSION === '0.9.10') {
              options.success(model, result, options);
            } else {
              options.success(result);
            }
          }
          if (syncDfd != null) {
            return syncDfd.resolve(result);
          }
        });
        resp.fail(function() {
          errorMessage = errorMessage != null ? errorMessage : 'Record Not Found';
          if (options != null ? options.error : void 0) {
            if (Backbone.VERSION === '0.9.10') {
              options.error(model, errorMessage, options);
            } else {
              options.error(errorMessage);
            }
          }
          if (syncDfd != null) {
            return syncDfd.reject(errorMessage);
          }
        });
        resp.always(function(result) {
          if ((options != null ? options.complete : void 0)) {
            return options.complete(result);
          }
        });
        return syncDfd != null ? syncDfd.promise() : void 0;
      };

      DbxDatastore.datastore = Backbone.$.Deferred();

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
