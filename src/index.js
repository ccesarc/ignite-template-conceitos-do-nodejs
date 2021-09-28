const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((user) => {
    return user.username === username;
  });

  request.user = user;

  if (!user) {
    return response.status(400).json({ error: "Usuario não existe" });
  }

  return next();
}

app.post("/users", (request, response) => {
  // Complete aqui
  const { name, username } = request.body;
  const user = {
    id: uuidv4(), // precisa ser um uuid
    name,
    username,
    todos: [],
  };

  const user_onde = users.find((user) => {
    return user.username === username;
  });

  if (user_onde) {
    return response.status(400).json({
      error: "Mensagem do erro",
    });
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { todos } = request.user;

  return response.status(201).json(todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  //Find retorna apenas 1 nao precisando colocar o [0]
  const todo = user.todos.filter((todo) => {
    return todo.id === id;
  });

  if (todo.length != 1) {
    return response.status(404).json({ error: "Not Found" });
  }

  todo[0].title = title;
  todo[0].deadline = deadline;

  return response.status(201).json(todo[0]);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.filter((todo) => {
    return todo.id === id;
  });

  if (todo.length != 1) {
    return response.status(404).json({ error: "Not Found" });
  }

  todo[0].done = true;

  return response.status(201).json(todo[0]);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;

  const todo = user.todos.filter((todo) => {
    return todo.id === id;
  });

  if (todo.length != 1) {
    return response.status(404).json({ error: "Not Found" });
  }

  user.todos.splice(todo, 1);

  return response.status(204).send();
});

module.exports = app;
