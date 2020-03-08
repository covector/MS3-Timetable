var selection = [];
selection["Class"] = 0;
selection["Math"] = 0;
selection["A"] = 0;
selection["B"] = 0;
selection["C"] = 0;
var studentInfo = [];
window.onload = function() {
    var studentCookie = document.cookie.split("; ");
    if (studentCookie.length == 5){
        document.getElementById("Ask").style.display = "none";
        for (let i = 0; i < 5; i++){
            let electives = studentCookie[i].split("=")
            studentInfo[electives[0]] = electives[1];
        }
        UpdateInfo();
        Refresh();
    }
}

UpdateInfo = function(){
    document.getElementById("UrClass").textContent = studentInfo["Class"];
    document.getElementById("UrMath").textContent = studentInfo["Math"];
    document.getElementById("UrA").textContent = studentInfo["A"];
    document.getElementById("UrB").textContent = studentInfo["B"];
    document.getElementById("UrC").textContent = studentInfo["C"];
    document.getElementsByClassName("MS3V")[0].style.display = "none";
    document.getElementsByClassName("MS3I")[0].style.display = "none";
    document.getElementsByClassName(studentInfo["Class"])[0].style.display = "inline";
}

selClass = function(key, val){
    studentInfo[key] = val;
    document.cookie = key+"="+val+"; expires=20 Apr 2020 00:00:00 UTC";
    if (selection[key] == 0) {
        selection[key] = 1;
        let card = document.getElementById(key);
        card.style.animationPlayState = "running";
        if (key == "C") {
            UpdateInfo();
            Refresh();
            setTimeout(function(){
                document.getElementById("Ask").style.display = "none";
            }, 1000)
        }
        setTimeout(function(){ card.style.display = "none"; }, 1000);
    }
}

Refresh = function(){
    let now = new Date();
    let weekday = now.getDay() - 1;
    if (weekday == -1 | weekday == 5) { Display(); }
    else {
        let hr = now.getHours();
        let min = now.getMinutes();
        let extra = ExtraLesson(weekday, hr, min);
        if (!extra){
            let todayLesson = TimeTable[studentInfo["Class"]][weekday];
            let currLessonNo = Mapping(hr, min);
            if (currLessonNo >= 0) {
                let currLesson = todayLesson[currLessonNo];
                let currTeacher = Teacher(currLesson);
                let currID = ID[currTeacher];
                Display(currLesson, currTeacher, currID);
            }
            else { Display(); }
        }
    }

}

ExtraLesson = function(dy, hr, min){
    let x = hr + min / 60;
    if (dy == 2 & x >= 19.5 & x < 21 & studentInfo[B] == "Phy"){
        Display("Phy Extra", "LCH", ID[LCH]);
        return true;
    }
    return false;
}

Display = function(lesson = null, teacher = null, id = null){
    lessonText = document.getElementById("Lesson");
    lessonID = document.getElementById("ID");
    lessonLink = document.getElementById("Link");
    lessonLinkWord = document.getElementById("LinkWord");
    if (id == null){
        lessonText.textContent = "No Lesson now";
        lessonText.style.color = "rgb(100, 100, 100)";
        lessonLink.textContent = "";
        lessonLinkWord.textContent = "";
    }
    else{
        lessonText.textContent = "Lesson now: "+displayLesson(lesson, teacher);
        lessonID.value = id;
        lessonLink.textContent = "https://zoom.us/j/"+id;
        lessonLink.href = "https://zoom.us/j/"+id;
        lessonLinkWord.textContent = "Link: ";
    }
}

displayLesson = function(lesson, teacher){
    if (lesson == "A" | lesson == "B" | lesson == "C"){
        return studentInfo[lesson]+" ("+teacher+")";
    }
    else { return lesson+" ("+teacher+")"; }
}

Mapping = function(hr, min){
    let x = hr + min / 60;
    if (x < 8){ return -1; }
    if (x < 9.25){ return 0; }
    if (x < 9.75){ return 1; }
    if (x < 10.5){ return 2; }
    if (x < 12){ return 3; }
    if (x < 13.5){ return 4; }
    if (x < 14.5){ return 5; }
    if (x < 15.25){ return 6; }
    if (x < 16){ return 7; }
    return -1;
}

