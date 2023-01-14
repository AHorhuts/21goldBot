
const {Pool} = require('pg')
const pg = require('pg')


const dbConfig = ({
    host: 'localhost',
    port: '5432',
    database: '21goldCardAccsDB',
    user: 'postgres',
    password: 'SHorhuts88'
});

const pool = new pg.Pool(dbConfig);
module.exports = pool;