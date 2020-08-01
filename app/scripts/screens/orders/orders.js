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
        corretoras: []
    },
    ready: function () {
        setInterval(prices, 3000);

        self = this;
        function prices() {

            axios.get('https://api.binance.com/api/v3/ticker/price')
                .then(response => (
                    self.binance_prices = response.data
                    , self.erro = false
                    , self.carregando = false
                    // , console.log(self.binance_prices)
                )
                )
                .catch(function (error) {
                    self.erro = true;
                    self.carregando = false;
                    console.log(self.erro);
                });

            axios.get('https://api.exmo.com/v1/ticker/')
                .then(response => (
                    self.exmo_prices = response.data
                    , self.erro = false
                    , self.carregando = false
                    // , console.log(self.exmo_prices)
                )
                )
                .catch(function (error) {
                    self.erro = true;
                    self.carregando = false;
                    console.log(self.erro);
                });

            for (let i = 0; i < self.binance_prices.length; i++) {
                if (self.binance_prices[i].symbol == 'BTCUSDT') {
                    self.corretoras.push(
                        {
                            corretora: 'binance',
                            symbol: self.binance_prices[i].symbol,
                            priceBTCUSDT: self.binance_prices[i].price
                        }
                    );
                }
            }

            for (var prop in self.exmo_prices) {
                if (prop == 'BTC_USD') {
                    self.corretoras.push(
                        {
                            corretora: 'exmo',
                            symbol: prop,
                            priceBTC_USD: self.exmo_prices[prop].avg
                        }
                    );
                }
            }

            //Aqui eu vou disparar as ordens de compra e venda
            for (var x = 0; x < self.corretoras.length; x++) {
                if (self.corretoras[x].corretora == 'binance') {
                    var binance = self.corretoras[x].priceBTCUSDT;

                }

                if (self.corretoras[x].corretora == 'exmo') {
                    var exmo = self.corretoras[x].priceBTC_USD;

                }
            }

            console.log('Binance: ' + binance);
            console.log('Exmo: ' + exmo);

            if (binance < exmo) {
                console.log('Compmpra na binance e vende na exmo...');
            }else{
                console.log('compra na exmo e vende na binance...');
            }

            // console.log(self.corretoras);
            self.corretoras = [];
        }

    },
    methods: {
        makeDebug: function () {
            if (this.debug == false) {
                this.debug = true;
            } else {
                this.debug = false;
            }
        },
        showBTC: function () {
            console.log(this.binance_prices);
        }
    }
});