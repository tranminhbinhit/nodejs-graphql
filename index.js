const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");
const configEnv = require('dotenv').config();

// (You may need to replace your connection details, username and password)
const AURA_ENDPOINT = process.env.NEO4J_URI;//'neo4j+s://be7b4531.databases.neo4j.io';
const USERNAME = process.env.NEO4J_USERNAME;//'neo4j';
const PASSWORD = process.env.NEO4J_PASSWORD;//'vuuH4DTZe0IWgiKrvP9NEPyHaAKY8BupOfMV-d4_hig';
const DATABASE = process.env.AURA_INSTANCENAME;

// Create Neo4j driver instance
const driver = neo4j.driver(AURA_ENDPOINT, neo4j.auth.basic(USERNAME, PASSWORD));
const typeDefs = gql`
  type Customer {
    CustomerName: String
    CustomerCode: String
    Gender: Int
    Phone: String
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
    findCustomerByGender(Gender: Int): [Customer]
    @cypher(
      statement: """
        MATCH (c:Customer {Gender: $Gender})
        RETURN c
      """
    )
  }
`;


const checkConnect = async () =>  {
  try {
    await driver.verifyConnectivity()
    console.log('Driver created')
  } catch (error) {
    console.log(`connectivity verification failed. ${error}`)
  }

  const session = driver.session()
  try {
    await session.run('CREATE (i:Item)')
  } catch (error) {
    console.log(`unable to execute query. ${error}`)
  } finally {
    await session.close()
  }
}


// Create instance that contains executable GraphQL schema from GraphQL type definitions
const neo4jGraphQL = new Neo4jGraphQL({
  typeDefs,
  driver
});

//Config port
const PORT = process.env.PORT || 8080;

// Generate schema
neo4jGraphQL.getSchema().then((schema) => {
  // Create ApolloServer instance to serve GraphQL schema
  const server = new ApolloServer({
    schema,
    context: { driverConfig: { database: DATABASE } }
  });

  // Start ApolloServer
  server.listen(PORT).then(({ url }) => {
    checkConnect();
    console.log(`GraphQL server ready at ${url}`);
  });
});
