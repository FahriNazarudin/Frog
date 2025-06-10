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
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          "authorDetail.password": false,
          "authorDetail.createdAt": false,
          "authorDetail.updatedAt": false,
        },
      },
    ];
    const post =  await this.collection()
      // .find({
      //   content: {
      //     $regex: content,
      //     $options: "i",
      //   },
      // })
      .aggregate(agg)
      .toArray();
      console.log(post);
      
      return post
  }

  static async getPostById(id) {
    return await this.collection().findOne({ _id: new ObjectId(id) });
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
