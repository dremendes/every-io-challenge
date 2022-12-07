# Every.io engineering challenge

### Challenge link: https://github.com/every-io/engineering-interivew-be

-----

I am submitting in a unlinked repo so my code won't be available
to others candidates
I tried my best with the time I got, here's a summary:

```
Requirements
 [X] - Tasks with Title, Description and Status that has 4 different states
 [X] - Authentication
 [X] - Authorization

 Ideal
 [X] - Typescript
 [X] - Tests
 [ ] - Dockerized Application
 
 Extra credit
 [X] - Apollo Server Graphql
 [X] - Logging
```

## Coverage Report 
```
=============================== Coverage summary ===============================
Statements   : 68.27% ( 738/1081 )
Branches     : 68% ( 34/50 )
Functions    : 26.41% ( 28/106 )
Lines        : 68.27% ( 738/1081 )
================================================================================
```
##### visit ./every-io-challenge/coverage/lcov-report/index.html for more

## Instructions

You must have postgres installation readly and create a database for the project.

You must provide on your _.env_ file information about this database, as well as an 
user credentials to access it. I commited it with data. Replace it with yours 
configuration. You need to do it because I failed to Dockerize it.

Then:
 - $ yarn
 - $ yarn migration:run
 - $ yarn build
 - $ yarn start:dev

This shall suffice, you may now proceed to visit  http://localhost:3030/graphql

Please, do not forget to also visit http://localhost:3030/log/info to check out
some fine logging capabilities.

Now you are ready to load-up your Playground with some Mutations & Queries.
Please check each of them. The createUser mutation is public. The others will ask
for an Authorization Token that you receive at every login. 

You need to provide it in your HTTP Header like in the following example:
```
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuZHJlIiwic3ViIjoiYWY3YWNiODctMTNlOC00NTkwLTgyNmQtOTliYjA1ZWYyMTcyIiwicGVybWlzc2lvbnMiOiJBRE1JTiIsImlhdCI6MTY3MDM1OTQxNiwiZXhwIjoxNjcwMzU5NDc2fQ.KlU9wkHqkxAR9qufIL59BUs5KTmZr3OpOaZdMD6sIUk"
}
```

You need an User do login and an User can have regular User permissions or Admin 
permission. Some Mutations and Queries will ask for Admin permission.

Mutations and Queries:

```
query whoAmI {
  whoAmI {
    id
    username
  }
}

mutation createJonesUser {
  createUser(
    createUserInput: {
      username: "jones",
      password: "bro",
      permissions: USER
    }
  ) {
    id
    username
  }
}

mutation createAndreUser {
  createUser(
    createUserInput: {
      username: "andre",
      password: "pass",
      permissions: ADMIN
    }
  ) {
    id
    username
  }
}

query loginJones {
  login(username: "jones", password: "bro") {
    access_token
  }
}

query loginAndre {
  login(username: "andre", password: "pass") {
    access_token
  }
}

query myTasks {
  myTasks {
    id
    title
    status
    user {
      username
    }
  }
}

mutation createTask {
  createTask(
    createTaskInput: {
      title: "Teste 3",
      description: "Desc",
      status: Inprogress,
    }
  ) {
    id
    title
    description
    status
    __typename
  }
}

mutation updateTask {
  updateTask(
    updateTaskInput: { 
      id: "956d9a85-43cd-4937-8bf3-b20c3747940c", 
      title: "Jones test",
      status: Done,
    }
  ) {
    id
    title
    description
    status
  }
}

mutation removeTask {
  removeTask(id: "4f89700a-31be-4db4-8d28-c6870aa639b0")
}

query allTasks {
  tasks {
    id
    title
    description
    status
    user {
      username
    }
  }
}

query task {
  task(id: "3633fbb9-6a63-45b8-b776-5004721d3efd") {
    id
    title
    description
    status
  }
}

```

 Devlog details on what is missing:
  - I am getting an error on #docker composer up command and the time is 
  finishing up so that's the reason this project is not Dockerized.
  - Right now I remembered about eager parameter, that is certainly
  what I should have done to save a query on task.service.ts
  - I made Logging feature but almost did not used it, we have it in maybe
  like 3 places? Just to show it works but this is not enough ok.
  - Must write UT tests to cover recent changes
  - End-to-end tests would be good
  - We also lack safe login and need to only store salted passwords
  - It looks like the logging endpoint at http://localhost:3030/log/info
  does not update in real-time. You must refresh to get new contents. This
  is a bug.

##### done with love by André Mendes - (andre@mendesc.com)
