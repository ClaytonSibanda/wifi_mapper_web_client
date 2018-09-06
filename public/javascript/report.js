//For firebase
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

//Initialise firebase
firebase.initializeApp(getConfig());

//get firebase handle
let locations =firebase.database().ref('location').orderByKey();
let areas =firebase.database().ref('areas').orderByKey();
let isRendered =false;
let isAreaRendered =false;


/**
 * Loading data from API when DOM Content has been loaded'.
 */
document.addEventListener("DOMContentLoaded", function(event) {

    /**
     * Gets location data from firebase database
     */
    locations.on('value',(snap)=>{

        /**
         * check if the chart has been rendered
         */
        if(!isRendered) {

            let objArray = Object.values(snap.val());

            let pData = objArray.map((value) => {

                    return {"label": ["randomLocation"], "backgroundColor": getRandomColor(),
                        "borderColor":getRandomColor(),
                        "data":[{'x':value.lat,
                            'y':value.lon,'r':20+Math.abs(Math.log(value.strength))>100?0:10+Math.abs(Math.log(value.strength))}]};
            }).filter((element) => {
                return element !== undefined;
            });
            document.getElementById('numLocations').innerHTML ="Number of collected points: "+objArray.length;

drawBubbleChart(pData);
            isRendered = true;
        }
    });

    /**
     * Gets area data from firebase database
     */
    areas.on('value',(snap)=>{

        /**
         * check if the chart has been rendered
         */
        if(!isAreaRendered) {
            let objArray = Object.values(snap.val());
            barChartData={labels:[],data:[]};
            barChartData1={labels:[],data:[]};

            objArray.forEach(function(value){
                      barChartData.labels.push(value.name);
                      barChartData.data.push(value.wifiStrength);
                      barChartData1.labels.push(value.name);
                      barChartData1.data.push(value.numLocation);
                     // console.log(value.numLocation);

        });

             //console.log(barChartData);
            //   drawLineChart(pData);
            drawStrengthBarChart(barChartData);
            drawAreaChart(barChartData);
            drawNumLocationBarChart(barChartData1);
            document.getElementById('numAreas').innerHTML ="Number of Segents: 25";

            isAreaRendered = true;
        }
    });

});

function getRandomColor() {

    return 'rgb(' + (Math.floor(100+(Math.random() * 128))) + ',' + (Math.floor(70+(Math.random() *128))) + ',' + (Math.floor(70+(Math.random() * 128)))+ ')';
}
function getRandomColors(length){

    //randomise colors
    colors=[];
    for(let i =0;i<length;i++){
        colors.push('rgb(' + (Math.floor(100+(Math.random() * 128))) + ',' + (Math.floor(70+(Math.random() *128))) + ',' + (Math.floor(70+(Math.random() * 128))) + ')')
    }

    return colors;
}

/**
 * draws a bar chart of wifiStength with names of the areas on the x-axis
 * @param dataItems
 */
function drawStrengthBarChart(dataItems){
// console.log(dataItems);

    new Chart(document.getElementById("bar-chart"), {
        type: 'bar',
        data: {
            labels: dataItems.labels,
            datasets: [
                {
                    label: "WifiStrength (%)",
                    backgroundColor:getRandomColors(dataItems.data.length),
                    data:dataItems.data
                }
            ]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Average values of Wifi Strength per segmented area'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Average Wifi Strength"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "WLAN ZONE"
                    }
                }]
            }
        }
    });


}


/**
 * draws a bar chart of Number of Locations vs the names of the areas on the x-axis
 * @param dataItems
 */
function drawNumLocationBarChart(dataItems){
    // console.log(dataItems);
//randomise colors


    new Chart(document.getElementById("bar-chart1"), {
        type: 'bar',
        data: {
            labels: dataItems.labels,
            datasets: [
                {
                    label: "numberOfLocations",
                    backgroundColor:getRandomColors(dataItems.data.length),
                    data:dataItems.data
                }
            ]
        },
        options: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Number of Locations from which data was collected from per segmented area'
            },
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Number Of Locations"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "WLAN ZONE"
                    }
                }]
            }
        }
    });


}

