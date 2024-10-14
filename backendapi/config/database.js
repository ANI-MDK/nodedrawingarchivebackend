const mysql     = require("mysql")
const config    = require("./config")

const pool = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
    port: config.DBPORT
})

module.exports = pool