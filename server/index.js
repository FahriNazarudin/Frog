require("dotenv").config();
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const { UserModel } = require("./models/UserModel");
const { userTypeDefs, userResolvers } = require("./schemas/user");
const { postTypeDefs, postResolvers } = require("./schemas/post");
const { followTypeDefs, followResolvers } = require("./schemas/follow");
const { verifyToken } = require("./helpers/jwt");


const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
});

startStandaloneServer(server, {
  listen: { port: 3000 },
  context: async ({ req }) => {

    return { 
      auth: async ()=> {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith("Bearer ")) {
          throw new Error("You need to login first")
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyToken(token);
        if(!payload) {
          throw new Error("Invalid token")
        }

        const user = await UserModel.getUserById(payload.id);
        if(!user) {
          throw new Error("User not found")
        }

        return  user 

      }
     };
  },
}).then(({ url }) => console.log(`🚀 Server ready at ${url}`));
