const { ObjectId } = require("mongodb");
const { database } = require("../config/mongodb");

class PostModel {
  static collection() {
    return database.collection("posts");
  }

  static async getPosts(content = "") {
    const agg = [
      {
        $match: {
          content: {
            $regex: content,
            $options: "i",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDetail",
        },
      },
      {
        $unwind: {
          path: "$authorDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "authorDetail.password": false,
          "authorDetail.createdAt": false,
          "authorDetail.updatedAt": false,
        },
      },
      {
        $addFields: {
          // Fix: Convert array tag to string, or null if empty
          tag: {
            $cond: {
              if: { $isArray: "$tag" },
              then: {
                $cond: {
                  if: { $eq: [{ $size: "$tag" }, 0] },
                  then: null,
                  else: { $arrayElemAt: ["$tag", 0] },
                },
              },
              else: "$tag",
            },
          },
          // Ensure other fields have proper defaults
          content: { $ifNull: ["$content", ""] },
          imgUrl: { $ifNull: ["$imgUrl", ""] },
          comments: { $ifNull: ["$comments", []] },
          likes: { $ifNull: ["$likes", []] },
          createdAt: { $ifNull: ["$createdAt", new Date()] },
          updatedAt: { $ifNull: ["$updatedAt", new Date()] },
        },
      },
      {
        $sort: { createdAt: -1 }, // Sort by newest first
      },
    ];

    try {
      const posts = await this.collection().aggregate(agg).toArray();
      console.log(`📊 Retrieved ${posts.length} posts`);
      return posts;
    } catch (error) {
      console.error("❌ Error in getPosts:", error);
      throw new Error("Failed to retrieve posts");
    }
  }

  static async getPostById(id) {
    if (!id || !ObjectId.isValid(id)) {
      throw new Error("Invalid post ID");
    }

    const agg = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authorDetail",
        },
      },
      {
        $unwind: {
          path: "$authorDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          "authorDetail.password": false,
          "authorDetail.createdAt": false,
          "authorDetail.updatedAt": false,
        },
      },
      {
        $addFields: {
          // Fix: Convert array tag to string, or null if empty
          tag: {
            $cond: {
              if: { $isArray: "$tag" },
              then: {
                $cond: {
                  if: { $eq: [{ $size: "$tag" }, 0] },
                  then: null,
                  else: { $arrayElemAt: ["$tag", 0] },
                },
              },
              else: "$tag",
            },
          },
          content: { $ifNull: ["$content", ""] },
          imgUrl: { $ifNull: ["$imgUrl", ""] },
          comments: { $ifNull: ["$comments", []] },
          likes: { $ifNull: ["$likes", []] },
        },
      },
    ];

    try {
      const posts = await this.collection().aggregate(agg).toArray();
      return posts[0] || null;
    } catch (error) {
      console.error("❌ Error in getPostById:", error);
      throw new Error("Failed to retrieve post");
    }
  }

  static async addPost(newPost) {
    // Validation
    if (!newPost.content || newPost.content.trim() === "") {
      throw new Error("Content is required and cannot be empty");
    }
    if (!newPost.authorId) {
      throw new Error("Author ID is required");
    }
    if (!ObjectId.isValid(newPost.authorId)) {
      throw new Error("Invalid author ID format");
    }

    // Sanitize and prepare post data
    const postData = {
      content: newPost.content.trim(),
      tag: newPost.tag && newPost.tag.trim() ? newPost.tag.trim() : null, // Ensure tag is string or null
      imgUrl:
        newPost.imgUrl && newPost.imgUrl.trim() ? newPost.imgUrl.trim() : "",
      authorId: new ObjectId(newPost.authorId),
      comments: [],
      likes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const result = await this.collection().insertOne(postData);
      console.log("✅ Post created with ID:", result.insertedId);

      // Return the created post with populated authorDetail
      return await this.getPostById(result.insertedId);
    } catch (error) {
      console.error("❌ Error in addPost:", error);
      throw new Error("Failed to create post");
    }
  }

  static async addComment(postId, newComment) {
    // Validation
    if (!postId || !ObjectId.isValid(postId)) {
      throw new Error("Valid Post ID is required");
    }
    if (!newComment.content || newComment.content.trim() === "") {
      throw new Error("Comment content is required and cannot be empty");
    }
    if (!newComment.username || newComment.username.trim() === "") {
      throw new Error("Username is required");
    }

    // Check if post exists
    const postExists = await this.collection().findOne({
      _id: new ObjectId(postId),
    });
    if (!postExists) {
      throw new Error("Post not found");
    }

    const commentData = {
      content: newComment.content.trim(),
      username: newComment.username.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const result = await this.collection().updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: { comments: commentData },
          $set: { updatedAt: new Date() },
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Post not found");
      }

      console.log("✅ Comment added to post:", postId);
      return result;
    } catch (error) {
      console.error("❌ Error in addComment:", error);
      throw new Error("Failed to add comment");
    }
  }

  static async addLike(postId, newLike) {
    // Validation
    if (!postId || !ObjectId.isValid(postId)) {
      throw new Error("Valid Post ID is required");
    }
    if (!newLike.username || newLike.username.trim() === "") {
      throw new Error("Username is required");
    }

    // Check if post exists
    const postExists = await this.collection().findOne({
      _id: new ObjectId(postId),
    });
    if (!postExists) {
      throw new Error("Post not found");
    }

    // Check if user already liked this post
    const existingLike = await this.collection().findOne({
      _id: new ObjectId(postId),
      "likes.username": newLike.username.trim(),
    });

    if (existingLike) {
      throw new Error("User already liked this post");
    }

    const likeData = {
      username: newLike.username.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const result = await this.collection().updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: { likes: likeData },
          $set: { updatedAt: new Date() },
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Post not found");
      }

      console.log("✅ Like added to post:", postId);
      return result;
    } catch (error) {
      console.error("❌ Error in addLike:", error);
      throw new Error("Failed to add like");
    }
  }

  // New method: Unlike post
  static async removeLike(postId, username) {
    if (!postId || !ObjectId.isValid(postId)) {
      throw new Error("Valid Post ID is required");
    }
    if (!username || username.trim() === "") {
      throw new Error("Username is required");
    }

    try {
      const result = await this.collection().updateOne(
        { _id: new ObjectId(postId) },
        {
          $pull: { likes: { username: username.trim() } },
          $set: { updatedAt: new Date() },
        }
      );

      if (result.matchedCount === 0) {
        throw new Error("Post not found");
      }

      console.log("✅ Like removed from post:", postId);
      return result;
    } catch (error) {
      console.error("❌ Error in removeLike:", error);
      throw new Error("Failed to remove like");
    }
  }
}

module.exports = { PostModel };