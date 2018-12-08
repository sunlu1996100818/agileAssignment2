let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let expect = chai.expect;
let datastore = require('../Models/cargos');
chai.use(chaiHttp);
let _ = require('lodash' );
const clean = require("mocha");

chai.use(require('chai-things'));



describe('cargo', function (){
    describe('GET /cargoAll',  () => {
        it('should return all the cargo if has authentication', function(done) {
            chai.request(server)
                .get('/cargoAll/')

                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    //expect(res.body.length).to.equal(10);
                    let result = _.map(res.body, (cargo) => {
                        return { id: cargo._id,
                            providerID: cargo.providerID }
                    });
                    expect(result.length).to.equal(12);
                    /*expect(result).to.include( { id: "5bc907cd5a6760bc51a7f9a8", providerID: "5bc9060f5a6760bc51a7f99f"  } );*/
                    expect(result).to.include( { id: "5c01adc8d2b264205471da77", providerID: "5bc9066a5a6760bc51a7f9a2"  } );
                    expect(result).to.include( { id: "5c01adead2b264205471da78", providerID: "5bc906805a6760bc51a7f9a3"  } );
                    expect(result).to.include( { id: "5c01ae0dd2b264205471da79", providerID: "5bc906a35a6760bc51a7f9a4"  } );
                    expect(result).to.include( { id: "5c01ae34d2b264205471da7a", providerID: "5bc906fc5a6760bc51a7f9a7"  } );
                    expect(result).to.include( { id: "5c01ae55d2b264205471da7b", providerID: "5bc906bb5a6760bc51a7f9a5"  } );
                    expect(result).to.include( { id: "5c01afabd2b264205471da7d", providerID: "5bd0ce8fc7222d1d7c0c4122"  } );
                    //expect(result).to.include( { id: "5c0b0cc0f493bd0e6cfd7cae", providerID: "5c0b0cc0f493bd0e6cfd7cae"  } );

                    done();
                });
        });

    });
    describe('GET /cargoName',  () => {
        it('should return all one kind of cargos if has authentication', function(done) {
            chai.request(server)
                .get('/cargoName/beef/John')
                .end(function(err, res) {
                    done();
                });
        });
        it('should return massage of authentication', function(done) {
            chai.request(server)
                .get('/cargoName/beef/Sam')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal("your authority is not enough! cant find this!") ;
                    done();
                });
        });
        it('should return massage of invalid name', function(done) {
            chai.request(server)
                .get('/cargoName/aaa/John')
                .end(function(err, res) {

                    expect(Error);


                    done();
                });
        });
        it('should return massage of wrong provider name', function(done) {
            chai.request(server)
                .get('/cargoName/beef/aaa')
                .end(function(err, res) {
                    expect(res.body).to.equal("Invalid providerName!") ;
                    done();
                });
        });

    });

    //Fuzzy search:
    describe('GET /cargoContains/:name/:providerName',  () => {
        it('should return all cargo contain certain names if has authentication', function(done) {
            chai.request(server)
                .get('/cargoContains/beef/John')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let result = _.map(res.body, (cargo) => {
                        return { id: cargo._id,name:cargo.name,
                            providerID: cargo.providerID }
                    });

                    expect(result).to.include( { id: "5c01adc8d2b264205471da77", name:'beef',providerID: "5bc9066a5a6760bc51a7f9a2"  } );
                    expect(result).to.include( { id: "5c01adead2b264205471da78", name:'beef-tongue',providerID: "5bc906805a6760bc51a7f9a3"  } );

                    done();


                });
        });
        it('should return massage of authentication not enough', function(done) {
            chai.request(server)
                .get('/cargoContains/beef/Sam')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal("your authority is not enough! cant find this!") ;
                    done();
                });
        });

        it('should return massage of wrong provider name', function(done) {
            chai.request(server)
                .get('/cargoContains/beef/aaa')
                .end(function(err, res) {
                    expect(Error);
                    done();
                });
        });

    });

    //Relevance search
    describe('GET /cargoCompany/:id',  () => {
        it('should return certain cargo company and its reputation', function(done) {
            chai.request(server)
                .get('/cargoCompany/:id')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    //expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(46);
                    let result = _.map(res.body, (provider) => {
                        return {
                            company: provider.company,
                            providerReputation:provider.providerReputation

                        }
                    });

                    done();
                });
        });

        it('should return massage of invalid id', function(done) {
            chai.request(server)
                .get('/cargoCompany/asdfa')
                .end(function(err, res) {

                    expect(Error);
                    expect(res.body).to.equal('invalid ID!  Please reconnect to the Database!') ;
                    done();
                });
        });


    });

    //get one kind of cargo total cost
    describe('GET /cargoTotalCostByName/:name',  () => {
        it('should return one kind of cargo total cost if invalid name', function(done) {
            chai.request(server)
                .get('/cargoTotalCostByName/chicken')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.include("Invalid name!") ;
                    done();
                });
        });


        it('should return massage of invalid name', function(done) {
            chai.request(server)
                .get('/cargoTotalCostByName/asdfa')
                .end(function(err, res) {

                    //expect(Error);
                    expect(res.body).to.equal('Invalid name!') ;
                    done();
                });
        });


    });
    //get one certain cargo total cost
    describe('GET /cargoCertainCost/:id',  () => {
        it('should return a certain cargo cost of invalid id', function(done) {
            chai.request(server)
                .get('/cargoCertainCost/5c01adc8d2b264205471da77')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.include({'certainCost':40000}) ;
                    done();
                });
        });


        it('should return massage of invalid name', function(done) {
            chai.request(server)
                .get('/cargoCertainCost/asdasf')
                .end(function(err, res) {

                    //expect(Error);
                    expect(res.body).to.have.property( 'message', 'Error!') ;
                    //expect(res.body).to.have.property('message','Donation Successfully Deleted!');
                    done();
                });
        });


    });

    //post function test:
    describe('POST /cargo/', function () {

        it('should return cargo not successfully added because missing properties', function(done) {
            let cargo = {
                name:"Tommy",
                providerID:"5bc9060f5a6760bc51a7f99f"
            };
            chai.request(server)
                .post('/cargo')
                .send(cargo)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.include('you did not enter the right properties, please check');
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/cargoAll/John')
                .end(function(err, res) {
                    let result = _.map(res.body, (cargo) => {
                        return { name: cargo.name,
                            providerID: cargo.providerID };
                    }  );

                    //expect(res.body).to.be.a({});
                    //expect(res).to.be.a(undefined);

                    done();
                });
        });

    });


    describe('DELETE /cargo/:id', () => {
        it('should return a message of Donation Successfully Deleted', function(done) {
            chai.request(server)
                .delete('/cargo/5c01adc8d2b2644684a78')
                .end((err,res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message','Cant find cargo, cargo NOT Deleted!');
                    done();
                });
        });
        after(function (done){
            chai.request(server)
                .get('/cargoAll')
                .end(function(err,res){
                    expect(res).to.have.status(200);
                    expect(res.body).be.be.a('array');
                    let result = _.map(res.body,function (cargo) {
                        return{
                            _id:cargo._id,
                            name:cargo.name,
                            price:cargo.price,
                            amount:cargo.amount,
                            providerID:cargo.providerID
                        };
                    });
                    expect(result).to.not.include({_id:'5c01adc8d2b2644684a78'});
                    done();
                })

        })
        it('should return a message of invalid id', function(done) {
            chai.request(server)
                .delete('/cargo/adfasdf/')
                .end((err,res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message','Cant find cargo, cargo NOT Deleted!');
                    done();
                });
        });


    });

    //put function test
    describe('PUT /cargoCertainPrice/:id/providerName', () => {
        it('should return a message and the cargo price successfully changed', function(done) {

            chai.request(server)
                .put('/cargoCertainPrice/5bc907cd5a6760bc51a7f9a8/John')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let cargo = res.body ;
                    expect(cargo).to.equal( 'your change request is successful, please check' );
                    done();
                });
        });
        it('should return a message for invalid cargo id', function(done) {
            chai.request(server)
                .put('/cargoCertainPrice/12345/John')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal('cargo NOT Found - cant change the price' ) ;
                    done();
                });
        });
        it('should return massage of authentication not enough', function(done) {
            chai.request(server)
                .put('/cargoCertainPrice/5bc907cd5a6760bc51a7f9a8/Sam')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal("your authority is not Enough! You cant change any Price!") ;
                    done();
                });
        });
    });

    //change one kind of price
    describe('PUT /cargoPriceChange/:id/providerName', () => {
        it('should return a message and the cargo price successfully changed', function(done) {

            chai.request(server)
                .put('/cargoPriceChange/beef/John')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let cargo = res.body ;
                    expect(cargo).to.equal( 'your change request is successful, please check' );
                    done();
                });
        });
        it('should return a message for invalid cargo id', function(done) {
            chai.request(server)
                .put('/cargoPriceChange/basdf/John')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal('your change request is successful, please check' ) ;
                    done();
                });
        });
        it('should return massage of authentication not enough', function(done) {
            chai.request(server)
                .put('/cargoPriceChange/beef/Sam')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal("your authority is not Enough! You cant change any Price!") ;
                    done();
                });
        });
    });

    describe('PUT /cargoCertainAmount/:id/providerName', () => {
        it('should return a message and the cargo price successfully changed', function(done) {

            chai.request(server)
                .put('/cargoCertainAmount/5bc907cd5a6760bc51a7f9a8/John')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    let cargo = res.body ;
                    expect(cargo).to.equal(  'your change request is successful, please check');
                    done();
                });
        });
        it('should return message for invalid cargo id', function(done) {
            chai.request(server)
                .put('/cargoCertainAmount/12345/John')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal('cargo NOT Found - cant change the amount' ) ;
                    done();
                });
        });
    });
    //all put function tested




});
