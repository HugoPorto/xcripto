/*
|============================================================
|============================================================
|====Comanda o funcionamento das configurações do sistema====
|============================================================
|============================================================
*/
$(document).ready(function () {    
    /*
    |============================================================
    |============================================================
    |====================Alteração de senha======================
    |============================================================
    |============================================================
    */ 
    /*
    |----------------------------------------------------------
    |Quando o modal abre o foco vai para o campo senha antiga.
    |----------------------------------------------------------
    */
    $('body').on('click', '#key-change', function(){
        $('#keyChange').modal();
        $('#senha-antiga').focus();
           
    });
    /*
    |----------------------------------------------------------------
    |Quando o usuário começa a digitar no campo confirma-senha-nova.
    |----------------------------------------------------------------
    */
    $('#senha-nova').keyup(checarSenhas);
    $('#confirma-senha-nova').keyup(checarSenhas);
    /*
    |----------------------------------------------------------------
    |Quando o foco fica no campo confirma-senha-nova.
    |----------------------------------------------------------------
    */
    // $('#confirma-senha-nova').focus(()=>{});
    /*
    |----------------------------------------------------------------
    |Valida as senhas.
    |----------------------------------------------------------------
    */
    function checarSenhas(){
        var senha_antiga = $('#senha-antiga').val();
        var senha_nova = $('#senha-nova').val();
        var confirma_senha_nova = $('#confirma-senha-nova').val();
        
        if(senha_nova !== confirma_senha_nova){
            $('#divchek').html('<span>As senhas são diferentes!</span>');
            $('#alterar-senha').prop('disabled', true);
        }else{
            $('#divchek').html('');
            document.getElementById('alterar-senha').disabled = false;
        }
    }
    /*
    |----------------------------------------------
    |Faz a alteração da senha, mas antes valida no
    |Controller.
    |----------------------------------------------
    */
    $('body').on('click', '#alterar-senha', function(){
        var senha_antiga = $('#senha-antiga').val();
        var senha_nova = $('#senha-nova').val();
        var confirma_senha_nova = $('#confirma-senha-nova').val();
        var path = urlPath("usuario", "updatePass");

        $.ajax({
            type: 'POST',
            url: path,
            cache: false,            
            data: {senha_nova: senha_nova, senha_antiga: senha_antiga, confirma_senha_nova: confirma_senha_nova},
            success: function (dados) {
                if (dados === 'senha_antiga:erro') {                    
                    $('#senha-antiga').val('');
                    $('#senha-nova').val('');
                    $('#confirma-senha-nova').val('');
                    $('#divchek').html('<span>Ocorreu um erro, senha antiga não confere!</span>');
                    $('#alterar-senha').prop('disabled', true);
                } else if(dados === 'ok'){
                    location.reload();
                }
            }
        });
    });
    /*
    |============================================================
    |============================================================
    |====================Alteração de status=====================
    |============================================================
    |============================================================
    */ 
    /*
    |----------------------------------------------------------
    |Quando o usuário clica no link do alterar status
    |----------------------------------------------------------
    */
    $('body').on('click', '#status-change', function(){
        /*
        |----------------------------
        |Abre o modal
        |----------------------------
        */
        $('#statusChange').modal();
        var path = urlPath('usuario', 'verStatus');
        /*
        |-------------------------------
        |Verifica o status do usuário.
        |-------------------------------
        */
        $.ajax({
            type: 'POST',
            url: path,
            beforeSend: ()=>{
            },
            success: (dados)=>{
                if(dados == 'online'){
                    $('#status').prop({checked: true});
                    $('#markcheck').html('online');
                }else{
                    $('#status').prop({checked: false});
                    $('#markcheck').html('offline');
                }
            },
            error: ()=>{                
            }
        });        
    });
    /*
    |----------------------------------------------
    |Alterar o staus do usuário.
    |----------------------------------------------
    */
    $('#status').change(function(){
        var path = urlPath('usuario', 'updateStatus');
        var status = $('#markcheck').html();       

        $.ajax({
            type: 'POST',
            url: path,
            data: {status: status},
            beforeSend: ()=>{
            },
            success: (dados)=>{                
                if (dados === 'online') {                    
                    $('#markcheck').html('online');
                    $('#status_sidebar').html('<i class="fa fa-circle text-success"></i>online');
                } else{
                    $('#markcheck').html('offline');
                    $('#status_sidebar').html('<i class="fa fa-circle text-danger"></i>offline');
                }
            },
            error: ()=>{
            }
        });
    });
     /*
    |----------------------------------------------------------
    |Quando o usuário clica no link do lado esquerdo do menu
    |onde existe a indicação de status online
    |esse item é invocado.
    |----------------------------------------------------------
    */
    $('body').on('click', '#status_sidebar', function(){
        /*
        |----------------------------
        |Abre o modal
        |----------------------------
        */
        $('#statusChange').modal();
        var path = urlPath('usuario', 'verStatus');
        /*
        |-------------------------------
        |Verifica o status do usuário.
        |-------------------------------
        */
        $.ajax({
            type: 'POST',
            url: path,
            beforeSend: ()=>{
            },
            success: (dados)=>{
                if(dados == 'online'){
                    $('#status').prop({checked: true});
                    $('#markcheck').html('online');
                }else{
                    $('#status').prop({checked: false});
                    $('#markcheck').html('offline');
                }
            },
            error: ()=>{                
            }
        });        
    });
    /*
    |============================================================
    |============================================================
    |=======================Reportando bug=======================
    |============================================================
    |============================================================
    */ 
    /*
    |----------------------------------------------------------
    |Quando o modal abre o foco vai para o campo senha antiga.
    |----------------------------------------------------------
    */
    $('body').on('click', '#send-bug', function(){
        $('#sendBug').modal();
        $('#message-text').focus();
           
    });
    $('#message-text').keyup(function(){
        $('#reportar-bug').prop({disabled: false});
    });
    /*
    |----------------------------------------------------------
    |Envia o bug
    |----------------------------------------------------------
    */
    $('body').on('click', '#reportar-bug', function(){ 
        var mensagem = $('#message-text').val();       

        if(mensagem == ''){            
            $('#divchekbug').html('<span>Ocorreu um erro, você não pode enviar uma imagem vazia!</span>');
            return false;
        }else{            
            var path = urlPath('report2', 'reportBug');            
            
            $.ajax({
                type: 'POST',
                url: path,
                data:{mensagem: mensagem},
                beforeSend: ()=>{
                },
                success: (dados)=>{                    
                    if(dados == 'ok'){                        
                        location.reload();
                    }else{
                        $('#divchekbug').html('<span>Ocorreu um erro, tente reportar bug novamente!</span>');
                    }
                },
                error: ()=>{             
                }
            });   
        }             
    });
    /*
    |============================================================
    |============================================================
    |======================Apontador de url======================
    |============================================================
    |============================================================
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

