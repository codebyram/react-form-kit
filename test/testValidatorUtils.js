import chai from "chai"

import {getValidationRule, getSelfValidator, getSiblingValidator} from '../src/core/validatorUtils';

let expect = chai.expect
let should = chai.should()
export default function testValidatorUtils () {
  let rule = null;
  let siblingRules = [];
  let selfValidator = null;
  let siblingValidator = null;
  describe("Testing validatorUtils", function () {
    it('getValidationRule when called with a validation, should return object with keys expr, value, element, func, message ',
      function () {
         rule = getValidationRule({
           expr: 'eq',
           value: 3,
           message: 'Test message'
         });
         expect(rule).to.have.all.keys('expr', 'value', 'element', 'func', 'message');
      }
    );
    it('getSelfValidator when called with valiadtions should return a validator function',
      function(){
        selfValidator = getSelfValidator([rule]);
        expect(selfValidator).to.be.a('function');
      }
    );
    it('self validator function generated should validate for correctness of the rule',
      function(){
        let result = selfValidator(3);
        expect(result).to.be.a('Array');
        expect(result.length).to.equal(0);
        result = selfValidator(4);
        expect(result).to.deep.equal(['Test message']);
        expect(result.length).to.equal(1);
      }
    );
    it('getSiblingValidator when called with valiadtions should return a validator function',
      function(){
        siblingRules.push(getValidationRule({
          expr: 'eq',
          element: 'sibling1',
          message: 'Test message'
        }))
        siblingRules.push(getValidationRule({
          expr: 'neq',
          element: 'sibling2'
        }))
        siblingValidator = getSiblingValidator(siblingRules);
        expect(siblingValidator).to.be.a('function');
      }
    );
    it('sibling validator function generated should validate for correctness of the rule for respective sibling',
      function(){
        let result = siblingValidator(3,{name : 'sibling1', value : 3});
        expect(result).to.be.a('Array');
        expect(result.length).to.equal(0);
        result = siblingValidator(3,{name : 'sibling2', value : 3});
        expect(result).to.be.a('Array');
        expect(result.length).to.equal(1);
      }
    );
  });
}
