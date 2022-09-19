// MongoDB
const mongo = require("mongodb").MongoClient;
const database = require('../db/database.js');
/**
 * Model to handle MongoDB requests.
 */
const dbModel = {
    /**
     * Find documents in an collection by matching search criteria.
     *
     * @async
     *
     * @param {string} dsn        DSN to connect to database.
     * @param {string} colName    Name of collection.
     * @param {object} criteria   Search criteria.
     * @param {object} projection What to project in results.
     * @param {number} limit      Limit the number of documents to retrieve.
     *
     * @throws Error when database operation fails.
     *
     * @return {Promise<array>} The resultset as an array.
     */
    findInCollection: async function findInCollection (colName, criteria, projection, limit) {
        const db = await database.getDb(colName);
        const col = db.collection;
        const res = await col.find(criteria, projection).limit(limit).toArray();

        await db.client.close();

        return res;
    },

    addToCollection: async function addToCollection(colName, title, content) {
        const db = await database.getDb(colName);
        const col = db.collection;

        // Check if document with current title already exists in database.
        const exists = await dbModel.checkIfExists(colName, title);
        
        // If document already exists update it.
        // If not insert it into database. 
        if (exists.length > 0) {
            const id = exists[0]._id
            const res = await col.updateOne( {_id: id},
                { $set: {title: title, content: content, lastSaved: new Date} } )

        } else {
            const res = await col.insertOne({title: title, content: content, lastSaved: new Date});
        }


        await db.client.close();
    },

    checkIfExists: async function checkIfExists(colName, title) {
        const db = await database.getDb(colName);
        // const col = await db.collection;
        const res = await db.collection.find({title: `${title}`}).toArray();
        console.log(res);
        await db.client.close();
        return res;
    }
}

module.exports = dbModel;