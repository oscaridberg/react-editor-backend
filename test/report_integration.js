process.env.NODE_ENV = 'test';
// process.env.PORT = 27017;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');

chai.should();

chai.use(chaiHttp);

describe('Reports', () => {
    describe('GET /documents/', () => {
        it('200', (done) => {
            chai.request(server)
                .get("/documents/")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    res.body.length.should.be.above(0);

                    done();
                });
        });
    });

    describe('POST /documents/', () => {
        it('201', (done) => {
            chai.request(server)
                .post('/documents/')
                .end((err, res) => {
                    res.should.have.status(201);


                    done();
                });
        });
    });


    describe('PUT /documents/', () => {
        it('204', (done) => {
            chai.request(server)
                .put('/documents/')
                .end((err, res) => {
                    res.should.have.status(204);

                    done();
                });
        });
    });

    describe('DELETE /documents/', () => {
        it('204', (done) => {
            chai.request(server)
                .delete('/documents/')
                .end((err, res) => {
                    res.should.have.status(204);

                    done();
                });
        });
    });

    describe('404 ERROR /testtest/', () => {
        it('404', (done) => {
            chai.request(server)
                .get('/testtest/')
                .end((err, res) => {
                    res.should.have.status(404);

                    done();
                });
        });
    });

});