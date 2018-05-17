import _ from 'lodash';

import {getValidationRule, getSelfValidator, getSiblingValidator} from './validatorUtils';

export default function createValidator(validations = []){
  let selfValidationRules = _.filter(
    validations,
    item => item.element === undefined ).map( rule => getValidationRule(rule)
  );
  let siblingValidationRules = _.filter(
    validations,
    item => item.element !== undefined ).map( rule => getValidationRule(rule)
  );

  let selfValidator = getSelfValidator(selfValidationRules)
  let siblingValidator = getSiblingValidator(siblingValidationRules)

  return (value, sibling) => {
    if (sibling) {
      return siblingValidator(value, sibling)
    } else {
      return selfValidator(value);
    }
  }
}
