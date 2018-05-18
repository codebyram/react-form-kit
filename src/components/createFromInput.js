import React from 'react';
import _ from 'lodash';

import createValidator from '../core/createValidator';

export default function createFromInput (InputComponent) {
  class FormInput extends React.Component {

    constructor() {
      super(...arguments);
      this._valueStoreSubscriber = this.onValueStoreChange.bind(this);
      this._errorStoreSubscriber = this.onErrorStoreChange.bind(this);
      this.setState({
        isPristine: true,
        hasError: false,
        errorMessage: ''
      })
    }

    setUpValidations() {
      if(!this._validations || this._validations === this.props.validations) {
        this._validations = this.props.validations;
        this.validator = createValidator(this._validations);
        this.setUpSiblingValidationIndex();
      }
    }

    setUpSiblingValidationIndex(){
      var self = this;
      this._dependentSiblings = _.reduce(this.props.validations,(result, item) => {
        if(item.element !== self.props.name && item.element !== undefined) {
          if(result.indexOf(item.element) < 0) {
            result.push(item);
          }
        }
        return result;
      },[]);
    }

    getPropsForChild() {
      return {};
    }

    render() {
      this.setUpValidations();
      let childProps = this.getPropsForChild();
      return(
        <InputComponent {...childProps} >
          {this.props.children}
        </InputComponent>
      )
    }

    handleChange(value) {
      this.setState({
        ...this.state,
        value: value
      });
      this.context.valueStore.set(this.props.name, value);
    }

    runValidator(name, value) {
      if(name === this.props.name) {
        return this.validator(value);
      } else {
        return this.validator(this.context.valueStore.get(this.props.name), {name, value})
      }
    }

    forceValidate(){
      let error = this.runValidator(this.props.name, this.context.valueStore.get(this.props.name));
      let siblings = this._dependentSiblings;
      if(error.length === 0) {
        for(let i =0, length = siblings.length; i < length; i++) {
          error = this.runValidator(siblings[i], this.context.valueStore.get(siblings[i]));
          if(error.length > 0) {
            return error;
          }
        }
      } else {
        return error;
      }
    }

    onValueStoreChange(type, {prop, value}) {
      let error = [];
      let self = this;
      switch(type) {
        case 'change' :
          error = this.runValidator(prop, value)
          break;
        case 'forceValidate':
          error = this.forceValidate();
          break;
      }
      if(error.length == 0) {
        this.context.errorStore.set(this.props.name, undefined);
      } else {
        this.context.errorStore.set(this.props.name, error[0]);
      }
    }

    onErrorStoreChange(type, {prop, value}) {
      if(prop === this.props.name) {
        this.setState({
          ...this.state,
          hasError: value ? true : false,
          errorMessage: value ? value : ''
        });
      }
    }
  }

  return FormInput
}
