const mongoose = require("mongoose");
const pastrySchema = new mongoose.Schema({
    name: String,
    isFrench: Boolean,
});
const Pastry = mongoose.model("Pastry", pastrySchema);
module.exports = Pastry;