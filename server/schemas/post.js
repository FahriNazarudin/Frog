const redis = require("../config/redis");
const { PostModel } = require("../models/PostModel");

const postTypeDefs = `#graphql
    type Post {
        _id: ID
        content: String
        tag: String
        imgUrl: String
        comments: [Comment]
        likes: [Like]
        createdAt: String
        updatedAt: String
        authorDetail: authorDetail
    }
    type authorDetail {
        _id: ID
        name: String
        username: String
        email: String
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

     type Query {
        getPosts: [Post]
        getPostById(id: ID): Post
        getPostByContent(content: String): [Post]
    }
    
     type Mutation {
        addPost(content: String, tag: String, imgUrl: String, authorId: ID): Post
        addComment(postId: ID, content: String, username: String): String
        # // perlu hapus username karena sudah ada di auth
        addLike(postId: ID, username: String): String 
    }
`;

const postResolvers = {
  Query: {
    getPosts: async (parent, args, { auth }) => {
      await auth();

      const postsCache = await redis.get("posts:all");
      if (postsCache) {
        return JSON.parse(postsCache);
      }

      const posts = await PostModel.getPosts();
      await redis.set("posts:all", JSON.stringify(posts), "EX", 3600)
      return posts;
    },

    getPostById: async (_, { id }, { auth }) => {
      await auth();
      return await PostModel.getPostById(id);
    },

    getPostByContent: async (_, { content }, { auth }) => {
      await auth();
      const posts = await PostModel.getPosts(content);
      return posts;
    },
  },

  Mutation: {
    addPost: async (_, { content, tag, imgUrl }, { auth }) => {
      const user = await auth();
      const newPost = {
        content,
        tag,
        imgUrl,
        authorId: user._id,
        comments: [],
        likes: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await PostModel.addPost(newPost);
      await redis.del("posts:all"); 
      return newPost;
    },

    addComment: async (_, { postId, content }, { auth }) => {
      const user = await auth();
      const newComment = {
        content,
        username: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await PostModel.addComment(postId, newComment);
      await redis.del("posts:all");
      return "Comment added successfully";
    },

    addLike: async (_, { postId }, { auth }) => {
      const user = await auth();
      const newLike = {
        username: user.username,
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
