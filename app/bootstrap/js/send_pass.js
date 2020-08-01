$(document).ready(function () {
     $('.send_pass').submit(function(){
         var dados = $('.send_pass').serializeArray();
         sendPass(dados);
         return false;
     });
    function sendPass(dados){
        var path = urlPath("usuario", "recuperarSenha");
        $.ajax({
            method: "post",
            url: path,
            data: dados,
            dataType: 'json',
            success: function (retorno) {
                if(retorno.error)      {
                    alert(retorno.error);
                }else{
                    alert(retorno.success);
                }
            }
        });
    }
    function urlPath(controller, metodo, parametro) {
        if(parametro == `undefined`){
            let caminho_a_buscar = `/${controller}/${metodo}/${parametro}/`;
            
            let caminho_padrao_recuperado = window.location.href.toString();
            let array_url_sem_barras = caminho_padrao_recuperado.split('/');
            let url_array_base = array_url_sem_barras.slice(0, 4);
            let url_done_com_barras = url_array_base.join('/');
            let path = url_done_com_barras.concat(caminho_a_buscar);            
            return path;
        }else{
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