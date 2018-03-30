'use strict';

const Router = require('xiaolan-router');

let router = new Router();

router
  .get('', 'index')
  .get('book', 'get_book_list')

module.exports = router;
