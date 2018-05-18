import React from 'react';

import createStore from '../core/createStore';

export default function createFrom (FormComponent) {

  class Form extends React.Component {

    constructor() {
      super(...arguments);
      this._valueStoreSubscriber = this.onValueStoreChange.bind(this);
      this._errorStoreSubscriber = this.onErrorStoreChange.bind(this);
    }

    render() {
      return (
        <FormComponent { ...this.props } onSubmit={this.handleSubmit.bind(this)}>
          {this.props.children}
        </FormComponent>
      )
    }

    willComponentUnMount() {
      this.clearSubscriptions();
      this.valueStore = null;
      this.errorStore = null;
    }

    onValueStoreChange(type, {prop,value}) {
      if(this.props.onChange) {
        if(type === 'change') {
          this.props.onChange(prop, value);
        } else if (type === 'submit') {
          this.handleSubmit();
        }
      }
    }

    onErrorStoreChange(type, {prop,value}) {

    }

    handleSubmit() {
      let {valueStore, errorStore} = this.getChildContext();
      valueStore.trigger('forceValidate');
      let errors = errorStore.getAll();
      if(errors.length === 0) {
        this.props.onSubmit(valueStore.getAll());
      }
    }

    getChildContext() {
      if( !this.valueStore ) {
        this.clearSubscriptions();

        this.valueStore = createStore(this.props.data || {});
        this._unsubscribeValueStore = this.valueStore.subscribe(this._valueStoreSubscriber);

        this.errorStore = createStore();
        this.unsubscribeErrorStore = this.errorStore.subscribe(this._errorStoreSubscriber);
      }

      return {
        valueStore : this.valueStore,
        errorStore : this.errorStore
      }
    }

    clearSubscriptions(){
      if (this._unsubscribeValueStore) {
        this._unsubscribeValueStore();
      }
      if (this.unsubscribeErrorStore) {
        this.unsubscribeErrorStore();
      }
    }
  }

  return Form;
}
