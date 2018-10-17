const express = require('express');
const fetch = require('node-fetch');
const Graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const FIXER_API_KEY = 'e5c790dff627f07acbb62d687d55f95c';
const PORT = 8081;

// GraphQL schema
const schema = buildSchema(`
  type Query {
      yahoo(amount: Float!, to: String!): Conversion
      fixer(amount: Float!, to: String!): Conversion
    },
    type Conversion {
      converted: Float
      rate: Float
    }
`);

const getYahooConversion = (args) => {
  return new Promise((resolve, reject) => {
    fetch('https://adsynth-ofx-quotewidget-prod.herokuapp.com/api/1', {
      'method': 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        'method': 'spotRateHistory',
        'data': {'base': 'EUR', 'term': args.to.toUpperCase(), 'period': 'week'}
      })
    })
    .then(response => response.json())
    .then((json) => {
      const rate = json.data.CurrentInterbankRate; 

      return resolve({
        converted: rate * args.amount,
        rate: rate,
      });
    })
    .catch(error => console.error('Error:', error));
  });
};

const getFixerConversion = (args) => {
  return new Promise((resolve, reject) => {
    const to = args.to.toUpperCase();
    fetch('http://data.fixer.io/api/latest?access_key=' + FIXER_API_KEY + '&symbols=' + to)
    .then(response => response.json())
    .then((json) => {
      const rate = json.rates[args.to.toUpperCase()];

      return resolve({
        converted: rate * args.amount,
        rate: rate,
      });
    })
    .catch(error => console.error('Error:', error));
  });
};

// Root resolver
const root = {
  yahoo: getYahooConversion,
  fixer: getFixerConversion
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use('/graphql', Graphql({
  schema: schema,
  rootValue: root,
  graphiql: true
}));
app.listen(PORT, () => console.log(`Express GraphQL Server Now Running On localhost:${PORT}/graphql`));
