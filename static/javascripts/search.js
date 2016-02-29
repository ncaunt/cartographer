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
        $(searchBox).keypress(function(event){
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if(keycode == '13'){
                $('#search-button').click()
            }
        });
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
            return resultsBox.html('<li class="result"><span id="no-results">No results found <i class="fa fa-frown-o"></i> <i class="fa fa-frown-o"></i> <i class="fa fa-frown-o"></i> <i class="fa fa-frown-o"></i> <i class="fa fa-frown-o"></i> <i class="fa fa-frown-o"></i></span></li>');
        }

        var parsed = _.map(results.hits.hits, function (hit) {
            var source = hit._source;
            var websiteCount = '0 websites ';
            if(source.software && source.software.websites) {
                websiteCount = Array.isArray(source.software.websites) ? source.software.websites.length + ' websites ' : '1 website '; 
            }
            var type = source.physicalOrVirtual.toLowerCase().startsWith("virtual") ? 
                '<img src="/static/images/vm.png" height="100%" width="24px" class="virtual"/>' :
                '<i class="fa fa-server physical"></i>';

            var memory = source.physicalOrAllocatedMemory + (source.physicalOrAllocatedMemory > 300 ? 'MB' : 'GB');
            var processors = source.numberOfProcessors || 'Unknown';

            var websites = mapWebsites(source.software)

            return {
                hostName: source.hostName,
                ipAddress: source.primaryIPAddress,
                websiteCount: websiteCount,
                platform: source.platform,
                type: type,
                physicalOrAllocatedMemory: memory,
                numberOfProcessors: processors,
                model: source.model,
                serialNumber: source.serialNumber,
                websites: mapWebsites(source.software)
            }
        });

        parsed.forEach(createResultEntry);
    }

    function createResultEntry(result) {

        var entry = $(Mustache.render(
            '<li class="result">'+
                '<span class="host-name">' +
                    '<strong>{{hostName}}</strong>' +
                '</span> ' +
                '<span class="ip">({{ipAddress}})</span> ' +
                '<span class="website-count">{{websiteCount}}</span>' +
                '<div class="hidden details">' +
                    '<ul>' +
                        '<li><strong>Platform:</strong>{{platform}}</li>' +
                        '<li><strong>Type:</strong>{{{type}}}</li>' +
                        '<li><strong>Memory:</strong>{{physicalOrAllocatedMemory}}</li>' +
                        '<li><strong>Total Cores:</strong>{{numberOfProcessors}}</li>' +
                        '<li><strong>Model:</strong>{{model}}</li>' +
                        '<li><strong>Service Tag:</strong>{{serialNumber}}</li>' +
                    '</ul>' +
                    createWebsites(result.websites) +
                '</div>' +
            '</li>', result));
        resultsBox.append(entry);
    }

    function mapWebsites(software) {
        if(!software) {
            return [];
        }
        if(Array.isArray(software.websites)) {
            return _.map(software.websites, function (website) {
                return {
                    name: website.name,
                    state: website.state,
                    physicalPath: website.physicalPath,
                    bindings: mapBindings(website.bindings)
                }
            })
        } else {
            return [software.websites];
        }
    }

    function mapBindings(bindings) {
        if(!bindings){
            return [];
        }
        if(Array.isArray(bindings)){
            return bindings;
        } else {
            return [bindings];
        }
    }

    function createWebsites(websites) {
        if(!websites || websites.length === 0) {
            return '<strong>No websites found for this server</strong>';
        }
        var websitesHtml = '<strong>Websites:</strong>';
        websites.forEach(function (website){
            websitesHtml += Mustache.render('<div class="website">' +
                        '<ul>' +
                            '<li class="name"><strong>Name:</strong> {{name}}</li>' +
                            '<li class="state"><strong>State:</strong> {{state}}</li>' +
                            '<li class="path"><strong>Path:</strong> {{physicalPath}}</li>' +
                        '</ul>', website);
            if(website.bindings){
                websitesHtml += '<div class="bindings"><strong>Bindings:</strong><ul>'
                _.forEach(website.bindings, function (binding){
                    websitesHtml += Mustache.render('<li class="binding">{{binding}}</li>', {binding: binding});
                });
                websitesHtml += '</ul></div><div class="cl"></div>'
            }
            websitesHtml += '</div>';        
        });
        return websitesHtml;
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
}