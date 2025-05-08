const express = require('express');
const getAllMyAsset = require('../walletoperations/getAllMyAsset.js');
const router = express.Router();


// Service to create an alert and its corresponding price alert details
router.post('/', async (req, res) => {
console.log("hi!");
	  const response = await getAllMyAsset();
	console.log("fonksitondan routera gelen yanıt");
	console.log(response);
        res.status(201).json({
response
        });
});

module.exports = router;

