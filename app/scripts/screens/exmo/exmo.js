window.Vue = require('vue');
var axios = require("axios");

new Vue({
    el: 'body',
    data: {
        debug: false,
        exmo: [],
        testes: [],
        erro: null,
        carregando: true,
        moedas: ['BTC_USD', 'LITE_USD']
    },
    ready: function () {
        setInterval(btc, 5000);

        self = this;
        function btc() {
            // axios.get('http://localhost/budgetsAPI/Budgets.json')
            //     .then(response => (
            //         self.testes = response.data.budgets
            //         , console.log(self.testes)
            //     ))
            //     .catch(function (error) {
            //         console.log(error);
            //     });

            axios.get('https://api.exmo.com/v1/trades/?pair=BTC_USD')
                .then(response => (
                    self.exmo = response.data.BTC_USD
                    , self.erro = false
                    , self.carregando = false
                    , console.log(self.exmo))
                )
                .catch(function (error) {
                    self.erro = true;
                    self.carregando = false;
                    console.log(self.erro);
                });
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
            console.log(this.testes);
        }
    }
});