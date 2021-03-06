'use strict';

var SmoothScroll = require('smooth-scroll');
var scroll = new SmoothScroll();

var mergeDroits = function(prestationsNationales, partenairesLocaux) {

    var droits = _.values(prestationsNationales);
    _.forEach(partenairesLocaux, function(partenaireLocal) {
        droits = droits.concat(_.values(partenaireLocal.prestations));
    });

    droits.sort(function(a, b) {
        return a.label < b.label ? -1 : 1;
    });

    return droits;
};

angular.module('ddsApp').controller('droitsEligiblesListCtrl', function($scope) {

    $scope.isBoolean = _.isBoolean;
    $scope.isNumber = _.isNumber;
    $scope.isString = _.isString;
    $scope.list = [];

    $scope.$watch('droits', function(value) {
        if (value) {
            var list = (value.prestationsNationales && mergeDroits(value.prestationsNationales, value.partenairesLocaux)) || value;
            if ($scope.filter) {
                list = _.filter(list, function(value) {

                    return _.includes($scope.filter, value.id);
                });
            }
            $scope.list = list;
        }
    });

    $scope.shouldDisplayYM2Warning = function(droit) {
        return droit.isBaseRessourcesYearMoins2 && ! $scope.ressourcesYearMoins2Captured && ! _.isString(droit.montant);
    };

    $scope.scrollTo = function(droit, $event) {
        $event.preventDefault();
        scroll.animateScroll(document.querySelector('#' + droit.id), $event.target, {
            updateURL: false,
            offset: function () {
                return document.querySelector('header').offsetHeight;
            }
        });
    };

    $scope.scrollToTop = function($event) {
        $event.preventDefault();
        scroll.animateScroll(document.querySelector('body'), $event.target, {
            updateURL: false
        });
    };

});

var controllerOptions = function(templateUrl) {
    return function() {
        return {
            restrict: 'E',
            templateUrl: templateUrl,
            scope: {
                droits: '=',
                filter: '=',
                patrimoineCaptured: '=',
                ressourcesYearMoins2Captured: '=',
                yearMoins2: '=',
            },
            controller: 'droitsEligiblesListCtrl',
        };
    };
};

angular.module('ddsApp')
    .directive('droitEligiblesList', controllerOptions('/partials/droits-eligibles-list.html'));

angular.module('ddsApp')
    .directive('droitEligiblesDetails', controllerOptions('/partials/droits-eligibles-details.html'));

angular.module('ddsApp')
    .directive('droitNonEligiblesList', controllerOptions('/partials/droits-non-eligibles-list.html'));

angular.module('ddsApp')
    .directive('droitMontant', function() {
        return {
            restrict: 'E',
            templateUrl: '/partials/droit-montant.html',
            scope: {
                droit: '=',
            },
            link: function(scope) {
                scope.isNumber = _.isNumber;
                scope.isString = _.isString;
            }
        };
    });
