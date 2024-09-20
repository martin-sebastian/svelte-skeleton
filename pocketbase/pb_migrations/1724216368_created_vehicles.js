/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "6u1mn0xdwgf14ib",
    "created": "2024-08-21 04:59:28.253Z",
    "updated": "2024-08-21 04:59:28.253Z",
    "name": "vehicles",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "cijbqkif",
        "name": "link",
        "type": "url",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "exceptDomains": null,
          "onlyDomains": null
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
  const collection = dao.findCollectionByNameOrId("6u1mn0xdwgf14ib");

  return dao.deleteCollection(collection);
})
