export default function createStore (data = {}) {
  let subscriptions = [];

  let dataMap = {};
  for(prop in data) {
    dataMap[prop] = data[prop];
  }

  const subscribe = (func) => {
    subscriptions.push(func);
    return () => {
      subscriptions.splice(subscriptions.indexOf(func),1);
    }
  }

  const trigger = (type,payload) => {
    subscriptions.forEach( (func) => { func(type,payload); } );
  }

  const getUnsubscribe = (prop) => {
    return () => {subscriptions.splice}
  }

  const get = (prop) => {
    return dataMap[prop]
  }

  const getAll = () => {
    let toReturn = {};
    for(let prop in dataMap){
      toReturn[prop] = dataMap[prop];
    }
    return toReturn;
  }

  const set = (prop, value, silent = false) => {
    dataMap[prop] = value;
    if (!silent) {
      trigger('change', {prop,value});
    }
  }

  const setAll = (map) => {
    dataMap = {};
    for(let prop in map) {
      dataMap[prop] = map[prop];
    }
  }

  return {
    subscribe : subscribe,
    trigger : trigger,
    get : get,
    getAll : getAll,
    set : set,
    setAll : setAll
  }
}
