var read = require('read-file-utf8');
var path = require('path');
let pathDB = path.join(__dirname, 'loki/loki.json');
var loki = require("lokijs");
var db = new loki(pathDB);
var data = read(pathDB);
db.loadJSON(data);
window.Vue = require('vue');

if (db.getCollection('users') == null) {
    var users = db.addCollection('users');
    users.insert(
        {
            nome: 'vazio',
            email: 'vazio',
            pass: 'vazio'
        });
    db.save();
    alert('Usuário criado com sucesso...');
}

var users = db.getCollection('users');

new Vue({
    el: 'body',
    data: {
        debug: false,
        users: [],
        mode: '',
        user: {
            nome: 'vazio',
            email: '',
            pass: '',
        },
        openModal: false
    },
    ready: function () {
        this.mode = 'edicao';
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
        editUser: function (users) {
            this.user = users
            this.openModal = true;
        },
        userAddOrUpdate: function () {
            if (typeof this.user.$loki !== 'undefined') {
                users.update(this.user);
            } else {
                users.insert(this.user);
            }
            db.save();
            this.openModal = false;
        }
    }
});