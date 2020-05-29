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

    type LoginResponse {
        status: Boolean!
        code: Int!
        result: AuthData!
    }
    type SignupResponse {
        status: Boolean!
        code: Int!
        result: User!
    }
    type UsersResponse {
        status: Boolean!
        code: Int!
        result: [User!]
    }

    type UserResponse {
        status: Boolean!
        code: Int!
        result: User!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        login(email: String!, password: String!): LoginResponse!
        users: UsersResponse!
        user(id: ID!): UserResponse!
    }

    type RootMutation {
        signup(userInput: UserInputData): SignupResponse!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
