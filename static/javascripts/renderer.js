function createRenderer(resultsMapper, filterMapper, fileLoader) {

    return {
        render: function (results) {

            var mappedResults = resultsMapper.map(results.hits.hits);
            // var filters = filterMapper.map(results.hits.hits);
            var renderedResults;

            return fileLoader.all(['/static/javascripts/templates/results.html', '/static/javascripts/templates/filters.html'])
                .then(function (templates) {
                    return {
                        results: Mustache.render(templates[0], mappedResults),
                        filters: Mustache.render(templates[1], mappedResults)
                    }
                });
        }
    }
}