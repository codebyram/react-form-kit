import chai from "chai"
import createStore from "../src/core/createStore"
let expect = chai.expect
let should = chai.should()
export default function testCreateStore () {
  describe("Testing createStore", function () {
    let store = createStore();
    it('Should return an object when createStore is called', function () {
      expect(store).to.be.an('object')
    });
    it('Store object should have keys subscribe, trigger, get, getAll, set, setAll, clear', function () {
      expect(store).to.have.all.keys(
        'subscribe',
        'trigger',
        'get',
        'getAll',
        'set',
        'setAll'
      );
    });
  });
}
