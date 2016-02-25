window.onload = function(){
    var resultsBox = $('#results');
    var searchBox = $('#search-box');

    function parse(results){
        resultsBox.html(
            '<ul id="header">' +
                '<li class="name">Server Name</li>' +
                '<li class="ip">Ip Address</li>' +
                '<li class="function">Function</li>' +
                '<li class="type">Type</li>' +
            '</ul>');
        console.log(results.hits.hits.length);
        results.hits.hits.forEach(createResultEntry);
    }

    function createResultEntry(result) {
        var source = result._source;
        var entry = $('<ul class="result">'+
                '<li class="name">' + source.hostName + '</li>' +
                '<li class="ip">' + source.primaryIPAddress + '</li>' +
                '<li class="function">' + source.primaryFunction + '</li>' +
                '<li class="type">' + source.physicalOrVirtual + '</li>' +
            '</ul>');

        resultsBox.append(entry)
    }

    function createSearch() {
        function doSearch() {
            resultsBox.html('Searching now');
            var text = searchBox[0].value;
            if(text === "") {
                resultsBox.html('');
                return;
            }
            $.ajax({
                url:"http://logs.laterooms.com:9200/servers/_search?size=100&q=hostName:" + text + "*"
            })
            .success(parse)
            .error(function (err) {
                resultsBox.html('encountered an error: ' + err)
            });
        }

        function bindSearchEvents(){
            $(searchBox[0]).blur(doSearch);
            $('#search-button').click(doSearch);
        }
        bindSearchEvents();
    }

    createSearch();
}