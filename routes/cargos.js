
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Cargo1 = require('../Models/cargos');

mongoose.connect('mongodb://sunlu:sunlu1996100818@ds127604.mlab.com:27604/cargo',{ useNewUrlParser: true });

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.on('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

/**
 * find all cargoes in database
 */
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

            Cargo1.find(function (err,cargo1234) {
                if (err)
                    res.send(err);
                //res.send(JSON.stringify(cargo1234,null,5));
                res.json(cargo1234);
            })

    };


/*
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Cargo1.find({ providerName: req.params.providerName },function(err, cargos123) {
        if (err){
            res.send("Error!!!");
        }else if(cargos123.length<=0){
            res.send("Invalid provider name!")
        }
        else if(cargos123[0].providerType==="admin"){
            Cargo1.find(function (err,cargo1234) {
                if (err)
                    res.send(err);
                //res.send(JSON.stringify(cargo1234,null,5));
                res.json(cargo1234);
            })
        }
        else {
            res.json('your authority is not Enough! You cant see all cargos!');
        }
    });

}*/


/**
 * find certain cargo by id:
 */

router.findById = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

            Cargo1.find({ "_id" : req.params.id },function(err, cargos111) {
                if (err){
                    res.send("invalid ID");
                    res.send(err);
                }
                else if(cargos111.length<=0){
                    res.send("invalid ID");
                }
                else {
                    console.log(cargos111);
                    res.json(cargos111);
                }
            });


    /*Cargo1.find({ "_id":req.params.id, "providerName" : req.params.providerName},function (err, cargos111) {
        if (err||(cargos111.length<=0)){
            console.log(cargos111);
            res.send("Invalid id or provider name, or you id and provider does not match!");
        }
        else if ((cargos111[0].providerType==="admin")||(cargos111[0].providerName===req.params.providerName)) {
            res.send(JSON.stringify(cargos111,null,5));
        }
        else if (cargos111[0].providerType==="admin") {
            res.send(JSON.stringify(cargos111,null,5));
        }
        else {
            res.json("your authority is not enough! cant find all users!");
        };
    });*/
}



router.searchCompanyReputationByCargoId =(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    var cargoID = req.params.id;
    Cargo1.findCargoCompanyByCargoId(cargoID,function (err, cargo) {
        if(err){
            res.json("invalid ID!  Please reconnect to the Database!");
            //res.send(err);

        }
        else if(cargo.length<=0){
            //res.send(JSON.stringify("invalid ID",null,5));
            res.json("invalid ID");
        }
        else {
            res.json(cargo.providerID.company+cargo.providerID.providerReputation);
        }
    })
}



/**
 * find certain cargo by its name;
 */


router.findByName = (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    Cargo1.find({ providerName: req.params.providerName },function(err, cargos123) {
        if (err){

            res.send("Error!!!");
        }else if(cargos123.length<=0){
            res.json("Invalid providerName!");
        }
        else if(cargos123[0].providerType==="admin"){
            Cargo1.find({ "name" : req.params.name },function(err, cargos111) {
                if (err){
                    res.send(err);
                }
                else if(cargos111.length<=0){
                    res.send("Wrong name! Error!!!");
                }
                else {
                    console.log(cargos111);
                    //res.send(JSON.stringify(cargos111,null,5));
                    res.json(cargos111);
                }
            });
        }
        else {
            res.json('your authority is not enough! cant find this!');
        }
    });

};


/**
 * find certain cargo which contains certain name elements;
 */

router.containNames = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    var keyword = req.params.name;
    var reg=new RegExp(keyword,'i');
    var result;
    Cargo1.find({'name':{$regex: reg} },function(err, cargo) {
        if (err){
            res.send(err);
        }
        else if(cargo.length<=0){
            res.json("invalid name! ");
        }
        else{
            //res.send(JSON.stringify(cargo,null,5));
            return result = cargo;
        }
    });

    Cargo1.find({"providerName":req.params.providerName},function (err, cargos111) {
        //console.log(allCargos);
        if (err){
            res.send(err);}
            else if(cargos111.length<=0){
                res.send("invalid provider name! ")
        }
        else if ((cargos111[0].providerType==="admin")) {
            //res.send(JSON.stringify(result,null,5));
            res.json(result);
        }
        else {
            //res.send(JSON.stringify(cargos111,null,5));
            res.json("your authority is not enough! cant find this!");
        };
    });

}


