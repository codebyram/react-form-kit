import chai from "chai"
import createStore from "../src/core/createStore"
let expect = chai.expect
let should = chai.should()
export default function testCreateStore () {
  describe("Testing createStore", function () {
    let store = createStore();
    let eventType = null;
    let eventPayload = null;
    let subscriber = (type, payload) => {
      eventType = type;
      eventPayload = payload;
    }
    let unscriber = null;
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
    it('Store object should set name value and get value with name', function () {
      store.set('val',1);
      let val = store.get('val');
      expect(val).to.equal(1);
    });
    it('Store should let subscribe to changes and give an unsubscribe function', function () {
      unscriber = store.subscribe(subscriber);
      expect(unscriber).to.be.a('function');
    });
    it('Store should call subscriber on changes with type and payload', function () {
      store.set('val',2)
      expect(eventType).to.equal('change');
      expect(eventPayload).to.deep.equal({ prop: 'val', value: 2 });
    });
    it('Store should let unsubscribe to changes when unscriber is called', function () {
      unscriber();
      eventType = null;
      eventPayload = null;
      store.set('val',2)
      expect(eventType).to.equal(null);
      expect(eventPayload).to.equal(null);
    });
  });
}
