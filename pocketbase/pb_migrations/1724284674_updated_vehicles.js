/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6u1mn0xdwgf14ib")

  // remove
  collection.schema.removeField("hrn2zenl")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6u1mn0xdwgf14ib")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "hrn2zenl",
    "name": "test",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "i72pxy802o0s372",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
