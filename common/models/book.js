'use strict';
var isbn = require('node-isbn');

module.exports = function(Book) {
  Book.byISBN = function(ISBN, cb) {
    isbn.resolve(ISBN)
      .then(function (book) {
        cb(null, book);
      })
      .catch(function (err) {
        cb('Book not found');
      })
  };

  Book.remoteMethod(
    'byISBN', {
      http: {
        path: '/byISBN/:ISBN',
        verb: 'get',
      },
      accepts: { arg: "ISBN", type: 'string' },
      returns: [
        {
          arg: 'byISBN',
          type: '[string]'
        },
     
      ]
    }
  );
};