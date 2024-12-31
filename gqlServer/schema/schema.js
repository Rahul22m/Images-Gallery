export const typeDefs = `#graphql
    enum UserType {
        Admin
        User
    } 
    
    type Image {
        id: ID!,
        dataUri: String!
        title: String!
        description: String!
        userId: Int!
        createdAt: String!
        updatedAt: String!
        deletedAt: String
    }
    
    type UploadImage{
        status: String
        image: Image
    }
    type PaginatedImages {
        status: String
        images: [Image] 
        totalImages: Int 
        page: Int    
        limit: Int 
    }

    type User {
        id: ID!
        userType: UserType!
        email: String!
        password: String!
        createdAt: String!
        updatedAt: String!
        deletedAt: String
    }

    type Result{
        id: ID!
        userType: UserType!
        email: String!
        createdAt: String!
        updatedAt: String!
    }

    type Signup{
        status: String
        data: Result
    }

    type PaginatedUsers {
        status: String
        users: [User]
        totalUsers: Int
        page: Int
        limit: Int
    }
    
    type Users{
       users: [User]
    }
    
    type Login{
        status: String
        token: String
        id: ID
        userType: UserType
    }

    type Delete{
        status: String
        message: String
    }
    type Query{
        getUserImages(
            search: String
            sortBy: String
            orderBy: String
            page: Int
            limit: Int
            ): PaginatedImages

        getAnImage(id: ID!): Image

        getAllUsersImages(
            search: String
            sortBy: String
            orderBy: String
            page: Int
            limit: Int
            ): PaginatedImages

        getAnImageByAdmin(id: ID!): Image

        getUsers(
            search: String
            sortBy: String
            orderBy: String
            page: Int
            limit: Int
            ): PaginatedUsers

    } 
    
    type Mutation{
        login(
                email: String! 
                password: String!
                ): Login
        uploadAnImage(image: AddImageInput!): UploadImage

        deleteAnImage(id: ID!): Delete

        deleteAnImageByAdmin(id: ID!): Delete

        createUser(user: AddUserInput): Signup

        deleteUser(id: ID!): Delete
    }

    input AddImageInput{
        userId: ID
        dataUri: String!
        title: String!
        description: String!
    }
    
    input AddUserInput{
        userType: UserType!
        email: String!
        password: String!
        confirmPassword: String!
    }
`
// Query: specify entry types and return types for graph
//int, float, string, boolean, ID