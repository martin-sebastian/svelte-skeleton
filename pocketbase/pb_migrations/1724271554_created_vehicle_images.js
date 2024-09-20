/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "i72pxy802o0s372",
    "created": "2024-08-21 20:19:14.498Z",
    "updated": "2024-08-21 20:19:14.498Z",
    "name": "vehicle_images",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vdwie4tf",
        "name": "imageurl",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("i72pxy802o0s372");

  return dao.deleteCollection(collection);
})
