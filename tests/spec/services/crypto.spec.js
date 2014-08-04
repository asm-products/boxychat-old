'use strict';

var assert = require('assert'),
    cryptoService = require('../../../api/services/crypto.js');

describe('The Service Crypto', function() {
    describe('.token', function() {
        it('should return the md5 of the passed string', function() {
            assert.equal(cryptoService.token("test"), '098f6bcd4621d373cade4e832627b4f6');
        });
    });

    describe('.generate', function(){
        it('should return a string 60 chars long and no error', function(done) {
           cryptoService.generate({}, 'test', function(err, value){
               assert.equal(err, null);
               assert.equal(value.length, 60);
               done();
           });
        });

        it('should return an error if something different than a string is passed', function(done) {
            cryptoService.generate({}, {}, function(err, value){
                assert.notEqual(err, null);
                assert.equal(value, undefined);
                done();
            });
        });

    });

    describe('.compare', function(){
        it('should return true as a value and no error if compared with a valid hash', function(done) {
            cryptoService.generate({}, 'test', function(err, value) {
                cryptoService.compare('test', value, function (err, value) {
                    assert.equal(err, null);
                    assert.equal(value, true);
                    done();
                });
            });
        });

        it('should return false as a value and no error if compared with a not valid hash', function(done) {
            cryptoService.compare('test', 'value', function (err, value) {
                assert.equal(err, null);
                assert.equal(value, false);
                done();
            });
        });

        it('should return an error if compared with a non-string', function(done) {
            cryptoService.compare('test', {}, function (err, value) {
                assert.notEqual(err, null);
                assert.equal(value, undefined);
                done();
            });
        });
    });
});