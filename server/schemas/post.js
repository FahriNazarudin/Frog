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
        authorDetail: AuthorDetail
    }
    
    type AuthorDetail {
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
        getPostById(id: ID!): Post
        getPostByContent(content: String!): [Post]
    }
    
    type Mutation {
        addPost(content: String!, tag: String, imgUrl: String, authorId: ID): Post
        addComment(postId: ID!, content: String!, username: String): String
        addLike(postId: ID!, username: String): String 
        removeLike(postId: ID!, username: String): String
        fixInvalidDates: String
    }
`;

// Utility function untuk sanitize posts
const sanitizePost = (post) => {
  if (!post) return null;

  return {
    ...post,
    // Fix tag field - convert array to string or null
    tag: Array.isArray(post.tag)
      ? post.tag.length > 0
        ? post.tag[0]
        : null
      : post.tag || null,

    // Ensure other fields have proper defaults
    content: post.content || "",
    imgUrl: post.imgUrl || "",
    comments: Array.isArray(post.comments) ? post.comments : [],
    likes: Array.isArray(post.likes) ? post.likes : [],

    // FIX: More robust date handling to prevent Unix Epoch issue
    createdAt: (() => {
      if (
        !post.createdAt ||
        post.createdAt === "" ||
        post.createdAt === "1970-01-01T00:00:00.000Z"
      ) {
        return new Date().toISOString();
      }
      if (typeof post.createdAt === "string") {
        const date = new Date(post.createdAt);
        return isNaN(date.getTime())
          ? new Date().toISOString()
          : date.toISOString();
      }
      return new Date(post.createdAt).toISOString();
    })(),
    updatedAt: (() => {
      if (
        !post.updatedAt ||
        post.updatedAt === "" ||
        post.updatedAt === "1970-01-01T00:00:00.000Z"
      ) {
        return new Date().toISOString();
      }
      if (typeof post.updatedAt === "string") {
        const date = new Date(post.updatedAt);
        return isNaN(date.getTime())
          ? new Date().toISOString()
          : date.toISOString();
      }
      return new Date(post.updatedAt).toISOString();
    })(),

    // Ensure authorDetail is properly formatted
    authorDetail: post.authorDetail
      ? {
          _id: post.authorDetail._id || null,
          name: post.authorDetail.name || "Unknown User",
          username: post.authorDetail.username || "unknown",
          email: post.authorDetail.email || "",
        }
      : null,
  };
};

// Utility function untuk sanitize multiple posts
const sanitizePosts = (posts) => {
  if (!Array.isArray(posts)) return [];
  return posts.map(sanitizePost).filter(Boolean);
};

const postResolvers = {
  Query: {
    getPosts: async (parent, args, { auth }) => {
      try {
        await auth();

        const cacheKey = "posts:all";
        const postsCache = await redis.get(cacheKey);

        if (postsCache) {
          console.log("📦 Retrieved posts from cache");
          const cachedPosts = JSON.parse(postsCache);
          return sanitizePosts(cachedPosts);
        }

        console.log("🔄 Fetching posts from database");
        const posts = await PostModel.getPosts();

        // Sanitize posts before caching and returning
        const sanitizedPosts = sanitizePosts(posts);

        // Cache for 1 hour (3600 seconds)
        if (sanitizedPosts.length > 0) {
          await redis.setex(cacheKey, 3600, JSON.stringify(sanitizedPosts));
          console.log("📦 Posts cached successfully");
        }

        return sanitizedPosts;
      } catch (error) {
        console.error("❌ Error in getPosts resolver:", error);
        throw new Error("Failed to retrieve posts");
      }
    },

    getPostById: async (_, { id }, { auth }) => {
      try {
        await auth();

        if (!id) {
          throw new Error("Post ID is required");
        }

        const cacheKey = `post:${id}`;
        const postCache = await redis.get(cacheKey);

        if (postCache) {
          console.log("📦 Retrieved post from cache");
          const cachedPost = JSON.parse(postCache);
          return sanitizePost(cachedPost);
        }

        console.log(`🔄 Fetching post ${id} from database`);
        const post = await PostModel.getPostById(id);

        if (!post) {
          throw new Error("Post not found");
        }

        // Sanitize post before caching and returning
        const sanitizedPost = sanitizePost(post);

        // Cache for 30 minutes (1800 seconds)
        await redis.setex(cacheKey, 1800, JSON.stringify(sanitizedPost));
        console.log(`📦 Post ${id} cached successfully`);

        return sanitizedPost;
      } catch (error) {
        console.error("❌ Error in getPostById resolver:", error);
        throw error;
      }
    },

    getPostByContent: async (_, { content }, { auth }) => {
      try {
        await auth();

        if (!content || content.trim() === "") {
          throw new Error("Search content is required");
        }

        console.log(`🔍 Searching posts with content: "${content}"`);
        const posts = await PostModel.getPosts(content.trim());

        // Sanitize search results
        const sanitizedPosts = sanitizePosts(posts);

        console.log(
          `📊 Found ${sanitizedPosts.length} posts matching "${content}"`
        );
        return sanitizedPosts;
      } catch (error) {
        console.error("❌ Error in getPostByContent resolver:", error);
        throw new Error("Failed to search posts");
      }
    },
  },

  Mutation: {
    addPost: async (_, { content, tag, imgUrl, authorId }, { auth }) => {
      try {
        const user = await auth();

        // Validation
        if (!content || content.trim() === "") {
          throw new Error("Content is required and cannot be empty");
        }

        // Use authenticated user's ID if authorId not provided
        const finalAuthorId = user._id;

        // Sanitize input data
        const newPost = {
          content: content.trim(),
          tag: tag && tag.trim() ? tag.trim() : null, // Ensure tag is string or null
          imgUrl: imgUrl && imgUrl.trim() ? imgUrl.trim() : "",
          authorId: finalAuthorId,
        };

        console.log("🚀 Creating new post:", {
          content: newPost.content.substring(0, 50) + "...",
          tag: newPost.tag,
          authorId: finalAuthorId,
        });

        const createdPost = await PostModel.addPost(newPost);

        // Sanitize created post
        const sanitizedPost = sanitizePost(createdPost);

        // Clear cache after successful creation
        await Promise.all([
          redis.del("posts:all"),
          // Also clear any search-related caches if they exist
          redis.del("posts:search:*"),
        ]);

        console.log("✅ Post created successfully with ID:", createdPost._id);
        console.log("🗑️ Cache cleared successfully");

        return sanitizedPost;
      } catch (error) {
        console.error("❌ Error in addPost resolver:", error);
        throw error;
      }
    },

    addComment: async (_, { postId, content }, { auth }) => {
      try {
        const user = await auth();

        // Validation
        if (!postId) {
          throw new Error("Post ID is required");
        }
        if (!content || content.trim() === "") {
          throw new Error("Comment content is required and cannot be empty");
        }

        const newComment = {
          content: content.trim(),
          username: user.username,
        };

        console.log(`💬 Adding comment to post ${postId} by ${user.username}`);
        await PostModel.addComment(postId, newComment);

        // Clear related caches
        await Promise.all([
          redis.del("posts:all"),
          redis.del(`post:${postId}`),
        ]);

        console.log("✅ Comment added successfully");
        console.log("🗑️ Related caches cleared");

        return "Comment added successfully";
      } catch (error) {
        console.error("❌ Error in addComment resolver:", error);
        throw error;
      }
    },

    addLike: async (_, { postId }, { auth }) => {
      try {
        const user = await auth();

        // Validation
        if (!postId) {
          throw new Error("Post ID is required");
        }

        const newLike = {
          username: user.username,
        };

        console.log(`👍 Adding like to post ${postId} by ${user.username}`);
        await PostModel.addLike(postId, newLike);

        // Clear related caches
        await Promise.all([
          redis.del("posts:all"),
          redis.del(`post:${postId}`),
        ]);

        console.log("✅ Like added successfully");
        console.log("🗑️ Related caches cleared");

        return "Like added successfully";
      } catch (error) {
        console.error("❌ Error in addLike resolver:", error);

        // Handle specific error for already liked
        if (error.message.includes("already liked")) {
          throw new Error("You have already liked this post");
        }

        throw error;
      }
    },

    removeLike: async (_, { postId }, { auth }) => {
      try {
        const user = await auth();

        // Validation
        if (!postId) {
          throw new Error("Post ID is required");
        }

        console.log(`👎 Removing like from post ${postId} by ${user.username}`);
        await PostModel.removeLike(postId, user.username);

        // Clear related caches
        await Promise.all([
          redis.del("posts:all"),
          redis.del(`post:${postId}`),
        ]);

        console.log("✅ Like removed successfully");
        console.log("🗑️ Related caches cleared");

        return "Like removed successfully";
      } catch (error) {
        console.error("❌ Error in removeLike resolver:", error);
        throw error;
      }
    },

    fixInvalidDates: async (_, args, { auth }) => {
      try {
        await auth(); // Ensure user is authenticated

        console.log("🔧 Starting to fix invalid dates in posts...");
        const result = await PostModel.fixInvalidDates();

        // Clear all caches after fixing dates
        await redis.del("posts:all");
        const keys = await redis.keys("post:*");
        if (keys.length > 0) {
          await redis.del(...keys);
        }

        console.log("✅ Invalid dates fixed successfully");
        console.log("🗑️ All caches cleared");

        return `Fixed ${result.createdAtFixed} createdAt fields and ${result.updatedAtFixed} updatedAt fields`;
      } catch (error) {
        console.error("❌ Error in fixInvalidDates resolver:", error);
        throw error;
      }
    },
  },
};

module.exports = {
  postTypeDefs,
  postResolvers,
};
