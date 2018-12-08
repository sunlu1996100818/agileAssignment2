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


    //get one certain cargo total cost
    describe('GET /cargoCertainCost/:id',  () => {


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





});
