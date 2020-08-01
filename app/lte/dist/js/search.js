$(document).ready(function(){

	$(".btn-pesquisar").click(function(event){

	    let seraBuscado = $("input#busca").val();
	    let url_invocada = url("index", "searchUsuario");

	    $.ajax({
	    	type: 'POST',
	    	url: url_invocada,
	    	cache: false,
	    	data: {nome: seraBuscado},
	    	dataType: "json",
	    	beforeSend: function(){

	    	},
	    	success: function(data){	

	    			var table ='';

	    			table += '<div class="box">';
	    			table += '<div class="box-header">';
	    			table += '<h3 class="box-title">Consulta de Clientes</h3>';
	    			table += '</div>';
	    			table += '<div class="box-body">';
    				table += '<table id="example1" class="table table-bordered table-striped">';
    				table += '<thead>';
        			table += '<tr>';   
    				table += '<th>Id</th>';
    				table += '<th>Nome</th>';               
    				table += '<th>Sobrenome</th>';
                    table += '<th>E-mail</th>';
                    table += '<th>Telefone</th>';
                    table += '</tr>';
                    table += '</thead>';

                    table += '<tbody>';
                
                    
					table += '</tbody>';

					table += '<tfoot>';
                	table += '<tr>';
                	table += '<th>Id</th>';
                	table += '<th>Nome</th>';
                	table += '<th>Sobrenome</th>';
                	table += '<th>E-mail</th>';
                	table += '<th>Telefone</th>';
					table += '</tr>';
					table += '</tfoot>';					
					table += '</table>';
					table += '</div>';
					table += '</div>';              

					$("#conteudo").html(table);

	    			var itens = '';

	    			for(let count = 0; count < data.length; count++){
	    				
	    				itens += '<tr>';
	    				itens += '<td>' + data[count].id + '</td>';
	    				itens += '<td>' + data[count].nome + '</td>';
	    				itens += '<td>' + data[count].sobrenome + '</td>';
	    				itens += '<td>' + data[count].email + '</td>';
	    				itens += '<td>' + data[count].fone + '</td>';
	    				itens += '</tr>';
	    				
	    			}
	    			$("tbody").html(itens);    			
	    	},
	    	error: function(){
	    		console.log("Erro ao retornar dados!")
	    	}
	    });
	    return false;
	});

	/*
    |--------------------------------------------------------------
    | Aponta o caminho do arquivo a ser invocado
    | Também pode apontar para um caminho estático, por exemplo o 
    | caminho da pasta de imagens
    |--------------------------------------------------------------
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