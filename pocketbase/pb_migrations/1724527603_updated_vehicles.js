/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6u1mn0xdwgf14ib")

  collection.indexes = [
    "CREATE INDEX `idx_6Vfl8ue` ON `vehicles` (`webid`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("6u1mn0xdwgf14ib")

  collection.indexes = []

  return dao.saveCollection(collection)
})
