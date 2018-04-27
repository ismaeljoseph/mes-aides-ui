/* global emit: true */
var Promise = require('bluebird');
var MongoClient = Promise.promisifyAll(require('mongodb').MongoClient);
var requests = require('./requests');

var db;
function saveDb(refDb) {
    db = refDb;
    return db;
}

exports.closeDb = function() {
    if (db) {
        db.close();
    }
};

function manageMissingCollection(error) {
    if (error.message == 'ns doesn\'t exist') {
        return { results: [] };
    } else {
        throw error;
    }
}

function formatMongo(data) {
    return [{
        metric: 'simulation',
        datapoints: data.map(function(dateTuple) {
            return {
                date: dateTuple._id,
                value: dateTuple.value,
            };
        }),
    }];
}

function formatMongoCSV(data) {
    return data.map(function(tuple) {
        return tuple._id + ';' + tuple.value;
    }).join('\n');
}

exports.extractData = function(queryFn, processFn) {
    var p = MongoClient
    .connectAsync('mongodb://localhost:27017/dds')
    .then(saveDb)
    .then(queryFn)
    .catch(manageMissingCollection)
    // MongoDB 2.4 (production) does not embed metadata of the operation, the result is directly available in the response
    // MongoDB 3.4 (dev environment) returns results with metadata and are available in the results property
    .then(function(response) { return response.results || response; })

    if (! processFn) {
        return p;
    }

    return p.then(processFn);
};

exports.getDailySituationCount = function(fromDate, toDate) {
    return exports.extractData(
        function(db) { return requests.extractSimulationDailyCount(db, fromDate, toDate); },
        formatMongo
    );
};

exports.getCommuneCount = function(fromDate, toDate) {
    return exports.extractData(function(db) { return requests.extractSimulationCommuneCount(db, fromDate, toDate); });
};
