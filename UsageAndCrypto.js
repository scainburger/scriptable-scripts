const params = args.widgetParameter ? args.widgetParameter.split(",") : [];

const isDarkTheme = params?.[0] === 'dark';
const padding = 2;

const widget = new ListWidget();
if (isDarkTheme) {
 widget.backgroundColor = new Color('#1C1C1E');; 
}
widget.setPadding(padding, padding, padding, padding);

widget.url = 'https://www.coinspot.com.au/buy/eth';

// const headerStack = widget.addStack();
// headerStack.setPadding(0, 0, 25, 0);
// const headerText = headerStack.addText("Ethereum Wallet");
// headerText.font = Font.mediumSystemFont(16);
// if (isDarkTheme) {
//     headerText.textColor = new Color('#FFFFFF');
// }

async function buildWidget() {
    const rubicImage = await loadImage('https://cdn1.iconfinder.com/data/icons/business-2-52/65/65-512.png');
    const ethereumImage = await loadImage('https://i.imgur.com/3DMqpZY.png');
  
   const ethereumPriceInfo = await getTokenPriceInfo('ethereum');
    const rubicPriceInfo = Math.round(ethereumPriceInfo.price * 0.59336881);
    if (rubicPriceInfo < 2500)  ethereumPriceInfo.grow = false;
  
    const roundedRubicPrice = Math.round(rubicPriceInfo * 100) / 100;
    const roundedEthereumPrice = Math.round(ethereumPriceInfo.price);
  
    addCrypto(ethereumImage, 'ETH', `$${roundedEthereumPrice}`, ethereumPriceInfo.grow);
    addCrypto(rubicImage, 'Bal  ', `$${roundedRubicPrice}`, ethereumPriceInfo.grow);

}

function addCrypto(image, symbol, price, grow) {
   const rowStack = widget.addStack();
   rowStack.setPadding(0, 0, 20, 0);
   rowStack.layoutHorizontally();
  
   const imageStack = rowStack.addStack(); 
   const symbolStack = rowStack.addStack(); 
   const priceStack = rowStack.addStack(); 
  
   imageStack.setPadding(0, 0, 0, 10);
   symbolStack.setPadding(0, 0, 0, 8);
  
   const imageNode = imageStack.addImage(image);
   imageNode.imageSize = new Size(20, 20);
   imageNode.leftAlignImage();
  
   const symbolText = symbolStack.addText(symbol);
   symbolText.font = Font.mediumSystemFont(16);
  
   const priceText = priceStack.addText(price);
   priceText.font = Font.mediumSystemFont(16);
  
  if (isDarkTheme) {
    symbolText.textColor = new Color('#FFFFFF');
  }
  
  if (grow) {
    priceText.textColor = new Color('#4AA956');
  } else {
    priceText.textColor = new Color('#D22E2E');
  }
}

async function getTokenPriceInfo(tokenId) {
  const url = "https://www.coinspot.com.au/pubapi/v2/buyprice/ETH";
  const req = new Request(url)
  const apiResult = await req.loadJSON() 
  return { price: apiResult.rate, grow: true };
}  
  
async function loadImage(imgUrl) {
    const req = new Request(imgUrl)
    return await req.loadImage()
}

await buildWidget();

Script.setWidget(widget);
Script.complete();
widget.presentSmall();
