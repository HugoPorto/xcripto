# API pública Rest para Binance (2018-11-13)
# Informações Gerais da API
* A base dos endpoints é: **https://api.binance.com**
* Todos os terminais retornam um objeto ou matriz JSON.
* Os dados são retornados na ordem ** crescente **. O mais antigo primeiro, o mais novo por último.
* Todos os campos relacionados a hora e data e hora estão em milissegundos.
* Os códigos de retorno HTTP '4XX' são usados para solicitações malformadas; a questão está do lado do remetente.
* O código de retorno HTTP `429` é usado ao quebrar um limite de taxa de requisição.
* O código de retorno HTTP `418` é usado quando um IP é auto-banido para continuar enviando pedidos depois de receber os códigos` 429`.
* Códigos de retorno HTTP `5XX` são usados para erros internos; a questão está em O lado de Binance. É importante ** NÃO ** tratar isso como uma operação de falha; o status de execução é ** UNKNOWN ** e poderia ter sido um sucesso.
* Qualquer endpoint pode retornar um erro; a carga de erro é a seguinte:

```javascript
{
  "code": -1121,
  "msg": "Invalid symbol."
}
```

* Códigos e mensagens de erro específicos definidos em outro documento.
* Para os terminais `GET`, os parâmetros devem ser enviados como uma cadeia de consulta.
* Para pontos de extremidade `POST`, `PUT` e `DELETE`, os parâmetros podem ser enviados como uma cadeia de consulta ou no corpo da solicitação com o tipo de conteúdo application / x-www-form-urlencoded. Você pode misturar parâmetros entre a string de consulta e o corpo da solicitação, se desejar fazê-lo.
* Parâmetros podem ser enviados em qualquer ordem.
* Se um parâmetro enviado na string de consulta e no corpo da solicitação, o parâmetro da string de consulta será usado.

# LIMITS
* A matriz `/api/v1/exchangeInfo`` rateLimits` contém objetos relacionados aos limites de taxa `RAW_REQUEST`,` REQUEST_WEIGHT` e `ORDER` da troca. Estes são ainda definidos na seção `ENUM definitions` sob` Rate limiters (rateLimitType) `.
* Um 429 será devolvido quando o limite de taxa for violado.
* Cada rota tem um "peso" que determina o número de pedidos para os quais cada ponto de extremidade conta. Endpoints e terminais mais pesados ​​que fazem operações em vários símbolos terão um 'peso' mais pesado.
* Cada pedido conterá um cabeçalho `X-MBX-USED-WEIGHT` que possui o peso atual usado para o IP do minuto atual.
* Quando um 429 é recebido, é sua obrigação como uma API retroceder e não enviar spam para a API.
* **A violação repetida dos limites de taxa e / ou a falha em recuar após o recebimento dos 429s resultará em uma proibição automática de IP (status HTTP 418).**
* As proibições de IP são rastreadas e **redimensionadas em duração** para reincidentes, **de 2 minutos a 3 dias**.
* Um cabeçalho `Retry-After` é enviado com uma resposta de 418 ou 429 e dará o **número de segundos** requerido para esperar, no caso de um 418, para evitar uma proibição, ou, no caso de um 429, até que a proibição termine.

# Endpoint security type
* Cada endpoint tem um tipo de segurança que determina como você interagir com ele.
* API-keys são passadas para a API Rest através do `X-MBX-APIKEY` cabeçalho.
* Chaves de API e chaves secretas **fazem distinção entre maiúsculas e minúsculas**.
* As chaves de API podem ser configuradas para acessar apenas certos tipos de endpoints seguros. Por exemplo, uma chave de API pode ser usada apenas para TRADE, enquanto outra chave de API pode acessar tudo, exceto para as rotas TRADE.
* Por padrão, as chaves de API podem acessar todas as rotas seguras.

Security Type | Description
------------ | ------------
NONE | O endpoint pode ser acessado livremente.
TRADE | O endpoint requer o envio de uma chave de API e assinatura válidas.
USER_DATA | O endpoint requer o envio de uma chave de API e assinatura válidas.
USER_STREAM | O endpoint requer o envio de uma chave de API válida.
MARKET_DATA | O endpoint requer o envio de uma chave de API válida.


* Os pontos de extremidade `TRADE` e `USER_DATA` são pontos finais `ASSINADOS`.

# SIGNED (TRADE and USER_DATA) Segurança do endpoint
* Terminados `SIGNED` requerem um parâmetro adicional, `signature`, para ser enviado na `query string` ou `request body`.
* Endpoints usam assinaturas `HMAC SHA256`. A `assinatura HMAC SHA256` é uma operação com chave `HMAC SHA256`. Use seu `secretKey` como a chave e `totalParams` como o valor para a operação HMAC.
* A `assinatura` é **não diferencia maiúsculas de minúsculas**.
* `totalparams` é definido como a `query string` concatenada com o `request body`.

