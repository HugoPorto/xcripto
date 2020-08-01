$(document).ready(function(){

	$(".btn-pesquisar").click(
        function (event) {
            event.defaultPrevented;
            var redirect = jQuery("#form-search").attr("action") + jQuery("input#busca").val();
            document.location.href = redirect;
            return false;
        }
    );
});