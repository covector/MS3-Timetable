var ID = [];
ID["CMHS"] = 4250521170;
ID["COP"] = 7442953999;
ID["KLY"] = 3917322830;
ID["YPWP"] = 7578549019;
ID["LKY"] = 8046325344;
ID["TSM"] = 9580105163;
ID["FCW"] = 7243497346;
ID["KYT"] = 3470015685;
ID["KKH"] = 4363847326;
ID["KWM"] = 9707531036;
ID["LWC"] = 7153001742;
ID["LW"] = 9220387241;
ID["LTC"] = 8634365482;
ID["LYKY"] = 6630791936;
ID["LGW"] = 3651136599;
ID["LCH"] = 7355556244;
ID["LKB"] = 2815409930;
ID["LSH"] = 6941560994;
ID["NWY"] = 3524716921;
ID["TKF"] = 4249805562;
ID["TK"] = 2233127322;
ID["WCK"] = 9544379197;
ID["WCF"] = 2558829501; 
ID["YKN"] = 2163878514;
ID["YTF"] = 2816872757;
ID["CKW"] = 6873689333;
ID["NDN"] = 3263052676;
ID["YHY"] = 5720086942;
ID["HWL"] = 5168805269;
ID["TWY"] = 4287727803;
ID["NTM"] = 7823785789;

var Teacher = ["CMHS", "COP", "KLY", "YPWP", "LKY", "TSM", "FCW", "KYT", "KKH", "KWM", "LWC", "LW", "LTC", "LYKY", "LGW", "LCH", "LKB", "NWY", "TKF", "TK", "WCK", "WCF", "YKN", "YTF", "CKW", "NDN", "YHY", "HWL", "TWY", "NTM"]

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
    }
}