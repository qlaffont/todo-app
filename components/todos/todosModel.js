const todosTools = require("./todosTools");

module.exports = mongoose => {
  const { Schema } = mongoose;

  /**
   * @swagger
   * definitions:
   *   Todo:
   *     type: object
   *     required:
   *      - id
   *     properties:
   *       id:
   *         type: string
   *         required: true
   *       creationDate:
   *         type: date
   *         default: new Date().toISOString()
   *       title:
   *         type: string
   *         default: "My Todo"
   */
  const TodoSchema = Schema(
    {
      id: {
        type: String,
        default: () => todosTools.generateId(),
        unique: true
      },
      creationDate: {
        type: Date,
        default: () => new Date().toISOString()
      },
      title: {
        type: String,
        default: () => "My Todo",
        minlength: 5
      }
    },
    { versionKey: false }
  );

  return mongoose.model("Todo", TodoSchema);
};
