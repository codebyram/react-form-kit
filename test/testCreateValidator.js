import chai from "chai"
import createValidator from "../src/core/createValidator";
let expect = chai.expect
let should = chai.should()
export default function testCreateValidator () {
  describe("Testing createValidator", function () {
    let validator = createValidator();
  });
}
