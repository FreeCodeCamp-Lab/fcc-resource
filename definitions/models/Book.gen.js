"use strict";
const Connection = require('xiaolan-db').Connection('default').conn;
const TableName = "book";

class Book {

  constructor(data={}){
    this.id = (data.id||data.id)||0;
    this.name = (data.name||data.book_name)||'';
    this.count = (data.count||data.remains)||0;
    this.createTime = (data.createTime||data.create_time)||0;
    this.updateTime = (data.updateTime||data.update_time)||0;
  }

  static fetchById(v){
    let sql = 'select * from `book` where `id`=:v limit 1';
    //@row
    return new Promise((resolved, rejected) => {
      Connection.query({sql:sql, params:{v:v}}, (e ,r)=>{
        if(e){
          rejected(e);
        }else{
          if(r[0]){
            resolved(new Book(r[0]));
          }else{
            resolved(null);
          }
        }
      });
    });
  }

  static fetchByCreateTime(createTime, page=1, pageSize=10){
    let sql = 'select * from `book` where `create_time`=:createTime order by `id` desc limit '+((page-1)*pageSize)+','+pageSize+'';
    //@list
    return new Promise((resolved, rejected) => {
      Connection.query({sql:sql, params:{createTime: createTime}}, (e ,r)=>{
        if(e){
          rejected(e);
        }else{
          let result = [];
          for(let k in r) {
            result.push(new Book(r[k]));
          }
          resolved(result);
        }
      });
    });
  }

  static fetchByUpdateTime(updateTime, page=1, pageSize=10){
    let sql = 'select * from `book` where `update_time`=:updateTime order by `id` desc limit '+((page-1)*pageSize)+','+pageSize+'';
    //@list
    return new Promise((resolved, rejected) => {
      Connection.query({sql:sql, params:{updateTime: updateTime}}, (e ,r)=>{
        if(e){
          rejected(e);
        }else{
          let result = [];
          for(let k in r) {
            result.push(new Book(r[k]));
          }
          resolved(result);
        }
      });
    });
  }

  static fetchByName(name, page=1, pageSize=10){
    let sql = 'select * from `book` where `book_name`=:name order by `id` desc limit '+((page-1)*pageSize)+','+pageSize+'';
    //@row
    return new Promise((resolved, rejected) => {
      Connection.query({sql:sql, params:{name: name}}, (e ,r)=>{
        if(e){
          rejected(e);
        }else{
          if(r[0]){
            resolved(new Book(r[0]));
          }else{
            resolved(null);
          }
        }
      });
    });
  }

  static fetchByAttr(data={}, page=1, pageSize=10){
    let allowKey = ['id','create_time','update_time','book_name'];
    let sql = 'select * from `book` where 1 ';
    if(Object.keys(data).length===0){
      throw new Error('data param required');
    }
    for(let k in data){
      let field = '';
      if(allowKey.includes(k)){
        field = k;
      }else if(allowKey.includes(KeyMap[k])){
        field = KeyMap[k];
      }else{
        throw new Error('Not Allow Fetching By [ "'+k+'" ]');
      }
      if (Array.isArray(data[k]) && data[k].length) {
        sql += ' and `'+field+'` in ("'+data[k].join('","')+'")';
      } else {
        sql += ' and `'+field+'`=:'+k+'';
      }
      
    }
    sql += ' order by `id` desc limit '+((page-1)*pageSize)+','+pageSize;
    //@list
    return new Promise((resolved, rejected)=>{
      Connection.query({sql:sql,params:data}, (e, r)=>{
        if(e){
          rejected(e);
        }else{
          let result = [];
          for(let k in r) {
            result.push(new Book(r[k]));
          }
          resolved(result);
        }
      });
    });
  }

  static raw(sql='',params={}, obj=true){
    if(!sql.includes('limit')){
      throw new Error('raw sql must with paging');
    }
    //@list
    return new Promise((resolved, rejected)=>{
      Connection.query({sql:sql,params:params}, (e, r)=>{
        if(e){
          rejected(e);
        }else{
          if (obj) {
            let result = [];
            for(let k in r) {
              result.push(new Book(r[k]));
            }
            resolved(result);
          }else{
            resolved(r);
          }
        }
      });
    });
  }
    
