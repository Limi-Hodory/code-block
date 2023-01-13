const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    subject:{type: String, required: true},
    code:{type: String, required: false}
});

module.exports=mongoose.model('Code', codeSchema);