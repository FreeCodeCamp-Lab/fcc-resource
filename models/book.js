
  'use strict';
const {Field, Table, Migrate, Presets} = require('xiaolan-db');

module.exports = new Table('book', {
  ...Presets.AI,
  name: Field.name('book_name').varchar(64).uniq().comment("书名"),
  count:Field.name('remains').smallint(true).comment('库存'),
  ...Presets.opTime,
});
  