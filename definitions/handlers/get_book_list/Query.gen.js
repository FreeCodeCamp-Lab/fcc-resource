"use strict";



class Query {
  constructor(options={}){
    this.id = options.id || [];
    this.name = options.name || [];
    this.page = options.page || 1;
    this.validate();
  }

  static fromRequest(req){
    let options={};
    options.id = this.pick(req, 'query.id', 'array', [], 'number');
    options.name = this.pick(req, 'query.name', 'array', [], 'string');
    options.page = this.pick(req, 'query.page', 'number', 1);
    return new Query(options);
  }

  validate(){
    if(!(Array.isArray(this.id) && (this.id.length >= 0 && this.id.length <= 100))){
      throw new Error('type validate failed: [id]: must be array of [number]');
    }
    for (let k in this.id) {
      if (!((typeof this.id[k] === 'number') && (this.id[k] >= 0) && (this.id[k] <= 9007199254740991))){
        throw new Error('type validate failed: [id]: must be array of [number] in ["0",9007199254740991]');
      }
    }

    if(!(Array.isArray(this.name) && (this.name.length >= 0 && this.name.length <= 100))){
      throw new Error('type validate failed: [name]: must be array of [string]');
    }
    for (let k in this.name) {
      if (!((typeof this.name[k] === 'string') && (this.name[k].length >= 0) && (this.name[k].length <= 9007199254740991))){
        throw new Error('type validate failed: [name]: must be array of [string] length in undefined');
      }
    }

    if(!(!Number.isNaN(this.page) && (this.page>=1) && (this.page<=999))){
      throw new Error('type validate failed: [page]: Number must in range 1 to 999');
    }

  }

  static pick(source, path, type=null, defaultValue=null, memberType=null){
    let paths = path.split('.');
    let tmp = source;
    for(let k in paths){
      if(tmp[paths[k]]){
        tmp = tmp[paths[k]];
      }else{
        tmp = tmp[paths[k]];
        break;
      }
    }
    if(tmp===undefined){
      return defaultValue;
    }
    switch (type){
      case 'string':
        if(typeof tmp === 'object'){
          tmp = JSON.stringify(tmp);
        }else{
          tmp = decodeURIComponent(tmp.toString());
        }
        break;
      case 'number':
      case 'enum':
        tmp = 1*tmp;
        break;
      case 'array':
        if(typeof tmp === 'string'){
          tmp = tmp.split(',');
        }
        if (memberType === 'number') {
          let len = tmp.length;
          for (let i = 0; i < len; i++) {
            tmp[i] = 1 * tmp[i];
          }
        }
        break;
    }
    return (defaultValue && (undefined===tmp)) ? defaultValue: tmp;
  }
}

module.exports = Query;