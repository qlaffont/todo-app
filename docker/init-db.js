/* eslint-disable */
const res = [
  db.container.drop(),
  db.init.insert({ init: "true" }),
  db.createUser({
    user: "user",
    pwd: "pwd",
    roles: [{ role: "readWrite", db: "todoapp" }]
  })
];

printjson(res);
