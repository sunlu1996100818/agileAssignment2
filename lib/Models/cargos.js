'use strict';

var mongoose = require('mongoose');

var CargoSchema = new mongoose.Schema({
    providerID: {
        type: mongoose.Schema.ObjectId,
        ref: 'providers'
    },
    name: String,
    price: Number,
    amount: Number,
    providerName: String,
    providerType: String

}, { collection: 'Cargo' });

CargoSchema.statics = {
    findCargoCompanyByCargoId: function findCargoCompanyByCargoId(cargoId, callback) {
        return this.findOne({ _id: cargoId }).populate('providerID') // 关联查询
        .exec(callback);
    }
    /*
    CargoSchema.statics = {
        findCargoReputationByCargoId:function(cargoId, callback){
            return this
                .findOne({_id : cargoId}).populate('providerID')  // 关联查询
                .exec(callback)
        }
    }*/

};module.exports = mongoose.model('cargos', CargoSchema);