/**
 * add cargo
 */


router.addCargo = (req, res) => {

    res.setHeader('Content-Type', 'application/json');


            var cargoss = new Cargo1();

            cargoss.name =  req.body.name;
            cargoss.price = req.body.price;
            cargoss.amount = req.body.amount;
            cargoss.providerID = req.body.providerID;
            cargoss.providerName = req.body.providerName;
            cargoss.providerType = req.body.providerType;



            if((req.body.name!=null)&&(req.body.price!=null)&&(req.body.amount!=null)
                &&(req.body.providerName!=null)&&(req.body.providerType!=null)&&(req.body.providerID!=null)){
                cargoss.save(function(err) {
                    if (err){
                        res.json({ message: 'Cargo NOT Added!'});
                    }
                    // return a suitable error message
                    else{

                        res.json(cargoss);
                        //res.json({ message: 'Cargo Added Successfully!',data:cargoss});
                    }
                    // return a suitable success message
                });
            }
            else {
                res.json('you did not enter the right properties, please check');
            }



}
/*
router.addCargo = (req, res) => {

    res.setHeader('Content-Type', 'application/json');

    var cargo1 = new Cargo1();

    cargo1.name =  req.body.name;
    cargo1.price =  req.body.price;
    cargo1.amount =  req.body.amount;
    cargo1.providerID = req.body.providerID;
    cargo1.providerName = req.body.providerName;
    cargo1.providerType = req.body.providerType;

            cargo1.save(function(err) {
                if (err){
                    res.json({ message: 'cargo NOT Added!'});
                }
                // return a suitable error message
                else{
                    console.log(typeof(cargo1));
                    res.json({ message: 'Cargo Added Successfully!',data:cargo1});
                }
                // return a suitable success message
            });
};
*/




/**
 * delete cargo by its id;
 */
router.deleteCargoById = (req, res) => {

            Cargo1.findByIdAndRemove(req.params.id, function(err) {
                if (err){
                    res.json({ message: 'Cant find cargo, cargo NOT Deleted!'});
                }
                // return a suitable error message
                else{
                    res.json({ message: 'cargo Deleted successfully!'});
                }
            });


}

/**
 * change cargo price, amount and provider;
 */
router.changeCargoPrice =(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    /*var conditions = { name: req.params.name } , update = {  price: req.body.price };
    var query = { name: req.params.name };
    Cargo1.updateMany(query, update,function (err, cargo) {
        //console.log(allCargos);
        if (err){
            res.json('cargo NOT Found - cant change the price');
        }
        else if(cargo.length<=0){
            res.json("Invalid Name!!")
        }
        else {
            console.log(req.body.price);

            res.json('your change request is successful, please check');
        }
    })*/

    Cargo1.find({ providerName: req.params.providerName },function(err, cargos123) {
        if (err){
            res.send("Error!!!");
        }
        else if(cargos123.length<=0){
            res.send("Invalid provider name!")
        }
        else if(cargos123[0].providerType==="admin"){
            var conditions = { name: req.params.name } , update = {  price: req.body.price };
            var query = { name: req.params.name };
            Cargo1.updateMany(query, update,function (err, cargo) {
                //console.log(allCargos);
                if (err){
                    res.json('cargo NOT Found - cant change the price');
                }
                else if(cargo.length<=0){
                    res.json("Invalid Name!!")
                }
                else {
                    res.json('your change request is successful, please check');
                }
            })
        }
        else {
            res.json('your authority is not Enough! You cant change any Price!');
        }
    });
};

router.changeCertainPrice =(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    Cargo1.find({ providerName: req.params.providerName },function(err, cargos123) {
        if (err){
            res.send("Error!!!");
        }

        else if(cargos123.length<=0){
            res.send("Invalid provider name!")
        }else if(cargos123[0].providerType==="admin"){
            var conditions = { _id: req.params.id } , update = {  price: req.body.price };
            var query = { _id: req.params.id };
            Cargo1.updateMany(query, { price: req.body.price},function (err, cargo) {
                //console.log(allCargos);
                if (err){
                    res.json('cargo NOT Found - cant change the price');
                }
                else if(cargo.length<=0){
                    res.json("Invalid ID!")
                }
                else {
                    res.json('your change request is successful, please check');
                }
            })
        }
        else {
            res.json('your authority is not Enough! You cant change any Price!');
        }
    });

};


