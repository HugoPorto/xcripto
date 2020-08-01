/*
|=========================================================================
|=========================================================================
|Comanda o sistema de notificações do sistema.============================
|Trabalha diretamente com o arquivo notifications.phtml===================
|=========================================================================
|=========================================================================
*/
$(document).ready(function () {    
    /*
    |======================Início===========================
    |=======================================================
    |Veridicação de convites.===============================
    |=======================================================
    |=======================================================
    */
    /*
    |---------------------------------------
    |Inicia a verificação de convites.
    |---------------------------------------
    */
    loopVerificacaoConvites();
    /*
    |---------------------------------------
    |Faz a verificação de convites.
    |---------------------------------------
    */
    function loopVerificacaoConvites(){
        setInterval(verifica_convites, 7000);
        verifica_convites();
    }

    function verifica_convites(){
        var path = urlPath("notification", "verificaConvites");

        $.ajax({
            type: 'POST',
            url: path,
            cache: true,
            // data: {timestamp: timestamp, lastid: lastid, userOnline: userOnline},
            dataType: 'json',
            success: function(dados){
                if(dados.recebidos > 0){
                    $('#convites_recebidos').html(dados.recebidos);                   

                    if(dados.recebidos > 0 && dados.recebidos != 1){
                        $('#convites_recebidos_text').html(`Você tem ${dados.recebidos} convites recebidos`);

                        var path_rec = urlPath("convite", "conRec");
                        $('#convite_notificacao').
                        html(`<li>
                                <a href="${path_rec}">
                                <i class="fa fa-users text-aqua"></i> 
                                <span>${dados.recebidos} notificações para verificar</span>
                                </a>
                            </li> `);
                    }else{
                        $('#convites_recebidos_text').html(`Você tem ${dados.recebidos} convite recebido`);

                        var path_rec = urlPath("convite", "conRec");
                        $('#convite_notificacao').
                        html(`<li>
                                <a href="${path_rec}">
                                <i class="fa fa-users text-aqua"></i> 
                                <span>${dados.recebidos} notificação para verificar</span>
                                </a>
                            </li> `);
                    }                    
                }
                // else if(dados.recebidos == 0){
                //     $('#menu_notification_rec').html('');
                // }               
            },
            error: function(){

            }
        });
    } 
    /*
    |========================Fim============================
    |=======================================================
    |Veridicação de convites.===============================
    |=======================================================
    |=======================================================
    */   
    /*
    |========================Início=========================
    |=======================================================
    |Veridicação de mensagens.==============================
    |=======================================================
    |=======================================================
    */
    /*
    |---------------------------------------
    |Inicia a verificação de mensagens.
    |---------------------------------------
    */
    loopVerificacaoMensagens();
    /*
    |---------------------------------------------
    |Quando o usuário clica no item referente as
    |notificações do chat o item é limpo.
    |---------------------------------------------
    */
    jQuery('body').on('click', '#mensagens_recebidas', function () {
        $('#message_notificacao_in').html('');
    });
    /*
    |---------------------------------------
    |Faz a verificação de mensagens.
    |---------------------------------------
    */
    
    function loopVerificacaoMensagens(){
        setInterval(verificaMensagens, 7000);
        verificaMensagens();
    }    
    
    function verificaMensagens(){
        $('#message_notificacao_in').html('');
        var path = urlPath("notification", "verificaMensagens");

        $.ajax({
            type: 'POST',
            url: path,
            cache: true,            
            dataType: 'json',
            success: function(json){                
                if(json.length > 0){
                    $('#mensagens_recebidas').html(json.length);
                    if(json.length > 0 && json.length != 1){
                        $('#message_notificacao').html(`Você tem ${json.length} mensagens recebidas`);
                    }else{
                        $('#message_notificacao').html(`Você tem ${json.length} mensagem recebida`);
                    }                    
                    for (var i = 0; i < json.length; i++) {                    
                        /*
                        |--------------------------------------------------
                        |URL usada para fazer a busca do nome do usuário.
                        |--------------------------------------------------
                        */
                        var path2 = urlPath("usuario", "refMessages");
                        $.post( path2, { id_de: json[i].id_de }, function( data ) {
                            
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
            error: function(){
            }
        });
    }
    /*
    |=========================Fim===========================
    |=======================================================
    |Veridicação de mensagens.==============================
    |=======================================================
    |=======================================================
    */
    /*
    |--------------------------------------------------
    |Aponta o caminho do arquivo a ser invocado
    |Também pode apontar para um caminho estático, 
    |por exemplo o caminho da pasta de imagens.
    |--------------------------------------------------
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