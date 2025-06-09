// config = require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const users = [
  {
    name: "User1",
    username: "User1",
    email: "user1@mail.com",
    password: "user1",
  },
  {
    name: "User2",
    username: "User2",
    email: "user2@mail.com",
    password: "user2",
  },
];

// const Posts = [
//  {
//   content : "Post1",
//   tag : "tag1",
//   imgUrl : "https://example.com/post1.jpg",
//   likes : 10,
//   createdAt : "2023-10-01T12:00:00Z",
//   updatedAt : "2023-10-01T12:00:00Z",
//  },
//   {
//     content : "Post2",
//     tag : "tag2",
//     imgUrl : "https://example.com/post2.jpg",
//     likes: 11,
//     createdAt : "2023-10-02T12:00:00Z",
//     updatedAt : "2023-10-02T12:00:00Z",
//   }
// ]

// const comments = [
//   {
//     content: "Comment1",
//     username: "1",
//     createdAt: "2023-10-01T12:00:00Z",
//     updatedAt: "2023-10-01T12:00:00Z",
//   },
//   {
//     content: "Comment2",
//     username: "2",
//     createdAt: "2023-10-02T12:00:00Z",
//     updatedAt: "2023-10-02T12:00:00Z",
//   }
// ]

// const likes = [
//   {
//     username: "1",
//     createdAt: "2023-10-01T12:00:00Z",
//     updatedAt: "2023-10-01T12:00:00Z",
//   },
//   {
//     username: "2",
//     createdAt: "2023-10-02T12:00:00Z",
//     updatedAt: "2023-10-02T12:00:00Z",
//   }
// ]


// const Follows = [
//   {
//     followingId,
//     followerId,
//     createdAt: "2023-10-01T12:00:00Z",
//     updatedAt: "2023-10-01T12:00:00Z",
//   },
//   {
//     followingId,
//     followerId,
//     createdAt: "2023-10-02T12:00:00Z",
//     updatedAt: "2023-10-02T12:00:00Z",
//   }
// ]

const typeDefs = `#graphql
    type User {
        name: String,
        username: String,
        email: String,
        password: String,
    }

    type Query {
      getUsers: [User]
    }
  `;
 

const resolvers = {
  Query: {
    getUsers: () => users,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) =>
  console.log(`🚀 Server ready at ${url}`)
)