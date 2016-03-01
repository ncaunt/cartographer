function createFileLoader(){
    return {
        load: function(path){
            return new Promise(function (resolve, reject) {
                $.get(path, function(data){
                    return resolve(data);
                })
            });
        }
    }
}