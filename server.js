var express = require('express');
var app = express();
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 8080;
var exphbs = require("express-handlebars");
var apiCall = require("./routes/apiRoutes")



app.use(express.static(process.cwd() + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(methodOverride("_method"));

app.engine("handlebars",exphbs({defaultLayout:"main"}));
app.set("view engine","handlebars");

app.get("/",function(req,res){
	res.render("index");
})

//apiCall.analyze;

app.listen(PORT,function(){
	console.log("listening on PORT: " + PORT)
});

apiCall.awsApi(function(data){
	console.log("this is result: ",data);
})
