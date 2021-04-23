const mongoose = require('mongoose');
const {Schema}  = mongoose;



const loginModel = new Schema(
    {
email: {
    type: String, require
},
password: {
    type: String, require
}
}
);


module.exports = mongoose.model('Login', loginModel);
