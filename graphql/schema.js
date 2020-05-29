const { buildSchema } = require("graphql");

module.exports = buildSchema(`

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
    }

    type AuthData {
        token: String!
        userId: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        users: [User!]
    }

    type RootMutation {
        signup(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
