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
        var websitesHtml = '<strong>Websites:</strong>';
        websites.forEach(function (website){
            websitesHtml += Mustache.render('<div class="website">' +
                        '<ul>' +
                            '<li class="name"><strong>Name:</strong> {{name}}</li>' +
                            '<li class="state"><strong>State:</strong> {{state}}</li>' +
                            '<li class="path"><strong>Path:</strong> {{physicalPath}}</li>' +
                        '</ul>' +
                        renderBindings(website), website);
            websitesHtml += '</div>';        
        });
        return websitesHtml;
    }

    function renderBindings(website) {
        var html = '<div class="bindings"><strong>Bindings:</strong><ul>';
        _.forEach(website.bindings, function (binding){
            html += Mustache.render('<li class="binding">{{binding}}</li>', {binding: binding});
        });
        html += '</ul></div><div class="cl"></div>';
        return html;
    }

    return {
        render: function (results) {
            var parsed = _.map(results.hits.hits, resultsMapper.map);

            return _.reduce(parsed, function (sum, result) {
                return sum + renderResultEntry(result);
            }, '');
        }
    }
}