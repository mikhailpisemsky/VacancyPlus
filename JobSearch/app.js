const express = require('express');
const config = require('config');
const pool = require('./config/db');

const app = express();

const PORT = config.get('port') || 5000

async function start() {
    try {
        pool.query('SELECT NOW()')
        app.listen(PORT, () => {
            console.log(`App has been started on port ${PORT}...`)
        })
    } catch(e) {
        console.log('Server Error', e.message)
        process.exit(1)
    }
}

start()