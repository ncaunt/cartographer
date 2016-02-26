window.onload = function(){

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    var resultsBox = $('#results')
    resultsBox.on('click', '.result', showAdditionalInfo);
    var searchBox = $('#search-box');

    function bindSearchEvents(){
        $('#search-button').click(searchFromBox);
    }
    bindSearchEvents();

    var query = getParameterByName('q');
    if(query){
        return runSearch(query);
    }

    function parse(results){
        resultsBox.html(
            '<ul id="header">' +
                '<li class="name">Server Name</li>' +
                '<li class="ip">Ip Address</li>' +
                '<li class="function">Function</li>' +
                '<li class="type">Type</li>' +
            '</ul>');

        results.hits.hits = _.sortBy(results.hits.hits, '_source.hostName');
        results.hits.hits.forEach(createResultEntry);
    }

    function createResultEntry(result) {
        var source = result._source;
        source.type = source.physicalOrVirtual.toLowerCase().startsWith("virtual") ? 
            '<img src="/static/images/vm.png" height="100%" width="24px" class="virtual"/>' :
            '<i class="fa fa-server physical"></i>'
        var entry = $(Mustache.render(
            '<ul class="result">'+
                '<li class="name">{{hostName}}</li>' +
                '<li class="ip">{{primaryIPAddress}}</li>' +
                '<li class="function">{{primaryFunction}}</li>' +
                '<li class="type">{{{type}}}</li>' +
                '<ul class="hidden roles">' +
                    createWebsites(source.software) +
                '</ul>' +
            '</ul>', source));
        resultsBox.append(entry);
    }

    function showAdditionalInfo(e){
        $('.roles', $(e.target).closest('.result')).toggleClass('hidden');
    }

    function createWebsites(software) {
        if(!software || !software.websites || software.websites.length === 0) {
            return '<div class="role">No websites found for this server</div>';
        }
        var roles = '';
        software.websites.forEach(function (website){
            roles += Mustache.render('<div class="role">' +
                        '<ul>' +
                            '<li class="name"><strong>Website:</strong> {{name}}</li>' +
                            '<li class="state"><strong>State:</strong> {{state}}</li>' +
                            '<li class="path"><strong>Path:</strong> {{physicalPath}}</li>' +
                        '</ul>', website);
            if(website.bindings){
                roles += '<div class="bindings"><strong>Bindings:</strong><ul>'
                 if(Array.isArray(website.bindings) && website.bindings.length > 0){
                    _.forEach(website.bindings, function (binding){
                        roles += Mustache.render('<li class="binding">{{binding}}</li>', {binding: binding});
                    });
                } else if(website.bindings) {
                    roles += Mustache.render('<li class="binding">{{bindings}}</li>', website);
                }
                roles += '</ul></div><div class="cl"></div>'
            }
            roles += '</div>';        
        });
        return roles;
    }

    function searchFromBox() {
        var text = searchBox[0].value;
        if(text === "") {
            resultsBox.html('');
            return;
        }
        runSearch(text);
    }

    function runSearch(text) {
        resultsBox.html('Searching now');
        $.ajax({
            url:"http://logs.laterooms.com:9200/servers/_search?size=100&q=" + text + "*"
        })
        .success(parse)
        .error(function (err) {
            resultsBox.html('encountered an error: ' + err)
        });
    }
}