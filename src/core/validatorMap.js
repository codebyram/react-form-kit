import _ from 'lodash';

let validatorMap = {
  'req': function (rule, value) {
    return !_.isEmpty(value);
  },
  'selReq': function (rule, value) {
    return value !== '-1';
  },
  'digits': function (rule, value) {
    return (/^\d{5}$/).test(value);
  },
  'alphanumeric': function (rule, value) {
    var ck_alphaNumeric = /^\w+$/;
    return ck_alphaNumeric.test(value);
  },
  'number': function (rule, value) {
    if (value === undefined) {
      return true;
    }
    var numberVal = +value;
    return numberVal === numberVal;
  },
  'email': function (rule, value) {
    if(value==='' || value === null || value === undefined) {
      return true;
    }
    var ck_email = /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-\\+]+)*@[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-\+]+)*(\.[A-Za-z]{2,})$/i;
    return ck_email.test(value.trim());
  },
  'minlen': function (rule, value) {
    var min = rule.value;
    return String(value).trim().length >= min;
  },
  'maxlen': function (rule, value) {
    var max = rule.value;
    return String(value).trim().length <= max;
  },
  'lt': function (rule, value) {
    var target = parseFloat(rule.value);
    var curvalue = parseFloat(value);
    return curvalue < target;
  },
  'gt': function (rule, value) {
    var target = parseFloat(rule.value);
    var curvalue = parseFloat(value);
    return curvalue > target;
  },
  'eq': function (rule, value) {
    return rule.value === value;
  },
  'neq': function (rule, value) {
    return rule.value !== value;
  },
  'url': function (rule, value) {
    if (value === '') {
      return true;
    }
    var ck_url = /(http|https|market):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i;
    return ck_url.test(value.trim());
  },
  'emaillist': function (rule, value) {
    var emails = value.split(',');
    var ck_email = /^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    for (var i = 0; i < emails.length; i++) {
      if (emails[i].trim() !== '' && !ck_email.test(emails[i].trim())) {
        return false;
      }
    }
    return true;
  }
}

let exprMessageMap = (expr, val ) => {
  expr = expr.toLowerCase().trim();
  switch(expr){
    case 'req' :
    case 'required' :
      return {expr: 'req', message: 'Required'};
    case 'lt' :
    case 'lessthan' :
    case 'max' :
    case 'maximum':
      return {expr: 'lt', message: 'Should be less than '+val};
    case 'gt' :
    case 'greaterthan' :
    case 'min' :
    case 'minimum':
      return {expr: 'gt', message: 'Should be greater than '+val};
    case 'eq':
    case 'equals':
    case 'equalto':
      return {expr: 'eq', message: 'Should be equal to '+val};
    case 'neq':
    case 'notequals':
    case 'notequalto':
      return {expr: 'neq', message: 'Should not be equal to '+val};
    case 'maxlen':
    case 'maxlength':
      return {expr: 'maxlen', message: 'Length should be less than '+val};
    case 'minlen':
    case 'minlength':
      return {expr: 'minlen', message: 'Length should be greater than '+val};
    default:
      return {expr: expr, message: ' Not a valid '+expr};
  }
}

export {validatorMap, exprMessageMap };
