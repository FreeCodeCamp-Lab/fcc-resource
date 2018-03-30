
'use strict';
//获取Book列表
const BookModel = require('../definitions/models/Book.gen.js');

const Query = {
  // 数据主键 []number:0,100:0 in:query
  id:0,
  // 书名 []string:0,100:0 in:query
  name:'',
  //页码 number:1,999 in:query
  page: 1
};

module.exports = async (Query) => {
  const PAGE_SIZE = 10;

  let sql = 'select * from `book` where 1 ';
   
  if (Query.id.length){
    sql += 'and `id` in ('+JSON.stringify(Query.id)+') ';
  }

  if (Query.name.length){
    sql += 'and `book_name` in ('+JSON.stringify(Query.name)+') ';
  }


  sql += 'order by id desc limit ' + (Query.page - 1) * PAGE_SIZE + ',' + PAGE_SIZE;
  let count = await BookModel.raw(sql.replace('*', 'count(*) c'), {}, false);
  if (count.length) {
    count = count[0].c;
  } else {
    count = 0;
  }
  let list = await BookModel.raw(sql, {});

  return {
    list: list,
    total: count,
    page: Query.page,
    pageSize: PAGE_SIZE
  };
};
  