## Segurança de temporização
* Um terminal `SIGNED` também requer que um parâmetro, `timestamp`, seja enviado deve ser o timestamp de milissegundos de quando a solicitação foi criada e enviada.
* Um parâmetro adicional, `recvWindow`, pode ser enviado para especificar o número de milissegundos após `timestamp` o pedido é válido para. Se `recvWindow` não é enviado, **o padrão é 5000**.
* A lógica é a seguinte:

  ```javascript
  if (timestamp < (serverTime + 1000) && (serverTime - timestamp) <= recvWindow) {
    // process request
  } else {
    // reject request
  }
  ```

**Negociação séria é sobre o tempo.** As redes podem ser instáveis e não confiáveis,
que pode levar a solicitações que levam quantidades variáveis de tempo para alcançar o
servidores. Com o `recvWindow`, você pode especificar que o pedido deve ser
processado dentro de um certo número de milissegundos ou ser rejeitado pelo
servidor.

**Recomenda-se usar uma pequena recvWindow de 5000 ou menos!**

## SIGNED Exemplos de terminal para POST / api / v1 / order
Aqui está um exemplo passo-a-passo de como enviar uma carga útil assinada do
Linha de comando do Linux usando `echo`,` openssl` e `curl`.

Chave | Valor
------------ | ------------
apiKey | vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A
secretKey | NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j


Parâmetro | Valor
------------ | ------------
symbol | LTCBTC
side | BUY
type | LIMIT
timeInForce | GTC
quantity | 1
price | 0.1
recvWindow | 5000
timestamp | 1499827319559


### Exemplo 1: Como uma query string
* **queryString:** symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559
* **HMAC SHA256 signature:**

    ```
    [linux]$ echo -n "symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559" | openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
    (stdin)= c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71
    ```


* **curl command:**

    ```
    (HMAC SHA256)
    [linux]$ curl -H "X-MBX-APIKEY: vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A" -X POST 'https://api.binance.com/api/v3/order?symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559&signature=c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71'
    ```

### Exemplo 2: Como uma request body
* **requestBody:** symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559
* **HMAC SHA256 signature:**

    ```
    [linux]$ echo -n "symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559" | openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
    (stdin)= c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71
    ```


* **curl command:**

    ```
    (HMAC SHA256)
    [linux]$ curl -H "X-MBX-APIKEY: vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A" -X POST 'https://api.binance.com/api/v3/order' -d 'symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559&signature=c8db56825ae71d6d79447849e617115f4a920fa2acdcab2b053c4b2838bd6b71'
    ```

### Exemplo 3: Mistura de query string e request body
* **queryString:** symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC
* **requestBody:** quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559
* **HMAC SHA256 signature:**

    ```
    [linux]$ echo -n "symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTCquantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559" | openssl dgst -sha256 -hmac "NhqPtmdSJYdKjVHjA7PZj4Mge3R5YNiP1e3UZjInClVN65XAbvqqM6A7H5fATj0j"
    (stdin)= 0fd168b8ddb4876a0358a8d14d0c9f3da0e9b20c5d52b2a00fcf7d1c602f9a77
    ```


* **curl command:**

    ```
    (HMAC SHA256)
    [linux]$ curl -H "X-MBX-APIKEY: vmPUZE6mv9SD5VNHk4HlWFsOr6aKE2zvsw0MuIgwCIPy6utIco14y7Ju91duEh8A" -X POST 'https://api.binance.com/api/v3/order?symbol=LTCBTC&side=BUY&type=LIMIT&timeInForce=GTC' -d 'quantity=1&price=0.1&recvWindow=5000&timestamp=1499827319559&signature=0fd168b8ddb4876a0358a8d14d0c9f3da0e9b20c5d52b2a00fcf7d1c602f9a77'
    ```

Observe que a assinatura é diferente no exemplo 3.
Não há & entre `GTC` e `quantidade = 1`.

# API Pública - Endpoints
## Teminologia
* `base asset` refere-se ao ativo que é a `quantity` de um symbol(símbolo).
* `quote asset` refere-se ao ativo que é o `price` de um symbol(símbolo).


## ENUM definitions(definições)
**Symbol(símbolo) status (status):**

* PRE_TRADING
* TRADING
* POST_TRADING
* END_OF_DAY
* HALT
* AUCTION_MATCH
* BREAK

**Symbol type(tipo):**

* SPOT

**Order status (status da ordem):**

* NEW
* PARTIALLY_FILLED
* FILLED
* CANCELED
* PENDING_CANCEL (currently unused)
* REJECTED
* EXPIRED

