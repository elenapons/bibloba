'use strict';

module.exports = function(Library) {
    Library.validate('serviceOptions', serviceOptionsValidator, {message: 'Invalid Option'});
    function serviceOptionsValidator(err) {
        if (!this.serviceOptions.every(element => ['takeaway', 'library', 'delivery'].includes(element))) {
            err();
        }
    };
    // Library.validatesInclusionOf('serviceOptions', {in: ['takeaway', 'library', 'delivery']});
};