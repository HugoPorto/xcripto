var path = require('path');
let pathDB = path.join(__dirname, 'loki/loki.json');
var loki = require("lokijs");
var db = new loki(pathDB);
var fileExists = require('file-exists');

fileExists(pathDB).then(exists => {
    if (exists == false) {
        db.addCollection('users');
        var users = db.getCollection('users');
        users.insert(
            {
                nome: 'vazio',
                key: 'vazio',
                secret: 'vazio'
            });
        db.save();
        console.log("========fileExists()========");
        console.log("Banco de dados criado com sucesso...");
        console.log("========fileExists()========");
    } else {
        console.log("========fileExists()========");
        console.log("O banco de dados já está criado e rodando...");
        console.log("========fileExists()========");
    }
});