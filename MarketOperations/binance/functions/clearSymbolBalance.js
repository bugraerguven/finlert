const getSymbolAsset = require('../walletoperations/getSymbolAsset.js');
const getSymbolPrice = require('../walletoperations/getSymbolPrice.js');
const newMarketOrder = require('../walletoperations/newMarketOrder.js');
const getPrecisionLimitAmount = require('../walletoperations/getPrecisionLimitAmount.js');


function truncateToPrecision(value, precision) {
    const factor = Math.pow(10, precision);
    return Math.floor(value * factor) / factor;
  }

async function clearSymbolBalance(pairname,clientOrderId) {

    await new Promise(resolve => setTimeout(resolve, 2000)); // sleep 2 sec
    console.log("Starting after delay...");

return new Promise(async (resolve, reject) => {



  //coin balansını çek
  var balance = await getSymbolAsset(pairname);
  var price = await getSymbolPrice(pairname);


  //freenin dolar cinsini hesapla
  //borrowed'un dolar cinsini hesapla
  console.log("balance.free --> " , balance.free);
  const dollar = price * balance.free;
  console.log("dollar --> " , dollar);
  const borroweddollar = price * balance.borrowed;


  console.log ( balance.asset + "'den " + balance.free + " adet bulunmaktadır. Dolar karşılığı : " + dollar)
  console.log ( balance.asset + "'den " + balance.borrowed + " adet borcunuz bulunmaktadır. Dolar karşılığı : " + borroweddollar)

  //free 20$'dan küçük ve borrowed 20$'dan küçükse ise cleardır
  if (dollar<20 && borroweddollar<20)
      {console.log("cüzdan temiz");resolve("clear");}

  //free 20$dan büyükdan büyük ve borrowed 0 ise
      if (dollar>20 && borroweddollar<20)
      {
        console.log("bakiye satılıyor . . .");
        const precision = await getPrecisionLimitAmount(pairname);
        let limitedCoinQuantity = truncateToPrecision(balance.free,precision);

        var resp = await newMarketOrder("0","SELL",pairname,limitedCoinQuantity,clientOrderId);
        //console.log(resp);
        clearSymbolBalance(pairname,clientOrderId);
      }

  //free 20$ dan büyük ve borrowed 0'dan büyükse
      if (dollar>20 && borroweddollar>=20)
      {
        console.log("borç ödenecek ve tekrar çalıştırılacak");
        reject("hem borç hem bakiye var. Kontrol edilmeli")
      }

  //free 20$ dan küçük ve borrowd 0'dan büyükse
      if (dollar<20 && borroweddollar>=20)
      {
        console.log("eksik olan kısım satın alınacak ve borç ödenecek");
        console.log("satın alınıyor . . . ")
        const precision = await getPrecisionLimitAmount(pairname);
        let limitedCoinQuantity = truncateToPrecision(balance.borrowed,precision);

        var resp = await newMarketOrder("0","BUY",pairname,limitedCoinQuantity,clientOrderId);
        //console.log(resp);
        clearSymbolBalance(pairname,clientOrderId);

      // satın al
      // balance öde
      // tekrar başlat
      }



resolve("ok");

reject("error");


});
}
//clearSymbolBalance("BNBUSDT");
module.exports = clearSymbolBalance;