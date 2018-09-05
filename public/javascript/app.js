//(function() {

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
            window.open("./report.html");
            // alert("Will generate report soon");
        });

    }



    //FIREBASE CONFIG FILE
    const config = {
        apiKey: "AIzaSyDFuGSxPHb7yApVqy3AWTZVJcYL48gQz7U",
        authDomain: "capestone-a8a58.firebaseapp.com",
        databaseURL: "https://capestone-a8a58.firebaseio.com",
        projectId: "capestone-a8a58",
        storageBucket: "capestone-a8a58.appspot.com",
        messagingSenderId: "705085920910"
    };
    firebase.initializeApp(config);






    //location.on("value",snap=> console.log(snap.val()));


    function initMap(){
        let options={
            zoom:19,
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

        areas.on('value',function(snap) {
            // console.log(Object.values(snap.val())[0]["coordinates"]);
            let objArray = Object.values(snap.val());

            objArray.forEach(function (item) {
                //  console.log(item["coordinates"]);
                let new_obj= new google.maps.Polygon({
                    paths:parseLatLng(item["coordinates"]),
                    strokeColor:"black",
                    strokeOpacity:0,
                    strokeWeight:2,
                    fillColor:getColor(Number(item["wifiStrength"])),
                    fillOpacity:0.35
                });
                new_obj.setMap(map);
            });
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
            return "red";
        }
        if(strength<=50){
            return "orange";
        }
        if(strength<=60){
            return "#e4e32c";
        }
        if(strength<=80){
            return "#9acd32";
        }
        if(strength<=100){
            return "#2ada2e";
        }
    }















//}());