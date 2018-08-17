'use strict';
var isbn = require('node-isbn');

module.exports = function(Book) {
  Book.validate('serviceOptions', serviceOptionsValidator, {message: 'Invalid Option'});
  function serviceOptionsValidator(err) {
      if (this.serviceOptions !== undefined && 
        !this.serviceOptions.every(element => ['takeaway', 'library', 'delivery'].includes(element))) {
          err();
      }
  };
  Book.getByISBN = function(ISBN, cb) {
    isbn.resolve(normalizedISBN(ISBN))
      .then(function (book) {
        cb(null, book);
      })
      .catch(function (err) {
        cb('Book not found');
      })
  };
  Book.createByISBN = function(ISBN, libraryId, cb) {
    isbn.resolve(normalizedISBN(ISBN))
      .then(function (book) {
        var normalizedBook = {
          title: book.title,
          authors: book.authors,
          publishedDate: book.publishedDate,
          publisher: book.publisher,
          imageLink:
            book.imageLinks !== undefined
              ? book.imageLinks.thumbnail || book.imageLinks.smallThumbnail
              : undefined,
          ISBN: normalizedISBN(ISBN),
          libraryId: libraryId
        }
        new Book(normalizedBook).save(function(err, book){
          if (err){
            cb(err);
            return;
          }
          cb(null, book);
        })
      })
      .catch(function (err){
        cb(err.toString());
      })
  };
  Book.remoteMethod(
    'getByISBN', {
      http: {
        path: '/byISBN/:ISBN',
        verb: 'get',
        status: '200',
        // errorStatus: '400'
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
  Book.remoteMethod(
    'createByISBN', {
      http: {
        path: '/byISBN',
        verb: 'post',
        status: '201',
        // errorStatus: '400'
      },
      accepts:[
        { arg: "ISBN", type: 'string', required: true },
        { arg: "libraryId", type: 'string', required: true }
      ],
      returns: [
        {
          arg: 'newBook',
          type: 'Book'
        },
     
      ]
    }
  );
  Book.beforeRemote('create',function (ctx, book, cb){
    book.ISBN = normalizedISBN(book.ISBN);
    cb();
  });
  Book.beforeRemote('update',function (ctx, book, cb){
    book.ISBN = normalizedISBN(book.ISBN);
    cb();
  });
};
function normalizedISBN(ISBN){
  return ISBN.replace(/[^0-9xX]/g, "").replace(/x/g, "X");
}