//(function() {
let isRendered=false;
    //Button for generating report
    function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        let  controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to generate report';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Generate Report';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
            window.open("./views/report.html");
            // alert("Will generate report soon");
        });

    }



    //FIREBASE CONFIG FILE

function getConfig()
{
    const config = {
        apiKey: "AIzaSyDFuGSxPHb7yApVqy3AWTZVJcYL48gQz7U",
        authDomain: "capestone-a8a58.firebaseapp.com",
        databaseURL: "https://capestone-a8a58.firebaseio.com",
        projectId: "capestone-a8a58",
        storageBucket: "capestone-a8a58.appspot.com",
        messagingSenderId: "705085920910"
    };
    return config;
}


firebase.initializeApp(getConfig());






    //location.on("value",snap=> console.log(snap.val()));


    function initMap(){
        let options={
            zoom:18,
            center:{lat:-33.957567, lng:18.460152},
            mapTypeId: 'hybrid',
            maxZoom:20,
            minZoom:18

        };

        let map = new google.maps.Map(document.getElementById('map'),options);

        //add marker
        let marker = new google.maps.Marker({
            position:{lat:-33.9577,lng:18.4612}
        });






        let areas = firebase.database().ref('areas').orderByKey();
        let polys ={};

        areas.on('value',function(snap) {
            // console.log(Object.values(snap.val())[0]["coordinates"]);
            let objArray = Object.values(snap.val());
//console.log(objArray);
            if(!isRendered){
            objArray.forEach(function (item) {
                //  console.log(item["coordinates"]);

                let new_obj= new google.maps.Polygon({
                    paths:parseLatLng(item["coordinates"]),
                    strokeColor:"black",
                    strokeOpacity:0.5,
                    strokeWeight:2,
                    fillColor:getColor(Number(item["wifiStrength"])),
                    fillOpacity:0.8
                });
                polys[item["id"]]=new_obj;


                new_obj.setMap(map);

            });}
            isRendered=true;
        });

console.log(polys);

areas.on("child_changed",(snap)=>{
    var changedPoly = snap.val();
    console.log("The updated post title is " ,changedPoly);
    let _id = changedPoly['id'];
    polys[_id].setOptions({fillColor: getColor(Number(changedPoly['wifiStrength']))});
});

        marker.setMap(map);


        //For Button that generates the report for ICTS
        let centerControlDiv = document.createElement('div');
        let centerControl = new CenterControl(centerControlDiv, map);

        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);
    }

    function parseLatLng(arr){
        new_arr= arr.map((ele)=>{

            return {lat:ele["latitude"],lng:ele["longitude"]};
        });

        return new_arr;}


    function getColor(strength){
        if(strength<=30){
            return "rgba(255,0,0,0.5)";
        }
        if(strength<=50){
            return "rgba(255,127,0,0.5)";
        }
        if(strength<=60){
            return "rgba(255,255,0,0.5)";
        }
        if(strength<=80){
            return "rgba(127,255,0,0.5)";
        }
        if(strength<=100){
            return "rgba(0,255,0,0.5)";
        }
    }














//}());