var notify = [];
var selection = [];
var autore = false;
var nextLessonChange;
var flere = "FLE";
var newFeature = true;
selection["Class"] = 0;
selection["Math"] = 0;
selection["A"] = 0;
selection["B"] = 0;
selection["C"] = 0;
var studentInfo = [];
window.onload = function() {
    let studentCookie = document.cookie.split("; ");
    let firstTime = true;
    
    for (let i = 0; i < studentCookie.length; i++){
        let key = studentCookie[i].split("=")[0];

        if (key != "Class" & key != "Math" & key != "A" & key != "B" & key != "C" & key != "Auto" & key != "New"){
            displayExtra(studentCookie[i]);
        }
        if (key == "Auto"){
            firstTime = false;
            if (studentCookie[i].split("=")[1] == "true"){
                AutoRefreshToggle();
            }
        }
        if (key == "New"){
            document.getElementById("new").style.display = "none";
            newFeature = false;
        }
    }
    if (firstTime){
        document.cookie = "Auto=false; expires=1 Jan 2022 00:00:00 UTC";
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
    navigator.permissions.query({
        name: 'clipboard-write'
    });
    updateTopBar();
}

ProminLesson = function(hr, min, day, sec){
    let x = hr * 3600 + min * 60 + sec;
    let tt = TimeTable[studentInfo["Class"]][day];
    let list = prominLessonTime(tt, x);
    return [tt, list];
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
        for (let i = 0; i < notList1[1].length; i++){
            for (let j = 0; j < notList1[1][i].length; j++){
                Notify(notList1[1][i][j], notList1[0][i]);
            }
        }
        for (let i = 0; i < notList2[1].length; i++){
            for (let j = 0; j < notList2[1][i].length; j++){
                Notify(notList2[1][i][j], notList2[0][i]);
            }
        }
    }
}

