// Ce fichier permet de se connecter à la Db
const mongoose = require('mongoose');

const connect = function (callback) {
    mongoose.set("debug", true);
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    mongoose.set('useNewUrlParser', true);
    mongoose.connect("mongodb+srv://admin:admin@cluster0.mqomq.mongodb.net/<dbname>?retryWrites=true&w=majority");
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, " Connection error"));
    db.once("open", function () {

        console.log('Super, vous êtes connecté à la base de données');
        callback();
    });
};



module.exports.connect = connect;