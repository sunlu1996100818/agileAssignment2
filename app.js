var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cargo = require("./routes/cargos");
const provider = require("./routes/provider");
const user = require("./routes/allUsers");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/cargoAll/:providerName', cargo.findAll);        //p
app.get('/provider/providerAll', provider.findAll);       //p

app.get('/cargoCompany/:id',cargo.searchCompanyReputationByCargoId);  //p


app.get('/cargoContains/:name/:providerName', cargo.containNames);    //p
app.get('/providerCompanyContains/:company', provider.containNames);  //p

app.get('/cargoName/:name/:providerName', cargo.findByName);          //p
app.get('/cargoId/:id/:providerName', cargo.findById);                //p

app.get('/providerName/:name', provider.findByName);                  //p
app.get('/provider/:id', provider.findById);                          //p

app.get('/cargoTotalCostByName/:name', cargo.totalCost);              //p
app.get('/cargoCertainCost/:id', cargo.certainCost);                  //p


app.post('/cargo/:providerName',cargo.addCargo);                                   //p
app.post('/provider/',provider.addProvider);                          //p

app.put('/cargoPriceChange/:name/:providerName', cargo.changeCargoPrice);           //p
app.put('/cargoCertainPrice/:id/:providerName', cargo.changeCertainPrice);          //p


//app.put('/cargoAmountChange/:name/:providerName', cargo.changeCargoAmount);         //p
app.put('/cargoCertainAmount/:id/:providerName', cargo.changeCertainAmount);        //p

app.put('/cargoCertainProvider/:id/:providerName', cargo.changeCertainProvider);

app.put('/providerCompanyChange/:id',provider.changeCertainCompany);                //p
app.put('/providerReputationChange/:id',provider.changeCertainReputation);          //p


app.delete('/cargo/:id/:providerName', cargo.deleteCargoById);
//app.delete('/provider/:id', cargo.deleteProviderById);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
