function createFilterMapper(){

    return {
        map: function (hits) {
            if(!hits) return {};

            return {
                filters: _.map(_.groupBy(hits, '_source.systemStatus'), function(hit, key) {
                    return {filter: key};
                })
            };
        }
    }
}
