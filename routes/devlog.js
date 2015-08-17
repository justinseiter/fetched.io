var express = require('express');
var async   = require('async');
var router  = express.Router();
var request = require('request');
var _       = require('lodash');

router.get('/', function (req, res) {
  var boardUrl = 'https://api.trello.com/1/lists/'
  var trelloKey = '?key=a4920852d6687e2947e5f724a5b1c5b3'
  var trelloList = {
    todo: '55c169233ee71fef7530cd13',
    done: '55c16a22e3da1daf7497cf73'
  }
  var lists = {}

  async.forEachOf(trelloList, function(val, key, callback) {
    request(boardUrl + val + '/cards' + trelloKey, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        lists[key] = JSON.parse(body);
        callback();
      }
    });
  },
  function(err) {
    var sortedObject = {};

    // Get array of keys from the old/current object
    var keys = Object.keys(lists);

    // Sort keys (in place)
    keys.sort().reverse();

    // Use sorted keys to copy values from old object to the new one
    for (var i = 0; i < keys.length; i++) {
      key = keys[i];
      value = lists[key];
      sortedObject[key] = value;
    }
    res.render('devlog', {lists:sortedObject, bodyClassTag: 'static'});
  });
});

module.exports = router;