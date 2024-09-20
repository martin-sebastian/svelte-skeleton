/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i72pxy802o0s372")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "yq614bzr",
    "name": "imageurl",
    "type": "url",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "exceptDomains": null,
      "onlyDomains": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i72pxy802o0s372")

  // remove
  collection.schema.removeField("yq614bzr")

  return dao.saveCollection(collection)
})
