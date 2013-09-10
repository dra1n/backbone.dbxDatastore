"use strict"

do (
  root = this,
  factory = (_, Backbone) ->
    class Backbone.DbxDatastore
      constructor: (@tableName) ->


      create: (model) ->
        record = @_getTable().insert model.toJSON()
        model.id = record.getId()
        model.set(model.idAttribute, model.id)
        @find(model)


      update: (model) ->
        @_getRecord(model).update(model.toJSON())
        @find(model)


      find: (model) ->
        @jsonData(@_getRecord(model))


      findAll: ->
        _(@_getTable().query()).map (r) => @jsonData(r)


      destroy: (model) ->
        return false if model.isNew()
        @_getRecord(model).deleteRecord()
        model


      jsonData: (record) ->
        if record?
          data = record.getFields()
          data.id = record.getId()          # *idAttribute* is hardcoded to *id*
        data


      _getRecord: (model) ->
        @_getTable().get(model.id)


      _getTable: ->
        @_table or= Backbone.DbxDatastore.datastore.getTable(@tableName)


      @sync: (method, model, options) ->
        datastore = Backbone.DbxDatastore.datastore
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

        if resp?
          if (options?.success)
            if Backbone.VERSION is '0.9.10'
              options.success(model, resp, options)
            else
              options.success(resp)

          if syncDfd? then syncDfd.resolve(resp)
        else
          errorMessage = if errorMessage? then errorMessage else 'Record Not Found'

          if options?.error
            if Backbone.VERSION is '0.9.10'
              options.error(model, errorMessage, options)
            else
              options.error(errorMessage)
          if syncDfd? then syncDfd.reject(errorMessage)

        if (options?.complete) then options.complete(resp)

        syncDfd?.promise()


      @datastore: null

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
