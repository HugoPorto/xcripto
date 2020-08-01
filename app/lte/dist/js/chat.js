/*
 |=====================================================
 |=====================================================
 |====Comanda o funcionamento do chat de modo geral====
 |=====================================================
 |=====================================================
 */
$(document).ready(function () {
    /*
     |----------------------------------------------
     |Verifica se existem mensagens novas para------
     |serem lidas.----------------------------------
     |----------------------------------------------
     */
    loopVerificacaoMensagens();
    /*
     |-----------------------------------
     |Recupera o id do usuário online,---
     |É uma variável GLOBAL.-------------
     |-----------------------------------
     */
    var userOnline = Number($('span.user_online').attr('id'));
    /*
     |-------------------------------------------------------------
     |Função responsável pelo loop de verificação de abertura------
     |da janela. Quando a janela do chat é aberta essa função------
     |indica que a janela está aberta.-----------------------------
     |-------------------------------------------------------------
     */
    function loopVerWindow() {
        setInterval(verificaAbertura, 5000);
        verificaAbertura();
    }
    /*
     |-----------------------------------------------------------------
     |Verifica se a janela está aberta. Trabalha com a função acima.---
     |-----------------------------------------------------------------
     */
    function verificaAbertura() {
        var janela = $('.content.conteudo_chat').attr('id');
        var path = urlPath("chat", "ler");

        if (janela === 'open') {
            var ids_conversa = $('.box-title').attr('id');
            var splitDados = ids_conversa.split(':');
            var id_de = Number(splitDados[0]);
            var id_para = Number(splitDados[1]);

            $.ajax({
                type: 'POST',
                url: path,
                data: {ler: 'sim', id_de: id_de, id_para: id_para},
                dataType: 'json',
                success: function (dados) {
                    if (dados == true) {
                        /*
                         |-------------------------------
                         |Por enquanto não informa nada.-
                         |-------------------------------
                         */
                    }
                },
                error: function () {
                }
            });
        } else {
            console.info("Nenhuma conversa foi iniciada no chat ainda!");
        }
    }
    /*
     |--------------------------------------------------
     |Envia a mensagem no chat.-------------------------
     |--------------------------------------------------
     */
    $('body').on('click', '#btn-enviar', function () {
        var userOnline = Number(jQuery('span.user_online').attr('id'));
        /*
         |---------------------------------------
         |Recupera o valor da do .msg e coloca---
         |na variável texto.---------------------
         |---------------------------------------
         */
        var texto = $('.msg').val();
        /*
         |------------------------------------------------------------------------------
         |Recupera os id's dos usuários(quem vai enviar e quem vai receber a mensagem)--
         | no seguinte formato (id_de:id_para).-----------------------------------------
         |------------------------------------------------------------------------------
         */
        var id = $('.msg').attr('id');
        /*
         |----------------------------------------------------------------------------
         |Separa os id's tendo como separador o dois pontos(:) usando a função split.-
         |----------------------------------------------------------------------------
         */
        var split = id.split(':');
        /*
         |---------------------------------------------------------------------------
         |id do usuário para quem será enviado o texto.------------------------------
         |---------------------------------------------------------------------------
         */
        var para = Number(split[1]);
        var apontador = urlPath('chat', 'salvar');
        /*
         |----------------------------------------
         |Verifica se a mensagem está em branco.--
         |----------------------------------------
         */
        if (texto == '') {
            $('#errorSendMessageBlank').modal();
            return false;
        }
        $.ajax({
            type: 'POST',
            url: apontador,
            data: {mensagem: texto, de: userOnline, para: para},
            success: function (retorno) {
                if (retorno === 'ok') {
                    $('.msg').val('');
                } else {
                    $('#errorSendMessage').modal();
                }
            }
        });
    });
    /*
     |==============================================================================================
     |==============================================================================================
     |================================Abre a janela do chat=========================================
     |==============================================================================================
     |==============================================================================================
     */
    $('body').on('click', '#users_online a', function () {
        /*
         |--------------------------------------------------------
         |Indica que a janela está aberta.------------------------
         |--------------------------------------------------------
         */
        var janela = '1';
        /*
         |----------------------------------------------------------------------------------------
         |ID De(usuário que está invocando o chat) : ID Para(usuário com quem se quer conversar).-
         |----------------------------------------------------------------------------------------
         */
        var id = this.id;
        /*
         |---------------------------
         |Remove a classe comecar.---
         |---------------------------
         */
        $(this).removeClass('comecar');
        /*
         |------------------------------
         |Recupera o status.------------
         |------------------------------
         */
        var status = $(this).next().attr('class');
        /*
         |--------------------------------------------------------
         |Recupera o nome do usuário com quem se vai conversar.---
         |--------------------------------------------------------
         */
        var nome = $(this).text();
        /*
         |----------------------------------------------------------
         |Invoca a função responsável por adcionar as referências---
         |do usuário com quem se quer conversar na janela.----------
         |----------------------------------------------------------
         */
        add_janela(id, nome, status);
    });
    /*
     |---------------------------------------
     |Adiciona o usuário a janela do site.---
     |---------------------------------------
     */
    function add_janela(id, nome, status) {
        $('.content.conteudo_chat').attr('id', 'open');
        
        var splitDados = id.split(':');
        /*
         |---------------------------------------
         |Meu id.--------------------------------
         |---------------------------------------
         */
        var id_de = Number(splitDados[0]);
        /*
         |---------------------------------------
         |Pessoa com quem eu estou conversando.--
         |---------------------------------------
         */
        var id_para = Number(splitDados[1]);
        /*
         |---------------------------------------
         |Cabeçalho da janela do chat.-----------
         |---------------------------------------
         */
        var header = `<i class="fa fa-comments-o"></i>`;
        header += `<h3 class="box-title" id="${id_de + ':' + id_para}">${nome}</h3>`;
        header += `<div class="box-tools pull-right" data-toggle="tooltip" title="Status">`;
        header += `<div class="btn-group" data-toggle="btn-toggle">`;
        if (status === 'status on') {
            header += `<button type="button" class="btn btn-default btn-sm active"><i class="fa fa-circle text-green"></i></button>`;
            header += `<button type="button" class="btn btn-default btn-sm"><i class="fa fa-circle text-red"></i></button>`;
        } else {
            header += `<button type="button" class="btn btn-default btn-sm"><i class="fa fa-circle text-green"></i></button>`;
            header += `<button type="button" class="btn btn-default btn-sm active"><i class="fa fa-circle text-red"></i></button>`;
        }
        header += `</div>`;
        header += `</div>`;

        $('#header-chat').html(header);
        /*
         |--------------------------------------------------------
         |Corpo da janela do chat.--------------------------------
         |Limpa a janela do chat.---------------------------------
         |--------------------------------------------------------
         */
        var body = `<div class="mensagens">`;
        body += `<ul>`;
        body += `</ul>`;
        body += `</div>`

        $('#chat-box').html(body);
        /*
         |---------------------------------------------------------
         |Rodapé da janela do chat.--------------------------------
         |---------------------------------------------------------
         */
        var footer = `<div class="input-group">`;
        footer += `<div class="send_message" id="${id}">`;
        footer += `<input id="${id}" name="mensagem" class="form-control msg" placeholder="Digite sua mensagem...">`;
        footer += `</div>`;
        footer += `<div class="input-group-btn">`;
        footer += `<button type="button" class="btn btn-success" id="btn-enviar"><i class="fa fa-send"></i></button>`;
        footer += `</div>`;
        footer += `</div>`;

        $('#footer-chat').html(footer);
        /*
         |---------------------------------------------------------
         |Retorna o histórico das conversas.-----------------------
         |---------------------------------------------------------
         */
        retorna_historico(id_para, status);
    }
    /*
     |-----------------------------------------------------
     |Responsável por devolver o histórico das conversas.--
     |-----------------------------------------------------
     */
    function retorna_historico(para, status) {

        var path = urlPath("chat", "retornaHistorico");
        /*
         |---------------------------------------------------
         |ID de quem enviou a mensagem.----------------------
         |---------------------------------------------------
         */
        var de = userOnline;
        /*
         |---------------------------------------------------
         |ID de quem vai receber a mensagem.-----------------
         |---------------------------------------------------
         */
        var para = para;

        jQuery.ajax({
            type: 'POST',
            url: path,
            data: {user_de: de, user_para: para},
            dataType: 'json',
            success: function (retorno) {
                /*
                 |-----------------------------------------------
                 |jQuery.each -> Itera sobre objetos e matrizes.-
                 |-----------------------------------------------
                 */
                jQuery.each(retorno, function (i, msg) {

                    if (de == msg.id_de) {
                        jQuery('#chat-box .mensagens ul')
                                .append(`<li class="i"><div class="item" id="${msg.id}">
                                <img src="http://localhost/mindmon$/public_html/static_into${msg.foto_de}" alt="user image" class="img-chat">
                                <p class="message">
                                <a class="name">
                                <!--<small class="text-muted pull-right"><i class="fa fa-clock-o"></i> 5:15</small>-->
                                ${msg.nome_de}
                                </a>
                                ${msg.mensagem}
                                </p>
                                </div>
                                </li>`);
                    } else {
                        jQuery('#chat-box .mensagens ul')
                                .append(`<li class="you"><div class="item" id="${msg.id}">
                                <img src="http://localhost/mindmon$/public_html/static_into${msg.foto_para}" alt="user image" class="img-chat">
                                <p class="message">
                                <a class="name">
                                <!--<small class="text-muted pull-right"><i class="fa fa-clock-o"></i> 5:15</small>-->
                                ${msg.nome_para}
                                </a>
                                ${msg.mensagem}
                                </p>
                                </div>
                                </li>`);
                    }
                });
                /*
                 |----------------------------------------------------
                 |Pede pra inverter o conteúdo da li das mensagens.---
                 |----------------------------------------------------
                 */
                [].reverse.call(jQuery('#chat-box .mensagens li')).appendTo(jQuery('#chat-box .mensagens ul'));
                /*
                 |---------------------------------------
                 |Move o conteúdo da janela para baixo.--
                 |---------------------------------------
                 */
                jQuery('#chat-box').animate({scrollTop: 500}, '500');
            }
        });
    }
    /*
     |-------------------------------------
     |Envia a mensagem para outro usuário--
     |-------------------------------------
     */
    $('body').on('keyup', '.msg', function (e) {
        e.preventDefault();
        /*
         |---------------------------------------
         |Recupera o ID do usuário que que vai---
         |enviar a mensagem.---------------------
         |---------------------------------------
         */
        var userOnline = Number(jQuery('span.user_online').attr('id'));
        /*
         |------------------------------------------
         |Se o enter for teclado.-------------------
         |------------------------------------------
         */
        if (e.which == 13) {
            /*
             |---------------------------------------
             |Recupera o valor da do .msg e coloca---
             |na variável texto.---------------------
             |---------------------------------------
             */
            var texto = jQuery(this).val();
            /*
             |------------------------------------------------------------------------------
             |Recupera os id's dos usuários(quem vai enviar e quem vai receber a mensagem)--
             | no seguinte formato (id_de:id_para).-----------------------------------------
             |------------------------------------------------------------------------------
             */
            var id = jQuery(this).attr('id');
            /*
             |----------------------------------------------------------------------------
             |Separa os id's tendo como separador o dois pontos(:) usando a função split.-
             |----------------------------------------------------------------------------
             */
            var split = id.split(':');
            /*
             |---------------------------------------------------------------------------
             |id do usuário para quem será enviado o texto.------------------------------
             |---------------------------------------------------------------------------
             */
            var para = Number(split[1]);
            var apontador = urlPath('chat', 'salvar');
            /*
             |---------------------------------------
             |Verifica se a mensagem está em branco.-
             |---------------------------------------
             */
            if (texto == '') {
                $('#errorSendMessageBlank').modal();
                return false;
            }
            $.ajax({
                type: 'POST',
                url: apontador,
                data: {mensagem: texto, de: userOnline, para: para},
                success: function (retorno) {
                    if (retorno === 'ok') {
                        $('.msg').val('');
                    } else {
                        $('#errorSendMessage').modal();
                    }
                }
            });
        }
    });
    $('body').on('live', '.mensagens', function () {
        alert('funcionando!');
    });
    /*
     |-------------------------------------------------------------------
     |Toda vez que a função salavar for executada no sentido de salvar---
     |uma nova mensagem no banco de dados um timestamp novo e um lastid-- 
     |novo serão retornados o userOnline serve apenas para determinar----
     |qual timestamp e qual last id serão trazidos para a função.--------
     |-------------------------------------------------------------------
     */
    /*
     |------------------------------------------------------------------------------------------------
     |Tempo final de execução(timestamp), Último id das mensagens(mensagens mais novas), Usuário(id).-
     |------------------------------------------------------------------------------------------------
     */
    function verifica(timestamp, lastid, userOnline) {
        var path = urlPath("chat", "stream");
        /*
         |-------------------------------------------------
         |Parece não funcionar direito, preciso verificar.-
         |-------------------------------------------------
         */
        var t;

        jQuery.ajax({
            type: 'POST',
            url: path,
            cache: true,
            data: {timestamp: timestamp, lastid: lastid, userOnline: userOnline},
            dataType: 'json',
            success: function (retorno) {
                clearTimeout(t);
                /*
                 |---------------------------------------------------------
                 |Se o status contiver resultados ou se estive vazio a-----
                 |função será executada, ou seja a função precisa ser------
                 |executada recursivamente independente do resultado.------
                 |---------------------------------------------------------
                 */
                if (retorno.status == 'resultados' || retorno.status == 'vazio') {
                    t = setTimeout(function () {
                        verifica(retorno.timestamp, retorno.lastid, userOnline);
                    }, 1000);
                    if (retorno.status == 'resultados') {
                        jQuery.each(retorno.dados, function (i, msg) {
                            /*
                             |---------------------------------------------------------
                             |Essa verificação serve para determinar em que posição a-- 
                             |mensagem vai ser colocada.-------------------------------
                             |---------------------------------------------------------
                             */
                            if (userOnline == msg.id_de) {
                                jQuery('#chat-box .mensagens ul')
                                        .append(`<li class="i"><div class="item" id="${msg.id}">
                                    <img src="http://localhost/mindmon$/public_html/static_into${msg.foto_de}" alt="user image" class="img-chat">
                                    <p class="message">
                                    <a class="name">                                    
                                    ${msg.nome_de}
                                    </a>
                                    ${msg.mensagem}
                                    </p>
                                    </div>
                                    </li>`);
                            } else {
                                jQuery('#chat-box .mensagens ul')
                                        .append(`<li class="you"><div class="item" id="${msg.id}">
                                    <img src="http://localhost/mindmon$/public_html/static_into${msg.foto_para}" alt="user image" class="img-chat">
                                    <p class="message">
                                    <a class="name">                                    
                                    ${msg.nome_para}
                                    </a>
                                    ${msg.mensagem}
                                    </p>
                                    </div>
                                    </li>`);
                            }

                        });
                        jQuery('#chat-box').animate({scrollTop: 500}, '500');
                    }
                    /*
                     |----------------------------------------------
                     |Se houver algum erro no primeiro if.----------
                     |----------------------------------------------
                     */
                } else if (retorno.status == 'erro') {
                    alert('Ficamos confusos, atualize a pagina');
                }
            },
            /*
             |--------------------------------------------------
             |Caso ocorra algum erro no serviro ou se a conexão-
             |cair um descanso de 15 segundos é invocado até o--
             |longpolling começar novamente;--------------------
             |--------------------------------------------------
             */
            error: function () {
                clearTimeout(t);
                t = setTimeout(function () {
                    verifica(retorno.timestamp, retorno.lastid, userOnline);
                }, 15000);
            }
        });
    }
    function loopVerificacaoMensagens() {
        setInterval(verificaMensagens, 7000);
        verificaMensagens();
    }
    function verificaMensagens() {
        $('#message_notificacao_in').html('');
        var path = urlPath("notification", "verificaMensagens");

        $.ajax({
            type: 'POST',
            url: path,
            cache: true,
            dataType: 'json',
            success: function (json) {
                if (json.length > 0) {
                    $('#mensagens_recebidas').html(json.length);
                    if (json.length > 0 && json.length != 1) {
                        $('#message_notificacao').html(`Você tem ${json.length} mensagens recebidas`);
                    } else {
                        $('#message_notificacao').html(`Você tem ${json.length} mensagem recebida`);
                    }
                    for (var i = 0; i < json.length; i++) {
                        /*
                         |--------------------------------------------------
                         |URL usada para fazer a busca do nome do usuário.--
                         |--------------------------------------------------
                         */
                        var path2 = urlPath("usuario", "refMessages");
                        $.post(path2, {id_de: json[i].id_de}, function (data) {

                            $('#message_notificacao_in').append(`<li>
                                    <a href="">
                                        <div class="pull-left">
                                            <img src="http://localhost/mindmon$/public_html/static_into${data.fotoperfil}" class="img-circle">
                                        </div>
                                        <h4>${data.nome}</h4>
                                        <p>Te chamou no chat.</p>
                                    </a>
                            </li>`);
                        }, "json");
                    }
                }
            },
            error: function () {
            }
        });
    }
    /*
     |--------------------------------------------------
     |Aponta o caminho do arquivo a ser invocado--------
     |Também pode apontar para um caminho estático,-----
     |por exemplo o caminho da pasta de imagens.--------
     |--------------------------------------------------
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
    verifica(0, 0, userOnline);
    /*
     |-------------------------------------------------------------
     |Faz a verificação pra saber se tem alguma janela aberta.-----
     |-------------------------------------------------------------
     */
    loopVerWindow();
});