**Order types (orderTypes, type):**

* LIMIT
* MARKET
* STOP_LOSS
* STOP_LOSS_LIMIT
* TAKE_PROFIT
* TAKE_PROFIT_LIMIT
* LIMIT_MAKER

**Order side (side):**

* BUY
* SELL

**Time in force (timeInForce):**

* GTC
* IOC
* FOK

**Kline/Candlestick chart intervals:**

m -> minutes; h -> hours; d -> days; w -> weeks; M -> months

* 1m
* 3m
* 5m
* 15m
* 30m
* 1h
* 2h
* 4h
* 6h
* 8h
* 12h
* 1d
* 3d
* 1w
* 1M

**Rate limiters (rateLimitType)**
* REQUEST_WEIGHT

    ```json
    {
      "rateLimitType": "REQUEST_WEIGHT",
      "interval": "MINUTE",
      "intervalNum": 1,
      "limit": 1200
    }
    ```

* ORDERS

    ```json
    {
      "rateLimitType": "ORDERS",
      "interval": "SECOND",
      "intervalNum": 1,
      "limit": 10
    }
    ```
* RAW_REQUESTS

    ```json
    {
      "rateLimitType": "RAW_REQUESTS",
      "interval": "MINUTE",
      "intervalNum": 5,
      "limit": 5000
    }
    ```

**Rate limit intervals (interval)**

* SECOND
* MINUTE
* DAY

## General endpoints
### Test connectivity
```
GET /api/v1/ping
```
Test connectivity to the Rest API.

**Weight:**
1

**Parameters:**
NONE

**Response:**
```javascript
{}
```

### Check server time
```
GET /api/v1/time
```
Test connectivity to the Rest API and get the current server time.

**Weight:**
1

**Parameters:**
NONE

**Response:**
```javascript
{
  "serverTime": 1499827319559
}
```

### Exchange information
```
GET /api/v1/exchangeInfo
```
Current exchange trading rules and symbol information

**Weight:**
1

**Parameters:**
NONE

**Response:**
```javascript
{
  "timezone": "UTC",
  "serverTime": 1508631584636,
  "rateLimits": [
    // These are defined in the `ENUM definitions` section under `Rate limiters (rateLimitType)`.
    // All limits are optional.
  ],
  "exchangeFilters": [
    // There are defined in the `Filters` section.
    // All filters are optional.
  ],
  "symbols": [{
    "symbol": "ETHBTC",
    "status": "TRADING",
    "baseAsset": "ETH",
    "baseAssetPrecision": 8,
    "quoteAsset": "BTC",
    "quotePrecision": 8,
    "orderTypes": [
      // These are defined in the `ENUM definitions` section under `Order types (orderTypes)`.
      // All orderTypes are optional.
    ],
    "icebergAllowed": false,
    "filters": [
      // There are defined in the `Filters` section.
      // All filters are optional.
    ]
  }]
}
```

## Market Data endpoints
### Order book
```
GET /api/v1/depth
```

**Weight:**
Adjusted based on the limit:


Limit | Weight
------------ | ------------
5, 10, 20, 50, 100 | 1
500 | 5
1000 | 10

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
limit | INT | NO | Default 100; max 1000. Valid limits:[5, 10, 20, 50, 100, 500, 1000]

**Caution:** setting limit=0 can return a lot of data.

**Response:**
```javascript
{
  "lastUpdateId": 1027024,
  "bids": [
    [
      "4.00000000",     // PRICE
      "431.00000000"    // QTY
    ]
  ],
  "asks": [
    [
      "4.00000200",
      "12.00000000"
    ]
  ]
}
```

### Recent trades list
```
GET /api/v1/trades
```
Get recent trades (up to last 500).

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
limit | INT | NO | Default 500; max 1000.

**Response:**
```javascript
[
  {
    "id": 28457,
    "price": "4.00000100",
    "qty": "12.00000000",
    "time": 1499865549590,
    "isBuyerMaker": true,
    "isBestMatch": true
  }
]
```

### Old trade lookup (MARKET_DATA)
```
GET /api/v1/historicalTrades
```
Get older trades.

**Weight:**
5

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
limit | INT | NO | Default 500; max 1000.
fromId | LONG | NO | TradeId to fetch from. Default gets most recent trades.

**Response:**
```javascript
[
  {
    "id": 28457,
    "price": "4.00000100",
    "qty": "12.00000000",
    "time": 1499865549590,
    "isBuyerMaker": true,
    "isBestMatch": true
  }
]
```

