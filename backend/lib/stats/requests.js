exports.extractSimulationDailyCount = function(db, fromDate, toDate) {
    return db.collection('situations').mapReduce(function() {
        emit(this.dateDeValeur.toISOString().slice(0,10), 1);
    }, function(date, values) {
        return Array.sum(values);
    }, {
        out: {
            inline: 1,
        },
        query: {
            dateDeValeur: {
                $gte: fromDate,
                $lte: toDate,
            },
            modifiedFrom: {
                $exists: false,
            },
        },
    });
};

exports.extractSimulationCommuneCount = function(db, fromDate, toDate) {
    return db.collection('situations').mapReduce(function() {
        if (this.menage && this.menage.depcom) {
            //emit(this.dateDeValeur.toISOString().slice(0,10) + ';' + this.menage.depcom, 1);
            emit(this.menage.depcom, 1);
        }
    }, function(date, values) {
        return Array.sum(values);
    }, {
        out: {
            inline: 1,
        },
        query: {
            dateDeValeur: {
                $gte: fromDate,
                $lte: toDate,
            },
            modifiedFrom: {
                $exists: false,
            },
        },
    });
};
