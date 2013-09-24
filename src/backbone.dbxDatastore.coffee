"use strict"

do (
  root = this,
  factory = (_, Backbone) ->
    class Backbone.DbxDatastore
      constructor: (@tableName) ->
        @datastoreDfr = Backbone.DbxDatastore.datastore


      create: (model) ->
        @_withDatastore (datastore) =>
          record = @_getTable(datastore).insert model.toJSON()
          model.id = record.getId()
          model.set(model.idAttribute, model.id)
          @jsonData(@_getRecord(datastore, model))


      update: (model) ->
        @_withDatastore (datastore) =>
          @_getRecord(datastore, model).update(model.toJSON())
          @jsonData(@_getRecord(datastore, model))


      find: (model) ->
        @_withDatastore (datastore) =>
          @jsonData(@_getRecord(datastore, model))


      findAll: ->
        @_withDatastore (datastore) =>
          _(@_getTable(datastore).query()).map (r) => @jsonData(r)


      destroy: (model) ->
        return false if model.isNew() # no promise?
        @_withDatastore (datastore) =>
          @_getRecord(datastore, model).deleteRecord()
          model


      jsonData: (record) ->
        if record?
          data = @_convertList(record.getFields())
          data.id = record.getId()          # *idAttribute* is hardcoded to *id*
        data


      _withDatastore: (action) ->
        @datastoreDfr.then action


      _getRecord: (datastore, model) ->
        @_getTable(datastore).get(model.id)


      _getTable: (datastore) ->
        @_table or= datastore.getTable(@tableName)


      _convertList: (data) ->
        _(data).each (v, k) ->
          data[k] = v.toArray() if v instanceof Dropbox.Datastore.List
        data


      @sync: (method, model, options) ->
        store = model.dbxDatastore || model.collection.DbxDatastore
        syncDfd = Backbone.$.Deferred && Backbone.$.Deferred()

        try
          switch method
            when 'read'
              resp = if model.id? then store.find(model) else store.findAll()
            when 'create'
              resp = store.create(model)
            when 'update'
              resp = store.update(model)
            when 'delete'
              resp = store.destroy(model)

        catch error
          errorMessage = error.message

        resp.done (result) ->
          if (options?.success)
            if Backbone.VERSION is '0.9.10'
              options.success(model, result, options)
            else
              options.success(result)

          if syncDfd? then syncDfd.resolve(result)

        resp.fail ->
          errorMessage = if errorMessage? then errorMessage else 'Record Not Found'

          if options?.error
            if Backbone.VERSION is '0.9.10'
              options.error(model, errorMessage, options)
            else
              options.error(errorMessage)
          if syncDfd? then syncDfd.reject(errorMessage)

        resp.always (result) ->
          if (options?.complete) then options.complete(result)

        syncDfd?.promise()


      @datastore: Backbone.$.Deferred()

    Backbone.ajaxSync = Backbone.sync

    Backbone.getSyncMethod = (model) ->
      if (model.dbxDatastore or model.collection?.dbxDatastore)
        Backbone.DbxDatastore.sync
      else
        Backbone.ajaxSync

    Backbone.sync = (method, model, options) ->
      Backbone.getSyncMethod(model).apply(this, [method, model, options])

    Backbone.DbxDatastore
) ->
  if exports?
    _ = require 'underscore'
    Backbone = require 'backbone'
    module.exports = factory _, Backbone
  else if define?.amd
    define ['underscore', 'backbone'], (_, Backbone) ->
      # Use global variables if the locals are undefined.
      factory(_ || root._, Backbone || root.Backbone)
  else
    factory root._, root.Backbone
