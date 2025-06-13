const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri)
const database =  client.db("gc01-phase-3")

module.exports = { database, client }