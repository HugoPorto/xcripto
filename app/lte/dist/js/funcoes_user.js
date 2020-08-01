$(document).ready(function(){
    /*
    |-----------------------------------------------
    |Quando o usuário passa o mouse sobre a imagem
    |o botão para alterar a mesma aparece.
    |-----------------------------------------------
    */
    $( "#img_conteudo" ).mouseover(()=>{
        $("#alterar_foto_perfil")
        .html( '<a class="btn btn-default" id="change-perfil" style="cursor:pointer" role="button">Alterar foto</a>');
    })
    /*
    |---------------------------------------------------
    |Assim que o usuário tira o mouse de cima da imagem
    |o botão leva 1 segundo para desaparecer.
    |---------------------------------------------------
    */
    .mouseout(()=>{
        setTimeout(()=>{
            $("#alterar_foto_perfil").html('');
        }, 1000);
    });

    carregaDados();
    function carregaDados() {
        let path = urlPath("usuario","carregaDadosUsuario");
        $.ajax({
            type: 'POST',
            url: path,
            cache: false,
            dataType: "json",
            beforeSend: ()=>{

            },
            success: (dados)=>{
                /*
                |-------------------
                | conteudo
                |-------------------
                */
                $("#nome_sobrenome_conteudo").html(dados.nome + ' ' + dados.sobrenome);
                $("#datcad_conteudo").html(dados.datcad);
                $("#minibio_conteudo").html(dados.minibio);
                $("#img_conteudo").attr("src", dados.fotoperfil);
                /*
                |-------------------
                | sidebar_geral
                |------------------
                */
                $("#img_sidebar").attr("src", dados.fotoperfil);
                $("#nome_sobrenome_sidebar").html(dados.nome + ' ' + dados.sobrenome);
                if (dados.logado == 1) {
                    $('#status_sidebar').html('<i class="fa fa-circle text-success"></i>online');
                } else{
                    $('#status_sidebar').html('<i class="fa fa-circle text-danger"></i>offline');
                }
                /*
                |-------------------
                | Edit User
                |-------------------
                */
                $("#img_edit").attr("src", dados.fotoperfil);
                $("#minibio_edit").val(dados.minibio);
                /*
                |-------------------
                | Geral
                |-------------------
                */
                $("#img").attr("src", dados.fotoperfil);
                $("#nome_sobrenome").html(dados.nome + ' ' + dados.sobrenome);
                $("#minibio").html(dados.minibio);
                $("#nome").val(dados.nome);
                $("#sobrenome").val(dados.sobrenome);
                $("#email").val(dados.email);
                $("#nascimento").val(dados.nascimento);
                $("#fone").val(dados.fone);
                $("#genero").val(dados.genero);
                /*
                |-------------------
                | Header
                |-------------------
                */
                $("#nome_sobrenome_header").html(dados.nome + ' ' + dados.sobrenome);
                $("#img_header").attr("src", dados.fotoperfil);
                $("#img_header_2").attr("src", dados.fotoperfil);
                /*
                |-----------------------------------
                | Foto de capa do usuário principal.
                |-----------------------------------
                */
                var foto_capa = 'photo1.png';
                if(dados.fotocapa == 'null'){
                    $("#capa_user").css({"background": "#F4F4F4", "min-height": "220px", "cursor": "pointer", "min-width": "600px"});
                }else{
                    $("#capa_user").css({"background": `url('http://localhost/learning/public_html/static_into/dist/img/into/${dados.fotocapa}') center center`, "center": "center", "center": "center", "min-height": "220px", "cursor": "pointer", "min-width": "600px"});

                }

            },
            error: ()=>{
            }
        })
        /*
        |----------------------------------------------
        |Quando o ajax de cima termina entra em ação
        |este.
        |----------------------------------------------
        */
        .done(()=>{
            let path = urlPath("usuario","retornaAmigos");

            $.ajax({
                type: 'POST',
                url: path,
                cache: true,
                dataType: 'json',
                beforeSend: ()=>{
                    $("#num_amigos").html("Carregando...");
                },
                success: (dados)=>{
                    $("#num_amigos").html(dados.num);
                },
                error: ()=>{
                    $("#num_amigos").html("Não foi possível carregar os dados!");
                }
            });
        })
        .done(function(){
            let path = urlPath("invest","getPrefs");

            $.ajax({
                type: 'POST',
                url: path,
                cache: true,
                dataType: 'json',
                beforeSend: ()=>{
                    $("#pref1").html("Carregando...");
                    $("#pref2").html("Carregando...");
                    $("#pref3").html("Carregando...");
                },
                success: (dados)=>{
                    if(dados.preferencia1){
                        $("#pref1").html(dados.preferencia1);
                    }else{
                        $("#pref1").html('Não Informado!');
                    }

                    if(dados.preferencia2){
                        $("#pref2").html(dados.preferencia2);
                    }else{
                        $("#pref2").html('Não Informado!');
                    }

                    if(dados.preferencia3){
                        $("#pref3").html(dados.preferencia3);
                    }else{
                        $("#pref3").html('Não Informado!');
                    }
                },
                error: ()=>{
                    $("#pref1").html("Não foi possível carregar os dados!");
                    $("#pref2").html("Não foi possível carregar os dados!");
                    $("#pref3").html("Não foi possível carregar os dados!");
                }
            });
        });
    }
    /*
    |---------------------------------------------------------
    |Preciso avaliar esta função depois.----------------------
    |---------------------------------------------------------
    */
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
