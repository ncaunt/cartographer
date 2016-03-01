window.onload = function(){

    var resultsMapper = createMapper();
    var renderer = createRenderer(resultsMapper);
    var esInterface = createElasticsearchInterface();
    var resultsBox = $('#results');
    var searchBox = $('#search-box');

    function bindSearchEvents(){
        $('#search-button').click(searchFromBox);
        $(searchBox).keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                $('#search-button').click()
            }
        });
        resultsBox.on('click', '.result', showAdditionalInfo);
    }
    bindSearchEvents();

    function runQueryFromQuerystring(){
        var query = getParameterByName('q');
        if(query){
            $(searchBox).val(query);
            return runSearch(query);
        }    
    }
    runQueryFromQuerystring();

    function runSearch(text) {
        resultsBox.html('<span id="searching">Searching now</span>');
        esInterface.query(text)
            .then(renderResultList)
            .catch(function (err) {
                resultsBox.html('<span id="no-results">Encountered an error ' + err.message + '</span>');
            });
    }

    function renderResultList(results){
        resultsBox.html(renderer.render(results));
    }

    function showAdditionalInfo(e){
        $('.details', $(e.target).closest('.result')).toggleClass('hidden');
    }

    function searchFromBox() {
        var text = searchBox[0].value;
        if(text === "") {
            resultsBox.html('');
            return;
        }
        runSearch(text);
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