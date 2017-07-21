/*--------------------Database--------------------*/

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

// Use mockgoose for automated testing
// Mockgoose is for a temporary DB stored in RAM
const Mockgoose = require("mockgoose").Mockgoose;
const mockgoose = new Mockgoose(mongoose);

if (process.env.NODE_ENV === "test") {
    // While testing use mockgoose
    mockgoose.prepareStorage().then(() => {
        mongoose.connect(config.dbPath, {
            useMongoClient: true,
        });
    });
} else {
    // Else use the web database
    mongoose.connect(config.dbPath, {
        useMongoClient: true,
    });
}

const db = mongoose.connection;

db.on("error", () => {
    console.log("Error occured from the database");
});

db.once("open", () => {
    console.log("Successfully opened the database");
});
