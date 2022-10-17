const database = require("../db/database.js");
const mongo = require("mongodb").MongoClient;

const documents = {
    getAll: async function getAll(
        res=undefined,
    ) {
        let db;

        try {
            db = await database.getDb('documents');

            let result = await db.collection.find({}, {}).limit(0).toArray();
            console.log(result);
            if (res === undefined) {
                return result;
            }

            return res.json({
                data: result
            });
        } catch (e) {
            console.log(e.message);
            return res.json({
                errors: {
                    status: 500,
                    name: "Database Error",
                    description: e.message,
                    path: "/",
                }
            })
        } finally {
            await db.client.close();
        }
    }
};

module.exports = documents;