### Compressed/Aggregate trades list
```
GET /api/v1/aggTrades
```
Get compressed, aggregate trades. Trades that fill at the time, from the same
order, with the same price will have the quantity aggregated.

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
fromId | LONG | NO | ID to get aggregate trades from INCLUSIVE.
startTime | LONG | NO | Timestamp in ms to get aggregate trades from INCLUSIVE.
endTime | LONG | NO | Timestamp in ms to get aggregate trades until INCLUSIVE.
limit | INT | NO | Default 500; max 1000.

* If both startTime and endTime are sent, time between startTime and endTime must be less than 1 hour.
* If fromId, startTime, and endTime are not sent, the most recent aggregate trades will be returned.

**Response:**
```javascript
[
  {
    "a": 26129,         // Aggregate tradeId
    "p": "0.01633102",  // Price
    "q": "4.70443515",  // Quantity
    "f": 27781,         // First tradeId
    "l": 27781,         // Last tradeId
    "T": 1498793709153, // Timestamp
    "m": true,          // Was the buyer the maker?
    "M": true           // Was the trade the best price match?
  }
]
```

### Kline/Candlestick data
```
GET /api/v1/klines
```
Kline/candlestick bars for a symbol.
Klines are uniquely identified by their open time.

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
interval | ENUM | YES |
startTime | LONG | NO |
endTime | LONG | NO |
limit | INT | NO | Default 500; max 1000.

* If startTime and endTime are not sent, the most recent klines are returned.

**Response:**
```javascript
[
  [
    1499040000000,      // Open time
    "0.01634790",       // Open
    "0.80000000",       // High
    "0.01575800",       // Low
    "0.01577100",       // Close
    "148976.11427815",  // Volume
    1499644799999,      // Close time
    "2434.19055334",    // Quote asset volume
    308,                // Number of trades
    "1756.87402397",    // Taker buy base asset volume
    "28.46694368",      // Taker buy quote asset volume
    "17928899.62484339" // Ignore.
  ]
]
```


### Current average price
Current average price for a symbol.
```
GET /api/v3/avgPrice
```
**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |


**Response:**
```javascript
{
  "mins": 5,
  "price": "9.35751834"
}
```


### 24hr ticker price change statistics
```
GET /api/v1/ticker/24hr
```
24 hour rolling window price change statistics. **Careful** when accessing this with no symbol.

**Weight:**
1 for a single symbol; **40** when the symbol parameter is omitted

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | NO |

* If the symbol is not sent, tickers for all symbols will be returned in an array.

**Response:**
```javascript
{
  "symbol": "BNBBTC",
  "priceChange": "-94.99999800",
  "priceChangePercent": "-95.960",
  "weightedAvgPrice": "0.29628482",
  "prevClosePrice": "0.10002000",
  "lastPrice": "4.00000200",
  "lastQty": "200.00000000",
  "bidPrice": "4.00000000",
  "askPrice": "4.00000200",
  "openPrice": "99.00000000",
  "highPrice": "100.00000000",
  "lowPrice": "0.10000000",
  "volume": "8913.30000000",
  "quoteVolume": "15.30000000",
  "openTime": 1499783499040,
  "closeTime": 1499869899040,
  "firstId": 28385,   // First tradeId
  "lastId": 28460,    // Last tradeId
  "count": 76         // Trade count
}
```
OR
```javascript
[
  {
    "symbol": "BNBBTC",
    "priceChange": "-94.99999800",
    "priceChangePercent": "-95.960",
    "weightedAvgPrice": "0.29628482",
    "prevClosePrice": "0.10002000",
    "lastPrice": "4.00000200",
    "lastQty": "200.00000000",
    "bidPrice": "4.00000000",
    "askPrice": "4.00000200",
    "openPrice": "99.00000000",
    "highPrice": "100.00000000",
    "lowPrice": "0.10000000",
    "volume": "8913.30000000",
    "quoteVolume": "15.30000000",
    "openTime": 1499783499040,
    "closeTime": 1499869899040,
    "firstId": 28385,   // First tradeId
    "lastId": 28460,    // Last tradeId
    "count": 76         // Trade count
  }
]
```


### Symbol price ticker
```
GET /api/v3/ticker/price
```
Latest price for a symbol or symbols.

**Weight:**
1 for a single symbol; **2** when the symbol parameter is omitted

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | NO |

* If the symbol is not sent, prices for all symbols will be returned in an array.

**Response:**
```javascript
{
  "symbol": "LTCBTC",
  "price": "4.00000200"
}
```
OR
```javascript
[
  {
    "symbol": "LTCBTC",
    "price": "4.00000200"
  },
  {
    "symbol": "ETHBTC",
    "price": "0.07946600"
  }
]
```

### Symbol order book ticker
```
GET /api/v3/ticker/bookTicker
```
Best price/qty on the order book for a symbol or symbols.

