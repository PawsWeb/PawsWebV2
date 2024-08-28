const mongoose = require("mongoose");

const PetsSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Pet's name
    breed: { type: String, required: true }, // Pet's breed
    size: { type: String, enum: ['small', 'medium', 'large'], required: true }, // Pet's size
    age: { type: Number, required: true }, // Pet's age
    gender: { type: String, enum: ['male', 'female'], required: true }, // Pet's gender
    shelter: { type: String, required: true }, // Shelter name or ID
    description: { type: String }, // Additional description
    isAdopted: { type: Boolean, default: false }, // Adoption status
    dateAdded: { type: Date, default: Date.now }, // Date the listing was added
});

const PetsModel = mongoose.model("pets", PetsSchema);

module.exports = PetsModel;