var prevScrollPos = window.pageYOffset;
var threshold = 110;
window.onscroll = function() {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollPos < currentScrollPos & currentScrollPos > threshold) {
        document.getElementById("topBar").style.top = "-80px";
    }else{
        document.getElementById("topBar").style.top = "0px";
    }
    prevScrollPos = window.pageYOffset;
}