Notify = function(time, subject, word = "You are having {} lesson soon"){
    let lessonSub = subject;
    if (subject == "Bmod"){ subject = "B"; }
    if (subject == "Amod"){ subject = "A"; }
    if (subject == "A" | subject == "B" | subject == "C"){
        lessonSub = studentInfo[subject];
    }
    if (subject == "FleRe"){ lessonSub = flere; }
    if (time > 0){
        notify.push(setTimeout(function(){ Refresh(); new Notification(word.replace("{}", lessonSub)+".\nID: "+ID[Teacher(subject)], { body: "Click to copy ID", icon: "images/qualityThumbnail.png" })
        .onclick = function() {
            Copy();
        };}, time * 1000));
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
    document.getElementsByClassName("MS4V")[0].style.display = "none";
    document.getElementsByClassName("MS4I")[0].style.display = "none";
    document.getElementsByClassName("MS4S")[0].style.display = "none";
    document.getElementsByClassName(studentInfo["Class"])[0].style.display = "inline";
    document.getElementById("AChoice").textContent = studentInfo["A"];
    document.getElementById("BChoice").textContent = studentInfo["B"];
    document.getElementById("CChoice").textContent = studentInfo["C"];
}

selClass = function(key, val){
    studentInfo[key] = val;
    document.cookie = key+"="+val+"; expires=1 Jan 2022 00:00:00 UTC";
    if (studentInfo["Class"] == "MS4S") {
        studentInfo["Math"] = "YHY";
        document.cookie = "Math=YHY; expires=1 Jan 2022 00:00:00 UTC";
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
            if (todayLesson[currLessonNo] == "None"){ currLessonNo = -1; }
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
    if (lesson == "FleRe"){
        document.getElementById("flere").style.display = "block";
    }
    else{
        document.getElementById("flere").style.display = "none";
    }
}

displayLesson = function(lesson, teacher){
    if (lesson == "FleRe"){
        lesson = flere;
    }
    if (lesson == "Bmod"){ lesson = "B"; }
    if (lesson == "Amod"){ lesson = "A"; }
    if (lesson == "A" | lesson == "B" | lesson == "C"){
        return studentInfo[lesson]+" ("+teacher+")";
    }
    else { return lesson+" ("+teacher+")"; }
}

Teacher = function(lesson){
    switch(lesson){
        case "Chi":
            switch(studentInfo["Class"]){
                case "MS4V":
                    return "TK";
                case "MS4I":
                    return "WCF";
                case "MS4S":
                    return "CKW";
            }
            break;
        case "Eng":
            switch(studentInfo["Class"]){
                case "MS4V":
                    return "YTF";
                case "MS4I":
                    return "LW";
                case "MS4S":
                    return "NDN";
            }
            break;
        case "Math":
            return studentInfo["Math"];
            break;
        case "TOK":
            switch(studentInfo["Class"]){
                case "MS4V":
                    return "KLY";
                case "MS4I":
                    return "TSM";
                case "MS4S":
                    return "COP";
            }
            break;
        case "HRT":
            switch(studentInfo["Class"]){
                case "MS4V":
                    return "TK";
                case "MS4I":
                    return "WCF";
                case "MS4S":
                    return "NDN";
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
        case "Amod":
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
                    return "YPWP";
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
        case "Bmod":
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
                    return "YPWP";
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
                    return "LCH";
                case "VA":
                    return "NWY";
            }
            break;
        case "PE":
            return "NTM";
            break;
        case "FleRe":
            switch(flere){
                case "FLE":
                    return "HWL";
                case "RE":
                    return "TWY";
            }
            break;
        case "Assembly":
            return "Assembly";
        case "None":
            return "";
            break;
        default:
            alert("an error has occured, please reload the page");
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
            if (id != "Auto" & id != "New"){
                document.cookie = id+"=Delete; expires=11 Sep 2001 13:46:00 UTC";
                if (id != "Class" & id != "Math" & id != "A" & id != "B" & id != "C" & id != "New"){
                    deleteLesson(id);
                }
            }
        }
        let autoBut = document.getElementById("Auto");
        autoBut.style.backgroundColor = "rgb(20, 20, 20)";
        autoBut.style.borderStyle = "none";
        document.cookie = "Auto=false; expires=1 Jan 2022 00:00:00 UTC"
        autore = false;
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

TimeTable = []
TimeTable["MS4V"] = [V_1, V_2, V_3, V_4, V_5];
TimeTable["MS4I"] = [I_1, I_2, I_3, I_4, I_5];
TimeTable["MS4S"] = [S_1, S_2, S_3, S_4, S_5];

AutoRefreshToggle = function(){
    let autoBut = document.getElementById("Auto");
    if (autore){
        autoBut.style.backgroundColor = "rgb(20, 20, 20)";
        autoBut.style.borderStyle = "none";
        document.cookie = "Auto=false; expires=1 Jan 2022 00:00:00 UTC";
        autore = false;
    }
    else{
        autoBut.style.backgroundColor = "rgb(116, 212, 121)";
        autoBut.style.borderStyle = "solid";
        document.cookie = "Auto=true; expires=1 Jan 2022 00:00:00 UTC";
        autore = true;
        ScheduleNextRefresh();
    }
}

ScheduleNextRefresh = function(lessonNo){
    let today = new Date();
    let now = today.getHours() * 3600 + today.getMinutes() * 60 + today.getSeconds();
    let lessonTime = refreshLessonTime();
    if (lessonNo == null){
        for (let i = 0; i < 10; i++){
            let delta = lessonTime[i] - now;
            if (delta > 0){
                nextLessonChange = setTimeout(function(){
                    Refresh();
                    ScheduleNextRefresh(i);
                }, 1000 * delta);
                break;
            }
        }
    }
    else{
        if (lessonNo < lessonTime.length-1){
            let delta = lessonTime[lessonNo + 1] - now;
            if (delta < 0) { alert("Some error has occured, please reload page"); }
            else{
                nextLessonChange = setTimeout(function(){
                    Refresh();
                    ScheduleNextRefresh(lessonNo + 1);
                }, 1000 * delta);
            }
        }
    }
}

flereChange = function(to){
    if (to=="FLE"){
        document.getElementById("fle").style.color = "rgb(110, 238, 132)";
        document.getElementById("re").style.color = "white";
        flere = "FLE";
    }
    if (to=="RE"){
        document.getElementById("re").style.color = "rgb(110, 238, 132)";
        document.getElementById("fle").style.color = "white";
        flere = "RE";
    }
    Refresh();
}