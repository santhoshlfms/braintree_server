var express = require('express');
var router = express.Router();
var braintree = require("braintree");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// get client token 

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "hjw95jmm3g4sgpz3",
  publicKey: "cjysymr9z8n9935m",
  privateKey: "1147b2d9631684711b0235e6b5ccce2e"
});


router.get("/client_token", function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});

router.post("/checkout", function (req, res) {
  var nonceFromTheClient = req.body.payment_method_nonce;
  gateway.transaction.sale({
	  amount: "10.00",
	  paymentMethodNonce: nonceFromTheClient,
	  
	}, function (err, result) {
		if(err) {
		   res.send(err);
		}else {
			console.log(JSON.stringify(result))
			res.send(result);
			
		}

	});

  // Use payment method nonce here
});

router.post("/settle", function (req, res) {
	var id = req.body.id;
	gateway.transaction.submitForSettlement(id, function (err, result) {
	    if (result.success) {
	      var settledTransaction = result.transaction;
	      res.send(settledTransaction);
	    } else {
	      console.log(result.errors);
	      res.send(result.errors);
	    }
	  });
});

/////ECBT///////


var ecbtgateway = braintree.connect({
  	accessToken: "access_token$sandbox$v5m2n5j29dk69nwv$45a280a49b6283b2bb09efcae9f1d00b"
});


router.get("/client_token_ecbt", function (req, res) {
  ecbtgateway.clientToken.generate({}, function (err, response) {
    res.send(response.clientToken);
  });
});

router.post("/checkout_ecbt", function (req, res) {
  	 var nonce = req.body.payment_method_nonce;
  // Use payment method nonce here

	  var saleRequest = {
	  amount: req.body.amount,
	  merchantAccountId: "USD",
	  paymentMethodNonce: nonce,
	  orderId: "Mapped to PayPal Invoice Number santhosh test Env",
	  descriptor: {
	    name: "Descriptor displayed in customer CC statements. 22 char max"
	  },
	  shipping: {
	    firstName: "Jen",
	    lastName: "Smith",
	    company: "Braintree",
	    streetAddress: "1 E 1st St",
	    extendedAddress: "5th Floor",
	    locality: "Bartlett",
	    region: "IL",
	    postalCode: "60103",
	    countryCodeAlpha2: "US"
	  },
	  options: {
	    paypal: {
	      customField: "PayPal custom field",
	      description: "Description for PayPal email receipt"
	    },
	    submitForSettlement: true
	  }
	};

	gateway.transaction.sale(saleRequest, function (err, result) {
	  if (err) {
	        res.send(err);
	  } else if (result.success) {
	    res.send(result.transaction.id);
	  } else {
	    res.send("<h1>Error:" +result.message + "</h1>");
	  }
	});
});


module.exports = router;
