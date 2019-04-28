/* eslint-disable no-underscore-dangle */
const { Joi, validate } = require("./../../tools/joiService");
const todoTools = require("./todosTools");

module.exports = (app, Models) => {
  const todosController = {};
  const { Todo, Task } = Models;

  todosController.getTodo = (req, res) => {
    if (req.params.id) {
      Todo.findOne({ id: req.params.id })
        .lean()
        .exec((err, data) => {
          if (data) {
            res.status("200").json(data);
          } else {
            res.status(404).json({
              error: "Not Found"
            });
          }
        });
    } else {
      res.status(404).json({
        error: "Not Found"
      });
    }
  };

  todosController.addTodo = (req, res) => {
    validate(
      req.body,
      {
        title: Joi.string().min(5),
        id: Joi.string().min(5)
      },
      res,
      data => {
        if (data.id) {
          const newTodo = new Todo({
            id: data.id,
            title: data.title
          });

          newTodo.save(err => {
            if (err) {
              res.status(500).json({
                error: "Impossible to save Todo. Please Try Again."
              });
            } else {
              res.status(200).json({
                message: "Todo Created with success",
                id: data.id
              });
            }
          });
        } else {
          todoTools.foundFreeId(Todo).then(idTodo => {
            const newTodo = new Todo({
              id: idTodo,
              title: data.title
            });

            newTodo.save(err => {
              if (err) {
                res.status(500).json({
                  error: "Impossible to save Todo. Please Try Again."
                });
              } else {
                res.status(200).json({
                  message: "Todo Created with success",
                  id: idTodo
                });
              }
            });
          });
        }
      }
    );
  };

  todosController.editTodo = (req, res) => {
    validate(
      req.body,
      {
        title: Joi.string().min(5)
      },
      res,
      data => {
        if (req.params.id) {
          Todo.findOneAndUpdate({ id: req.params.id }, data, { new: true }, (err, todo) => {
            if (err) {
              res.status(500).json({
                error: "Impossible to save Todo. Please Try Again."
              });
            } else if (!todo) {
              res.status(404).json({
                error: "Impossible to found Todo. Please Try Again."
              });
            } else {
              const todoRes = todo._doc;
              delete todoRes._id;

              res.status(200).json({
                message: "Todo Updated with success",
                todo: todoRes
              });
            }
          });
        } else {
          res.status(400).json({
            error: "Form Invalid"
          });
        }
      }
    );
  };

  todosController.deleteTodo = (req, res) => {
    validate(
      req.params,
      {
        id: Joi.string().min(5)
      },
      res,
      data => {
        if (req.params.id) {
          Todo.findOneAndRemove({ id: data.id }, (err, oldtodo) => {
            if (err) {
              res.status(500).json({
                error: "Impossible to delete Todo. Please Try Again."
              });
            } else {
              Task.find({ id_Todo: oldtodo._id }, (_err, tasks) => {
                const promiseDelete = id => {
                  return new Promise(resolve => {
                    Todo.findOneAndRemove({ _id: id }, () => {
                      resolve();
                    });
                  });
                };

                const arrayPromise = [];

                for (let index = 0; index < tasks.length; index += 1) {
                  const task = tasks[index];
                  arrayPromise.push(promiseDelete(task._id));
                }

                Promise.all(arrayPromise).then(() => {
                  res.status(200).json({
                    message: "Todo deleted with success"
                  });
                });
              });
            }
          });
        } else {
          res.status(400).json({
            error: "Form Invalid"
          });
        }
      }
    );
  };

  return todosController;
};