Teacher = function(lesson){
    switch(lesson){
        case "Chi":
            switch(studentInfo["Class"]){
                case "MS3V":
                    return "TK";
                case "MS3I":
                    return "WCF";
            }
            break;
        case "Eng":
            switch(studentInfo["Class"]){
                case "MS3V":
                    return "YTF";
                case "MS3I":
                    return "LW";
            }
        break;
        case "Math":
            return studentInfo["Math"];
        break;
        case "TOK":
            switch(studentInfo["Class"]){
                case "MS3V":
                    return "KLY";
                case "MS3I":
                    return "TSM";
            }
        break;
        case "HRT":
            switch(studentInfo["Class"]){
                case "MS3V":
                    return "TK";
                case "MS3I":
                    return "WCF";
            }
        break;
        case "A":
            switch(studentInfo["A"]){
                case "Bio":
                    return "LWC";
                case "Chem":
                    return "WCK";
                case "Econ":
                    return "YKN";
                case "Geo":
                    return "LTC";
                case "Psy":
                    return "LGW";
            }
        break;
        case "B":
            switch(studentInfo["B"]){
                case "Bio":
                    return "LWC";
                case "Chem":
                    return "KWM";
                case "Econ":
                    return "YKN";
                case "Geo":
                    return "LTC";
                case "Phy":
                    return "LCH";
                case "Psy":
                    return "LGW";
            }
        break;
        case "C":
            switch(studentInfo["C"]){
                case "Bio":
                    return "LKB";
                case "Chem":
                    return "LYKY";
                case "CS":
                    return "FCW";
                case "Hist":
                    return "TKF";
                case "Phy":
                    return "LSH";
                case "VA":
                    return "NWY";
            }
        break;
        default:
            alert("an error has occured, please reload page");
    }
}

Copy = function(){
    let copyText = document.getElementById("ID");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

ClearCookie = function(){
    let decision = confirm("Are you sure you want to clear?");
    if (decision){
        document.cookie = "Class=Delete; expires=11 Sep 2001 13:46:00 UTC";
        document.cookie = "Math=Delete; expires=11 Sep 2001 13:46:00 UTC";
        document.cookie = "A=Delete; expires=11 Sep 2001 13:46:00 UTC";
        document.cookie = "B=Delete; expires=11 Sep 2001 13:46:00 UTC";
        document.cookie = "C=Delete; expires=11 Sep 2001 13:46:00 UTC";

    selection = [];
    selection["Class"] = 0;
    selection["Math"] = 0;
    selection["A"] = 0;
    selection["B"] = 0;
    selection["C"] = 0;
    studentInfo = [];
    document.getElementById("Ask").style.display = "block";
    document.getElementById("Class").style.display = "block";
    document.getElementById("Class").style.animationPlayState = "paused";
    document.getElementById("Math").style.display = "block";
    document.getElementById("Math").style.animationPlayState = "paused";
    document.getElementById("A").style.display = "block";
    document.getElementById("A").style.animationPlayState = "paused";
    document.getElementById("B").style.display = "block";
    document.getElementById("B").style.animationPlayState = "paused";
    document.getElementById("C").style.display = "block";
    document.getElementById("C").style.animationPlayState = "paused";
    }
}

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
    ID["YTF "] = 2816872757;

var V_1 = ["A", "Eng", "B", "Math", "A", "Eng", "A", "Eng"];
var V_2 = ["B", "TOK", "A", "Eng", "B", "TOK", "Chi", "Math"];
var V_3 = ["B", "C", "Chi", "Math", "B", "C", "Math", "A"];
var V_4 = ["Chi", "C", "Math", "A", "Chi", "C", "C", "Chi"];
var V_5 = ["HRT", "Eng", "C", "Chi", "HRT", "Eng", "B", "Math"];

var I_1 = ["A", "Eng", "B", "Math", "A", "Eng", "A", "Eng"];
var I_2 = ["B", "TOK", "A", "Eng", "B", "TOK", "Chi", "Math"];
var I_3 = ["B", "C", "Chi", "Math", "B", "C", "Math", "A"];
var I_4 = ["Chi", "C", "Math", "A", "Chi", "C", "C", "Chi"];
var I_5 = ["HRT", "Eng", "C", "Chi", "HRT", "Eng", "B", "Math"];

TimeTable = []
TimeTable["MS3V"] = [V_1, V_2, V_3, V_4, V_5];
TimeTable["MS3I"] = [I_1, I_2, I_3, I_4, I_5];

