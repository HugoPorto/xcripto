$(document).ready(function(){

    let url_invocada = url("index", "searchUsuario");

    $.ajax({
    	type: 'POST',
    	url: url_invocada,
    	cache: false,
    	data: {nome: seraBuscado},
    	beforeSend: function(){

    	},
    	success: function(data){	    		

    			console.log(data);   	

    	},
    	error: function(){
    		console.log("Erro ao retornar dados!")
    	}
    });
    return false;

	/*
    |--------------------------------------------------------------
    | Aponta o caminho do arquivo a ser invocado
    | Também pode apontar para um caminho estático, por exemplo o 
    | caminho da pasta de imagens
    |--------------------------------------------------------------
    */
	function url(controller, metodo) {
        let url_controller = "/" + controller + "/" + metodo;
        let urlsplit = window.location.href.toString();
        let arrUrl = urlsplit.split('/');
        delete arrUrl[4];
        delete arrUrl[5];
        let joinUrl = arrUrl.join('/');
        let url_base = joinUrl.substring(0, (joinUrl.length - 1));
        let path = url_base.concat(url_controller);

        return path;
    }
});