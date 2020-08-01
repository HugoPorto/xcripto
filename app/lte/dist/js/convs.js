/*
|=====================================================================================
|=====================================================================================
|===É carregado nas páginas sol.phtml, usuario_my_friend e usuario_not_friend.phtml===
|=====================================================================================
|=====================================================================================
*/
$(document).ready(function () {
    /*
    |-------------------------------
    |Invoca a função carrega dados
    |-------------------------------
    */    
    externos_enviados();
    internos_enviados();
    recebidos();

    $('body').on('click', '.solicitar_amizade', function () {
        let convidado = $(this).attr('id'); 
        console.log(convidado);
		let url = urlPath('convite', 'convidar');
        $.ajax({
            type:'POST',
            url: url,
            data: {convidado : convidado},
            beforeSend: ()=>{
            },
            success: (dados)=>{      
                console.log(dados);
                // let convite_amizade ='';
                // convite_amizade += `<button type="button" class="btn btn-block btn-default">`;
                // convite_amizade += `Solicitação de amizade enviada`;
                // convite_amizade += `</button>`;                
                // $('#convite_amizade').html(convite_amizade);
            },
            error: ()=>{
                alert('Erro ao cadastrar convite');
            }
        });
	});
    /*
    |-----------------------------------------------------
    |Carrega os dados exibidos no primeiro item da página
    |de solicitações.
    |-----------------------------------------------------
    |As solicitaçõese enviadas para usuários ainda não 
    |cadastrados.
    |-----------------------------------------------------
    */
    function externos_enviados() {
        let url = urlPath('convite', 'conEnvPenExtJSON');

        $.ajax({
            type: 'POST',
            url: url,
            cache: true,
            dataType: 'JSON',
            beforeSend: ()=>{
            },
            success: (dados)=>{
                $('#externos_enviados').html(dados.enviadas);
            },
            error: ()=>{
                $('#externos_enviados').html("Erro!");
            }
        });
    }
    /*
    |-----------------------------------------------------
    |Carrega os dados exibidos no segundo item da página
    |de solicitações.
    |-----------------------------------------------------
    |As solicitações enviadas para usuário já cadastrados.
    |-----------------------------------------------------
    */
    function internos_enviados(){
        let url = urlPath('convite', 'conEnvPenIntJSON');

        $.ajax({
            type: 'POST',
            url: url,
            cahce: true,
            dataType: 'JSON',
            beforeSend: ()=>{

            },
            success: (dados)=>{
                $('#internos_enviados').html(dados.enviadas);
            },
            error: ()=>{
                $('#internos_enviados').html("Erro!");
            }
        });
    }
     /*
    |-----------------------------------------------------
    |Carrega os dados exibidos no terceiro item da página
    |de solicitações.
    |-----------------------------------------------------
    |As solicitações recebidas.
    |-----------------------------------------------------
    */
    function recebidos(){
        let url = urlPath('convite', 'Recebidos');

        $.ajax({
            type: 'POST',
            url: url,
            cahce: true,
            dataType: 'JSON',
            beforeSend: ()=>{

            },
            success: (dados)=>{                
                $('#recebidos').html(dados.recebidos);
            },
            error: ()=>{
                $('#recebidos').html("Erro!");
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
            console.log(path);
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