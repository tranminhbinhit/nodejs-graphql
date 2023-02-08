const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");

const app = express();

const typeDefs = `
    type Query{
        totalPosts: Int!
    }
`;
const resolvers = {
    Query: {
        totalPosts: () => 100,
    },
};
let apolloServer = null;
async function startServer() {
    apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
}
startServer();
const httpserver = http.createServer(app);

app.get("/rest", function (req, res) {
    res.json({ data: "api working" });
});

app.listen(4000, function () {
    console.log(`server running on port 4000`);
    console.log(`gql path is ${apolloServer.graphqlPath}`);
});