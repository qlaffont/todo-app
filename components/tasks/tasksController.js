/* eslint-disable no-underscore-dangle */
const { Joi, validate } = require("./../../tools/joiService");

module.exports = (app, Models) => {
  const tasksController = {};
  const { Task, Todo } = Models;

  tasksController.getTasks = (req, res) => {
    if (req.params.id_Todo) {
      Task.find({ id_Todo: req.params.id_Todo })
        .sort({ priority: -1, completed: 1 })
        .lean()
        .exec((err, data) => {
          if (!err && data.length > 0) {
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

  tasksController.addTask = (req, res) => {
    if (req.params.id_Todo) {
      validate(
        req.body,
        {
          title: Joi.string()
            .min(5)
            .required(),
          message: Joi.string()
        },
        res,
        data => {
          Todo.findOne(
            {
              id: req.params.id_Todo
            },
            (errTodo, todo) => {
              if (todo) {
                const newTask = new Task({
                  title: data.title,
                  message: data.message,
                  id_Todo: todo._id
                });

                newTask.save(err => {
                  if (err) {
                    res.status(500).json({
                      error: "Impossible to save Task. Please Try Again."
                    });
                  } else {
                    res.status(200).json({
                      message: "Task Created with success"
                    });
                  }
                });
              } else {
                res.status(404).json({
                  error: "Not Found"
                });
              }
            }
          );
        }
      );
    } else {
      res.status(404).json({
        error: "Not Found"
      });
    }
  };

  tasksController.editTask = (req, res) => {
    validate(
      req.body,
      {
        title: Joi.string(),
        message: Joi.string(),
        completed: Joi.boolean(),
        priority: Joi.number()
      },
      res,
      data => {
        if (req.params.id) {
          Task.findOneAndUpdate({ _id: req.params.id }, data, { new: true }, (err, task) => {
            if (err) {
              res.status(500).json({
                error: "Impossible to save Task. Please Try Again."
              });
            } else if (!task) {
              res.status(404).json({
                error: "Impossible to found Task. Please Try Again."
              });
            } else {
              const taskRes = task._doc;
              delete taskRes._id;

              res.status(200).json({
                message: "Task Updated with success",
                task: taskRes
              });
            }
          });
        } else {
          res.status(400).json({
            error: "Form Invalid 1"
          });
        }
      }
    );
  };

  tasksController.deleteTask = (req, res) => {
    validate(
      req.params,
      {
        id: Joi.string().min(5)
      },
      res,
      data => {
        if (req.params.id) {
          Task.findOneAndRemove({ _id: data.id }, err => {
            if (err) {
              res.status(500).json({
                error: "Impossible to delete Task. Please Try Again."
              });
            } else {
              res.status(200).json({
                message: "Task deleted with success"
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

  return tasksController;
};
