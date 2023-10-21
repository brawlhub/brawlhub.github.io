

// // Set the fill style to red
// ctx.fillStyle = "red";

// // Draw a rectangle at (10, 10) with width 100 and height 50
// // ctx.fillRect(10, 10, 100, 50);

    
async function generate() {
    // Get the canvas element by id
    var canvas = await document.getElementById("thumbnail");

    // Get the 2D drawing context
    var ctx = await canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // get card names from inputs
    cardName1 = encodeURIComponent(document.getElementById('card1').value);
    cardName2 = encodeURIComponent(document.getElementById('card2').value);
    
    // Draw the thumbnail
    await drawFirstCommander(canvas, ctx, cardName1);
    await drawSecondCommander(canvas, ctx, cardName2);
    await drawText(canvas, ctx);
}

async function drawFirstCommander(canvas, ctx, cardName) {
    // Create a separate canvas for the mask
    var maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    
    var maskCtx = maskCanvas.getContext("2d");
    
    // Create gradient 
    var grd = maskCtx.createLinearGradient(0, 0, 728, 0);
    grd.addColorStop(0, "#FFFFFF");
    grd.addColorStop(0.78, "#FFFFFF");
    grd.addColorStop(1, "#00000000");
    maskCtx.fillStyle = grd;
    maskCtx.fillRect(0, 0, 728, 720);
    ctx.drawImage(maskCanvas, 0, 0);
    
    // Get card image
    let imgUrl = await fetchImageUrl(cardName);
    
    let img = new Image();
    img.src = imgUrl;
    
    // Load image, then draw it on the canvas
    await img.decode().then(() => {
        var vRatio = canvas.height / img.height;
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        ctx.drawImage(img, 1280/4 - img.width * vRatio/2, 0, img.width * vRatio, img.height * vRatio);
        ctx.restore();

        // Reset composite operation
        ctx.globalCompositeOperation = "source-over";
    });
}

async function drawSecondCommander(canvas, ctx, cardName) {
    // Get card image
    let cardImage = await fetchImageUrl(cardName);
    
    let img = new Image();
    img.src = cardImage;
    
    // Load image, then draw it on the canvas
    await img.decode().then(() => {
        var vRatio = canvas.height / img.height;
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(img, 1280*3/4 - img.width * vRatio/2, 0, img.width * vRatio, img.height * vRatio);
        ctx.restore();
    });

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over";
}

async function drawText(canvas, ctx) {
    var smallCaps = new FontFace("Beleren Smallcaps", "url(../assets/fonts/Beleren2016SmallCaps-Bold.ttf)");
    
    // Wait for the font to load
    await smallCaps.load();

    // Add the font to the document
    document.fonts.add(smallCaps);
    // Add gradient background to bottom
    var grd = ctx.createLinearGradient(0, 400, 0, 720);
    grd.addColorStop(0, "#00000000");
    grd.addColorStop(0.16, "#00000060");
    grd.addColorStop(0.69, "#000000");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 400, 1280, 720);

    // Add names of players
    ctx.fillStyle = "white";
    ctx.font = "90px Beleren Smallcaps";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Check if player name is too long
    var fontsize = 90;
    var fontface = "Beleren Smallcaps";
    do {
        fontsize--;
        ctx.font = fontsize + "px " + fontface;
    } while (ctx.measureText(document.getElementById('player1').value).width > 500);  
    ctx.fillText(document.getElementById('player1').value, 300, 575);
    var fontsize = 90;
    do {
        fontsize--;
        ctx.font = fontsize + "px " + fontface;
    } while (ctx.measureText(document.getElementById('player2').value).width > 500);  
    ctx.fillText(document.getElementById('player2').value, 980, 575);
    ctx.font = "90px Beleren Smallcaps";
    ctx.fillText("vs", 640, 575);

    // Add Brawl Hub logo
    var logo = new Image();
    logo.src = "../assets/images/logo.png";
    await logo.decode();
    ctx.drawImage(logo, 1280/2 - logo.width/4, 64, logo.width/2, logo.height/2);

    var bold = new FontFace("Beleren Bold", "url(../assets/fonts/Beleren2016-Bold.ttf)");
    await bold.load();
    document.fonts.add(bold);
    // Add match type text with drop shadow
    ctx.font = "90px Beleren Bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "black";
    ctx.fillText(document.getElementById('matchType').value, 640, 348 + 4);
    ctx.fillStyle = "white";
    ctx.fillText(document.getElementById('matchType').value, 640, 348);


    // Add season text with drop shadow
    ctx.font = "60px Beleren Bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "black";
    ctx.fillText(document.getElementById('season').value, 640, 450 + 4);
    ctx.fillStyle = "white";
    ctx.fillText(document.getElementById('season').value, 640, 450);
}

async function fetchImageUrl(cardName) {
    let response = await fetch("https://api.scryfall.com/cards/named?fuzzy=" + cardName);
    let obj = await response.json();
    
    return (obj.hasOwnProperty("card_faces")) ? obj.card_faces[0].image_uris.art_crop : obj.image_uris.art_crop;
}

