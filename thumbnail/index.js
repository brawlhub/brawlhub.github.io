// Get the canvas element by id
var canvas = document.getElementById("thumbnail");

// Get the 2D drawing context
var ctx = canvas.getContext("2d");

// Set the fill style to red
ctx.fillStyle = "red";

// Draw a rectangle at (10, 10) with width 100 and height 50
// ctx.fillRect(10, 10, 100, 50);

    
function loadDoc() {
    // Get the canvas element by id
    var canvas = document.getElementById("thumbnail");

    // Get the 2D drawing context
    var ctx = canvas.getContext("2d");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var img = new Image();
            var txt = this.responseText;
            var obj = JSON.parse(txt);
            img.src = obj.image_uris.art_crop;
            var vRatio = canvas.height / img.height;
            // document.getElementById("demo").innerHTML="<img src=" + obj.image_uris.art_crop + ">";
            ctx.drawImage(img, -img.width * vRatio + 1280/2, 0, img.width * vRatio, img.height * vRatio);
            console.log(img.height * vRatio);
            console.log(img.width * vRatio);
        }
    };

    card1 = encodeURIComponent(document.getElementById('card1').value);

    xhttp.open("GET", "https://api.scryfall.com/cards/named?fuzzy=" + card1, true);
    xhttp.send();
  }