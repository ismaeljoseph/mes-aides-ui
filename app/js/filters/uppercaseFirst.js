'use strict';

angular.module('ddsApp').filter('uppercaseFirst', function() {
    return function(text) {
        return text.charAt(0).toUpperCase() + text.substring(1);
    };
});