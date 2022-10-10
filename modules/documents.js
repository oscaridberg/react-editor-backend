const database = require("../db/database.js");

const documents = {
    getAll: async function getAll(
        res=undefined,
    ) {
        let db;

        try {
            db = await database.getDb();

            let result = await db.collection.find({}).toArray();
            console.log('test');
            if (res === undefined) {
                return result;
            }

            return res.json({
                data: result
            });
        } catch (e) {
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