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
        $(searchBox).val(query);
        return runSearch(query);
    }

    function parse(results){
        resultsBox.html('');
        if(!results || !results.hits || !results.hits.hits || !results.hits.hits.length){
            return resultsBox.html('<span id="no-results">No results found <i class="fa fa-frown-o"></i> <i class="fa fa-frown-o"></i> <i class="fa fa-frown-o"></i> <i class="fa fa-frown-o"></i> <i class="fa fa-frown-o"></i> <i class="fa fa-frown-o"></i></span>');
        }

        // results.hits.hits = _.sortBy(results.hits.hits, '_source.hostName');
        results.hits.hits.forEach(createResultEntry);
    }

    function createResultEntry(result) {
        var source = result._source;
        source.type = source.physicalOrVirtual.toLowerCase().startsWith("virtual") ? 
            '<img src="/static/images/vm.png" height="100%" width="24px" class="virtual"/>' :
            '<i class="fa fa-server physical"></i>';
        if(!source.software || !source.software.websites){
            source.numberOfWebsites = '0 websites ';
        } else {
            source.numberOfWebsites = Array.isArray(source.software.websites) ? source.software.websites.length + ' websites ' : '1 website '; 
        }

        var entry = $(Mustache.render(
            '<ul class="result">'+
                '<li class="name">'+
                    '<span class="host-name">' +
                        '<strong>{{hostName}}</strong>' +
                    '</span> ' +
                    '<span class="ip">({{primaryIPAddress}})</span> ' +
                    '<span class="website-count">{{numberOfWebsites}}</span>' +
                    '<div class="hidden details">' +
                        '<ul>' +
                            '<li><strong>Platform:</strong>{{platform}}</li>' +
                            '<li><strong>Type:</strong>{{{type}}}</li>' +
                            '<li><strong>Memory:</strong>{{physicalOrAllocatedMemory}}GB</li>' +
                            '<li><strong>Total Cores:</strong>{{numberOfProcessors}}</li>' +
                            '<li><strong>Model:</strong>{{model}}</li>' +
                            '<li><strong>Service Tag:</strong>{{serialNumber}}</li>' +
                        '</ul>' +
                        createWebsites(source.software) +
                    '</div>' +
                '</li>' +
            '</ul>', source));
        resultsBox.append(entry);
    }

    function showAdditionalInfo(e){
        $('.details', $(e.target).closest('.result')).toggleClass('hidden');
    }

    function createWebsites(software) {
        if(!software || !software.websites || software.websites.length === 0) {
            return '<strong>No websites found for this server</strong>';
        }
        var websites = '<strong>Websites:</strong>';
        software.websites.forEach(function (website){
            websites += Mustache.render('<div class="website">' +
                        '<ul>' +
                            '<li class="name"><strong>Name:</strong> {{name}}</li>' +
                            '<li class="state"><strong>State:</strong> {{state}}</li>' +
                            '<li class="path"><strong>Path:</strong> {{physicalPath}}</li>' +
                        '</ul>', website);
            if(website.bindings){
                websites += '<div class="bindings"><strong>Bindings:</strong><ul>'
                 if(Array.isArray(website.bindings) && website.bindings.length > 0){
                    _.forEach(website.bindings, function (binding){
                        websites += Mustache.render('<li class="binding">{{binding}}</li>', {binding: binding});
                    });
                } else if(website.bindings) {
                    websites += Mustache.render('<li class="binding">{{bindings}}</li>', website);
                }
                websites += '</ul></div><div class="cl"></div>'
            }
            websites += '</div>';        
        });
        return websites;
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
        resultsBox.html('<span id="searching">Searching now</span>');
        $.ajax({
            url:"http://logs.laterooms.com:9200/servers/_search?size=100&q=" + text + "*"
        })
        .success(parse)
        .error(function (err) {
            resultsBox.html('encountered an error: ' + err)
        });
    }
}