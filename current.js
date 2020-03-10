var notify = [];
var selection = [];
selection["Class"] = 0;
selection["Math"] = 0;
selection["A"] = 0;
selection["B"] = 0;
selection["C"] = 0;
var studentInfo = [];
window.onload = function() {
    let studentCookie = document.cookie.split("; ");
    for (let i = 0; i < studentCookie.length; i++){
        let key = studentCookie[i].split("=")[0];
        if (key != "Class" & key != "Math" & key != "A" & key != "B" & key != "C"){
            displayExtra(studentCookie[i]);
        }
    }
    if (infoEnough(studentCookie)){
        document.getElementById("Ask").style.display = "none";
        for (let i = 0; i < studentCookie.length; i++){
            let electives = studentCookie[i].split("=")
            studentInfo[electives[0]] = electives[1];
        }
        UpdateInfo();
        Refresh();
    }
    else{
        if (this.Notification.permission == "granted") { setUpNotify(); }
    }
    if (Notification.permission != "granted"){
        Notification.requestPermission().then((permission) => {
                setUpNotify();
            });
    }
}

ProminLesson = function(hr, min, day, sec){
    let x = hr * 3600 + min * 60 + sec;
    let tt = TimeTable[studentInfo["Class"]][day]
    return [35400 - x, 35700 - x, tt[2] , 39000 - x, 39300 - x, tt[3], 46200 - x, 46500 - x, tt[4], 49800 - x, 50100 - x, tt[5]];
}

ExtraNotif = function(hr, min, day, sec){
    let x = hr * 3600 + min * 60 + sec;
    let list = [];
    for(let i = 0; i < ExtraLessons.length; i++){
        let lesson = ExtraLessons[i];
        let start = lesson[1] * 3600 + lesson[2] * 60;
        if (day == lesson[5]){
            list.push(start - x - 600);
            list.push(start - x - 300);
            let lessonName = lesson[0];
            switch (lessonName){
                case studentInfo["A"]:
                    lessonName = "A";
                    break;
                case studentInfo["B"]:
                    lessonName = "B";
                    break;
                case studentInfo["C"]:
                    lessonName = "C";
                    break;
            }
            list.push(lessonName);
        }
    }
    return list;
}

setUpNotify = function(){
    for (let i = 0; i < notify.length; i++){
        clearTimeout(notify[i]);
    }
    notify = [];

    let now = new Date();
    let sec = now.getSeconds();
    let min = now.getMinutes();
    let hr = now.getHours();
    let weekday = now.getDay() - 1;
    if (weekday != -1 & weekday != 5){
        let notList1 = ProminLesson(hr, min, weekday, sec);
        let notList2 = ExtraNotif(hr, min, weekday, sec);
        for (let i = 0; i < notList1.length / 3; i++){
            Notify(notList1[3*i], notList1[3*i + 2]);
            Notify(notList1[3*i + 1], notList1[3*i + 2], "very ");
        }
        for (let i = 0; i < notList2.length / 3; i++){
            Notify(notList2[3*i], notList2[3*i + 2]);
            Notify(notList2[3*i + 1], notList2[3*i + 2], "very ");
        }
    }
}

Notify = function(time, subject, adj = ""){
    let lessonSub = subject;
    if (subject == "A" | subject == "B" | subject == "C"){
        lessonSub = studentInfo[subject];
    }
    if (time > 0){
        notify.push(setTimeout(function(){ new Notification("You are having "+lessonSub+" lesson "+adj+"soon.\nID: "+ID[Teacher(subject)]); notify = notify.slice(1); }, time * 1000));
    }
}

infoEnough = function(cookie){
    let logicArray = []
    logicArray["Class"] = false;
    logicArray["Math"] = false;
    logicArray["A"] = false;
    logicArray["B"] = false;
    logicArray["C"] = false;
    for (let i = 0; i < cookie.length; i++){
        let index = cookie[i].split("=")[0];
        if (logicArray[index] != null){
            logicArray[index] = true;
        }
    }
    if (logicArray["Class"] & logicArray["Math"] & logicArray["A"] & logicArray["B"] & logicArray["C"]){
        return true;
    }
    return false;
}

UpdateInfo = function(){
    document.getElementById("UrClass").textContent = studentInfo["Class"];
    document.getElementById("UrMath").textContent = studentInfo["Math"];
    document.getElementById("UrA").textContent = studentInfo["A"];
    document.getElementById("UrB").textContent = studentInfo["B"];
    document.getElementById("UrC").textContent = studentInfo["C"];
    document.getElementsByClassName("MS3V")[0].style.display = "none";
    document.getElementsByClassName("MS3I")[0].style.display = "none";
    document.getElementsByClassName("MS3S")[0].style.display = "none";
    document.getElementsByClassName(studentInfo["Class"])[0].style.display = "inline";
    document.getElementById("AChoice").textContent = studentInfo["A"];
    document.getElementById("BChoice").textContent = studentInfo["B"];
    document.getElementById("CChoice").textContent = studentInfo["C"];
}