router.editCargo =(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    var conditions = { _id: req.params.id } ,
        update = {  price: req.body.price, amount: req.body.amount,name:req.body.name};
    var query = { _id: req.params.id };
    Cargo1.updateMany(query, update,function (err, cargo) {
        //console.log(allCargos);
        if (err){
            res.json('cargo NOT Found - cant change the price');
        }
        else if(cargo.length<=0){
            res.json("Invalid ID!!")
        }
        else {
            res.json('your change request is successful, please check');
        }
    })
};



router.changeCargoAmount =(req,res) => {
    res.setHeader('Content-Type', 'application/json');

    Cargo1.find({ providerName: req.params.providerName },function(err, cargos123) {
        if (err){
            res.send("Error!!!");
        }
        else if(cargos123.length<=0){
            res.send("Invalid provider name!")
        }else if(cargos123[0].providerType==="admin"){
            //var conditions = { name: req.params.name } , update = {  price: req.body.price };
            var query = { name: req.params.name };
            Cargo1.updateMany(query, { amount: req.body.amount},function (err, cargo) {
                //console.log(allCargos);
                if (err){
                    res.json('cargo NOT Found - cant change the amount');
                }
                else if(cargo.length<=0){
                    res.json("Invalid Name!!")
                }
                else {
                    res.json('your change request is successful, please check');
                }
            })
        }
        else {
            res.json('your authority is not Enough! You cant change any amount!');
        }
    });
};

router.changeCertainAmount =(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    Cargo1.find({ providerName: req.params.providerName },function(err, cargos123) {
        if (err){
            res.send("Error!!!");
        }
        else if(cargos123.length<=0){
            res.send("Invalid provider name!")
        }else if(cargos123[0].providerType==="admin"){
            //var conditions = { _id: req.params.id } , update = {  price: req.body.price };
            var query = { _id: req.params.id };
            Cargo1.updateMany(query, { amount: req.body.amount},function (err, cargo) {
                //console.log(allCargos);
                if (err){
                    res.json('cargo NOT Found - cant change the amount');
                }else if(cargo.length<=0){
                    res.json("Invalid ID!");
                }
                else {
                    res.json('your change request is successful, please check');
                }
            })
        }
        else {
            res.json('your authority is not Enough! You cant change any Amount!');
        }
    });
};


router.changeCertainProvider =(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    Cargo1.find({ providerName: req.params.providerName },function(err, cargos123) {
        if (err){
            res.send("Error!!!");
        }
        else if(cargos123.length<=0){
            res.send("Invalid provider name!")
        }else if(cargos123[0].providerType==="admin"){
            //var conditions = { _id: req.params.id } , update = {  price: req.body.price };
            var query = { _id: req.params.id };
            Cargo1.updateMany(query, { providerName: req.body.providerName},function (err, cargo) {
                //console.log(allCargos);
                if (err){
                    res.json('cargo NOT Found - cant change the provider Name');
                }else if(cargo.length<=0){
                    res.json("Invalid ID!")
                }
                else {
                    res.json('your change request is successful, please check');
                }
            })
        }
        else {
            res.json('your authority is not Enough! You cant change any provider Name!');
        }
    });
};



/**
 * compute the total price of a certain cargo;
 */
function getTotalCost(array) {
    let cost = 0;
    array.forEach(function(obj) { cost += (obj.price*obj.amount); });
    return cost;
}
router.totalCost = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Cargo1.find({"name":req.params.name},function(err, cargo) {
        if (err){
            res.json({message:'Error!'});
        }else if(cargo.length<=0){
            res.json("Invalid name!")
        }
        // return a suitable error message
        else
        {
            res.send({totalCost : getTotalCost(cargo)})
        }
    });
}

function getCertainCost(array) {
    let cost = 0;
    array.forEach(function(obj) { cost =+ (obj.price*obj.amount); });
    return cost;
}

router.certainCost = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Cargo1.find({"_id":req.params.id},function(err, cargo) {
        if (err){
            res.json({message:'Error!'});
        }else if(cargo.length<=0){
            res.json("Invalid ID!")
        }
        // return a suitable error message
        else
        {
            res.json({certainCost : getCertainCost(cargo)})
        }
    });
}








module.exports = router;
