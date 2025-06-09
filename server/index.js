require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const { userTypeDefs, userResolvers } = require("./schemas/user");
const { postTypeDefs, postResolvers } = require("./schemas/post");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs],
  resolvers: [userResolvers, postResolvers],
});

startStandaloneServer(server, {
  listen: { port: 3000 },
}).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
