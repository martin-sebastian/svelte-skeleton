/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "p6rkfidhf3q67c7",
    "created": "2024-08-21 20:20:14.331Z",
    "updated": "2024-08-21 20:20:14.331Z",
    "name": "vehicle_attributes",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "l9l0tre5",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "rp4nl2ph",
        "name": "value",
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
  const collection = dao.findCollectionByNameOrId("p6rkfidhf3q67c7");

  return dao.deleteCollection(collection);
})
