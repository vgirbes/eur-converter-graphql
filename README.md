# iti-graphql-node

Project made to test GraphQL with Node.

This project converts EURs to any other currency through the Yahoo and Fixer API.

# Prerequisites

1. Docker
2. Docker-compose >= 3.6

# First steps
```sh
$ docker-compose up -d
```

Go to http://localhost:8081 and feel free to test the online EUR currency converter.

```graphql
{
  yahoo(amount: 10.20, to: "USD") {
    converted, rate
  }
}
```

```graphql
{
  fixer(amount: 10.20, to: "USD") {
    converted, rate
  }
}
```

Expected response:
```json
{
  "data": {
    "yahoo": {
      "converted": 11.800379999999999,
      "rate": 1.1569
    }
  }
}
``` 