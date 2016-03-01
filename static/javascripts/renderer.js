function createRenderer(resultsMapper, fileLoader) {

    function renderResultEntry(software) {
        fileLoader.load('/static/javascripts/templates/result.html')
            .then(function (template) {
                return Mustache.render(template, software);
            });
    }

    return {
        render: function (results) {
            if(!results || !results.hits ){
                return '<span id="no-results">No results found <i class="fa fa-frown-o"></i></span>';
            }

            var parsed = resultsMapper.map(results.hits.hits);


            return fileLoader.load('/static/javascripts/templates/result.html')
                .then(function (template) {
                    return Mustache.render(template, parsed);
                });
        }
    }
}