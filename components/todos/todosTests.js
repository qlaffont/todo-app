/* eslint-disable no-undef */

module.exports = (chai, app) => {
  const { expect } = chai;

  describe("Todos Tests", () => {
    describe("Todo-Get", () => {
      it("shoud return 404 if id not found", () => {
        chai
          .request(app)
          .get("/todos/toto")
          .end((err, res) => {
            expect(res).to.have.status(404);
          });
      });
    });
  });
};
