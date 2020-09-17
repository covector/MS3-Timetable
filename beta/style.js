var prevScrollPos = window.pageYOffset;
var threshold = 110;
window.onscroll = function() {
    let currentScrollPos = window.pageYOffset;
    if (prevScrollPos < currentScrollPos & currentScrollPos > threshold) {
        document.getElementById("topBar").style.top = "-80px";
    }else{
        let init = "0px";
        if (newFeature){ init = "30px"; }
        document.getElementById("topBar").style.top = init;
    }
    prevScrollPos = window.pageYOffset;
}

closeNew = function(){
    document.cookie = "New=false; expires=1 Jan 2022 00:00:00 UTC";
    document.getElementById("new").style.display = "none";
    newFeature = false;
    updateTopBar();
}

updateTopBar = function(){
    let init = "0px";
    if (newFeature){ init = "30px"; }
    document.getElementById("topBar").style.top = init;
}