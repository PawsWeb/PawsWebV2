const mongoose = require("mongoose");

const PetsSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    breed: { type: String, required: true }, 
    size: { type: String, enum: ['small', 'medium', 'large'], required: true }, 
    age: { type: Number, required: true }, 
    gender: { type: String, enum: ['male', 'female'], required: true }, 
    shelter: { type: String, required: true }, 
    description: { type: String }, 
    isAdopted: { type: Boolean, default: false }, 
    dateAdded: { type: Date, default: Date.now }, 
    images: [{ type: String }],
});

const PetsModel = mongoose.model("pets", PetsSchema);

module.exports = PetsModel;