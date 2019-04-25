/* eslint-disable global-require */

module.exports = (app, Models) => {
  const todosController = require("./todosController")(app, Models);

  /**
   *  @swagger
   *  /todos/{id}:
   *    get:
   *      tags:
   *        - "Todos"
   *      description: Get Todo Information
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: id
   *          in: path
   *          required: true
   *          type: string
   *          description: Todo Id
   *      responses:
   *        404:
   *          description: Todo Not Found
   *        200:
   *          description: Todo result
   */

  app.route("/todos/:id").get((req, res) => todosController.getTodo(req, res));

  /**
   *  @swagger
   *  /todos:
   *    put:
   *      tags:
   *        - "Todos"
   *      description: Add a todo
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: title
   *          in: path
   *          type: string
   *          description: Todo Title
   *      responses:
   *        400:
   *          description: Form not Good
   *        200:
   *          description: Confirmation Message
   */

  app.route("/todos").put((req, res) => todosController.addTodo(req, res));

  /**
   *  @swagger
   *  /todos/{id}:
   *    post:
   *      tags:
   *        - "Todos"
   *      description: Edit a todo
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: title
   *          in: formData
   *          type: string
   *          description: Todo Title
   *        - name: id
   *          in: path
   *          type: string
   *          description: Todo Id
   *      responses:
   *        400:
   *          description: Form not Good
   *        200:
   *          description: Confirmation Message
   */

  app.route("/todos/:id").post((req, res) => todosController.editTodo(req, res));

  /**
   *  @swagger
   *  /todos/{id}:
   *    delete:
   *      tags:
   *        - "Todos"
   *      description: Delete Todo
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: id
   *          in: path
   *          type: string
   *          description: Todo Id
   *      responses:
   *        400:
   *          description: Form not Good
   *        200:
   *          description: Confirmation Message with Todo Id
   */

  app.route("/todos/:id").delete((req, res) => todosController.deleteTodo(req, res));
};
