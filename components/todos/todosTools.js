const generateId = () => {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
};

const todosTools = {};

todosTools.foundFreeId = Todo => {
  return new Promise(resolve => {
    const idGenerated = generateId();

    Todo.findOne(
      {
        id: idGenerated
      },
      (err, todo) => {
        if (todo) {
          todosTools.foundFreeId(Todo).then(data => resolve(data));
        } else {
          resolve(idGenerated);
        }
      }
    );
  });
};

todosTools.generateId = generateId;

module.exports = todosTools;
