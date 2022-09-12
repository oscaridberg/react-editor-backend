// MongoDB
const mongo = require("mongodb").MongoClient;
const dsn =  process.env.DBWEBB_DSN || "mongodb://localhost:27017/documents";


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
        const exists = await dbModel.checkIfExists(dsn, colName, title);
        
        if (exists.length > 0) {
            const id = exists[0]._id
            console.log('true');
            console.log(exists[0]._id);
            const res = await col.updateOne( {title: title},
                { $set: {content: content, lastSaved: new Date} } )

        } else {
            const res = await col.insertOne({title: title, content: content, lastSaved: new Date});
        }


        await client.close();
    },

    checkIfExists: async function checkIfExists(dsn, colName, title) {
        const client = await mongo.connect(dsn);
        const db = await client.db();
        const col = await db.collection(colName);
        const res = await col.find({title: `${title}`}).toArray();
        await client.close();
        return res;
    }
}

module.exports = dbModel;