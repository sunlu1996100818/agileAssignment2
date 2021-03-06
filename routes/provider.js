let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Provider = require('../Models/provider');

mongoose.connect('mongodb://localhost:27017/Cargo');


/**
 * find all providers in database
 */

router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');

    Provider.find(function(err, providers) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(providers,null,5));
    });
}


/**
 * find certain cargo by id:
 */

router.findById = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Provider.find({ "_id" : req.params.id },function(err, provider) {
        if (err){
            res.send('Provider NOT Found!!');
        }
        else{
            res.send(JSON.stringify(provider,null,5));
        }
    });
}


/**
 * find certain cargo by its name;
 */
router.findByName = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    Provider.find({ "name" : req.params.name },function(err, provider) {
        if (err){
            res.send('The cargo you asked to find is NOT EXIST!!');
        }
        else if (provider.length<=0) {
            res.send("Invalid name");
        }
        else{
            res.send(JSON.stringify(provider,null,5));
        }
    });
};


/**
 * find certain cargo which contains certain name elements;
 */

router.containNames = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    var keyword = req.params.company;
    var reg=new RegExp(keyword,'i');
    Provider.find({'company':{$regex: reg} },function(err, provider) {
        if (err){
            res.send('Provider NOT Found!!');
        }
        // return a suitable error message
        else{
            res.send(JSON.stringify(provider,null,5));
        }
        // return the donation
    });
}

/**
 * add cargo
 */
router.addProvider = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var provider = new Provider();

    provider.name =  req.body.name;
    provider.cargoProvide = req.body.cargoProvide;
    provider.company = req.body.company;
    provider.providerReputation = req.body.providerReputation;


    if((req.body.name!=null)&&(req.body.cargoProvide!=null)&&(req.body.company!=null)&&(req.body.providerReputation!=null)){
        provider.save(function(err) {
            if (err){
                res.json({ message: 'Provider NOT Added!'});
            }
            // return a suitable error message
            else{

                //res.json({ message: 'Donation Added!'});
                res.json({ message: 'Provider Added Successfully!',data:provider});
            }
            // return a suitable success message
        });
    }
    else {
        res.json('you did not enter the right properties, please check');
    }

}

/**
 * delete cargo by its id;
 */
router.deleteProviderById = (req, res) => {

    Provider.findByIdAndRemove(req.params.id, function(err) {
        if (err){
            res.json({ message: 'Cant find Provider, Provider NOT Deleted!'});
        }
        // return a suitable error message
        else{
            res.json({ message: 'Provider Deleted successfully!'});
        }

    });
}

router.changeCertainCompany =(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    var conditions = { _id: req.params.id } , update = {  company: req.body.company };
    var query = { _id: req.params.id };
    Provider.update(query, { company: req.body.company},function (err, cargo) {
        if (err){
            res.json('Provider NOT Found - cant change the Company');
        }
        else {
            res.json('your change request is successful, please check');
        }
    })
}

router.changeCertainReputation =(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    var conditions = { _id: req.params.id } , update = {  providerReputation: req.body.providerReputation };
    var query = { _id: req.params.id };
    Provider.update(query, { providerReputation: req.body.providerReputation},function (err, cargo) {
        if (err){
            res.json('Provider NOT Found - cant change the Reputation level');
        }
        else {
            res.json('your change request is successful, please check');
        }
    })
}



/*
router.searchCompany =(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    var cargoId = req.params.id;
    Provider.find().populate({path:'name',select:{_id:cargoId}}).exec(function (err,a) {
        if(err){
            res.send(err);
        }
        else{
            res.send(JSON.stringify(a,null,5));
        }
    })
}*/

module.exports = router;