  static table(){
    return TableName;
  }
  
  static count(expression,where){
    let sql = 'select count('+expression+') from `book` ';
    let conditions = [];
    let params = {};
    for(let k in where){
      conditions.push(' `'+k+'`=:'+k);
      params[k] = where[k];
    }
    if(conditions.length){
      sql += 'where '+conditions.join(' and ');
    }
    //@number
    return new Promise((resolved,rejected)=>{
      Connection.query({sql:sql,params:params}, (e,r)=>{
        if(e){
          rejected(e);
        }else{
          if(r[0]){
            resolved(r[0]['count('+expression+')']);
          }else{
            resolved(null);
          }
        }
      });
    });
  }
  
  data(){
    let obj = {};
    for(let k in FieldMap){
      obj[FieldMap[k]] = this[FieldMap[k]];
    }
    return obj;
  }

  row(){
    let row = {};
    for(let k in FieldMap){
      row[k] = this[FieldMap[k]];
    }
    return row;
  }

  validate(){
    if(this.name !== null && !(typeof this.name==='string' && this.name.length>=0 && this.name.length<=64)){
      throw new Error('attribute name(book_name) must be a string length in [0,64]');
    }
    if(this.count !== null && !(typeof this.count==='number' && this.count>=0 && this.count<=65535)){
      throw new Error('attribute count(remains) must be a number in [0,65535]');
    }
    if(this.createTime !== null && !(typeof this.createTime==='number' && this.createTime>=0 && this.createTime<=18014398509481982)){
      throw new Error('attribute createTime(create_time) must be a number in [0,18014398509481982]');
    }
    if(this.updateTime !== null && !(typeof this.updateTime==='number' && this.updateTime>=0 && this.updateTime<=18014398509481982)){
      throw new Error('attribute updateTime(update_time) must be a number in [0,18014398509481982]');
    }
  }

  save(force=false){
    if(force){
      try{
        this.validate();
      }catch(e){
        return Promise.resolve(Object.assign(error.BAD_REQUEST, {message: error.BAD_REQUEST.message+':'+e.message}));
      }
    }
    //@true
    return new Promise((resolved, rejected) => {
      let data = this.data();
      data.createTime = data.createTime||Number.parseInt(Date.now()/1000);
      data.updateTime = data.updateTime||Number.parseInt(Date.now()/1000);
      let sql = `insert into \`${TableName}\` set `;
      let fields = [];
      for(let k in data){
        if(k==='id' || data[k]===null){
          continue;
        }
        fields.push(`\`${KeyMap[k]}\`=:${k}`);
      }
      sql += fields.join(',');
      Connection.query({sql: sql,params:data},(e, r) => {
        if(e) {
          rejected(e);
        }else{
          this.id = r.insertId;
          this.createTime = data.createTime;
          this.updateTime = data.updateTime;
          resolved(true);
        }
      });
    });
  }

  update(force=false){
    if(force){
      this.validate();
    }
    //@true
    return new Promise((resolved, rejected) => {
      let sql = `update \`${TableName}\` set `;
      let data = this.data();
      data.updateTime = data.updateTime||Number.parseInt(Date.now()/1000);
      let fields = [];
      for(let k in data){
        if(k==='id' || data[k]===null){
          continue;
        }
        fields.push(`\`${KeyMap[k]}\`=:${k}`);
      }
      sql += fields.join(',');
      sql += ` where \`id\`=:id`;
      Connection.query({sql: sql,params:data},(e, r) => {
        if(e) {
          rejected(e);
        }else{
          resolved(true);
        }
      });
    });
  }

  static create(data){
    //@this
    return new Book(data);
  }

}

const FieldMap = {
  id: 'id',
  book_name: 'name',
  remains: 'count',
  create_time: 'createTime',
  update_time: 'updateTime',
};

const KeyMap = {
  id: 'id',
  name: 'book_name',
  count: 'remains',
  createTime: 'create_time',
  updateTime: 'update_time',
};


module.exports = Book;
