$(document).ready(function () {
    $('a[id=sobre]').click(function () {
        load_sobre();
    });
    $('a[id=termos]').click(function () {
       load_termos();
    });
    $('a[id=politica]').click(function () {
        load_politica();
    });
    /*
    |-----------------------------------
    |Vindos do form.--------------------
    |-----------------------------------
    */
    $('body').on('click', '#termos_in', function(){
        load_termos();
    });
    $('body').on('click', '#politica_in', function(){
        load_politica();
    });
    /*
    |================================================================
    |================================================================
    |===========================Funções==============================
    |================================================================
    |================================================================
    */
    function load_sobre(){
        var path = urlPath("loadpage", "loadPagesLogin", "sobre");     
        $("html, body").animate({scrollTop: 0}, 600);
        $.ajax({
            method: "POST",
            url: path,
            beforeSend: function(){                
            },
            success: function (dados) {
                $("#conteudo").html(dados);
            }
        });

        $(".container-fluid").scrollTop(0);
        return false;
    }
    /*
    |----------------------------------
    |Carrega as páginas das políticas.
    |----------------------------------
    */
    function load_politica(){
        var path = urlPath("loadpage", "loadPagesLogin", "politica");
        $("html, body").animate({scrollTop: 0}, 600);

        $.ajax({
            method: "post",
            url: path,
            success: function (dados) {
                $("#conteudo").html(dados);
            }
        });

        $(".container-fluid").scrollTop(0);
        return false;
    }
    function load_termos(){
        var path = urlPath("loadpage", "loadPagesLogin", "termos");
        $("html, body").animate({scrollTop: 0}, 600);

        $.ajax({
            method: "post",
            url: path,
            success: function (dados) {
                $("#conteudo").html(dados);
            }
        });

        $(".container-fluid").scrollTop(0);
        return false;
    }
    
    function urlPath(controller, metodo, parametro) {
        if(parametro == `undefined`){
            let caminho_a_buscar = `/${controller}/${metodo}/`;
            let caminho_padrao_recuperado = window.location.href.toString();
            let array_url_sem_barras = caminho_padrao_recuperado.split('/');
            let url_array_base = array_url_sem_barras.slice(0, 4);
            let url_done_com_barras = url_array_base.join('/');
            let path = url_done_com_barras.concat(caminho_a_buscar);            
            return path;
        }else{
            let caminho_a_buscar = `/${controller}/${metodo}/${parametro}/`;
            let caminho_padrao_recuperado = window.location.href.toString();
            let array_url_sem_barras = caminho_padrao_recuperado.split('/');
            let url_array_base = array_url_sem_barras.slice(0, 4);            
            let url_done_com_barras = url_array_base.join('/');
            let path = url_done_com_barras.concat(caminho_a_buscar);
            return path;
        }
    } 
});