/* eslint-disable no-undef */

module.exports = (chai, app) => {
  const { expect } = chai;

  describe("Todos Tests", () => {
    let todoId;

    describe("Todo - Add", () => {
      it("Wrong Data - Should be 400", done => {
        chai
          .request(app)
          .put("/todos")
          .send({
            title: "Myt"
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property("error");
            done();
          });
      });

      it("No Data - Should be good", done => {
        chai
          .request(app)
          .put("/todos")
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property("id");
            expect(res.body).to.have.property("message");
            done();
          });
      });

      it("Give Id - Should create Todo with id give", done => {
        chai
          .request(app)
          .put("/todos")
          .send({
            id: "topmol"
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property("id");
            expect(res.body).to.have.property("message");
            expect(res.body.id).equal("topmol");
            todoId = res.body.id;
            done();
          });
      });

      it("Give Title - Should create Todo", done => {
        chai
          .request(app)
          .put("/todos")
          .send({
            title: "Mytotoisyue"
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property("id");
            expect(res.body).to.have.property("message");
            done();
          });
      });
    });

    describe("Todo-Get", () => {
      it("shoud return 404 if id not found", done => {
        chai
          .request(app)
          .get("/todos/toto")
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            done();
          });
      });

      it("shoud return object", done => {
        chai
          .request(app)
          .get(`/todos/${todoId}`)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property("id");
            expect(res.body).to.have.property("title");
            expect(res.body).to.have.property("creationDate");
            done();
          });
      });
    });

    describe("Todo - Edit", () => {
      it("shoud return 404 if id not found", done => {
        chai
          .request(app)
          .post("/todos/toto")
          .send({
            title: "My New Title for my Todo Page"
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            done();
          });
      });

      it("Edit will be good", done => {
        chai
          .request(app)
          .post(`/todos/${todoId}`)
          .send({
            title: "My New Title for my Todo Page"
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property("todo");
            expect(res.body.todo).to.be.an("object");
            done();
          });
      });
    });

    describe("Todo - Delete", () => {
      it("Todo will be deleted", done => {
        chai
          .request(app)
          .delete(`/todos/${todoId}`)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property("message");
            done();
          });
      });
    });
  });
};
