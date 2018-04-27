var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var communes = require('/repos/mes-aides-analytics/villes/communes.json');

var communeKeyed = communes.reduce(function(obj, commune) {
    obj[commune.code] = commune;
    return obj;
}, {});

var cK = communeKeyed;

var mongodb = require('./mongodb');

function dateDaysAgo(nb_days) {
    var date = new Date();
    date = new Date(date.toISOString().slice(0,10));
    date.setDate(date.getDate() - nb_days);
    return date;
}

var start = dateDaysAgo(7 * 10);
var today = dateDaysAgo(0);

var relative_path = __dirname + '/../../../dist/documents/stats-communes.csv';
mongodb.getCommuneCount(start,today)
.then(function(data) {
    return ['code;simulations;population;commune;departement;region', ...data.map(function(row) {
        var additional = [undefined, undefined, undefined, undefined];
        if (cK[row._id]) {
            additional[0] = cK[row._id].population;
            additional[1] = cK[row._id].nom;
            if (cK[row._id].departement) {
                additional[2] = cK[row._id].departement.nom;
            }
            if (cK[row._id].region) {
                additional[3] = cK[row._id].region.nom;
            }
        }

        return [row._id, row.value, ...additional].join(';');
    })].join('\n');
})
.then(function(data) { return fs.writeFileAsync(relative_path, data, 'utf-8'); })
.catch(function(error) {
    console.error('error', error);
    process.exitCode = 1;
})
.finally(mongodb.closeDb);
