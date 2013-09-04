"use strict"

do (
  root = this,
  factory = (_, Backbone) ->
    class Backbone.DbxDatastore
      constructor: (datastore, name) ->
        'rofl'

      save: () ->

      create: () ->

      update: () ->

      find: () ->

      findAll: () ->

      destroy: () ->

      @sync: (method, model, options) ->

    Backbone.ajaxSync = Backbone.sync

    Backbone.getSyncMethod = (model) ->
      if (model.dbxDatastore or model.collection?.dbxDatastore)
        Backbone.dbxDatastore.sync
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
