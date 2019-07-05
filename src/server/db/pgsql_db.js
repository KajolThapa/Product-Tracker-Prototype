const pg = require('pg');

/**
 * db setup
 * $ sudo su -
 * $ su - postgres
 * $ psql
 * > CREATE USER dev WITH SUPERUSER CREATEDB CREATEROLE PASSWORD 'momo';
 * > CREATE DATABASE wine_db_v2 WITH OWNER dev
 */

const connectionString = 'postgresql://dev:momo@localhost:5432/wine_db_v2';


function setupTables() {
    const client = new pg.Client(connectionString);
    client.connect();
    query = client.query(
        `
        CREATE TABLE IF NOT EXISTS wineselections (
            barcode         VARCHAR(20)     PRIMARY KEY ,
            productname     VARCHAR(255)                ,
            manufacturer    VARCHAR(255)                ,
            brand           VARCHAR(255)                ,
            description     TEXT                    ,
            images          TEXT                        
        );
        
        CREATE TABLE IF NOT EXISTS users (
            id              SERIAL          PRIMARY KEY ,
            name            TEXT                        ,
            phone           VARCHAR(10)                 ,
            email           VARCHAR(50)                 ,
            password        VARCHAR(255)                
        );

        CREATE TABLE IF NOT EXISTS history (
            id              SERIAL          PRIMARY KEY ,
            userid          INTEGER                     ,
            barcode         VARCHAR(20)                 ,
            review          TEXT                        ,
            rating          VARCHAR(2)  
        );
        `, (err, result) => {
            console.warn(result);
            console.log('database created')
            client.end();
        }
    )
}
setupTables();

function createUser(newUser) {
    const client = new pg.Client(connectionString);
    const {
        name,
        phone,
        email,
        password
    } = newUser;
    client.connect();
    client.query(`
        INSERT INTO
        users(name, phone, email, password)
        values ($1, $2, $3, $4);
    `, [name, phone, email, password])
}

function addNewWine(product) {
    const client = new pg.Client(connectionString);
    const {
        barcode_number,
        product_name,
        manufacturer,
        brand,
        description,
        images
    } = product;
    client.connect();
    client.query(`
        INSERT INTO
        wineselections(barcode, productname, manufacturer, brand, description, images)
        values ($1, $2, $3, $4, $5, $6);
    `, [barcode_number, product_name, manufacturer, brand, description, images[0]], () => {
        client.end()
    })
}

async function getAllItems() {
    const client = new pg.Client(connectionString);
    // const result = [];
    client.connect();
    return client.query('SELECT * from wineselections;');
}


async function checkRecord(barcode) {
    const results = [];
    const client = new pg.Client(connectionString);
    await client.connect();
    const query = await client.query(
        `
        SELECT *
        FROM wineselections
        WHERE barcode=($1);
        `, [barcode]
    );
    query.rows.forEach(row => {
        results.push(row);
    });

    client.end();
    return results;
}

// refactor for async
async function getUserIdWithLogin(login) {
    const {
        email,
        password
    } = login;
    const client = new pg.Client(connectionString);
    client.connect();
    const query = client.query(
        `
        SELECT *
        FROM wineselection
        WHERE email=($1) AND password=($2);
        `, [email, password]
    );
    query.on('row', (row) => {
        results.push(row);
    });
    query.on('end', () => {
        client.end();
        return results;
    })
}

// function getUsersWine(userId) {

// }


module.exports = {
    setupTables,
    addNewWine,
    createUser,
    checkRecord,
    getUserIdWithLogin,
    getAllItems
    // getUsersWine
}