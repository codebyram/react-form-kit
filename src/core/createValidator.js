import _ from 'lodash';

import {validatorMap, exprMessageMap } from './validatorMap';

const getValidationRule = (item) => {
  let expressionMap = exprMessageMap(item.expr,item.value || item.element);
  return {
    expr: expressionMap.expr,
    value: item.value,
    element: item.element,
    func: expressionMap.expr === 'function' ? item.func : validatorMap[expressionMap.expr],
    message: item.message || expressionMap.message
  };
}

const getSelfValidators = (validations) => {
  return (value) => {
    let errors = [];
    validations.map(item => {
      if(!item.func.call(this,item,value))
        errors.push(item.message);
    });
    return errors;
  }
}

const getSiblingValidators = (validations) => {
  return (value,sibling) => {
    let errors = [];
    _.filter(
      validations,
      item => item.element === sibling.name
    ).map(item=>{
      item.value = sibling.value;
      if(!item.func.call(this,item,value))
        errors.push(item.message)
    });
    return errors;
  }
}

export default function createValidator(validations = []){
  let selfValidations = _.filter(
    validations,
    item => item.element === undefined ).map( rule => getValidationRule(rule)
  );
  let siblingValidations = _.filter(
    validations,
    item => item.element !== undefined ).map( rule => getValidationRule(rule)
  );

  let selfValidator = getSelfValidators(selfValidations)
  let siblingValidator = getSiblingValidators(siblingValidations)

  return (value, sibling) => {
    if (sibling) {
      return siblingValidator(value, sibling)
    } else {
      return selfValidator(value);
    }
  }
}
