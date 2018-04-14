'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sleep = require('sleep');
const expect = chai.expect;
const app = 'localhost:8080'
chai.use(chaiHttp);

describe("Object", () => {
  let url = "/object";
  let obj = {
    key: 'newKey' + Math.random(),
    value: 'newValue' + Math.random()
  };
  describe("Create Object", (done) => {
    it("return 200", (done) => {
      chai.request(app)
        .post(url)
        .send(obj)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.key).to.equal(obj.key);
          expect(res.body.value).to.equal(obj.value);
          expect(toString(res.body.timestamp)).to.not.empty;
          done();
        });
    });
    it("return 400 when key is not specified", (done) => {
      let res = chai.request(app)
        .post(url)
        .send({
          value: 'someValue'
        }).end((err, res) => {
          expect(res.body.errors).to.exist;
          done();
        });
    });
    it("return 400 when value is not specified", (done) => {
      let res = chai.request(app)
        .post(url)
        .send({
          key: 'someKey',
        }).end((err, res) => {
          expect(res.body.errors).to.exist;
          done();
        });
    });
  });
  describe("Find Object", (done) => {
    let currTime = new Date;
    beforeEach((done) => {
      obj.timestamp = currTime.setMinutes(currTime.getMinutes() + 30);
      obj.value = 'randomValue';
      chai.request(app).post(url).send(obj).end((err, res) => {done();});
    });
    it("return value from object key", (done) => {
      chai.request(app)
        .get(url + '/' + obj.key)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.value).to.equal(obj.value);
          done();
        });
    });
    it("return value from object key at specific time", (done) => {
      chai.request(app)
        .get(url + '/' + obj.key + '?timestamp=' + Math.round(currTime/1000)+1)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.value).to.equal(obj.value);
          done();
        });
    });
    it("return latest value from object key when timestamp not valid", (done) => {
      chai.request(app)
        .get(url + '/' + obj.key + '?timestamp=qwerty')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.value).to.equal('randomValue');
          done();
        });
    });
    it("return not found when object key not exists", (done) => {
      chai.request(app)
        .get(url + '/' + Math.random)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.error).to.equal('Not found');
          done();
        });
    });
  });
});
