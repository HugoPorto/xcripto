/* 
 * Carregamentos Ajax
 */
jQuery(document).ready(function () {
    
    alert('olá');
    
    
  
    /**
     *  Faz redirecionamentos que não precisam de um Controller específico na aplicação
     */
    jQuery("#dados_basicos").click(function (event) {

        var redirect = jQuery("#dados_basicos").attr("href");

        jQuery.ajax({
            method: "get",
            url: redirect,
            success: function (dados) {
                jQuery("#dados_basicos").html(dados);
            }
        });

        return false;

    });

    /**
     *  Faz o carremagento do primeiro formulário de cadastro (Especificação)
     */
    jQuery("select[name=ramo]").change(function () {

        // Recupera o valor do select
        var parametro_controller = jQuery("select[name=ramo]").val();

        // Cria a url do controller a ser chamado
        var url_controller = "chat/salvar/";

        // Inicia o processo de criação da url_base
        var urlsplit = window.location.href.toString();

        var arrUrl = urlsplit.split('/');

        delete arrUrl[4];

        var joinUrl = arrUrl.join('/');

        // url base
        var url_base = joinUrl.substring(0, (joinUrl.length - 1));

        // Concatena a url base com o valor recuperado do select        
        var redirect = url_base.concat(url_controller).concat(parametro_controller);

        $("select[name=especificacao]").html('<option value="">Carregando...</option>');

        $("select[name=area]").html('<option value="">Aguardando Especificacao...</option>');

        $("select[name=titulacao]").html('<option value="">Aguardando Área...</option>');

        $("select[name=expecificacao_extra]").html('<option value="">Aguardando Titulação...</option>');

        jQuery.ajax({
            method: "get",
            url: redirect,
            success: function (valor) {
                jQuery("select[name=especificacao]").html(valor);
            }
        });

        return false;


    });

    /**
        *  Faz o carremagento do primeiro formulário de cadastro (Área)
        */
    jQuery("select[name=especificacao]").change(function () {

        // Recupera o valor do select
        var parametro_controller = jQuery("select[name=especificacao]").val();

        // Cria a url do controller a ser chamado
        var url_controller = "pesquisa/cadastrar_pesquisa_area/";

        // Inicia o processo de criação da url_base
        var urlsplit = window.location.href.toString();

        var arrUrl = urlsplit.split('/');

        delete arrUrl[4];

        var joinUrl = arrUrl.join('/');

        // url base
        var url_base = joinUrl.substring(0, (joinUrl.length - 1));

        // Concatena a url base com o valor recuperado do select        
        var redirect = url_base.concat(url_controller).concat(parametro_controller);

        $("select[name=area]").html('<option value="">Carregando...</option>');

        jQuery.ajax({
            method: "get",
            url: redirect,
            success: function (valor) {

                jQuery("select[name=area]").html(valor);
            }
        });

        return false;


    });
    
    /**
        *  Faz o carremagento do primeiro formulário de cadastro (Titulação)
        */
    jQuery("select[name=area]").change(function () {

        // Recupera o valor do select
        var parametro_controller = jQuery("select[name=area]").val();

        // Cria a url do controller a ser chamado
        var url_controller = "pesquisa/cadastrar_pesquisa_titulacao/";

        // Inicia o processo de criação da url_base
        var urlsplit = window.location.href.toString();

        var arrUrl = urlsplit.split('/');

        delete arrUrl[4];

        var joinUrl = arrUrl.join('/');

        // url base
        var url_base = joinUrl.substring(0, (joinUrl.length - 1));

        // Concatena a url base com o valor recuperado do select        
        var redirect = url_base.concat(url_controller).concat(parametro_controller);

        $("select[name=titulacao]").html('<option value="">Carregando...</option>');

        jQuery.ajax({
            method: "get",
            url: redirect,
            success: function (valor) {

                jQuery("select[name=titulacao]").html(valor);
            }
        });

        return false;


    });
    
    /**
        *  Faz o carremagento do primeiro formulário de cadastro (Especificação Extra)
        */
    jQuery("select[name=titulacao]").change(function () {

        // Recupera o valor do select
        var parametro_controller = jQuery("select[name=titulacao]").val();

        // Cria a url do controller a ser chamado
        var url_controller = "pesquisa/cadastrar_pesquisa_esp_extra/";

        // Inicia o processo de criação da url_base
        var urlsplit = window.location.href.toString();

        var arrUrl = urlsplit.split('/');

        delete arrUrl[4];

        var joinUrl = arrUrl.join('/');

        // url base
        var url_base = joinUrl.substring(0, (joinUrl.length - 1));

        // Concatena a url base com o valor recuperado do select        
        var redirect = url_base.concat(url_controller).concat(parametro_controller);

        $("select[name=expecificacao_extra]").html('<option value="">Carregando...</option>');

        jQuery.ajax({
            method: "get",
            url: redirect,
            success: function (valor) {

                jQuery("select[name=expecificacao_extra]").html(valor);
            }
        });

        return false;


    });

});