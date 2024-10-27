const mongoose = require('mongoose');

async function connectToDB(uri) {
    return mongoose.connect(uri);
}

module.exports = { connectToDB };