**Weight:**
1 for a single symbol; **2** when the symbol parameter is omitted

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | NO |

* If the symbol is not sent, bookTickers for all symbols will be returned in an array.

**Response:**
```javascript
{
  "symbol": "LTCBTC",
  "bidPrice": "4.00000000",
  "bidQty": "431.00000000",
  "askPrice": "4.00000200",
  "askQty": "9.00000000"
}
```
OR
```javascript
[
  {
    "symbol": "LTCBTC",
    "bidPrice": "4.00000000",
    "bidQty": "431.00000000",
    "askPrice": "4.00000200",
    "askQty": "9.00000000"
  },
  {
    "symbol": "ETHBTC",
    "bidPrice": "0.07946700",
    "bidQty": "9.00000000",
    "askPrice": "100000.00000000",
    "askQty": "1000.00000000"
  }
]
```

## Account endpoints
### New order  (TRADE)
```
POST /api/v3/order  (HMAC SHA256)
```
Send in a new order.

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
side | ENUM | YES |
type | ENUM | YES |
timeInForce | ENUM | NO |
quantity | DECIMAL | YES |
price | DECIMAL | NO |
newClientOrderId | STRING | NO | A unique id for the order. Automatically generated if not sent.
stopPrice | DECIMAL | NO | Used with `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders.
icebergQty | DECIMAL | NO | Used with `LIMIT`, `STOP_LOSS_LIMIT`, and `TAKE_PROFIT_LIMIT` to create an iceberg order.
newOrderRespType | ENUM | NO | Set the response JSON. `ACK`, `RESULT`, or `FULL`; `MARKET` and `LIMIT` order types default to `FULL`, all other orders default to `ACK`.
recvWindow | LONG | NO |
timestamp | LONG | YES |

Additional mandatory parameters based on `type`:

Type | Additional mandatory parameters
------------ | ------------
`LIMIT` | `timeInForce`, `quantity`, `price`
`MARKET` | `quantity`
`STOP_LOSS` | `quantity`, `stopPrice`
`STOP_LOSS_LIMIT` | `timeInForce`, `quantity`,  `price`, `stopPrice`
`TAKE_PROFIT` | `quantity`, `stopPrice`
`TAKE_PROFIT_LIMIT` | `timeInForce`, `quantity`, `price`, `stopPrice`
`LIMIT_MAKER` | `quantity`, `price`

Other info:

* `LIMIT_MAKER` are `LIMIT` orders that will be rejected if they would immediately match and trade as a taker.
* `STOP_LOSS` and `TAKE_PROFIT` will execute a `MARKET` order when the `stopPrice` is reached.
* Any `LIMIT` or `LIMIT_MAKER` type order can be made an iceberg order by sending an `icebergQty`.
* Any order with an `icebergQty` MUST have `timeInForce` set to `GTC`.


Trigger order price rules against market price for both MARKET and LIMIT versions:

* Price above market price: `STOP_LOSS` `BUY`, `TAKE_PROFIT` `SELL`
* Price below market price: `STOP_LOSS` `SELL`, `TAKE_PROFIT` `BUY`

**Response ACK:**
```javascript
{
  "symbol": "BTCUSDT",
  "orderId": 28,
  "clientOrderId": "6gCrw2kRUAF9CvJDGP16IP",
  "transactTime": 1507725176595
}
```

**Response RESULT:**
```javascript
{
  "symbol": "BTCUSDT",
  "orderId": 28,
  "clientOrderId": "6gCrw2kRUAF9CvJDGP16IP",
  "transactTime": 1507725176595,
  "price": "1.00000000",
  "origQty": "10.00000000",
  "executedQty": "10.00000000",
  "cummulativeQuoteQty": "10.00000000",
  "status": "FILLED",
  "timeInForce": "GTC",
  "type": "MARKET",
  "side": "SELL"
}
```

**Response FULL:**
```javascript
{
  "symbol": "BTCUSDT",
  "orderId": 28,
  "clientOrderId": "6gCrw2kRUAF9CvJDGP16IP",
  "transactTime": 1507725176595,
  "price": "1.00000000",
  "origQty": "10.00000000",
  "executedQty": "10.00000000",
  "cummulativeQuoteQty": "10.00000000",
  "status": "FILLED",
  "timeInForce": "GTC",
  "type": "MARKET",
  "side": "SELL",
  "fills": [
    {
      "price": "4000.00000000",
      "qty": "1.00000000",
      "commission": "4.00000000",
      "commissionAsset": "USDT"
    },
    {
      "price": "3999.00000000",
      "qty": "5.00000000",
      "commission": "19.99500000",
      "commissionAsset": "USDT"
    },
    {
      "price": "3998.00000000",
      "qty": "2.00000000",
      "commission": "7.99600000",
      "commissionAsset": "USDT"
    },
    {
      "price": "3997.00000000",
      "qty": "1.00000000",
      "commission": "3.99700000",
      "commissionAsset": "USDT"
    },
    {
      "price": "3995.00000000",
      "qty": "1.00000000",
      "commission": "3.99500000",
      "commissionAsset": "USDT"
    }
  ]
}
```

### Test new order (TRADE)
```
POST /api/v3/order/test (HMAC SHA256)
```
Test new order creation and signature/recvWindow long.
Creates and validates a new order but does not send it into the matching engine.

**Weight:**
1

**Parameters:**

Same as `POST /api/v3/order`


**Response:**
```javascript
{}
```

### Query order (USER_DATA)
```
GET /api/v3/order (HMAC SHA256)
```
Check an order's status.

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
orderId | LONG | NO |
origClientOrderId | STRING | NO |
recvWindow | LONG | NO |
timestamp | LONG | YES |

Notes:
* Either `orderId` or `origClientOrderId` must be sent.
* For some historical orders `cummulativeQuoteQty` will be < 0, meaning the data is not available at this time.


**Response:**
```javascript
{
  "symbol": "LTCBTC",
  "orderId": 1,
  "clientOrderId": "myOrder1",
  "price": "0.1",
  "origQty": "1.0",
  "executedQty": "0.0",
  "cummulativeQuoteQty": "0.0",
  "status": "NEW",
  "timeInForce": "GTC",
  "type": "LIMIT",
  "side": "BUY",
  "stopPrice": "0.0",
  "icebergQty": "0.0",
  "time": 1499827319559,
  "updateTime": 1499827319559,
  "isWorking": true
}
```

### Cancel order (TRADE)
```
DELETE /api/v3/order  (HMAC SHA256)
```
Cancel an active order.

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
orderId | LONG | NO |
origClientOrderId | STRING | NO |
newClientOrderId | STRING | NO |  Used to uniquely identify this cancel. Automatically generated by default.
recvWindow | LONG | NO |
timestamp | LONG | YES |

Either `orderId` or `origClientOrderId` must be sent.

**Response:**
```javascript
{
  "symbol": "LTCBTC",
  "orderId": 28,
  "origClientOrderId": "myOrder1",
  "clientOrderId": "cancelMyOrder1",
  "transactTime": 1507725176595,
  "price": "1.00000000",
  "origQty": "10.00000000",
  "executedQty": "8.00000000",
  "cummulativeQuoteQty": "8.00000000",
  "status": "CANCELED",
  "timeInForce": "GTC",
  "type": "LIMIT",
  "side": "SELL"
}
```

### Current open orders (USER_DATA)
```
GET /api/v3/openOrders  (HMAC SHA256)
```
Get all open orders on a symbol. **Careful** when accessing this with no symbol.

**Weight:**
1 for a single symbol; **40** when the symbol parameter is omitted

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | NO |
recvWindow | LONG | NO |
timestamp | LONG | YES |

* If the symbol is not sent, orders for all symbols will be returned in an array.
* When all symbols are returned, the number of requests counted against the rate limiter is equal to the number of symbols currently trading on the exchange.

**Response:**
```javascript
[
  {
    "symbol": "LTCBTC",
    "orderId": 1,
    "clientOrderId": "myOrder1",
    "price": "0.1",
    "origQty": "1.0",
    "executedQty": "0.0",
    "cummulativeQuoteQty": "0.0",
    "status": "NEW",
    "timeInForce": "GTC",
    "type": "LIMIT",
    "side": "BUY",
    "stopPrice": "0.0",
    "icebergQty": "0.0",
    "time": 1499827319559,
    "updateTime": 1499827319559,
    "isWorking": true
  }
]
```

### All orders (USER_DATA)
```
GET /api/v3/allOrders (HMAC SHA256)
```
Get all account orders; active, canceled, or filled.

**Weight:**
5 with symbol

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
orderId | LONG | NO |
startTime | LONG | NO |
endTime | LONG | NO |
limit | INT | NO | Default 500; max 1000.
recvWindow | LONG | NO |
timestamp | LONG | YES |

**Notes:**
* If `orderId` is set, it will get orders >= that `orderId`. Otherwise most recent orders are returned.
* For some historical orders `cummulativeQuoteQty` will be < 0, meaning the data is not available at this time.

**Response:**
```javascript
[
  {
    "symbol": "LTCBTC",
    "orderId": 1,
    "clientOrderId": "myOrder1",
    "price": "0.1",
    "origQty": "1.0",
    "executedQty": "0.0",
    "cummulativeQuoteQty": "0.0",
    "status": "NEW",
    "timeInForce": "GTC",
    "type": "LIMIT",
    "side": "BUY",
    "stopPrice": "0.0",
    "icebergQty": "0.0",
    "time": 1499827319559,
    "updateTime": 1499827319559,
    "isWorking": true
  }
]
```

### Account information (USER_DATA)
```
GET /api/v3/account (HMAC SHA256)
```
Get current account information.

**Weight:**
5

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
recvWindow | LONG | NO |
timestamp | LONG | YES |

**Response:**
```javascript
{
  "makerCommission": 15,
  "takerCommission": 15,
  "buyerCommission": 0,
  "sellerCommission": 0,
  "canTrade": true,
  "canWithdraw": true,
  "canDeposit": true,
  "updateTime": 123456789,
  "balances": [
    {
      "asset": "BTC",
      "free": "4723846.89208129",
      "locked": "0.00000000"
    },
    {
      "asset": "LTC",
      "free": "4763368.68006011",
      "locked": "0.00000000"
    }
  ]
}
```

### Account trade list (USER_DATA)
```
GET /api/v3/myTrades  (HMAC SHA256)
```
Get trades for a specific account and symbol.

**Weight:**
5 with symbol

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
startTime | LONG | NO |
endTime | LONG | NO |
fromId | LONG | NO | TradeId to fetch from. Default gets most recent trades.
limit | INT | NO | Default 500; max 1000.
recvWindow | LONG | NO |
timestamp | LONG | YES |

**Notes:**
* If `fromId` is set, it will get orders >= that `fromId`.
Otherwise most recent orders are returned.

**Response:**
```javascript
[
  {
    "symbol": "BNBBTC",
    "id": 28457,
    "orderId": 100234,
    "price": "4.00000100",
    "qty": "12.00000000",
    "quoteQty": "48.000012",
    "commission": "10.10000000",
    "commissionAsset": "BNB",
    "time": 1499865549590,
    "isBuyer": true,
    "isMaker": false,
    "isBestMatch": true
  }
]
```
## User data stream endpoints
Specifics on how user data streams work is in another document.

### Start user data stream (USER_STREAM)
```
POST /api/v1/userDataStream
```
Start a new user data stream. The stream will close after 60 minutes unless a keepalive is sent.

**Weight:**
1

**Parameters:**
NONE

**Response:**
```javascript
{
  "listenKey": "pqia91ma19a5s61cv6a81va65sdf19v8a65a1a5s61cv6a81va65sdf19v8a65a1"
}
```

### Keepalive user data stream (USER_STREAM)
```
PUT /api/v1/userDataStream
```
Keepalive a user data stream to prevent a time out. User data streams will close after 60 minutes. It's recommended to send a ping about every 30 minutes.

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
listenKey | STRING | YES

**Response:**
```javascript
{}
```

### Close user data stream (USER_STREAM)
```
DELETE /api/v1/userDataStream
```
Close out a user data stream.

**Weight:**
1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
listenKey | STRING | YES

**Response:**
```javascript
{}
```

# Filters
Filters define trading rules on a symbol or an exchange.
Filters come in two forms: `symbol filters` and `exchange filters`.

## Symbol filters
### PRICE_FILTER
The `PRICE_FILTER` defines the `price` rules for a symbol. There are 3 parts:

* `minPrice` defines the minimum `price`/`stopPrice` allowed; disabled on `minPrice` == 0.
* `maxPrice` defines the maximum `price`/`stopPrice` allowed; disabled on `maxPrice` == 0.
* `tickSize` defines the intervals that a `price`/`stopPrice` can be increased/decreased by; disabled on `tickSize` == 0.

Any of the above variables can be set to 0, which disables that rule in the `price filter`. In order to pass the `price filter`, the following must be true for `price`/`stopPrice` of the enabled rules:

* `price` >= `minPrice` 
* `price` <= `maxPrice`
* (`price`-`minPrice`) % `tickSize` == 0

**/exchangeInfo format:**
```javascript
  {
    "filterType": "PRICE_FILTER",
    "minPrice": "0.00000100",
    "maxPrice": "100000.00000000",
    "tickSize": "0.00000100"
  }
