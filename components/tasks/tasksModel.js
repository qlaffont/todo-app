module.exports = mongoose => {
  const { Schema } = mongoose;

  /**
   * @swagger
   * definitions:
   *   Task:
   *     type: object
   *     required:
   *      - id_Todo
   *     properties:
   *       _id:
   *         type: string
   *         description: MongoDB generated
   *       creationDate:
   *         type: date
   *         default: new Date().toISOString()
   *       message:
   *         type: string
   *       completesd:
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
