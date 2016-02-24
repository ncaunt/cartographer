window.onload = function(){
    function createSearch() {
        var results = $('#results');
        var searchBox = $('#search-box');
        function doSearch() {
            var text = searchBox[0].value;
            results.html('You searched for ' + text);
        }

        function bindSearchEvents(){
            $(searchBox[0]).blur(doSearch);
            $('#search-button').click(doSearch);
        }
        bindSearchEvents();
    }

    createSearch();
}