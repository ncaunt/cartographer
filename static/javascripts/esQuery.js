function createElasticsearchInterface(){
    return {
        query: function (query) {
            return new Promise(function(resolve, reject) {
                $.ajax({
                    url:"http://logs.laterooms.com:9200/servers/_search?size=100&q=" + query + "*"
                })
                .success(resolve)
                .error(reject);
            }); 
        }
    }
}