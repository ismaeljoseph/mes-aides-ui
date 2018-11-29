'use strict';

var controllerOptions = function(templateUrl) {
    return function(TrampolineService) {
        return {
            restrict: 'E',
            templateUrl: templateUrl,
            scope: {
                list: '='
            },
            // Best Practice: use controller when you want to expose an API to other directives. Otherwise use link.
            // @see https://docs.angularjs.org/guide/directive
            link: function ($scope, $element, $attributes) {

                // Filter by benefit specified via the "filter" attribute
                if ($attributes.hasOwnProperty('filter')) {
                    var filter = $scope.$eval($attributes.filter);
                    $scope.list = _.pickBy($scope.list, function(value, key) {
                        return _.includes(filter, key);
                    });
                }

                $scope.isNumber = _.isNumber;
                $scope.isString = _.isString;

                $scope.shouldDisplayYM2Warning = function(droit) {
                    return droit.isBaseRessourcesYearMoins2 && ! $scope.ressourcesYearMoins2Captured && ! _.isString(droit.montant);
                };

                $scope.trampoline = TrampolineService;

                // ng-class and uib-accordion don't work well together, hence this extra function.
                // See https://github.com/angular-ui/bootstrap/issues/4172
                $scope.getAccordionClass = function(droit) {
                    return [$scope.shouldDisplayYM2Warning(droit) ? 'needs-n-2' : '', droit.open ? 'panel-opened': ''].join(' ');
                };
            }
        };
    };
};

angular.module('ddsApp')
    .directive('droitEligiblesList', controllerOptions('/partials/droits-eligibles-list.html'));

angular.module('ddsApp')
    .directive('droitNonEligiblesList', controllerOptions('/partials/droits-non-eligibles-list.html'));
