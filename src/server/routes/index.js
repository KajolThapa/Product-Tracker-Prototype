const routes = require('express').Router();
const fetch = require('node-fetch');
const apiKey = '22xhkfazg5q5llgl8x3zcx8klboyot'

const db = require('../db/pgsql_db');

// routes.get('/', (req, res) => {
//     res.send('Hello World')
// });

// routes.get('/genuser', (req, res) => {
//     db.createUser({
//         name: 'John',
//         phone: '1234567890',
//         email: 'pat@asd.com',
//         password: '123'
//     });
//     res.send('created')
// })

routes.get('/checkitem/:upc', (req, res) => {
    const {
        upc
    } = req.params;
    db.checkRecord(upc)
        .then(data => res.send(data))
        .catch(err => console.warn({
            err
        }))
})

routes.get('/getall', (req, res) => {
    db.getAllItems()
        .then(result => res.send(result.rows))
})

routes.get('/upc/:code', (req, res) => {
    const {
        code
    } = req.params;
    if (!isNaN(code)) {
        fetch(`https://api.barcodelookup.com/v2/products?barcode=${code}&formatted=y&key=${apiKey}`)
            .then(response => response.json())
            .then(data => db.addNewWine(formatUPCResult(data)))
            .then(product => res.send(product))
            .catch(err => {
                console.warn({
                    err
                })
            })
    }
});

function formatUPCResult(response) {
    const [product] = response.products; // get only first result. The api returns an array
    const {
        barcode_number,
        product_name,
        manufacturer,
        brand,
        description,
        images
    } = product; // let's limit the data we pass into the api
    return {
        barcode_number,
        product_name,
        manufacturer,
        brand,
        description,
        images
    };
}

module.exports = routes;

// l08bn0g524vn5yq1ruzwz9jpojaykt