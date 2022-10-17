const DocumentType = require("./document.js");
const UserType = require("./user.js");
const documents = require("../modules/documents.js");

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');


const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        document: {
            type: DocumentType,
            description: 'A single document',
            args: {
                docId: { type: GraphQLString }
            },
            resolve: async function(parent, args) {
                let docArray = await documents.getAll();
                // return docArray
                return docArray.find(document => document['_id'] === args.docId);
            }
        },
        documents: {
            type: new GraphQLList(DocumentType),
            description: 'List of all documents',
            resolve: async function() {
                return await documents.getAll();
            }
        },
        user: {
            type: UserType,
            description: 'A single user',
            args: {
                email: {type: GraphQLString}
            },
            resolve: async function (parent, args) {
                let users = await getUsers('')
            }
        }
    })
})

module.exports = RootQueryType;