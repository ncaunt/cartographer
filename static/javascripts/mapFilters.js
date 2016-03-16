function createFilterMapper() {
    const problemFilters = [{
        target: 'na',
        rename: 'Other'
    }]

    function renameFilters(hits) {
        var allFilters = Object.keys();
        return _.map(allFilters, function (filter) {
            var change = _.find(problemFilters, function (problem) {
                return problem.target === filter;
            });
            if (!change) {
                return filter;
            }
            return {
                name: change.rename
            };
        });
    }

    return {
        map: function (hits) {
            if (!hits) return {};

            return {
                filters: _.map(renameFilters(hits), function (filter) {
                    return {
                        filter: filter
                    };
                })
            };
        }
    }
}