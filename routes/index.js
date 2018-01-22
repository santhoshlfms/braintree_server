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
	  options: {
	    submitForSettlement: true
	  }
	}, function (err, result) {
		if(err) {
		   res.send(err);
		}else {
		   res.send(result);
		}

	});

  // Use payment method nonce here
});

module.exports = router;
