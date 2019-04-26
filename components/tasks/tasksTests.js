/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

module.exports = (chai, app) => {
  const { expect } = chai;

  describe("Tasks Tests", () => {
    let taskId;
    const todoId = "testtodos";

    describe("Task - Add", () => {
      it("Wrong Todo - Should be 400", done => {
        chai
          .request(app)
          .put("/tasks/totoep")
          .send({
            title: "Myt aze"
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            expect(res.body).to.have.property("error");
            done();
          });
      });

      it("No Data - Should be not good", done => {
        chai
          .request(app)
          .put("/tasks/totoep")
          .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.have.property("error");
            done();
          });
      });

      it("Give Title - Should create task", done => {
        chai
          .request(app)
          .put("/todos")
          .send({
            id: todoId,
            title: "Mytotoisyue"
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property("id");
            expect(res.body).to.have.property("message");
            expect(res.body.id).equal(todoId);
            chai
              .request(app)
              .put(`/tasks/${todoId}`)
              .send({
                title: "One Task"
              })
              .end((_err, resTask) => {
                expect(resTask.statusCode).to.equal(200);
                expect(resTask.body).to.have.property("message");
                done();
              });
          });
      });
    });

    describe("Task - Get", () => {
      it("shoud return 404 if id not found", done => {
        chai
          .request(app)
          .get("/tasks/azeoil")
          .end((err, res) => {
            expect(res.statusCode).to.equal(404);
            done();
          });
      });

      it("shoud return object", done => {
        chai
          .request(app)
          .get(`/todos/${todoId}`)
          .end((errTodo, resTodo) => {
            chai
              .request(app)
              .get(`/tasks/${resTodo.body._id}`)
              .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an("array");
                expect(res.body[0]).to.have.property("title");
                expect(res.body[0].title).equal("One Task");
                taskId = res.body[0]._id;
                done();
              });
          });
      });
    });

    describe("Task - Edit", () => {
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
          .post(`/tasks/${taskId}`)
          .send({
            title: "My New Title for my Todo Page"
          })
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property("task");
            expect(res.body.task).to.be.an("object");
            expect(res.body.task.title).to.equal("My New Title for my Todo Page");
            done();
          });
      });
    });

    describe("Todo - Delete", () => {
      it("Todo will be deleted", done => {
        chai
          .request(app)
          .delete(`/tasks/${taskId}`)
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.have.property("message");
            done();
          });
      });
    });
  });
};
