/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p6rkfidhf3q67c7")

  collection.name = "vehicle_attributes_OLD"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("p6rkfidhf3q67c7")

  collection.name = "vehicle_attributes"

  return dao.saveCollection(collection)
})
