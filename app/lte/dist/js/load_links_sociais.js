$(document).ready(function(){
    $('body').on('click', '.btn-bitbucket', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-dropbox', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-facebook', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-flickr', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-foursquare', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-github', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-google', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-instagram', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-linkedin', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-tumblr', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-twitter', function(){
        window.open($(this).attr("id"));

    });
    $('body').on('click', '.btn-vk', function(){
        window.open($(this).attr("id"));

    });
    carregaDadosIndex();
    carregaDadosForm();
    /*
    |---------------------------------
    |Carrega os dados no formulário.
    |---------------------------------
    */
    function carregaDadosForm() {
        let path = urlPath("sociais","getSociais");

        $.ajax({
            type: 'POST',
            url: path,
            cache: false,
            dataType: "json",
            beforeSend: ()=>{

            },
            success: (dados)=>{
                $("#bitbucket").val(dados.bitbucket);
                $("#dropbox").val(dados.dropbox);
                $("#facebook").val(dados.facebook);
                $("#flickr").val(dados.flickr);
                $("#foursquare").val(dados.foursquare);
                $("#github").val(dados.github);
                $("#googleplus").val(dados.googleplus);
                $("#instagram").val(dados.instagram);
                $("#linkedin").val(dados.linkedin);
                $("#tumblr").val(dados.tumblr);
                $("#twitter").val(dados.twitter);
                $("#vk").val(dados.vk);
            },
            error: ()=>{
            }
        });
    }
    /*
    |-----------------------------------------------------------------
    |Carrega os dados da página index relacionados aos links sociais
    |-----------------------------------------------------------------
    */
    function carregaDadosIndex(){
        let path = urlPath("sociais","getSociais");
        $.ajax({
            type: 'POST',
            url: path,
            cache: false,
            dataType: "json",
            beforeSend: ()=>{
            },
            success: (dados)=>{
                /*
                |----------------------------------------------------------
                |Verifica se alguma coisa é retornada, caso o retorno seja
                |false carrega esse bloco.
                |----------------------------------------------------------
                */
                if(dados == false){
                    let links_sociais = ``;
                    links_sociais += `<div class = "box-header">`;
                    links_sociais += `<h3 class = "box-title" style="margin-bottom: 10px;">Links Sociais</h3>`;
                    links_sociais += `<div class="text-left">`;
                    links_sociais += `<p class="text-muted" id="minibio_conteudo">Você  ainda não possui registros sociais..</p>`;
                    links_sociais += `</div>`;
                    links_sociais += `</div>`;
                    $('#links_sociais').html(links_sociais);
                /*
                |--------------------------------------------------------------
                |Caso contrário carrega esse outro bloco.
                |--------------------------------------------------------------
                */
                }else{
                        /*
                        |---------------------------------------
                        |Em caso de algum registro vazio
                        |repete o comportamento anterior.
                        |---------------------------------------
                        */
                        if(
                        dados.bitbucket == ""
                        && dados.dropbox == ""
                        && dados.facebook == ""
                        && dados.flickr == ""
                        && dados.foursquare == ""
                        && dados.github == ""
                        && dados.googleplus == ""
                        && dados.instagram == ""
                        && dados.linkedin == ""
                        && dados.tumblr == ""
                        && dados.twitter == ""
                        && dados.vk == ""
                        ){
                            let links_sociais = ``;
                                links_sociais += `<div class = "box-header">`;
                                links_sociais += `<h3 class = "box-title" style="margin-bottom: 10px;">Links Sociais</h3>`;
                                links_sociais += `<div class="text-left">`;
                                links_sociais += `<p class="text-muted" id="minibio_conteudo">Você  ainda não possui registros sociais..</p>`;
                                links_sociais += `</div>`;
                                links_sociais += `</div>`;
                                $('#links_sociais').html(links_sociais);
                        }else{
                            let links_sociais = ``;
                            links_sociais += `<div class = "box-header">`;
                            links_sociais += `<h3 class = "box-title" style="margin-bottom: 10px;">Links Sociais</h3>`;
                            links_sociais += `<div class="text-left">`;

                            $.each(dados, function( index, value ) {
                                if(value !== "" && index !== "id" && index !== "usuario_id"){
                                    if(index == "googleplus"){
                                        links_sociais += `<a class="btn btn-social-icon btn-google" id="${value}" style="margin-right: 10px;"><i class="fa fa-google-plus"></i></a>`;
                                    }else{
                                        links_sociais += `<a class="btn btn-social-icon btn-${index}" id="${value}" style="margin-right: 10px;"><i class="fa fa-${index}"></i></a>`;
                                    }
                                    
                                }
                            });
                            links_sociais += `</div>`;
                            links_sociais += `</div>`;
                            $('#links_sociais').html(links_sociais);
                        }
                }
            },
            error: ()=>{
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
