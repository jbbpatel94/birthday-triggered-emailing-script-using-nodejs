var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";
var nodemailer = require('nodemailer');
var moment = require('moment');
var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'from mail id',
		pass: 'pass'
	}
});
//sending mail
function send(email,date){
	// mail parameter
	var mailOptions = {
		from: 'from mail id',
		to: email,
		subject: 'Sending Email using Node.js',
		text: "Happy bithday"+date
	};
	//mail send
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}
//searching birthday as today
function search(){
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var dt  = moment().format('YYYY-MM-DD');
		db.collection("Details").find({},{"_id":0}).forEach(function(res) {
			//if birthday is today then send mail
			if(res.date===dt){
				send(res.mail,res.date);
				console.log("sent wishes");
			}
		});
		db.close();
	});
}
setInterval(function(){
	var currentdate = new Date(); 
	var datetime = currentdate.getHours() + ":" + currentdate.getMinutes() + ":"+ currentdate.getSeconds();
	//console.log(datetime,datetime==="16:11:20");
	//at time 24:0:1 call seach function to send mail 
	if(datetime==="24:0:1"){
		console.log("searching bdy boy");
		search();
	}
} , 1000);
