/*
|===========================================================================
|===========================================================================
|====Comanda o funcionamento dos updates das imagens de perfil e de capa====
|===========================================================================
|===========================================================================
*/
$(document).ready(function () {
    /*
    |----------------------------------------------------------
    |Recarrega a página para ver a mudança na imagem de perfil.
    |----------------------------------------------------------
    */
    $('body').on('click', '#change-perfil-buttom', function(){
        location.reload();  
    });
    /*
    |----------------------------------------------------------
    |Recarrega a página para ver a mudança na imagem de perfil.
    |----------------------------------------------------------
    */
    $('body').on('click', '#change-perfil-capa', function(){
        location.reload();  
    });
    /*
    |----------------------------------------------------------
    |Abre o modal para o update da foto de perfil.
    |----------------------------------------------------------
    */
    $('body').on('click', '#change-perfil', function(){
        $('#fotoPerfilChange').modal(); 
        $('#visualizar').hide();   
    });
    /*
    |----------------------------------------------------------
    |Abre o modal para o update da foto de capa.
    |----------------------------------------------------------
    */
    $('body').on('click', '#alterar_foto_capa', function(){
        $('#fotoCapaChange').modal();           
        $('#visualizar-capa').hide();
    });
    /*
    |----------------------------------------------------------------
    |Valida as senhas.
    |----------------------------------------------------------------
    */
    /*
    |-----------------------------------------------------------------
    |Quando ocorre uma mudança no item que refere o arquivo a ser
    |enviado para para substituir a imagem de perfil
    |as ações abaixo são tomadas.
    |------------------------------------------------------------------
    */
    $('#imagem_perfil').on('change',function(){           
        $('#sendImagePerfil').ajaxForm({
            /*
            |-----------------------------------------
            |O resultado deve ser colocado nessa div.
            |-----------------------------------------
            */
            target:'#visualizar',
            beforeSubmit: ()=>{           
            },
            success: ()=>{            
                /*
                |-------------------------------------
                |Mostra o resultado do processamento
                |-------------------------------------
                */
                $('#visualizar').fadeIn('slow');
            }
        }).submit();
    });
    $('#imagem_capa').on('change',function(){           
        $('#sendCapa').ajaxForm({
            target:'#visualizar-capa',
            // beforeSubmit: ()=>{            
            // },
            success: ()=>{
                $('#visualizar-capa').fadeIn('slow');
            }
        }).submit();
    });
});

