/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7g0fmo79hm4yjfb")

  collection.indexes = [
    "CREATE INDEX `idx_Ps7IRFK` ON `vehicle_attributes` (`vehicleid`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("7g0fmo79hm4yjfb")

  collection.indexes = []

  return dao.saveCollection(collection)
})
