const mongoose = require("mongoose");

const vendorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    cloudinary_id: {
        type: String
    },

    contact: {
        type: String,
        required: true
    },

    //modification 
    city: {
        type : String
    },
    locality : {
         type : String
    }

});
const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;
