var read = require('read-file-utf8');
var path = require('path');
let pathDB = path.join(__dirname, 'loki/loki.json');
var loki = require("lokijs");
var db = new loki(pathDB);
var data = read(pathDB);
db.loadJSON(data);
window.Vue = require('vue');

if (db.getCollection('destaques') == null) {
    var destaques = db.addCollection('destaques');
    db.save();
    alert('Coleção de destaques criada com sucesso...');
}

var destaques = db.getCollection('destaques');

new Vue({
    el: 'body',
    data: {
        debug: false,
        destaques: [],
        mode: '',
        destaque: {
            moeda: '',
            descricao: '',
            link: '',
            ativo: true
        },
        openModal: false
    },
    ready: function () {
        this.mode = 'edicao';
        this.destaques = destaques.data;
    },
    methods: {
        makeDebug: function () {
            if (this.debug == false) {
                this.debug = true;
            } else {
                this.debug = false;
            }
        },
        deleteDestaque: function (destaque) {
            destaque.ativo = false;
            if (typeof this.destaque.ativo == true) {
                this.destaque = destaque.ativo;
                destaques.update(this.destaque);
            }
            
            db.save();
        },
        editDestaque: function (destaque) {
            this.destaque = destaque
            this.openModal = true;
        },
        createDestaque: function () {
            this.mode = 'cadastro';
            this.openModal = true;
            this.destaque = {
                moeda: '',
                descricao: '',
                link: '',
                ativo: true
            };
        },
        destaqueAddOrUpdate: function () {
            if (typeof this.destaque.$loki !== 'undefined') {
                destaques.update(this.destaque);
            } else {
                destaques.insert(this.destaque);
            }
            db.save();
            this.openModal = false;
        }
    }
});