```

### PERCENT_PRICE
The `PERCENT_PRICE` filter defines valid range for a price based on the average of the previous trades.
`avgPriceMins` is the number of minutes the average price is calculated over. 0 means the last price is used.

In order to pass the `percent price`, the following must be true for `price`:
* `price` <= `weightedAveragePrice` * `multiplierUp`
* `price` >= `weightedAveragePrice` * `multiplierDown`

**/exchangeInfo format:**
```javascript
  {
    "filterType": "PERCENT_PRICE",
    "multiplierUp": "1.3000",
    "multiplierDown": "0.7000",
    "avgPriceMins": 5
  }
```

### LOT_SIZE
The `LOT_SIZE` filter defines the `quantity` (aka "lots" in auction terms) rules for a symbol. There are 3 parts:

* `minQty` defines the minimum `quantity`/`icebergQty` allowed.
* `maxQty` defines the maximum `quantity`/`icebergQty` allowed.
* `stepSize` defines the intervals that a `quantity`/`icebergQty` can be increased/decreased by.

In order to pass the `lot size`, the following must be true for `quantity`/`icebergQty`:

* `quantity` >= `minQty`
* `quantity` <= `maxQty`
* (`quantity`-`minQty`) % `stepSize` == 0

**/exchangeInfo format:**
```javascript
  {
    "filterType": "LOT_SIZE",
    "minQty": "0.00100000",
    "maxQty": "100000.00000000",
    "stepSize": "0.00100000"
  }
