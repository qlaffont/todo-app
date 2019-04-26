/* eslint-disable global-require */

module.exports = (app, Models) => {
  const tasksController = require("./tasksController")(app, Models);

  /**
   *  @swagger
   *  /tasks/{id_Todo}:
   *    get:
   *      tags:
   *        - "Tasks"
   *      description: Get Task Information from Todo ID
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: id_Todo
   *          in: path
   *          required: true
   *          type: string
   *          description: Todo Id
   *      responses:
   *        404:
   *          description: Todo Not Found
   *        200:
   *          description: Tasks from the todo board
   */

  app.route("/tasks/:id_Todo").get((req, res) => tasksController.getTasks(req, res));

  /**
   *  @swagger
   *  /tasks/{id_Todo}:
   *    put:
   *      tags:
   *        - "Tasks"
   *      description: Add a Task
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: title
   *          in: path
   *          type: string
   *          required: true
   *          description: Task Title
   *        - name: message
   *          in: path
   *          type: string
   *          description: Task Message
   *        - name: id_Todo
   *          in: path
   *          type: string
   *          description: Todo Id
   *      responses:
   *        400:
   *          description: Form not Good
   *        200:
   *          description: Confirmation Message
   */

  app.route("/tasks/:id_Todo").put((req, res) => tasksController.addTask(req, res));

  /**
   *  @swagger
   *  /tasks/{id}:
   *    post:
   *      tags:
   *        - "Tasks"
   *      description: Edit a Task
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: title
   *          in: path
   *          type: string
   *          description: Task Title
   *        - name: message
   *          in: formData
   *          type: string
   *          description: Task Message
   *        - name: completed
   *          in: formData
   *          type: boolean
   *          description: Task is completed or not
   *        - name: priority
   *          in: formData
   *          type: Number
   *          description: 0 -> No priority, 1 -> Low, 2 -> Medium, 3 -> High
   *        - name: id
   *          in: path
   *          type: string
   *          description: Task Id
   *      responses:
   *        400:
   *          description: Form not Good
   *        200:
   *          description: Confirmation Message
   */

  app.route("/tasks/:id").post((req, res) => tasksController.editTask(req, res));

  /**
   *  @swagger
   *  /tasks/{id}:
   *    delete:
   *      tags:
   *        - "Tasks"
   *      description: Delete Task
   *      produces:
   *        - application/json
   *      parameters:
   *        - name: id
   *          in: path
   *          type: string
   *          description: Task Id
   *      responses:
   *        400:
   *          description: Form not Good
   *        200:
   *          description: Confirmation Message with Todo Id
   */

  app.route("/tasks/:id").delete((req, res) => tasksController.deleteTask(req, res));
};
