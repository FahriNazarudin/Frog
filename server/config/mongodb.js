const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI || "mongodb+srv://fahrihacktiv8:HXE3FN8aJqFZTjsg@cluster0.gjc0utf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri)

const database =  client.db("gc01-phase-3")

module.exports = { database }