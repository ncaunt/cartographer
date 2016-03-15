function createRenderer(resultsMapper, filterMapper, fileLoader) {

    return {
        render: function (results) {

            var parsed = resultsMapper.map(results.hits.hits);
            var filters = filterMapper.map(results.hits.hits);
            var renderedResults;


            return fileLoader.load('/static/javascripts/templates/result.html')
                .then(function (template) {
                    return Mustache.render(template, parsed);
                })
                .then(function (moustacheRender) {
                    renderedResults = moustacheRender;
                    return fileLoader.load('/static/javascripts/templates/filters.html');
                })
                .then(function (filterTemplate) {
                    return {
                        results: renderedResults,
                        filters: Mustache.render(filterTemplate, filters)
                    };
                });
        }
    }
}
