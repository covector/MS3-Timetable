var dropped = false;
var Extratime = [0, 0, 0, 0, 0];
var ExtraLessons = []
dropDown = function(){
    document.addEventListener("click", cancelDropDown);
    let list = document.getElementById("dropDown");
    list.style.display = "inline";
}
cancelDropDown = function(elmt){
    if (dropped){
    document.removeEventListener("click", cancelDropDown);
    let list = document.getElementById("dropDown");
    list.style.display = "none";
    dropped = false;
    }
    else{ dropped = true; }
}
deleteLesson = function(id){
    let lesson = document.getElementById(id);
    let delID = lesson.children[1].textContent+lesson.children[2].textContent;
    document.cookie = delID+"=Delete; expires=11 Sep 2001 13:46:00 UTC";
    lesson.remove();
    let box = document.getElementsByClassName("Extra")[0];
    box.style.height = (400 + 60 * extraLessonCount()).toString()+"px";
    for (let i = 0; i < ExtraLessons.length; i++){
        if (delID == fillZ(ExtraLessons[i][1])+":"+fillZ(ExtraLessons[i][2])+" - "+fillZ(ExtraLessons[i][3])+":"+fillZ(ExtraLessons[i][4])+"("+no2Dy(ExtraLessons[i][5])+")"){
            ExtraLessons.splice(i, 1);
            break;
        }
    }
}
addLesson = function(){
    let subject = document.getElementById("Subject");
    let before = document.getElementsByClassName("EmptyExtra")[0];
    let weekday = document.getElementById("Day");
    let box = document.getElementsByClassName("Extra")[0];
    let customID = fillZ(Extratime[0])+":"+fillZ(Extratime[1])+" - "+fillZ(Extratime[2])+":"+fillZ(Extratime[3])+"("+no2Dy(Extratime[4])+")";
    if (inputValidation()){
        let divContain = document.createElement("DIV");
        divContain.id = customID;
        divContain.classList.add("AddedExtra");
        
        let newSubject = document.createElement("SPAN");
        newSubject.textContent = subject.textContent;
        newSubject.classList.add("Subject");

        let newTime = document.createElement("SPAN");
        newTime.textContent = fillZ(Extratime[0])+":"+fillZ(Extratime[1])+" - "+fillZ(Extratime[2])+":"+fillZ(Extratime[3]);
        newTime.classList.add("Time");

        let newDay = document.createElement("SPAN");
        newDay.textContent = weekday.textContent;
        newDay.classList.add(no2Dy(Extratime[4]));

        let newButton = document.createElement("BUTTON");
        newButton.textContent = "-";
        newButton.addEventListener("click", function(){deleteLesson(customID)});

        divContain.appendChild(newSubject);
        divContain.appendChild(newTime);
        divContain.appendChild(newDay);
        divContain.appendChild(newButton);
        document.getElementsByClassName("Extra")[0].insertBefore(divContain, before)

        ExtraLessons.push([newSubject.textContent, Extratime[0], Extratime[1], Extratime[2], Extratime[3], Extratime[4]]);
        document.cookie = customID+"="+newSubject.textContent+"; expires=20 Apr 2020 00:00:00 UTC";

        subject.textContent = "";
        Extratime = [0, 0, 0, 0, 0];
        document.getElementById("Time").textContent = "00:00 - 00:00";
        document.getElementById("Day")
        weekday.textContent = "(Mon)"
        weekday.className = "";
        weekday.classList.add("Mon");

        box.style.height = (400 + 60 * extraLessonCount()).toString()+"px";
    }
}

displayExtra = function(cookie){
    let subject = cookie.substring(19);
    let time = cookie.substring(0, 13);
    let before = document.getElementsByClassName("EmptyExtra")[0];
    let weekday = cookie.substring(13, 18);
    let box = document.getElementsByClassName("Extra")[0];
    let customID = cookie.substring(0, 18);

    let divContain = document.createElement("DIV");
    divContain.id = customID;
    divContain.classList.add("AddedExtra");
    
    let newSubject = document.createElement("SPAN");
    newSubject.textContent = subject;
    newSubject.classList.add("Subject");

    let newTime = document.createElement("SPAN");
    newTime.textContent = time;
    newTime.classList.add("Time");

    let newDay = document.createElement("SPAN");
    newDay.textContent = weekday;
    newDay.classList.add(no2Dy(Extratime[4]));

    let newButton = document.createElement("BUTTON");
    newButton.textContent = "-";
    newButton.addEventListener("click", function(){deleteLesson(customID)});

    divContain.appendChild(newSubject);
    divContain.appendChild(newTime);
    divContain.appendChild(newDay);
    divContain.appendChild(newButton);
    document.getElementsByClassName("Extra")[0].insertBefore(divContain, before)

    let startTime = cookie.substring(0, 5).split(":");
    let endTime = cookie.substring(8, 13).split(":");
    ExtraLessons.push([subject, parseInt(startTime[0]), parseInt(startTime[1]), parseInt(endTime[0]), parseInt(endTime[1]), inverseNo2Dy(weekday)]);

    box.style.height = (400 + 60 * extraLessonCount()).toString()+"px";
}

changeLesson = function(subject, electives = false){
    if (electives){
        document.getElementById("Subject").textContent = studentInfo[subject];  
    }
    else{
        document.getElementById("Subject").textContent = subject;  
    }
}
changeTime = function(end, min, delta){
    let time = document.getElementById("Time");
    if (!event.shiftKey & min ==1){ delta *= 30; }
    if (Extratime[2 * end + 1] + delta < 0) { Extratime[2 * end] = modTime(Extratime[2 * end] - 1, 0); }
    if (Extratime[2 * end + 1] + delta >= 60) { Extratime[2 * end] = modTime(Extratime[2 * end] + 1, 0); }
    Extratime[2 * end + min] = modTime(Extratime[2 * end + min] + delta, min);
    time.textContent = fillZ(Extratime[0])+":"+fillZ(Extratime[1])+" - "+fillZ(Extratime[2])+":"+fillZ(Extratime[3]);
}
changeDay = function(delta){
    let day = document.getElementById("Day");
    day.className = "";
    Extratime[4] = modTime(Extratime[4] + delta, -1);
    day.textContent = "("+no2Dy(Extratime[4])+")";
    day.classList.add(no2Dy(Extratime[4]));
}
fillZ = function(x) {
    if (x < 10) {
        return "0"+x;
    }
    return x;
}
modTime = function(x, min){
    if (min == 0) {
        if (x < 0){
            x += 24;
        }
        return x % 24;
    }
    if (min == 1) {
        if (x < 0){
            x += 60;
        }
        return x % 60;
    }
    if (min == -1){
        if (x < 0){
            x += 5;
        }
        return x % 5; 
    }
}
no2Dy = function(x){
    let weekday = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    return weekday[x];
}
extraLessonCount = function(){
    return document.cookie.split("; ").length - 5;
}
inputValidation = function(){
    if (document.getElementById("Subject").textContent == "") { return false; }
    if (Extratime[0] + Extratime[1] / 60 >= Extratime[2] + Extratime[3] / 60) { return false; }
    let key = document.getElementById("Time").textContent+document.getElementById("Day").textContent;
    let cookie = document.cookie.split("; ")
    for (let i = 0; i < cookie.length; i++){
        if (cookie[i].split("=")[0] == key){ return false; }
    }
    return true;
}
inverseNo2Dy = function(x){
    switch(x) {
        case "(Mon)":
            return 0;
        case "(Tue)":
            return 1;
        case "(Wed)":
            return 2;
        case "(Thu)":
            return 3;
        case "(Fri)":
            return 4;
    }
}