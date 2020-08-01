var read = require('read-file-utf8');
var path = require('path');
let pathDB = path.join(__dirname, 'loki/loki.json');
var loki = require("lokijs");
var db = new loki(pathDB);
var data = read(pathDB);
db.loadJSON(data);
window.Vue = require('vue');
var axios = require("axios");

new Vue({
    el: 'body',
    data: {
        debug: false,
        binance_prices: [],
        exmo_prices: [],
        erro: null,
        carregando: true,
        corretoras: [],
        binance: {
            apiKey: '',
            secretKey: '',
            symbol: '',	//STRING|YES	
            side: '', //ENUM|YES	
            type: '', //ENUM|YES
            timeInForce: '', //ENUM|NO	
            quantity: '', //DECIMAL|YES	
            price: '', //DECIMAL|NO	
            newClientOrderId: '', //STRING|NO|A unique id for the order. Automatically generated if not sent.
            stopPrice: '', //DECIMAL|NO|Used with STOP_LOSS, STOP_LOSS_LIMIT, TAKE_PROFIT, and TAKE_PROFIT_LIMIT orders.
            icebergQty: '',	//DECIMAL|NO|Used with LIMIT, STOP_LOSS_LIMIT, and TAKE_PROFIT_LIMIT to create an iceberg order.
            newOrderRespType: '', //ENUM|NO|Set the response JSON. ACK, RESULT, or FULL; MARKET and LIMIT order types default to FULL, all other orders default to ACK.
            recvWindow: '', //LONG|NO
            timestamp: '', //LONG|YES
        }
    },
    ready: function () {
    },
    methods: {
        makeDebug: function () {
            if (this.debug == false) {
                this.debug = true;
            } else {
                this.debug = false;
            }
        }
    }
});