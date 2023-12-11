const express = require('express')
const {ApolloServer} = require('@apollo/server')
const {expressMiddleware} = require('@apollo/server/express4')
const bodyParser = require('body-parser')
const cors = require('cors')
const {default: axios} = require('axios');

const {TODOS} = require('./todo.js');
const {USER} = require('./user.js');

async function startServer(){
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
     type User {
      id: ID!
      name: String!
      username: String!
      email: String!
      phone: String!
      website: String!
     }
     type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user: User
    },
     type Query {
        getTodos: [Todo]
        getAllUsers: [User]
        getUser(id: ID!): User
}
    `,
    resolvers: {
      Todo: {
        // user: async (todo) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)).data,
        user: (todo) => USER.find((e)=> e.id === todo.id),
      },
      Query: {
        // getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data, 
        getTodos: () => TODOS,
        // getAllUsers: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data, 
        getAllUsers: () => USER,
        // getUser: async (parent, {id}) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data, 
        getUser: (parent, {id}) => USER.find((e)=> e.id === id),
      }
    },
  });

  app.use(bodyParser.json())
  app.use(cors());

  await server.start();

  app.use('/graphql', expressMiddleware(server));

  app.listen(8000, ()=> console.log(`App is listening on PORT: 8000`));
}
startServer();

