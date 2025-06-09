const Posts = [
  {
    content: "Post1",
    tag: "tag1",
    imgUrl: "https://example.com/post1.jpg",
    likes: 10,
    createdAt: "2023-10-01T12:00:00Z",
    updatedAt: "2023-10-01T12:00:00Z",
  },
  {
    content: "Post2",
    tag: "tag2",
    imgUrl: "https://example.com/post2.jpg",
    likes: 11,
    createdAt: "2023-10-02T12:00:00Z",
    updatedAt: "2023-10-02T12:00:00Z",
  },
];

const postTypeDefs = `#graphql
    type Post {
    content: String,
    tag: String,
    imgUrl: String,
    createdAt: String,
    updatedAt: String,
    }

    type Query {
      getPost: [Post]
    }
  `;

const postResolvers = {
  Query: {
    getPost: () => Posts,
  },
};

module.exports = {
  postTypeDefs,
  postResolvers,
};
