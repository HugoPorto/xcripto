// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// var loki = require("lokijs");
// var db = new loki("loki.json");
// var clientes = db.addCollection('clientes');

// clientes.insert(
//     {
//         nome: 'Victor',
//         email: 'victor.porto7@gmail.com'
//     });
// db.save();

function ready(fn) {
    if (document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};

// ready(function(){
//     document.querySelector('#salvar').addEventListener('click', function (e) { 
//         e.preventDefault();

//         let data = {
//             nome: document.querySelector('#nome').value,
//             cpf: document.querySelector('#cpf').value,
//             telefone: document.querySelector('#telefone').value,
//             email: document.querySelector('#email').value,
//             endereco: document.querySelector('#endereco').value,
//             bairro: document.querySelector('#bairro').value,
//             numero: document.querySelector('#numero').value,
//         }

        // clientes.insert(data);
        // db.save();
//         alert('Cliente salvo com sucesso...')
//         document.querySelector('#cadastro-clientes').reset();
//         console.log(data);
//      });
// });