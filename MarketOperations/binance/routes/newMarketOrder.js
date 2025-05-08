const express = require('express');
const newMarketOrder = require('../walletoperations/newMarketOrder.js');
const newLimitOrder = require('../walletoperations/newLimitOrder.js');
const getSymbolPrice = require('../walletoperations/getSymbolPrice.js');
const getPrecisionLimitAmount = require('../walletoperations/getPrecisionLimitAmount.js');
const getPrecisionLimitPrice = require('../walletoperations/getPrecisionLimitPrice.js');
const getSymbolAsset = require ('../walletoperations/getSymbolAsset');
const getMarginBalanceInUSDT = require ('../walletoperations/getMarginBalanceInUSDT');
const getvariable = require('../functions/getvariable.js');
const router = express.Router();

// Service to create an alert and its corresponding price alert details
router.post('/', async (req, res) => {
  const {
    userid, 
    type, 
    pairname, 
  } = req.body;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function truncateToPrecision(value, precision) {
    const factor = Math.pow(10, precision);
    return Math.floor(value * factor) / factor;
  }
  
  const uniqueTimestamp = Date.now();  // e.g., 1713883642392


  // Check if the necessary fields for alert are provided
  if (!userid || !type || !pairname  ) {
    return res.status(400).json({ error: 'Missing required fields for market order' });
  }

  try {
    const asset = await getMarginBalanceInUSDT();
    const positionmargin = await getvariable("positionmargin");
    const dollar = asset*parseFloat(positionmargin);
    //Symbolün fiyatını al
    const SymbolPrice = await getSymbolPrice(pairname);
    //console.log(SymbolPrice);

    // kaç adet symbol alınacağını hesapla
    const SymbolQuantity = dollar/SymbolPrice;
    // binance satın alma miktarında kaç ondalık sayıya izin veriyor onu hesapla
    const precision = await getPrecisionLimitAmount(pairname);
    // miktarı o ondalık sayıya sınırla
    let limitedSymbolQuantity = Number(SymbolQuantity.toFixed(precision));




    const response = await newMarketOrder(userid,type,pairname,limitedSymbolQuantity,uniqueTimestamp);
  await sleep(5000); // Wait 2 seconds
console.log("DEBUG HIT HERE");
    let TPLimit=null;

    if (type=="BUY")
    {
      TPtype = "SELL"
      TPLimit = response.fills[0].price*1.06;
    }

    else if (type=="SELL")
    {
      TPtype = "BUY"
      TPLimit = response.fills[0].price*0.94;
    }
    let coinAsset = await getSymbolAsset(pairname);
    if (coinAsset.free > response.origQty)
    {
      coinAsset = Number(response.origQty);
    }
    else {
      coinAsset = Math.abs(Number(coinAsset.netAsset));
    }

    console.log("coinAsset --> ",coinAsset);
    console.log("ytopf --> ",typeof coinAsset);  

    let limitedCoinQuantity = truncateToPrecision(coinAsset,precision);

    const pricePrec = await getPrecisionLimitPrice(pairname);
    let LimitedTPLimit = Number(TPLimit.toFixed(pricePrec.pricePrecision));


    const TPresponse = await newLimitOrder(userid,TPtype,pairname,limitedCoinQuantity,LimitedTPLimit,uniqueTimestamp);
//    console.log(TPresponse);

// TP order ile satın alma işlemini birbiriyle ilişkilendirebilmek için burda bi tabloya TPresponse'u yazmak lazım



    if (response.status=="FILLED") {
     
      res.status(201).json({
        message: 'Order executed'
      });
    } else {
      throw new Error('Failed to execute order');
    }

  } catch (err) {
    console.error('Error executing the order:', err);
    res.status(500).json({ error: err.message || 'Failed to execute the order' });
  }
});

module.exports = router;


