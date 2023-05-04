const mongoose = require('mongoose');

const currencyModel = mongoose.Schema(
    {
        currency: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

const Curreny = mongoose.model('currencies', currencyModel);
module.exports = Curreny;