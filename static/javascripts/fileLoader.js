function createFileLoader(){
    return {
        load: function(path){
            return new Promise(function (resolve, reject) {
                $.get(path, function(data){
                    return resolve(data);
                })
            });
        },
        all: function(paths){
            return new Promise(function (resolve, reject) {
                async.map(paths,
                    function (item, callback) {
                        $.get(item, function(data){
                            callback(null, data);
                        })
                        .fail(function (data){
                            callback(new Error(data.responseText));
                        })
                    }, function (err, results) {
                    if(err) {
                        console.log(err);
                        return reject(err);
                    }
                    return resolve(results);
                });
            });
        }
    }
}
