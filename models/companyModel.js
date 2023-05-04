const mongoose = require('mongoose');

const companyModel = mongoose.Schema(
    {
        company_name: {
            type: String,
        },
        company_mail: {
            type: String,
        },
        address: {
            type: String,
        },
        logo: {
            type: String
        },
        company_url: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Company = mongoose.model('company_data', companyModel);
module.exports = Company;