function createElasticsearchInterface(){
    return {
        query: function (query) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url:'http://logs.laterooms.com:9200/servers/_search?size=100&q=' + query
                })
                .success(function (serverResults) {
                    if(!serverResults.hits.hits[0]) {
                        return resolve(serverResults);
                    }
                    return $.ajax({
                        url: 'http://logs.laterooms.com:9200/loadbalancer/pools/_search?q=basic.nodes_table.node:"' + serverResults.hits.hits[0]._source.primaryIPAddress + ':*"'
                    })
                    .success(function (poolResults){
                        if(poolResults.hits.hits[0]){
                            serverResults.hits.hits[0]._source.poolName = poolResults.hits.hits[0]._id;
                        }
                        resolve(serverResults);
                    })
                })
                .error(reject);
            });
        }
    }
}
