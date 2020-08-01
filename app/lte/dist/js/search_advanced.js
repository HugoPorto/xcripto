$(document).ready(function () {

    $("#btn-search-advanced").click(
            function (event) {
                /*
                 |------------------------------------------------------------------
                 |Evita que o comportamento padrão de chamada de url seja invocado
                 |------------------------------------------------------------------
                 */
                event.defaultPrevented;

                var url = urlPath("usuario", "searchAdvanced");

                var form = `<div class="row">`;
                form += `<div class="col-md-6">`;
                form += `<div class="box box-danger">`;
                form += `<div class="box-header with-border">`;
                form += `<h3 class="box-title">Por principal preferência de investimento</h3>`;
                form += `</div>`;
                form += `<form role="form" action="${url}" method="post">`;
                form += `<div class="box-body">`;
                form += `<div class="form-group">`;

                form += `<select class="form-control" name="search_advanced" required>`;
                form += `<option value="0" selected="1">Selecione</option>`;
                form += `<option value="Renda Fixa">Renda Fixa</option>`;
                form += `<option value="2">Fundos de Investimento</option>`;
                form += `<option value="3">Renda Variável</option>`;
                form += `</select>`;

                form += `</div>`;
                form += `</div>`;

                form += `<div class="box-footer">`;
                form += `<button type="submit" class="btn btn-primary">Pesquisar</button>`;
                form += `</div>`;
                form += `</form>`;
                form += `</div>`;
                form += `</div>`;
                form += `</div>`;

                $('#conteudo').html(form);

                return false;
            }
    );
    function urlPath(controller, metodo, parametro) {
        if (parametro == `undefined`) {
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
