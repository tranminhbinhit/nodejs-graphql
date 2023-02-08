# graphql-express-nodejs
A Simple GraphQL Server implementation using Express and Node JS

# Installation
``` 
npm install
```
Run it using `node server.js` in the root directory of your application.


https://console.neo4j.io/

# Wait 60 seconds before connecting using these details, or login to https://console.neo4j.io to validate the Aura Instance is available
NEO4J_URI=neo4j+s://be7b4531.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=vuuH4DTZe0IWgiKrvP9NEPyHaAKY8BupOfMV-d4_hig
AURA_INSTANCENAME=Instance01

https://workspace-preview.neo4j.io/workspace/query

D:\Neo4j\relate-data\dbmss\dbms-85c8a556-28a5-4450-a439-15e641e4b11b\import

# Some key
- yarn cache clean : remove cache

# Query test
    1. Query
    http://localhost:4000
    QUERY
        query FindCustomerByPhone($phone: String) {
            findCustomerByPhone(Phone: $phone) {
                CustomerCode
                CustomerName
                Gender
            }
        }
    GRAPHQL VARIABLES
        {
        "phone": "0944601709"
        }
    2. Select Customer
        {
            phones{
                Phone
                Customer{
                    CustomerCode
                    CustomerName
                },
                customerCount
            }
        }