```

### MIN_NOTIONAL
The `MIN_NOTIONAL` filter defines the minimum notional value allowed for an order on a symbol.
An order's notional value is the `price` * `quantity`.
`applyToMarket` determines whether or not the `MIN_NOTIONAL` filter will also be applied to `MARKET` orders.
Since `MARKET` orders have no price, the average price is used over the last `avgPriceMins` minutes.
`avgPriceMins` is the number of minutes the average price is calculated over. 0 means the last price is used.


**/exchangeInfo format:**
```javascript
  {
    "filterType": "MIN_NOTIONAL",
    "minNotional": "0.00100000",
    "applyToMarket": true,
    "avgPriceMins": 5
  }
```

### ICEBERG_PARTS
The `ICEBERG_PARTS` filter defines the maximum parts an iceberg order can have. The number of `ICEBERG_PARTS` is defined as `CEIL(qty / icebergQty)`.

**/exchangeInfo format:**
```javascript
  {
    "filterType": "ICEBERG_PARTS",
    "limit": 10
  }
```

### MARKET_LOT_SIZE
The `MARKET_LOT_SIZE` filter defines the `quantity` (aka "lots" in auction terms) rules for `MARKET` orders on a symbol. There are 3 parts:

* `minQty` defines the minimum `quantity` allowed.
* `maxQty` defines the maximum `quantity` allowed.
* `stepSize` defines the intervals that a `quantity` can be increased/decreased by.

In order to pass the `market lot size`, the following must be true for `quantity`:

* `quantity` >= `minQty`
* `quantity` <= `maxQty`
* (`quantity`-`minQty`) % `stepSize` == 0

**/exchangeInfo format:**
```javascript
  {
    "filterType": "MARKET_LOT_SIZE",
    "minQty": "0.00100000",
    "maxQty": "100000.00000000",
    "stepSize": "0.00100000"
  }
