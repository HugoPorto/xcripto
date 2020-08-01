var read = require('read-file-utf8');
var path = require('path');
let pathDB = path.join(__dirname, 'loki/loki.json');
var loki = require("lokijs");
var db = new loki(pathDB);
var data = read(pathDB);
db.loadJSON(data);
window.Vue = require('vue');

if (db.getCollection('corretoras') == null) {
    var corretoras = db.addCollection('corretoras');
    db.save();
    alert('Coleção de corretoras criada com sucesso...');
}

var corretoras = db.getCollection('corretoras');
var users = db.getCollection('users');

new Vue({
    el: 'body',
    data: {
        debug: false,
        corretoras: [],
        users: [],
        mode: '',
        corretora: {
            user: '',
            corretora: '',
            key: '',
            secret: ''
        },
        openModal: false
    },

    ready: function () {
        this.mode = 'edicao';
        this.corretoras = corretoras.data;
        this.users = users.data;
    },
    methods: {
        makeDebug: function () {
            if (this.debug == false) {
                this.debug = true;
            } else {
                this.debug = false;
            }
        },
        editCorretora: function (corretora) {
            // location.reload();
            this.mode = 'edicao';
            this.openModal = true;
            this.corretora = corretora;
        },
        createCorretora: function () {
            console.log('Method: createSale()');
            this.mode = 'cadastro';
            this.openModal = true;
            this.corretora = {
                user: '',
                corretora: '',
                key: '',
                secret: ''
            };
        },
        saleStoreOrUpdate: function () {
            if (typeof this.corretora.$loki !== 'undefined') {
                corretoras.update(this.corretora);
            } else {
                // this.venda.preco_unitario = produtos.find({ nome: this.venda.produto })[0].preco;
                // console.log(produtos.find({ nome: this.venda.produto })[0]);
                corretoras.insert(this.corretora);
            }
            db.save();
            this.openModal = false;
            location.reload();
        },
    }
});