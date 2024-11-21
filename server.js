const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
const Pastry = require("./models/pastry.js");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.get("/pastries", async (req, res) => {
    const allPastries = await Pastry.find();
    res.render("pastries/index.ejs", {pastries:allPastries});
});

app.get("/pastries/new", (req, res) => {
    res.render("pastries/new.ejs");
});

app.get("/pastries/:pastryId", async (req, res) => {
    const foundPastry = await Pastry.findById(req.params.pastryId);
    res.render("pastries/show.ejs", {pastry:foundPastry});
});

app.post("/pastries", async (req, res) => {
    if (req.body.isFrench === "on") {
        req.body.isFrench = true;
    } else {
        req.body.isFrench = false;
    }
    await Pastry.create(req.body);
    res.redirect("/pastries");
});

app.delete("/pastries/:pastryId", async (req, res) => {
    await Pastry.findByIdAndDelete(req.params.pastryId);
    res.redirect("/pastries");
  });

app.get("/pastries/:pastryId/edit", async (req, res) => {
    const foundPastry = await Pastry.findById(req.params.pastryId);
    res.render("pastries/edit.ejs", {pastry:foundPastry});
});

app.put("/pastries/:pastryId", async (req, res) => {
    if (req.body.isFrench === "on") {
      req.body.isFrench = true;
    } else {
      req.body.isFrench = false;
    }    
    await Pastry.findByIdAndUpdate(req.params.pastryId, req.body);  
    res.redirect(`/pastries/${req.params.pastryId}`);
});
  

app.listen(3000, () => {
  console.log("Listening on port 3000");
});