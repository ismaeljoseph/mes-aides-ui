title: 'h1',

resultatFrame: '.frame-resultats .droits-eligibles',

prestationTabs: '.droits-eligibles  div[role="tab"]',
prestationName: '.droits-eligibles .result:nth-child(' + PRESTATION_TO_TEST_POSITION + ') .description',
prestationMontant: '.droits-eligibles .result:nth-child(' + PRESTATION_TO_TEST_POSITION + ') .montant',
prestationMontantDetail: '.droits-eligibles .result:nth-child(' + PRESTATION_TO_TEST_POSITION + ') .montant-detail',
prestationYM2Warning: '.droits-eligibles .result:nth-child(' + PRESTATION_TO_TEST_POSITION + ') i.fa-warning',
togglePrestationTabLink: '.droits-eligibles .result:nth-child(' + PRESTATION_TO_TEST_POSITION + ') div[role="tab"]',
prestationDescription: '.droits-eligibles .result:nth-child(' + PRESTATION_TO_TEST_POSITION + ') p',
prestationMoreInfoLink: '.droits-eligibles .result:nth-child(' + PRESTATION_TO_TEST_POSITION + ') .btn-default',

openPrimeActivite: function() {
    return this.prestationTabs.then(function (tab) {
        if (driver.textPresent('Prime d’activité', tab)) {
            return tab.click();
        }
    });
},
requestPrimeActiviteLink: { a: 'Faire une demande' },

greyedPrestation: '.droits-eligibles .needs-n-2',
declareYM2ResourcesLink: { a: 'Déclarez vos ressources' },
