window.onload = function(){
    function createSearch() {
        function bindSearchEvents(){
            $('#search-box').blur(function (e) {
                var text = e.target.value;
                $('#results').html('You searched for ' + text);
            });
        }
        bindSearchEvents();
        return {

        }
    }

    createSearch();
}