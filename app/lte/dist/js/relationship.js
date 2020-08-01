/*
|=====================================================================================
|=====================================================================================
|======É responsável direto pelas ações de solicitação e desfazimento de amizade======
|=====================================================================================
|=====================================================================================
*/
/*
|-------------------------------------------------
|Toma a ação de desfazer uma relação de amizade.
|-------------------------------------------------
*/
$(document).ready(function () {
    /*
    |----------------vem de usuario_my_friend.phtml--------------
    |Responsável pela ação de desfazer a amizade com um usuário
    |a partir da página que lista o usuário como amigos.
    |------------------------------------------------------------
    */
    $('body').on('click', '.desfazer_amizade_relationship', function(){        
        var path = urlPath('usuario', 'desfazerAmizade');        
        var id_para = $(this).attr('id');    

        $.ajax({
            type: 'POST',
            url: path,
            data: {id_para: id_para },
            success: (dados)=>{
                if (dados !== '') {
                    /*
                    |-------------------------------------------
                    |Tira a foto da pessoa da lista dos amigos
                    |caso algum dados seja recuperado.
                    |-------------------------------------------
                    */
                    $(this).parent().parent().parent().parent().hide('slow', function(){
                        $(this).remove();
                    });
                } else {
                    alert('Erro!');
                }
            }
        });
    });
    /*
    |------------------------------------------------------------
    |Responsável pela ação de desfazer a amizade com um usuário
    |a partir da página de visualização do perfil do mesmo.
    |------------------------------------------------------------
    */
    $('body').on('click', '.desfazer_amizade', ()=>{        
        var path = urlPath('usuario', 'desfazerAmizade');        
        var dados = $('.desfazer_amizade').attr('id');
        var split = dados.split(':');

        var email_para = split[0];
        var id_para = Number(split[1]);

        /*
        |------------------------------------
        |URL usada para redirecionar precisa
        |do email_para.
        |------------------------------------
        */
        var path2 = urlPath('usuario', 'verUsuario', email_para);        

         $.ajax({
            type: 'POST',
            url: path,//Usa o caminho criado na primeira linha assim que a ação é invocada.         
            data: {id_para: id_para },
            success: (dados)=>{
                if (dados !== '') {
                    $(window.document.location).attr('href',path2);//Usa outro caminho para fazer o reload.
                } else {
                    alert('Erro!');
                }
            }
        });
    });
    /*
    |--------------------------------------------------
    |Tenho que avalizar se essa é a melhor função para
    |todo o sistema.
    |--------------------------------------------------
    */
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