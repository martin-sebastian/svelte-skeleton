/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i72pxy802o0s372")

  collection.indexes = [
    "CREATE INDEX `idx_p1tGDrd` ON `vehicle_images` (`vehicleid`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("i72pxy802o0s372")

  collection.indexes = []

  return dao.saveCollection(collection)
})
