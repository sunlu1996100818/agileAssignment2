/*const provider = [
    {id: 1000000, name:'John', cargoProvide:'beef',cargoPrice:500},
    {id: 1000001, name:'John', cargoProvide:'chicken',cargoPrice:300},
    {id: 1000002, name:'John', cargoProvide:'apple',cargoPrice:50},
    {id: 1000003, name:'John', cargoProvide:'banana',cargoPrice:40},
    {id: 1000003, name:'Sam', cargoProvide:'beef-fillet',cargoPrice:900},
    {id: 1000003, name:'Sam', cargoProvide:'chicken-brest',cargoPrice:600},
    {id: 1000003, name:'Bob', cargoProvide:'beef',cargoPrice:500},
    {id: 1000003, name:'Bob', cargoProvide:'chicken',cargoPrice:200},
    {id: 1000003, name:'Tony', cargoProvide:'fish',cargoPrice:300},


];*/

let mongoose = require('mongoose');

let ProviderSchema = new mongoose.Schema({

        name:String,
        cargoProvide: String,
        company:String,
        providerReputation:Number

    },

    { collection: 'provider' });

module.exports = mongoose.model('providers', ProviderSchema);


