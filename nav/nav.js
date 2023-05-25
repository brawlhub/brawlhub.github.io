// On page load, transclude header and footer
fetch("/nav/header.html")
    .then(response => response.text())
    .then(data => {
        document.querySelector("body").innerHTML = data + document.querySelector("body").innerHTML;
    });
fetch("/nav/footer.html")
    .then(response => response.text())
    .then(data => {
        document.querySelector("body").innerHTML += data;
    });
