import {  expect } from "chai";
import httpTrigger from "../HttpTrigger";
import chaiHttp from "chai-http";
import chai from "chai";

chai.use(chaiHttp);

describe("httpTrigger", () => {
    it("has response 200", () => {
        chai
            .request(httpTrigger)
            .get("/api/HttpTrigger?id=1")
            .end((err, res) => {
                const response: {status: number} = res;
                expect(res.status).to.equal(200);
            });
    });
    it("has response 404", () => {
        chai
            .request(httpTrigger)
            .get("/api/HttpTrigger?testteststest")
            .end((err, res) => {
                const response: {status: number} = res;
                expect(res.status).to.equal(404);
            });
    });
});
