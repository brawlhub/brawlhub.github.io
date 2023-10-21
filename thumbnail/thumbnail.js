async function generate() {

    // clear the error message
    document.getElementById("error_message").innerHTML = "";

    // Get the canvas element by id
    let canvas = document.getElementById("thumbnail");

    // Get the 2D drawing context
    let ctx = await canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // get input data
    let cardName1 = encodeURIComponent(document.getElementById('card1').value);
    let cardName2 = encodeURIComponent(document.getElementById('card2').value);
    let player1 = document.getElementById('player1').value;
    let player2 = document.getElementById('player2').value;
    let matchType = document.getElementById('matchType').value;
    let season = document.getElementById('season').value;
    
    let cardImageUrl1 = await fetchCardImageUrl(cardName1);
    let cardImageUrl2 = await fetchCardImageUrl(cardName2);

    // If one or more cards is invalid, display the error message
    if (!cardImageUrl1[0]) {
        document.getElementById("error_message").innerHTML += cardImageUrl1[1];
    }
    if (!cardImageUrl2[0]) {
        if (!cardImageUrl1[0]) {
            document.getElementById("error_message").innerHTML += "<br />";
        }
        document.getElementById("error_message").innerHTML += cardImageUrl2[1];
    }

    // Draw the thumbnail if both cards are valid
    if (cardImageUrl1[0] && cardImageUrl2[0]) {
        await drawFirstCommander(canvas, ctx, cardImageUrl1[1]);
        await drawSecondCommander(canvas, ctx, cardImageUrl2[1]);
        await drawText(canvas, ctx, player1, player2, matchType, season);
    }
}

async function drawFirstCommander(canvas, ctx, cardImageUrl) {
    
    let img = new Image();
    img.src = cardImageUrl;

    // Create a separate canvas for the mask
    let maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    
    let maskCtx = maskCanvas.getContext("2d");
    
    // Create gradient 
    let grd = maskCtx.createLinearGradient(0, 0, 728, 0);
    grd.addColorStop(0, "#FFFFFF");
    grd.addColorStop(0.78, "#FFFFFF");
    grd.addColorStop(1, "#00000000");
    maskCtx.fillStyle = grd;
    maskCtx.fillRect(0, 0, 728, 720);
    ctx.drawImage(maskCanvas, 0, 0);
       
    
    // Load image, then draw it on the canvas
    await img.decode().then(() => {
        let vRatio = canvas.height / img.height;
        ctx.save();
        ctx.globalCompositeOperation = "source-atop";
        ctx.drawImage(img, 1280/4 - img.width * vRatio/2, 0, img.width * vRatio, img.height * vRatio);
        ctx.restore();

        // Reset composite operation
        ctx.globalCompositeOperation = "source-over";
    });
}

async function drawSecondCommander(canvas, ctx, cardImageUrl) {
    
    let img = new Image();
    img.src = cardImageUrl;
    
    // Load image, then draw it on the canvas
    await img.decode().then(() => {
        let vRatio = canvas.height / img.height;
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(img, 1280*3/4 - img.width * vRatio/2, 0, img.width * vRatio, img.height * vRatio);
        ctx.restore();
    });

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over";
}

async function drawText(canvas, ctx, player1, player2, matchType, season) {
    
    let smallCaps = new FontFace("Beleren Smallcaps", "url(../assets/fonts/Beleren2016SmallCaps-Bold.ttf)");
    
    // Wait for the font to load
    await smallCaps.load();

    // Add the font to the document
    document.fonts.add(smallCaps);
    // Add gradient background to bottom
    let grd = ctx.createLinearGradient(0, 400, 0, 720);
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
    let fontsize1 = 90;
    let fontface = "Beleren Smallcaps";
    do {
        fontsize1--;
        ctx.font = fontsize1 + "px " + fontface;
    } while (ctx.measureText(player1).width > 500);  
    ctx.fillText(player1, 300, 575);
    let fontsize2 = 90;
    do {
        fontsize2--;
        ctx.font = fontsize2 + "px " + fontface;
    } while (ctx.measureText(player2).width > 500);  
    ctx.fillText(player2, 980, 575);
    ctx.font = "90px Beleren Smallcaps";
    ctx.fillText("vs", 640, 575);

    // Add Brawl Hub logo
    let logo = new Image();
    logo.src = "../assets/images/logo.png";
    await logo.decode();
    ctx.drawImage(logo, 1280/2 - logo.width/4, 64, logo.width/2, logo.height/2);

    let bold = new FontFace("Beleren Bold", "url(../assets/fonts/Beleren2016-Bold.ttf)");
    await bold.load();
    document.fonts.add(bold);
    // Add match type text with drop shadow
    ctx.font = "90px Beleren Bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "black";
    ctx.fillText(matchType, 640, 348 + 4);
    ctx.fillStyle = "white";
    ctx.fillText(matchType, 640, 348);


    // Add season text with drop shadow
    ctx.font = "60px Beleren Bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "black";
    ctx.fillText(season, 640, 450 + 4);
    ctx.fillStyle = "white";
    ctx.fillText(season, 640, 450);
}

async function fetchCardImageUrl(cardName) {
    let response = await fetch("https://api.scryfall.com/cards/named?fuzzy=" + cardName);
    let obj = await response.json();
    
    // If card not found, return the error message
    if (obj.hasOwnProperty("code") && obj.code == "not_found") {
        return [false, obj.details];
    }
    
    // return the URL to the card artwork
    return [true, (obj.hasOwnProperty("card_faces")) ? obj.card_faces[0].image_uris.art_crop : obj.image_uris.art_crop];
}
