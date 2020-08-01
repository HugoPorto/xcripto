$(function () {
    /*
     |-------------------------------------------------------------------
     | Carrega os primeiros 5 registros assim que a página é carregada.
     |-------------------------------------------------------------------
     */
    carregarDados(0, 5);
    /*
     |------------------------------------------------------------------------
     | Quando o usuário clica no botão Carregar mais esse evento é disparado.
     |------------------------------------------------------------------------
     */
    $("a#carregar-mais").click((evento) => {
        evento.preventDefault();
        var init = $("#friends #num-friends").length;
        carregarDados(init, 10);
    });
    /*
     |---------------------------------------------------------------------------------------
     | Faz o carregamento e no final no done, verifica se todos os amigos foram carregados.
     |---------------------------------------------------------------------------------------
     */
    function carregarDados(init, max) {
        var path = urlPath("colaborador", "carregaDados");
        var dados = {init: init, max: max};

        $.ajax({
            type: "POST",
            url: path,
            cache: true,
            data: dados,
            dataType: "json",
            beforeSend: () => {
            },
            success: (dados) => {
                /*
                 |---------------------------------------------------
                 | Caminho default das fotos de perfil dos usuáriios.
                 |----------------------------------------------------
                 */
                var path_images_part = urlPath("public_html", "static_into");
                var ver_amizade = urlPath("usuario", "verAmizade");
                var itens = '';

                for (var i = 0; i < dados.length; i++) {
                    itens += `<li id="num-friends" class="user:${dados[i].id}">`;
                    itens += `<img id="fotoperfil" src="${path_images_part + dados[i].fotoperfil}" alt="User Image">`;
                    itens += `<a class="users-list-name" href="${ver_amizade + dados[i].email}">${dados[i].nome + ' ' + dados[i].sobrenome}</a>`;
                    itens += `<div class="btn-group">`;
                    itens += `<button type="button" class="btn btn-default">Amigos</button>`;
                    itens += `<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">`;
                    itens += `<span class="caret"></span>`;
                    itens += `<span class="sr-only">Toggle Dropdown</span>`;
                    itens += `</button>`;
                    itens += `<ul class="dropdown-menu" role = "menu">`;
                    itens += `<li id="bot">`;
                    itens += `<a class="desfazer_amizade_relationship" id="${dados[i].id}" style="cursor: pointer">Desfazer amizade</a>`;
                    itens += `</li>`;
                    itens += `</ul>`;
                    itens += `</div>`;
                    itens += `</li>`;
                }                
                $("#friends").append(itens);
            },
            error: () => {
            }
        }).done(() => {
            /*
             |-----------------------------------
             | Recupera o número total de amigos.
             |-----------------------------------
             */
            var path = urlPath("usuario", "retornaAmigos");
            var result;

            $.ajax({
                url: path,
                cache: false,
                dataType: 'json',
                beforeSend: () => {
                },
                success: (dados) => {
                    /*
                     |-----------------------------------
                     | Recupera o número total de amigos.
                     |-----------------------------------
                     */
                    var totalResults = dados.num;
                    /*
                     |----------------------------------------------------------------------------------
                     | Recupera o número de amigos carregados na página, confere o número de tags li.
                     |----------------------------------------------------------------------------------
                     */
                    var conta = $("#friends #num-friends").length;
                     //console.log(conta);
                    /*
                     |---------------------------------------------------------------------
                     | Verifica se ainda falta carregar algum dado.
                     | Compara o número de amigos carregados e o número total de amigos.
                     | Se forem iguais, apaga o botão de carregamento da página.
                     |---------------------------------------------------------------------
                     */
                    if (conta == totalResults) {
                        $("a#carregar-mais").hide();
                    }
                },
                error: () => {
                    console.log("Erro => Não foi possvel carregar o número de amigos!");
                }
            });
        }).fail(() => {
            console.log("Erro => Não foi possível carregar os dados dos amigos!");
        }).always(() => {
        });
    }
    /*
     |----------------------------------------------------------------------------------------
     |Aponta o caminho do arquivo a ser invocado.
     |Também pode apontar para um caminho estático, por exemplo o caminho da pasta de imagens.
     |----------------------------------------------------------------------------------------
     */
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