/**
 * Draws a donut pie chart to display when there are a few items on the list, supplements bar graph
 * @param dataItems
 */
function drawAreaChart(dataItems){

    new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
            labels: dataItems.labels,
            datasets: [
                {
                    label: "Signal Strength",
                    backgroundColor: getRandomColors(dataItems.data.length),
                    data: dataItems.data
                }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Pie chart representation of the average values of Wifi Strength per segmented area'
            }
        }
    });



}


function drawBubbleChart(dataItems){


    new Chart(document.getElementById("bubble-chart"), {
        type: 'bubble',
        data: {

            datasets: dataItems
        },
        options: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Locations(Points on the map) and their respective strengths (log(radius)) used'
            }, scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Longitude"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Latitude"
                    }
                }]
            }
        }
    });
}



function generateReport(){
    var doc = new jsPDF('l', 'pt', 'a4');

    let canvas1 = document.getElementById('bar-chart');

    let canvas2 = document.getElementById('bar-chart1');
    let canvas3 = document.getElementById('doughnut-chart');

    let canvas4= document.getElementById('bubble-chart');




    // only jpeg is supported by jsPDF
    let imgData1 = canvas1.toDataURL("image/jpeg", 1.0);
    let imgData2 = canvas2.toDataURL("image/jpeg", 1.0);

    let imgData3 = canvas3.toDataURL("image/jpeg", 1.0);
    let imgData4 = canvas4.toDataURL("image/jpeg", 1.0);


    doc.autoPrint();
     doc.fromHTML($('body').get(0), 15, 15, {
         'width': 170
     });
    doc.addPage();
        doc.addImage(imgData1, 'JPEG', 0, 0);
        doc.addPage();
    doc.addImage(imgData2, 'JPEG', 0,0);
    doc.addPage();
    doc.addImage(imgData3, 'JPEG', 0,0);
    doc.addPage();
    doc.addImage(imgData4, 'JPEG', 0,0);
    //pdf.save("download.pdf");


   // doc.autoPrint();
   //  doc.fromHTML($('body').get(0), 15, 15, {
   //      'width': 170
   //  });
    let d= new Date();
    let d1=d.getMilliseconds();
    doc.save('report'+d1+'.pdf');
}






















// /**
//  * Creates a chart using D3
//  * @param {object} data Object containing historical data of location strength
//  */
// function drawLineChart(data) {
//     var svgWidth = 600, svgHeight = 400;
//     var margin = { top: 20, right: 5, bottom: 30, left: 700 };
//     var width = svgWidth - margin.left - margin.right;
//     var height = svgHeight - margin.top - margin.bottom;
//
//     var svg = d3.select('#svg1')
//         .attr("width", svgWidth)
//         .attr("height", svgHeight);
//
//     var g = svg.append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//     var x = d3.scaleTime()
//         .rangeRound([0, width]);
//
//     var y = d3.scaleLinear()
//         .rangeRound([height, 0]);
//
//     var line = d3.line()
//         .x(function(d) { return x(d.date)})
//         .y(function(d) { return y(d.value)})
//     x.domain(d3.extent(data, function(d) { return d.date }));
//     y.domain(d3.extent(data, function(d) { return d.value }));
//
//     g.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x))
//         .select(".domain")
//         .remove();
//
//     g.append("g")
//         .call(d3.axisLeft(y))
//         .append("text")
//         .attr("fill", "#000")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 8)
//         .attr("dy", "0.71em")
//         .attr("text-anchor", "end")
//         .text(" Strength (bps)");
//
//     g.append("path")
//         .datum(data)
//         .attr("fill", "none")
//         .attr("stroke", "steelblue")
//         .attr("stroke-linejoin", "round")
//         .attr("stroke-linecap", "round")
//         .attr("stroke-width", 1)
//         .attr("d", line);
// }


