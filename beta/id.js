var Teacher = ["CMHS", "COP", "KLY", "YPWP", "LKY", "TSM", "FCW", "KYT", "KKH", "KWM", "LWC", "LW", "LTC", "LYKY", "LGW", "LCH", "LKB", "NWY", "TKF", "TK", "WCK", "WCF", "YKN", "YTF", "CKW", "NDN", "YHY", "HWL", "TWY", "NTM", "Assembly"]

CopyID = function(id){
    let copyText = document.getElementById(id);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

window.onload = function() {
    for (let i=0; i<Teacher.length; i++){
        let item = Teacher[i];
        before = document.getElementById("before");
        
        let bgcolor = "odd";
        if (i%2 == 0){
            bgcolor = "even";
        }

        let divContain = document.createElement("DIV");
        divContain.classList.add(bgcolor);
        divContain.classList.add("item");

        let name = document.createElement("DIV");
        name.textContent = item;

        let idNo = document.createElement("INPUT");
        idNo.id = item;
        idNo.value = ID[item];
        idNo.readOnly = true;

        let button = document.createElement("DIV");
        button.addEventListener("click", function(){CopyID(item)});
        button.classList.add("button");
        button.textContent = "Copy";
        
        divContain.append(name);
        divContain.append(idNo);
        divContain.append(button);
        document.getElementById("list").insertBefore(divContain, before);

        updateTopBar();
    }
}

//hack
var newFeature = false;