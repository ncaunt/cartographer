function createRenderer(resultsMapper) {

    function renderResultEntry(software) {
        return Mustache.render(
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
                    renderWebsites(software.websites) +
                '</div>' +
            '</li>', software);
    }

    function renderWebsites(websites) {
        if(!websites || websites.length === 0) {
            return '<strong>No websites found for this server</strong>';
        }
        var websitesHtml = '';
        websites.forEach(function (website){
            websitesHtml += Mustache.render('<strong>Websites:</strong>' +
                '<div class="website">' +
                    '<ul>' +
                        '<li class="name"><strong>Name:</strong> {{name}}</li>' +
                        '<li class="state"><strong>State:</strong> {{state}}</li>' +
                        '<li class="path"><strong>Path:</strong> {{physicalPath}}</li>' +
                    '</ul>' +
                    '<div class="bindings">' +
                        '<strong>Bindings:</strong>' +
                        '<ul>' + 
                            '{{#bindings}}' +
                                '<li class="binding">{{binding}}</li>'+
                            '{{/bindings}}' +
                        '</ul>' +
                    '</div>' + 
                    '<div class="cl"></div>' +
                '</div>', website); 
        });
        return websitesHtml;
    }

    return {
        render: function (results) {
            if(!results || !results.hits || !results.hits.hits || !results.hits.hits.length){
                return '<span id="no-results">No results found <i class="fa fa-frown-o"></i></span>';
            }

            var parsed = _.map(results.hits.hits, resultsMapper.map);

            return _.reduce(parsed, function (sum, result) {
                return sum + renderResultEntry(result);
            }, '');
        }
    }
}