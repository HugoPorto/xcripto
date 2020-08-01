jQuery(document).ready(function () {

    $("select[name=estado]").change(function () {

        var parametro_controller = jQuery("select[name=estado]").val();

        var caminho = urlPath("bluelinecliente", "recupera_cidades", parametro_controller);

        $("select[name=cidade]").html('<option value="">Carregando...</option>');

        jQuery.ajax({
            method: "get",
            url: caminho,
            success: function (valor) {
                jQuery("select[name=cidade]").html(valor);
            }
        });

        return false;

    });

    function urlPath(controller, metodo, parametro) {
        if (parametro !== `undefined`) {
            let caminho_a_buscar = `/${controller}/${metodo}/${parametro}/`;
            let caminho_padrao_recuperado = window.location.href.toString();
            let array_url_sem_barras = caminho_padrao_recuperado.split('/');
            let url_array_base = array_url_sem_barras.slice(0, 4);
            let url_done_com_barras = url_array_base.join('/');
            let path = url_done_com_barras.concat(caminho_a_buscar);
            return path;
        } else {
            let caminho_a_buscar = `/${controller}/${metodo}/`;
            let caminho_padrao_recuperado = window.location.href.toString();
            let array_url_sem_barras = caminho_padrao_recuperado.split('/');
            let url_array_base = array_url_sem_barras.slice(0, 4);
            let url_done_com_barras = url_array_base.join('/');
            let path = url_done_com_barras.concat(caminho_a_buscar);
            return path;
        }
    }
});