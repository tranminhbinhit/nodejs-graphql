const express = require("express");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const neo4j = require("neo4j-driver");
const { ApolloServer } = require("apollo-server-express");
const http = require("http");
const configEnv = require('dotenv').config();

const app = express();

// (You may need to replace your connection details, username and password)
const AURA_ENDPOINT = process.env.NEO4J_URI;//'neo4j+s://be7b4531.databases.neo4j.io';
const USERNAME = process.env.NEO4J_USERNAME;//'neo4j';
const PASSWORD = process.env.NEO4J_PASSWORD;//'vuuH4DTZe0IWgiKrvP9NEPyHaAKY8BupOfMV-d4_hig';
const DATABASE = process.env.AURA_INSTANCENAME;

// Create Neo4j driver instance
const driver = neo4j.driver(AURA_ENDPOINT, neo4j.auth.basic(USERNAME, PASSWORD));

const typeDefs = `
  type Customer {
    CustomerName: String
    CustomerCode: String
    Gender: Int
    Phone: String
    fullInfo: String! @customResolver(requires: ["CustomerName", "CustomerCode"])
    PhoneRef: [Phone!]! @relationship(type: "HAS_PHONE", direction: OUT)
  }

  type Phone {    
    Phone: String
    Customer: [Customer!]! @relationship(type: "HAS_PHONE", direction: IN)
    customerCount: Int @cypher(statement:"MATCH (this)<-[:HAS_PHONE]-(p:Customer) RETURN count(p)")
  }

  type Query {
    findCustomerByPhone(Phone: String): [Customer]
    @cypher(
      statement:"""
        OPTIONAL match(c:Customer{Phone:$Phone})
        return distinct c
      """
    )
    findCustomerByCode(CustomerCode: String): Customer
    @cypher(
      statement:"""
        OPTIONAL match(c:Customer{CustomerCode:$CustomerCode})
        return distinct c
      """
    )
  }
`;
const resolvers = {
  Customer: {
    fullInfo(source) {
        return `${source.CustomerName} - ${source.CustomerCode}`;
    },
  },
};

const neo4jGraphQL = new Neo4jGraphQL({
  typeDefs,
  driver,
  resolvers
});

const checkConnect = async () =>  {
  try {
    await driver.verifyConnectivity()
    console.log('Driver created')
  } catch (error) {
    console.log(`Connectivity verification failed. ${error}`)
  }

  // const session = driver.session()
  // try {
  //   await session.run('CREATE (i:Item)')
  // } catch (error) {
  //   console.log(`unable to execute query. ${error}`)
  // } finally {
  //   await session.close()
  // }
}

async function startServer() {
    checkConnect();
    neo4jGraphQL.getSchema().then( async (schema) => {
      // Create ApolloServer instance to serve GraphQL schema
      const apolloServer = new ApolloServer({
        schema,
        context: { driverConfig: { database: DATABASE } }
      });
    
      await apolloServer.start();
      apolloServer.applyMiddleware({ app });  
    });
}
startServer();
//const httpserver = http.createServer(app);

app.get("/test", function (req, res) {
    res.json({ data: "api working" });
});
app.get(
  "/",
  function (request, response) {
    response.sendFile(
      __dirname + "/static/welcome-page.html"
    );
  }
);

const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
    console.log(`Graphql path is ${`/graphql`}`);
});