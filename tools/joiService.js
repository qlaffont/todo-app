const Joi = require("@hapi/joi");

const joiService = {};

// Result validation middleware
joiService.validate = (data, query, res, callback) => {
  Joi.validate(data, query, (err, dataJoi) => {
    if (err) {
      res.status(400).json({
        error: "Form Invalid"
      });
    } else {
      callback(dataJoi);
    }
  });
};

// Integrate into the service
joiService.Joi = Joi;

module.exports = joiService;
