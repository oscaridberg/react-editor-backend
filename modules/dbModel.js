// MongoDB
const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/documents";

const dbModel = {
    findInCollection: async function findInCollection (dsn, colName, criteria, projection, limit) {
        const client = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);
        const res = await col.find(criteria, projection).limit(limit).toArray();

        await client.close();

        return res;
    },

    addToCollection: async function addToCollection(dsn, colName, title, content) {
        const client = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);
        const res = await col.insertOne( {title: title, content: content} )
    }
}

module.exports = dbModel;