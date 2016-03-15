function createFilterMapper(){

    return {
        map: function (hits) {
            if(!hits) return {};

            return _.groupBy(hits, '_source.systemStatus');
        }
    }
}
