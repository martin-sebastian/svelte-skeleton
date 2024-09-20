/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6u1mn0xdwgf14ib")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mcygr5kr",
    "name": "images",
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

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dgqyvbr7",
    "name": "attributes",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "p6rkfidhf3q67c7",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6u1mn0xdwgf14ib")

  // remove
  collection.schema.removeField("mcygr5kr")

  // remove
  collection.schema.removeField("dgqyvbr7")

  return dao.saveCollection(collection)
})
