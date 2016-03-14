function createRenderer(resultsMapper, fileLoader) {

    return {
        render: function (results) {

            var parsed = resultsMapper.map(results.hits.hits);


            return fileLoader.load('/static/javascripts/templates/result.html')
                .then(function (template) {
                    return Mustache.render(template, parsed);
                });
        }
    }
}
