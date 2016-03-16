function createElasticsearchInterface(){
    function quote(str) {
        return ['"', str, '"'].join('');
    }

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

                    if (serverResults.hits.hits[0]._source.software && serverResults.hits.hits[0]._source.software.websites.length) {
                        var ports = _.map(serverResults.hits.hits[0]._source.software.websites, function (website) {
                            var b = _.map(website.bindings, function (binding) {
                                var m;
                                if (m = binding.match(/:(\d+)/)) {
                                    return m[1];
                                }
                            });
                            return _.uniq(_.compact(b));
                        });
                    }

                    return $.ajax({
                        url: 'http://logs.laterooms.com:9200/loadbalancer/pools/_search?q=basic.nodes_table.node:"' + serverResults.hits.hits[0]._source.primaryIPAddress + ':*"'
                    })
                    .success(function (poolResults){
                        var pools = _.uniq(_.map(poolResults.hits.hits, function (pool) {
                            var env = pool._source.environment;
                            var m = pool._id.match(new RegExp(env + '_(.+)'));
                            return m.length ? m[1] : undefined;
                        }));

                        serverResults.hits.hits[0]._source.pools = pools;
                        if (!pools.length) {
                            resolve(serverResults);
                        }

                        var vserversQuery = 'http://logs.laterooms.com:9200/loadbalancer/vservers/_search?q=basic.pool:(' + _.map(pools, quote).join(' ') + ')';

                        return $.ajax({
                            url: vserversQuery
                        }).success(function (vserverResults) {
                            serverResults.hits.hits[0]._source.vservers = vserverResults;
                            resolve(serverResults);
                        });
                    })
                })
                .error(reject);
            });
        }
    }
}
