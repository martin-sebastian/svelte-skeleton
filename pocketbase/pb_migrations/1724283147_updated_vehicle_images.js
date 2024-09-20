/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i72pxy802o0s372")

  // remove
  collection.schema.removeField("vdwie4tf")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i72pxy802o0s372")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vdwie4tf",
    "name": "imageurl2",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
