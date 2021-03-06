window.onload = function () {

    var resultsMapper = createResultsMapper();
    var fileLoader = createFileLoader();
    var renderer = createRenderer(resultsMapper, fileLoader);
    var esInterface = createElasticsearchInterface();
    var filter = createFilter();
    var resultsBox = $('#results');
    var filters = $('#filters');
    var searchBox = $('#search-box');

    function bindSearchEvents() {
        $('#search-button').click(searchFromBox);
        $(searchBox).keypress(function (event) {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') {
                $('#search-button').click()
            }
        });
        resultsBox.on('click', '.basic-info', showAdditionalInfo);
        filters.on('click', 'li', filterResults);
    }
    bindSearchEvents();

    function showAdditionalInfo(e) {
        $('.details', $(e.target).closest('.result')).toggleClass('hidden');
        $('.detail-icon', $(e.target).closest('.result')).each(function toggle(i, item) {
            $(item).toggleClass('hidden');
        })
    }

    function filterResults(e) {
        var li = $(e.target).closest('li')[0];
        filter.toggle(li);
        filter.apply();
    }

    function searchFromQuerystring() {
        var query = getParameterByName('q');
        if (query) {
            $(searchBox).val(query);
            return runSearch(query);
        }
    }
    searchFromQuerystring();

    function searchFromBox() {
        var text = searchBox[0].value;
        if (text === "") {
            resultsBox.html('');
            filters.html('');
            return;
        }
        runSearch(text);
    }

    function runSearch(text) {
        resultsBox.html('<span id="searching">Searching now</span>');
        return esInterface.query(text)
            .then(renderer.render)
            .then(function (renders) {
                resultsBox.html(renders.results);
                filters.html(renders.filters);
                filter.apply();
            })
            // .then(resultsBox.html)
            .catch(function (err) {
                resultsBox.html('<div id="error">' +
                    '<span class="message">Encountered an error ' + err.message + '</span>' +
                    '<span class="stack">' + err.stack + '</span>' +
                    '</div>');
            });
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
}
