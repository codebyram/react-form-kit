import _ from 'lodash';

import {validatorMap, exprMessageMap } from './validatorMap';

export const getValidationRule = (item) => {
  let expressionMap = exprMessageMap(item.expr,item.value || item.element);
  return {
    expr: expressionMap.expr,
    value: item.value,
    element: item.element,
    func: expressionMap.expr === 'function' ? item.func : validatorMap[expressionMap.expr],
    message: item.message || expressionMap.message
  };
}

export const getSelfValidator = (validations) => {
  return (value) => {
    let errors = [];
    validations.map(item => {
      if(!item.func.call(this,item,value))
        errors.push(item.message);
    });
    return errors;
  }
}

export const getSiblingValidator = (validations) => {
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
