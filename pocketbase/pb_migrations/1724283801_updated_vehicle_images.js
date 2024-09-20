/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i72pxy802o0s372")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9usdow4q",
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
  const collection = dao.findCollectionByNameOrId("i72pxy802o0s372")

  // remove
  collection.schema.removeField("9usdow4q")

  return dao.saveCollection(collection)
})