```

### MAX_NUM_ORDERS
The `MAX_NUM_ORDERS` filter defines the maximum number of orders an account is allowed to have open on a symbol.
Note that both "algo" orders and normal orders are counted for this filter.

**/exchangeInfo format:**
```javascript
  {
    "filterType": "MAX_NUM_ORDERS",
    "limit": 25
  }
```

### MAX_NUM_ALGO_ORDERS
The `MAX_NUM_ALGO_ORDERS` filter defines the maximum number of "algo" orders an account is allowed to have open on a symbol.
"Algo" orders are `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders.

**/exchangeInfo format:**
```javascript
  {
    "filterType": "MAX_NUM_ALGO_ORDERS",
    "maxNumAlgoOrders": 5
  }
```

### MAX_NUM_ICEBERG_ORDERS
The `MAX_NUM_ICEBERG_ORDERS` filter defines the maximum number of `ICEBERG` orders an account is allowed to have open on a symbol.
An `ICEBERG` order is any order where the `icebergQty` is > 0.

**/exchangeInfo format:**
```javascript
  {
    "filterType": "MAX_NUM_ICEBERG_ORDERS",
    "maxNumIcebergOrders": 5
  }
```

## Exchange Filters
### EXCHANGE_MAX_NUM_ORDERS
The `MAX_NUM_ORDERS` filter defines the maximum number of orders an account is allowed to have open on the exchange.
Note that both "algo" orders and normal orders are counted for this filter.

**/exchangeInfo format:**
```javascript
  {
    "filterType": "EXCHANGE_MAX_NUM_ORDERS",
    "maxNumOrders": 1000
  }
```

### EXCHANGE_MAX_NUM_ALGO_ORDERS
The `MAX_ALGO_ORDERS` filter defines the maximum number of "algo" orders an account is allowed to have open on the exchange.
"Algo" orders are `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders.

**/exchangeInfo format:**
```javascript
  {
    "filterType": "EXCHANGE_MAX_ALGO_ORDERS",
    "maxNumAlgoOrders": 200
  }
```

