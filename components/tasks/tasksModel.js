module.exports = mongoose => {
  const { Schema } = mongoose;

  /**
   * @swagger
   * definitions:
   *   Task:
   *     type: object
   *     required:
   *      - id_Todo
   *      - title
   *     properties:
   *       _id:
   *         type: string
   *         description: MongoDB generated
   *       creationDate:
   *         type: date
   *         default: new Date().toISOString()
   *       title:
   *         type: string
   *       message:
   *         type: string
   *       completed:
   *         type: boolean
   *         default: false
   *       priority:
   *         type: number
   *         min: 0
   *         max: 3
   *         default: 0
   *       id_Todo:
   *         $ref: '#/definitions/Todo'
   */
  const TaskSchema = Schema(
    {
      creationDate: {
        type: Date,
        default: () => new Date().toISOString()
      },
      title: {
        type: String,
        require: true
      },
      message: {
        type: String
      },
      completed: {
        type: Boolean,
        default: false
      },
      priority: {
        type: Number,
        min: 0,
        max: 3,
        default: 0
      },
      id_Todo: {
        type: Schema.Types.ObjectId,
        ref: "Todo",
        required: true
      }
    },
    { versionKey: false }
  );

  return mongoose.model("Task", TaskSchema);
};
