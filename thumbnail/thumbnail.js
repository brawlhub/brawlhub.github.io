// Get the canvas element by id
var canvas = document.getElementById("thumbnail");

// Get the 2D drawing context
var ctx = canvas.getContext("2d");

// Set the fill style to red
ctx.fillStyle = "red";

// Draw a rectangle at (10, 10) with width 100 and height 50
// ctx.fillRect(10, 10, 100, 50);

    
async function loadDoc() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    await drawFirstCommander();
    await drawSecondCommander();
    ctx.globalCompositeOperation = "source-over";

    var smallCaps = new FontFace("Beleren Smallcaps", "url(../assets/fonts/Beleren2016Smallcaps-Bold.ttf)");
    
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
    ctx.textBaseline = "top";
    ctx.fillText(document.getElementById('player1').value, 318, 551);
    ctx.fillText(document.getElementById('player2').value, 962, 551);
    ctx.fillText("vs", 640, 551);

    // Add Brawl Hub logo
    var logo = new Image();
    logo.src = "../assets/images/logo.png";
    await logo.decode();
    ctx.drawImage(logo, 1280/2 - logo.width/4, 64, logo.width/2, logo.height/2);

    var bold = new FontFace("Beleren Bold", "url(../assets/fonts/Beleren2016-Bold.ttf)");
    await bold.load();
    document.fonts.add(bold);
    // Add match type text
    ctx.font = "90px Beleren Bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(document.getElementById('matchType').value, 640, 348);

    // Add season text
    ctx.font = "60px Beleren Bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(document.getElementById('season').value, 640, 450);

  }

  async function drawFirstCommander() {
    // Get the canvas element by id
    var canvas = document.getElementById("thumbnail");

    // Get the 2D drawing context
    var ctx = canvas.getContext("2d");

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

    // Use fetch to make an HTTP request
    card1 = encodeURIComponent(document.getElementById('card1').value);
    let response = await fetch("https://api.scryfall.com/cards/named?fuzzy=" + card1);
    let obj = await response.json();
    let img = new Image();
    img.src = obj.image_uris.art_crop;
    var vRatio = canvas.height / img.height;

    // Wait for the image to load
    img.onload = async function() {
        ctx.save();
        await img.decode();
        ctx.globalCompositeOperation = "source-atop";
        ctx.drawImage(img, 1280/4 - img.width * vRatio/2, 0, img.width * vRatio, img.height * vRatio);
        ctx.restore();
    };

    ctx.globalCompositeOperation = "source-over";
}

async function drawSecondCommander() {
    // Get the canvas element by id
    var canvas = document.getElementById("thumbnail");

    // Get the 2D drawing context
    var ctx = canvas.getContext("2d");

    // Use fetch to make an HTTP request
    card2 = encodeURIComponent(document.getElementById('card2').value);
    let response = await fetch("https://api.scryfall.com/cards/named?fuzzy=" + card2);
    let obj = await response.json();
    let img = new Image();
    img.src = obj.image_uris.art_crop;
    var vRatio = canvas.height / img.height;

    // Wait for the image to load
    img.onload = async function() {
        await img.decode();
        ctx.save();
        // Draw the image on the canvas
        ctx.globalCompositeOperation = "destination-over";
        ctx.drawImage(img, 1280*3/4 - img.width * vRatio/2, 0, img.width * vRatio, img.height * vRatio);
        ctx.restore();
    };
}