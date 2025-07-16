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
          // FIX: Handle invalid dates more robustly
          createdAt: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$createdAt", null] },
                  { $ne: ["$createdAt", ""] },
                ],
              },
              then: {
                $dateToString: {
                  date: "$createdAt",
                  format: "%Y-%m-%dT%H:%M:%S.%LZ",
                },
              },
              else: {
                $dateToString: {
                  date: "$$NOW",
                  format: "%Y-%m-%dT%H:%M:%S.%LZ",
                },
              },
            },
          },
          updatedAt: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$updatedAt", null] },
                  { $ne: ["$updatedAt", ""] },
                ],
              },
              then: {
                $dateToString: {
                  date: "$updatedAt",
                  format: "%Y-%m-%dT%H:%M:%S.%LZ",
                },
              },
              else: {
                $dateToString: {
                  date: "$$NOW",
                  format: "%Y-%m-%dT%H:%M:%S.%LZ",
                },
              },
            },
          },
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
          // FIX: Handle invalid dates more robustly
          createdAt: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$createdAt", null] },
                  { $ne: ["$createdAt", ""] },
                ],
              },
              then: {
                $dateToString: {
                  date: "$createdAt",
                  format: "%Y-%m-%dT%H:%M:%S.%LZ",
                },
              },
              else: {
                $dateToString: {
                  date: "$$NOW",
                  format: "%Y-%m-%dT%H:%M:%S.%LZ",
                },
              },
            },
          },
          updatedAt: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$updatedAt", null] },
                  { $ne: ["$updatedAt", ""] },
                ],
              },
              then: {
                $dateToString: {
                  date: "$updatedAt",
                  format: "%Y-%m-%dT%H:%M:%S.%LZ",
                },
              },
              else: {
                $dateToString: {
                  date: "$$NOW",
                  format: "%Y-%m-%dT%H:%M:%S.%LZ",
                },
              },
            },
          },
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
      createdAt: new Date(), // MongoDB will handle this properly
      updatedAt: new Date(), // MongoDB will handle this properly
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
      createdAt: new Date(), // Use Date object for consistency
      updatedAt: new Date(), // Use Date object for consistency
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
      createdAt: new Date(), // Use Date object for consistency
      updatedAt: new Date(), // Use Date object for consistency
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

  // Method to fix existing posts with invalid dates
  static async fixInvalidDates() {
    try {
      const currentDate = new Date();

      // Update posts with null, empty, or invalid createdAt
      const result1 = await this.collection().updateMany(
        {
          $or: [
            { createdAt: null },
            { createdAt: { $exists: false } },
            { createdAt: "" },
            { createdAt: { $lt: new Date("1990-01-01") } }, // Before 1990 is likely invalid
          ],
        },
        {
          $set: {
            createdAt: currentDate,
            updatedAt: currentDate,
          },
        }
      );

      // Update posts with null, empty, or invalid updatedAt
      const result2 = await this.collection().updateMany(
        {
          $or: [
            { updatedAt: null },
            { updatedAt: { $exists: false } },
            { updatedAt: "" },
            { updatedAt: { $lt: new Date("1990-01-01") } }, // Before 1990 is likely invalid
          ],
        },
        {
          $set: {
            updatedAt: currentDate,
          },
        }
      );

      console.log(
        `✅ Fixed ${result1.modifiedCount} posts with invalid createdAt`
      );
      console.log(
        `✅ Fixed ${result2.modifiedCount} posts with invalid updatedAt`
      );

      return {
        createdAtFixed: result1.modifiedCount,
        updatedAtFixed: result2.modifiedCount,
      };
    } catch (error) {
      console.error("❌ Error fixing invalid dates:", error);
      throw new Error("Failed to fix invalid dates");
    }
  }
}

module.exports = { PostModel };
