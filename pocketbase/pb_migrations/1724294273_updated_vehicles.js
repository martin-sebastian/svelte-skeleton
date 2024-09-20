/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6u1mn0xdwgf14ib")

  // remove
  collection.schema.removeField("mcygr5kr")

  return dao.saveCollection(collection)
}, (db) => {
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
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