selClass = function(key, val){
    studentInfo[key] = val;
    document.cookie = key+"="+val+"; expires=20 Apr 2020 00:00:00 UTC";
    if (studentInfo["Class"] == "MS3S") {
        studentInfo["Math"] = "YHY";
        document.cookie = "Math=YHY; expires=20 Apr 2020 00:00:00 UTC";
        document.getElementById("Math").style.display = "none";
    }
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
    if (weekday == -1 | weekday == 5) { Display(-1); }
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
            else { Display(currLessonNo); }
        }
    }
    if (this.Notification.permission == "granted") { setUpNotify(); }
}

ExtraLesson = function(dy, hr, min){
    let x = hr + min / 60;
    for(let i = 0; i < ExtraLessons.length; i++){
        let lesson = ExtraLessons[i];
        let start = lesson[1] + lesson[2] / 60;
        let end = lesson[3] + lesson[4] / 60;
        if (dy == lesson[5] & x >= (start - 0.5) & x < (start + end)/2){
            let Eteacher;
            switch(lesson[0]){
                case studentInfo["A"]: 
                    Eteacher = Teacher("A");
                    break;
                case studentInfo["B"]: 
                    Eteacher = Teacher("B");
                    break;
                case studentInfo["C"]: 
                    Eteacher = Teacher("C");
                    break;
                default:
                    Eteacher = Teacher(lesson[0]);
                    break;
            }
            Display(lesson[0], Eteacher, ID[Eteacher]);
            return true;
        }
    }
    return false;
}

Display = function(lesson = null, teacher = null, id = null){
    lessonText = document.getElementById("Lesson");
    lessonID = document.getElementById("ID");
    lessonLink = document.getElementById("Link");
    lessonLinkWord = document.getElementById("LinkWord");
    if (id == null){
        if (lesson == -1){
            lessonText.textContent = "No Lesson";
            lessonText.style.color = "rgb(100, 100, 100)";
        }
        else{
            lessonText.textContent = "Lunch Time";
            lessonText.style.color = "rgb(100, 200, 100)";
        }
        lessonLink.textContent = "";
        lessonLinkWord.textContent = "";
        lessonID.value = "";
    }
    else{
        lessonText.textContent = "Lesson now: "+displayLesson(lesson, teacher);
        lessonText.style.color = "white";
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
    if (x < 12.5) { return -2; }
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
                case "MS3S":
                    return "CKW";
            }
            break;
        case "Eng":
            switch(studentInfo["Class"]){
                case "MS3V":
                    return "YTF";
                case "MS3I":
                    return "LW";
                case "MS3S":
                    return "NDN";
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
                case "MS3S":
                    return "COP";
            }
        break;
        case "HRT":
            switch(studentInfo["Class"]){
                case "MS3V":
                    return "TK";
                case "MS3I":
                    return "WCF";
                case "MS3S":
                    return "CKW";
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
        let cookie = document.cookie.split("; ");
        for(let i = 0; i < cookie.length; i++){
            let id = cookie[i].split("=")[0];
            document.cookie = id+"=Delete; expires=11 Sep 2001 13:46:00 UTC";
            if (id != "Class" & id != "Math" & id != "A" & id != "B" & id != "C"){
                deleteLesson(id);
            }
        }
        document.getElementsByClassName("Extra")[0].style.height = "400px";
        document.getElementById("Subject").textContent = "";
        document.getElementById("Time").textContent = "00:00 - 00:00";
        document.getElementById("Day").textContent = "(Mon)";
        Extratime = [0, 0, 0, 0, 0];

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
    ID["YTF"] = 2816872757;
    ID["CKW"] = 6873689333;
    ID["NDN"] = 3263052676;
    ID["YHY"] = 5720086942;

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

var S_1 = ["A", "Math", "B", "Eng", "A", "Math", "A", "Math"]
var S_2 = ["B", "TOK", "A", "Math", "B", "TOK", "Eng", "Chi"]
var S_3 = ["B", "C", "Eng", "Chi", "B", "C", "Chi", "A"]
var S_4 = ["Math", "C", "Chi", "A", "Math", "C", "C", "Chi"]
var S_5 = ["Eng", "HRT", "C", "Chi", "Eng", "HRT", "B", "Eng"]

TimeTable = []
TimeTable["MS3V"] = [V_1, V_2, V_3, V_4, V_5];
TimeTable["MS3I"] = [I_1, I_2, I_3, I_4, I_5];
TimeTable["MS3S"] = [S_1, S_2, S_3, S_4, S_5];

