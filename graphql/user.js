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

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents a user',
    fields: () => ({
        '_id': { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
    })
})

module.exports = UserType;