function createFilter() {

    var appliedFilters = [];
    function toggleSelection() {
        var filters = $('li', '#filters');
        filters.each(function (index, filter) {
            var checked = $('i.checked', $(filter))[0];
            var unchecked = $('i.unchecked', $(filter))[0];
            $(filter).removeClass('selected');
            $(checked).addClass('hidden');
            $(unchecked).removeClass('hidden');
            if(isApplied($('.name', filter)[0].innerText)){
                $(filter).addClass('selected');
                $(checked).removeClass('hidden');
                $(unchecked).addClass('hidden');
            }
        });
    }

    function isApplied(name){
        return _.some(appliedFilters, function (applied){
            return applied === name;
        });
    }

    return {
        toggle: function(selected) {
            var name = $('.name', selected)[0].innerText;
            if(isApplied(name)){
                return _.pull(appliedFilters, name);
            }
            return appliedFilters.push(name);
        },
        apply: function(){
            var groups = $('.group');
            toggleSelection();
            if(appliedFilters.length === 0){
                $(groups).removeClass('hidden');
                return;
            }
            $(groups).addClass('hidden');
            groups.each(function (i, group) {
                if (isApplied($(group).data().filter)) {
                    return $(group).removeClass('hidden');
                }
            })
        }
    }
}
//
// function filter() {
//     var selectedFilters = $('.name', '#filters .selected');
//     var groups = $('.group');
//     if (selectedFilters.length === 0) {
//         return $(groups).removeClass('hidden');
//     }
//     $(groups).addClass('hidden');
//     _.forEach(selectedFilters, function (filterElement) {
//         groups.each(function (i, group) {
//             if ($(group).data().filter === filterElement.innerText) {
//                 return $(group).removeClass('hidden');
//             }
//         })
//     });
// }
