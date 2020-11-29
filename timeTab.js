// All time is in hour
var earlyNotify = [6/60, 10/60, 15/60];
var earlyStart = 30/60;
var earlyRefresh = 20/60;

var V_1 = ["A", "C", "B", "Math", "HRT", "TOK", "Amod"];
var V_2 = ["A", "Chi", "B", "Eng", "C", "Math", "C"];
var V_3 = ["A", "B", "Eng", "Math", "TOK", "Chi", "Bmod"];
var V_4 = ["C", "B", "Chi", "Eng", "FleRe", "HRT", "Math"];
var V_5 = ["Chi", "A", "PE", "C", "Math", "Eng", "Assembly"];

var I_1 = ["A", "C", "B", "Math", "HRT", "Chi", "Amod"];
var I_2 = ["A", "Chi", "B", "Eng", "C", "Math", "C"];
var I_3 = ["A", "B", "PE", "Math", "Chi", "Eng", "Bmod"];
var I_4 = ["C", "B", "TOK", "Eng", "FleRe", "HRT", "Math"];
var I_5 = ["Chi", "A", "Eng", "C", "Math", "TOK", "Assembly"];

var S_1 = ["A", "C", "B", "Chi", "HRT", "Eng", "Amod"];
var S_2 = ["A", "Math", "B", "FleRe", "C", "TOK", "C"];
var S_3 = ["A", "B", "Eng", "Math", "PE", "Chi", "Bmod"];
var S_4 = ["C", "B", "Eng", "Math", "Chi", "HRT", "None"];
var S_5 = ["Eng", "A", "TOK", "C", "Chi", "Math", "Assembly"];

var lessonStart = [8+40/60, 9+25/60, 10+40/60, 11+25/60, 12+15/60, 13+30/60, 15.5, 16.5, 17.5];

var lunchTime = 5;

var endTime = 8;

function prominLessonTime(tt, x){
    let allLesson = [];
    for (let i = 0; i < tt.length; i++){
        if (tt[i]=="None") { continue; }
        let oneLesson = [];
        for (let j = 0; j < earlyNotify.length; j++){
            oneLesson.push(lessonStart[(i>=3)?i+1:i]*3600 - earlyNotify[j]*3600 - x);
        }
        allLesson.push(oneLesson)
    }
    return allLesson;
}

function ExtraNotif(hr, min, day, sec){
    let x = hr * 3600 + min * 60 + sec;
    let nameList = [];
    let allList = [];
    for(let i = 0; i < ExtraLessons.length; i++){
        let lesson = ExtraLessons[i];
        let start = lesson[1] * 3600 + lesson[2] * 60;
        if (day == lesson[5]){
            let oneList = [];
            for (let j = 0; j < earlyNotify.length; j++){
                oneList.push(start - x - earlyNotify[j]*3600);
            }

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
            nameList.push(lessonName);
            allList.push(oneList);
        }
    }
    return [nameList, allList];
}

function refreshLessonTime(){
    return lessonStart.map((x)=>{return x*3600-earlyRefresh*3600;});
}

function Mapping(hr, min){
    let x = hr + min / 60;
    for (let i = 0; i < lessonStart.length; i++){
        if (x < lessonStart[i] - earlyStart){
            if (i - 1 == lunchTime) { return -2; }
            return (i - 1 > lunchTime)? i - 2: i - 1;
        }
    }
    return -1;
}