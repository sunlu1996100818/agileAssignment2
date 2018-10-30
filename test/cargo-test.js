let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../bin/www');
let expect = chai.expect;
let datastore = require('../Models/cargos');
chai.use(chaiHttp);
let _ = require('lodash' );

chai.use(require('chai-things'));



describe('cargo', function (){
    describe('GET /cargoAll/John',  () => {
        it('should return all the cargo if has authentication', function(done) {
            chai.request(server)
                .get('/cargoAll/John')

                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    //expect(res.body.length).to.equal(10);
                    let result = _.map(res.body, (cargo) => {
                        return { id: cargo._id,
                            providerID: cargo.providerID }
                    });
                    expect(result.length).to.equal(9);
                    /*expect(result).to.include( { id: "5bc907cd5a6760bc51a7f9a8", providerID: "5bc9060f5a6760bc51a7f99f"  } );*/
                    expect(result).to.include( { id: "5bc908665a6760bc51a7f9a9", providerID: "5bc9062c5a6760bc51a7f9a0"  } );
                    expect(result).to.include( { id: "5bc908a65a6760bc51a7f9aa", providerID: "5bc9064d5a6760bc51a7f9a1"  } );
                    expect(result).to.include( { id: "5bc908e35a6760bc51a7f9ab", providerID: "5bc9066a5a6760bc51a7f9a2"  } );
                    expect(result).to.include( { id: "5bc9091a5a6760bc51a7f9ac", providerID: "5bc906805a6760bc51a7f9a3"  } );
                    expect(result).to.include( { id: "5bc909615a6760bc51a7f9ad", providerID: "5bc906a35a6760bc51a7f9a4"  } );
                    expect(result).to.include( { id: "5bc9098c5a6760bc51a7f9ae", providerID: "5bc906bb5a6760bc51a7f9a5"  } );
                    expect(result).to.include( { id: "5bc909b55a6760bc51a7f9af", providerID: "5bc906d85a6760bc51a7f9a6"  } );
                    expect(result).to.include( { id: "5bc909fa5a6760bc51a7f9b0", providerID: "5bc906fc5a6760bc51a7f9a7"  } );

                    done();
                });
        });
        it('should return massage of authentication not enough', function(done) {
            chai.request(server)
                .get('/cargoAll/Sam')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.equal('your authority is not Enough! You cant see all cargos!') ;
                    done();
                });
        });
        it('should return massage of wrong provider name', function(done) {
            chai.request(server)
                .get('/cargoAll/aaa')
                .end(function(err, res) {

                    expect(Error);
                    done();
                });
        });
    });
    describe('GET /cargoName',  () => {
        it('should return all one kind of cargos if has authentication', function(done) {
            chai.request(server)
                .get('/cargoName/beef/John')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (cargo) => {
                        return { id: cargo._id,
                            providerID: cargo.providerID }
                    });
                    //expect(result).to.include( { id: "5bc907cd5a6760bc51a7f9a8", providerID: "5bc9060f5a6760bc51a7f99f"  } );
                    expect(result).to.include( { id: "5bc908e35a6760bc51a7f9ab", providerID: "5bc9066a5a6760bc51a7f9a2"  } );
                    expect(result).to.include( { id: "5bc9098c5a6760bc51a7f9ae", providerID: "5bc906bb5a6760bc51a7f9a5"  } );

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

                    expect(result).to.include( { id: "5bc908e35a6760bc51a7f9ab", name:'beef',providerID: "5bc9066a5a6760bc51a7f9a2"  } );
                    expect(result).to.include( { id: "5bc9091a5a6760bc51a7f9ac", name:'beef-tongue',providerID: "5bc906805a6760bc51a7f9a3"  } );

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
        it('should return massage of invalid name', function(done) {
            chai.request(server)
                .get('/cargoContains/aaa/John')
                .end(function(err, res) {
                   expect(Error);
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




});