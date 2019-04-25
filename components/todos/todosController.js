/* eslint-disable no-underscore-dangle */
const { Joi, validate } = require("./../../tools/joiService");
const todoTools = require("./todosTools");

module.exports = (app, Models) => {
  const todosController = {};
  const { Todo } = Models;

  todosController.getTodo = (req, res) => {
    if (req.params.id) {
      Todo.findOne({ id: req.params.id })
        .select("-_id")
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
                error: "Impossible to found/save Todo. Please Try Again."
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
      () => {
        if (req.params.id) {
          Todo.findOneAndRemove({ id: req.params.id }, err => {
            if (err) {
              res.status(500).json({
                error: "Impossible to found Todo. Please Try Again."
              });
            } else {
              res.status(200).json({
                message: "Todo deleted with success"
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
