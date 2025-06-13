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
          tag: { $ifNull: ["$tag", []] },
        },
      },
    ];
    const post = await this.collection().aggregate(agg).toArray();
    console.log(post);

    return post;
  }

  static async getPostById(id) {
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
          tag: { $ifNull: ["$tag", []] },
        },
      },
    ];
    const post = await this.collection().aggregate(agg).toArray();
    return post[0];
  }

  static async addPost(newPost) {
    if (!newPost.content) {
      throw new Error("Content is required");
    }
    if (!newPost.authorId) {
      throw new Error("Author ID is required");
    }

    newPost.createdAt = new Date();
    newPost.updatedAt = new Date();
    newPost.comments = [];
    newPost.likes = [];
    newPost.tag = newPost.tag || [];

    return await this.collection().insertOne(newPost);
  }

  static async addComment(postId, newComment) {
    if (!postId) {
      throw new Error("Post ID is required");
    }
    if (!newComment.content) {
      throw new Error("Comment content is required");
    }
    if (!newComment.username) {
      throw new Error("Username is required");
    }

    return await this.collection().updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: { comments: newComment },
        $set: { updatedAt: new Date() },
      }
    );
  }

  static async addLike(postId, newLike) {
    if (!postId) {
      throw new Error("Post ID is required");
    }
    if (!newLike.username) {
      throw new Error("Username is required");
    }

    const existingLike = await this.collection().findOne({
      _id: new ObjectId(postId),
      "likes.username": newLike.username,
    });

    if (existingLike) {
      throw new Error("User already liked this post");
    }

    return await this.collection().updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: { likes: newLike },
        $set: { updatedAt: new Date() },
      }
    );
  }
}

module.exports = { PostModel };
