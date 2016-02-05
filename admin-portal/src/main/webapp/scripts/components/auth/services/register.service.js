'use strict';

angular.module('fooApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


