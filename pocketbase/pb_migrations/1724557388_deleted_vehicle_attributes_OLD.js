/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("p6rkfidhf3q67c7");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "p6rkfidhf3q67c7",
    "created": "2024-08-21 20:20:14.331Z",
    "updated": "2024-08-25 03:36:58.679Z",
    "name": "vehicle_attributes_OLD",
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
      },
      {
        "system": false,
        "id": "widpb3vd",
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
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
