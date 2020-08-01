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

            // console.log(self.binance_prices);
            // console.log(self.exmo_prices);
            
            for (let i = 0; i < self.binance_prices.length; i++) {
                if (self.binance_prices[i].symbol == 'ETHBTC') {
                    this.corretoras = self.binance_prices[i].symbol;
                    console.log(this.corretoras);                    
                }
            }
        }

        
        this.binance_prices = {
                
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