const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');

// const TeacherType = require("./teacher.js");
// const StudentType = require("./student.js");

const DocumentType = new GraphQLObjectType({
    name: 'Document',
    description: 'This represents a document',
    fields: () => ({
        '_id': { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: GraphQLString },
        lastSaved: { type: new GraphQLNonNull(GraphQLString) },
        authUser: {type: GraphQLString}
    })
})

module.exports = DocumentType;