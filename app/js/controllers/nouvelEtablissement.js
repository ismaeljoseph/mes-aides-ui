'use strict';

angular.module('ddsApp').controller('NouvelEtablissementCtrl', function($scope, $http) {
    $scope.test = {
        nom: 'Centre Communal d‘Action Sociale de Saint-Pourçain-sur-Sioule',
        pivotLocal: 'ccas',
        id: 'ccas_saint_pourcain_sur_sioule',
        adresses: [{
          lignes: ['5, rue Cadoret'],
          codePostal: '03500',
          commune: 'Saint-Pourçain-sur-Sioule'
        }],
        url: 'url',
        téléphone: '0470458865',
        fax: '0470455527',
        email: 'ccas@ville-saint-pourcain-sur-sioule.com',
        zonage: {
          communes: ['03254 Saint-Pourçain-sur-Sioule']
        }
    };

    $scope.getYAML = jsyaml.safeDump;// jsyaml.dump;
});
