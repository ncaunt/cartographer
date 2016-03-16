function filter() {
    var selectedFilters = $('.name', '#filters .selected');
    var groups = $('.group');
    if (selectedFilters.length === 0) {
        return $(groups).removeClass('hidden');
    }
    $(groups).addClass('hidden');
    _.forEach(selectedFilters, function (filterElement) {
        groups.each(function (i, group) {
            if ($(group).data().filter === filterElement.innerText) {
                return $(group).removeClass('hidden');
            }
        })
    });
}