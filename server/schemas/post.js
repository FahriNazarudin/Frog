const { PostModel } = require("../models/PostModel");

const postTypeDefs = `#graphql
    type Post {
        _id: ID
        content: String
        tag: String
        imgUrl: String
        authorId: ID
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
    }

    type Comment {
        content: String
        username: String
        createdAt: String
        updatedAt: String
    }
    
    type Like {
        username: String
        createdAt: String
        updatedAt: String
    }

    extend type Query {
        getPosts: [Post]
        getPostById(id: ID!): Post
    }
    
    extend type Mutation {
        addPost(content: String, tag: String, imgUrl: String, authorId: ID): Post
        addComment(postId: ID, content: String, username: String): String
        addLike(postId: ID, username: String): String
    }
`;

const postResolvers = {
  Query: {
    getPosts: async (parent, args, { auth }) => {
      await auth();
      const posts = await PostModel.getPosts();
      return posts;
    },

    getPostById: async (_, { id }, { auth }) => {
      await auth();
      return await PostModel.getPostById(id);
    },
  },

  Mutation: {
    addPost: async (_, { content, tag, imgUrl, authorId }, { auth }) => {
      await auth();
      const newPost = {
        content,
        tag,
        imgUrl,
        authorId,
        comments: [],
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await PostModel.addPost(newPost);
      return { _id: result.insertedId, ...newPost };
    },

    addComment: async (_, { postId, content, username }, { auth }) => {
      await auth();
      const newComment = {
        content,
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await PostModel.addComment(postId, newComment);
      return "Comment added successfully";
    },

    addLike: async (_, { postId, username }, { auth }) => {
      await auth();
      const newLike = {
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await PostModel.addLike(postId, newLike);
      return "Like added successfully";
    },
  },
};

module.exports = {
  postTypeDefs,
  postResolvers,
};
