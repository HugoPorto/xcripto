$(document).ready(function () {

    $.ajaxSetup({cache: false});
    carrega_dados();
    function carrega_dados() {

        

        $("html, body").scroll(function () {
          

                alert('funcionando!');

            
        });



        var pointer = url("carrega_dados");
        
        $.ajax({
            type: 'GET',
            url: pointer,
            cache: false,
            dataType: "json",
            beforeSend: function () {

            },
            success: function (retorna_dados) {

                console.log(retorna_dados);

                var itens = '';

                for (var i = 0; i < retorna_dados.length; i++) {

                    itens += '<li>';
                    itens += '<img src = "<?= STATIC_URL_INTO ?>/dist/img/user1-128x128.jpg" alt = "User Image">';
                    itens += '<a class = "users-list-name" href = "#">' + retorna_dados[i].nome + ' ' + retorna_dados[i].sobrenome + '</a>';
                    itens += '<div class = "btn-group">';
                    itens += '<button type = "button" class = "btn btn-default">Amigos</button>';
                    itens += '<button type = "button" class = "btn btn-default dropdown-toggle" data-toggle = "dropdown" aria-expanded = "false">';
                    itens += '<span class = "caret"></span>';
                    itens += '<span class = "sr-only">Toggle Dropdown</span>';
                    itens += '</button>';
                    itens += '<ul class = "dropdown-menu" role = "menu">';
                    itens += '<li><a href = "#">Desfazer amizade</a></li>';
                    itens += '</ul>';
                    itens += '</div>';
                    itens += '</li>';



                }

                $("#friends").append(itens);


            },
            error: function () {

            }
        });
    }

    function url(metodo) {//É o metódo que vai ser chamado no Controller Chat

        var url_controller = "/colaborador/" + metodo + "/"; //Edereço do Controller que receberá as informações
        var urlsplit = window.location.href.toString(); //Inicia o processo de criação da url_base
        var arrUrl = urlsplit.split('/');
        delete arrUrl[4];
        delete arrUrl[5];
        var joinUrl = arrUrl.join('/');
        var url_base = joinUrl.substring(0, (joinUrl.length - 1));
        var stream = url_base.concat(url_controller); //Controller que receberá a informação

        return stream;
    }
});