function createMapper() {
    function mapBaseResults(serverResults) {
        var source = serverResults._source;
        var websiteCount = '0 websites ';
        if(source.software && source.software.websites) {
            websiteCount = Array.isArray(source.software.websites) ? source.software.websites.length + ' websites ' : '1 website ';
        }
        var type = source.physicalOrVirtual.toLowerCase().startsWith("virtual") ?
            '<img src="/static/images/vm.png" height="100%" width="24px" class="virtual"/>' :
            '<i class="fa fa-server physical"></i>';

        var platformIcon = getIcon(source.platform.toLowerCase());

        var memory = source.physicalOrAllocatedMemory + (source.physicalOrAllocatedMemory > 300 ? 'MB' : 'GB');
        var processors = source.numberOfProcessors || 'Unknown';

        var websites = mapWebsites(source.software)

        var mappedResult = {
            hostName: source.hostName,
            ipAddress: source.primaryIPAddress,
            websiteCount: websiteCount,
            platform: source.platform,
            platformIcon: platformIcon,
            type: type,
            physicalOrAllocatedMemory: memory,
            numberOfProcessors: processors,
            model: source.model,
            serialNumber: source.serialNumber,
            environment: source.systemStatus,
            websites: mapWebsites(source.software),
            poolName: source.poolName
        }

        return mappedResult;
    }

    function getIcon(platform) {
        var windows = new RegExp(".*windows.*");
        var linux = new RegExp(".*linux.*");
        if(windows.test(platform)) {
            return '<i class="fa fa-windows"></i>';
        } else if (linux.test(platform)) {
            return '<i class="fa fa-linux"></i>';
        }
        return '<i class="fa fa-question"></i>';
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
            return mapBindings(['No bindings found']);
        }
        if(Array.isArray(bindings)){
            return _.map(bindings, function (binding) {
                return {binding:binding};
            });
        } else {
            return mapBindings([bindings]);
        }
    }

    return {
        map: function (results) {
            return {results: _.map(results, mapBaseResults)}
        }
    }
}
