var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'PUBLIC SPACE ROVER COMMAND CENTER' });
});

module.exports = router;
