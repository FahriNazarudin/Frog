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

const followTypeDefs = `#graphql
      type User {
          name: String,
          username: String,
          email: String,
          password: String,
      }
      
      type Query {
        getUsers: [User]
      }
  
      type Mutation {
          addUser(name: String, username: String, email: String, password: String): User
      }
    `;

const followResolvers = {
  Query: {
    getUsers: () => users,
  },

  Mutation: {
    addUser: (_, { name, username, email, password }) => {
      const newUser = { name, username, email, password };
      users.push(newUser);
      return newUser;
    },
  },
};

module.exports = {
  followTypeDefs,
  followResolvers,
};
