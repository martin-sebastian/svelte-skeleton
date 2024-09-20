/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p6rkfidhf3q67c7")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "widpb3vd",
    "name": "vehicleid",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "6u1mn0xdwgf14ib",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p6rkfidhf3q67c7")

  // remove
  collection.schema.removeField("widpb3vd")

  return dao.saveCollection(collection)
})
