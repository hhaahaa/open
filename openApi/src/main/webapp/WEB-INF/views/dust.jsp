<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<body>
<div id="container" style="min-width: 300px; height: 400px; margin: 0 auto"></div>
</body>
</html>

<script>
function makeChart(){
Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: '미세먼지 농도'
    },
    subtitle: {
        text: 'Source: <a href="http://en.wikipedia.org/wiki/List_of_cities_proper_by_population">기상청</a>'
    },
    xAxis: {
        type: 'category',
        labels: {
            rotation: -45,
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: '미세먼지 농도 (mm)'
        }
    },
    legend: {
        enabled: false
    },
    tooltip: {
        pointFormat: '미세먼지 농도: <b>{point.y:.1f} ms</b>'
    },
    series: [{
        name: 'dust',
        data:dataC,
        dataLabels: {
            enabled: true,
            rotation: -90,
            color: '#FFFFFF',
            align: 'right',
           // format: '{point.y:.1f}', // one decimal
           // y: 10, // 10 pixels down from the top
            style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif'
            }
        }
    }]
});

}

var pm10, pm25 = 0;
var dataTime, cityName;
var dataC = [];
$(document).ready(function(){
	$.ajax({
        url: "/dust",
        data:{cityName: '서울'},
        type: 'post',
        success: function(data) {
        	console.log(data);
        	for(var i=0;i<data.list.length;i++){
	        		pm10 = data.list[i].pm10Value;
	        		pm25 = data.list[i].pm25Value;
	        		dataTime = data.list[i].dataTime;
	        		cityName = data.list[i].cityName;
        	dataC[i] = {cityName,pm10};
		        	//grade(pm10, pm25);
        	}
        	 console.log(dataC);
        	 
        	 /*var chart = $('#container').highcharts();
        	chart.series[0].setData(dataC); */
        	makeChart();
        },
        error:function(request,status,error){
            alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
	});
})

$(window).load(function(){
	
})


</script>