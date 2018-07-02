<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
<!-- 부트스트랩 -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
<link href="https://stackpath.bootstrapcdn.com/bootswatch/4.1.1/sandstone/bootstrap.min.css" rel="stylesheet" >

<!-- 크로스 도메인 -->
<script type="text/javascript" src="../../js/jquery.xdomainajax.js"></script>

<title>Open API</title>

<style>
.spm_ws{display:inline-block;overflow:hidden;width:36px;height:26px;background:url(https://ssl.pstatic.net/static/maps/ux2013/sp_weather_small.png) no-repeat;line-height:999px;vertical-align:top}
.spm_ws1{background-position:0 0} /* 맑음 */
.spm_ws2{background-position:-41px 0} /* 구름 조금 */
.spm_ws3{background-position:-82px 0} /* 흐림 */
.spm_ws4{background-position:-123px 0} /* 비 */
.spm_ws5{background-position:-164px 0} /* 눈 */
.spm_ws6{background-position:-205px 0} /* 진눈깨비 */
.spm_ws7{background-position:-246px 0} /* 소나기 */
.spm_ws8{background-position:-287px 0} /* 소낙 눈 */
.spm_ws9{background-position:-328px 0} /* 안개 */
.spm_ws10{background-position:-369px 0} /* 뇌우 */
.spm_ws11{background-position:-410px 0} /* 흐려짐 */
.spm_ws12{background-position:-451px 0} /* 흐려져 뇌우 */
.spm_ws13{background-position:-492px 0} /* 흐려져 비 */
.spm_ws14{background-position:-533px 0} /* 흐려져 눈 */
.spm_ws15{background-position:-574px 0} /* 흐려져 진눈깨비 */
.spm_ws16{background-position:-615px 0} /* 흐린 후 갬 */
.spm_ws17{background-position:-656px 0} /* 뇌우 후 갬 */
.spm_ws18{background-position:-697px 0} /* 비 후 갬 */
.spm_ws19{background-position:-738px 0} /* 눈 후 갬 */
.spm_ws20{background-position:-779px 0} /* 진눈꺠비 후 갬 */
.spm_ws21{background-position:-820px 0} /* 구름 많음 */
.spm_ws22{background-position:-861px 0} /* 황사 */
</style>

<script type="text/javascript">
$(document).ready(function(){
	//getLocation();
})

// 접속위치 좌표 잡기
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError, geo_options);
    }else{
        console.log("지오 로케이션 없음")
    }
};
// getLocation


//기상청 제공 ==> 좌표 변환 함수
function locationSuccess(lat, lng){
 //       var latitude = p.coords.latitude,
 //       longitude = p.coords.longitude;
        var rs = dfs_xy_conv("toXY",lat,lng);
        // 위도/경도 -> 기상청 좌표x / 좌표 y 변환
        xml2jsonCurrentWth(rs.nx, rs.ny);
    }
// locationSuccess
 
 function locationError(error){
        var errorTypes = {
            0 : "에러...",
            1 : "허용 안눌렀음",
            2 : "위치가 안잡힘",
            3 : "응답시간 지남"
        };
        var errorMsg = errorTypes[error.code];
        console.log(errorMsg)
    }
    // locationError
 
    var geo_options = {
        enableHighAccuracy: true,
        maximumAge        : 30000,
        timeout           : 27000
    };
    // geo_options
    
    // LCC DFS 좌표변환을 위한 기초 자료
    //
    var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)
    //
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
    //
function dfs_xy_conv(code, v1, v2) {
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;
 
    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;
 
    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {
 
        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        rs['nx'] = v1;
        rs['ny'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
 
        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lng'] = alon * RADDEG;
    }
    return rs;
}
// dfs_xy_conv

function xml2jsonCurrentWth(nx, ny){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    console.log("time " + minutes)
 
    if(minutes < 30){
        // 30분보다 작으면 한시간 전 값
        hours = hours - 1;
        if(hours < 0){
            // 자정 이전은 전날로 계산
            today.setDate(today.getDate() - 1);
            dd = today.getDate();
            mm = today.getMonth()+1;
            yyyy = today.getFullYear();
            hours = 23;
        }
    }
    if(hours<10) {
        hours='0'+hours
    }
    if(mm<10) {
        mm='0'+mm
    }
    if(dd<10) {
        dd='0'+dd
    } 
 
    var _nx = nx,
    _ny = ny,
    today = yyyy+""+mm+""+dd,
    basetime = hours + "00",
    queryParams  = "base_date=" + today;
    queryParams  += "&base_time=" + basetime;
    queryParams  += "&nx=" + _nx + "&ny=" + _ny;
    queryParams  += "&pageNo=1&numOfRows=6";
    queryParams  += "&_type=json";
 
//    console.log(url);
    $.ajax({
        url: "/weather",
        type: 'post',
        data:queryParams,
        success: function(data) {
        	console.log(data);
        	
        	var rain_state = data.list[1].obsrValue;
        	var humidity = data.list[2].obsrValue;
        	var rain = data.list[3].obsrValue; //1시간 강수량
        	var sky = data.list[4].obsrValue;
        	var temp = data.list[5].obsrValue;
        	
        	//console.log("강수형태: "+rain_state+",비: "+rain+",하늘: "+sky+",온도: "+temp)
        	if(rain_state!=0){
        		if(rain_state==1){
        			$('.weather-state-text').text("비");
        			$("#weatherIcon").attr('class','spm_ws spm_ws4');
        			$('.weather-rain-text').text("1시간당 강수량"+rain+"mm");
        		}else if(rain_state==2){
        			$('.weather-state-text').text("비/눈");
        			$("#weatherIcon").attr('class','spm_ws spm_ws6');
        			$('.weather-rain-text').text("1시간당 강수량"+rain+"mm");
        		}else if(rain_state==3){
        			$('.weather-state-text').text("눈");
        			$("#weatherIcon").attr('class','spm_ws spm_ws5');
        			$('.weather-rain-text').text("1시간당 강수량"+rain+"mm");
        		}
        	} else {
        		if(sky==1){
	        			$('.weather-state-text').text("맑음");
	        			$("#weatherIcon").attr('class','spm_ws spm_ws1');
        		}else if(sky==2){
	        			$('.weather-state-text').text("구름조금");
	        			$("#weatherIcon").attr('class','spm_ws spm_ws2');
        		}else if(sky==3){
	        			$('.weather-state-text').text("구름많음");
	        			$("#weatherIcon").attr('class','spm_ws spm_ws21');
        		}else if(sky==4){
	        			$('.weather-state-text').text("흐림");
	        			$("#weatherIcon").attr('class','spm_ws spm_ws3');
        		}
        	}
        	$('.weather-temp-text').text(temp+"도");
        	$('.weather-humidity-text').text("습도: "+humidity+"%");
        },
        error:function(request,status,error){
            alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
        });
 
}
// xml2jsonCurrentWth
 
function rplLine(value){
    if (value != null && value != "") {
        return value.replace(/\n/g, "\\n");
    }else{
        return value;
    }
}
var positions = [];
function trafficInfo(){
	$.ajax({
        url: "/traf",
        type: 'post',
        success: function(data) {
        	console.log(data);
        	for(var i=0;i<data.list.length;i++){
        		var tm_x = data.list[i].grs80tm_x;
        		var tm_y = data.list[i].grs80tm_y;
        		var sub = "<div>발생기간 : "+data.list[i].occr_date+"\n"+data.list[i].occr_time+" ~ "+data.list[i].exp_clr_date+"\n"+data.list[i].exp_clr_time+"</div>"
        		sub+="<div>발생내용: "+data.list[i].acc_info+"</div>"
        		
        		positions[i] = [{pos_x: data.list[i].grs80tm_x, pos_y: data.list[i].grs80tm_y, content: sub}];
        		translate();
        	}
        		console.log(positions)
        },
        error:function(request,status,error){
            alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
	});
}

/* function cctvData(){
	 $.ajax({
        url: "/cctv",
        type: 'post',
        success: function(data) {
        	console.log(data);
        	
        },
        error:function(request,status,error){
            alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
	}); 
	
	window.location.href = "http://www.utic.go.kr/guide/cctvOpenData.do?key=aTOySLV39WUOQKd5V96SYaZNbpQszG9TqOCWmWDlRo47tovS955lYEiPjGt"
}
 */
//============================================================================== 미세먼지
/* function dust(){
	$.ajax({
		url:"/dust",
		type: 'post',
		success: function(data){
			for(var i=0;i<data.list.length;i++){
			console.log(data.list[i]);
			}
			console.log("성공");
		},
		error: function(e){
			console.log("실패");
		}
	});
} */
</script>

</head>
<body>
<img id="weatherIcon">
<p class="weather-temp-text"></p>
<p class="weather-state-text"></p>
<p class="weather-rain-text"></p>
<p class="weather-humidity-text"></p>
<p id="result"></p>
<div id="map" style="width:1000px;height:500px;"></div>
<button type="button" onclick="traffic();">교통상황보기</button>
<button type="button" onclick="trafficInfo();">돌발상황보기</button>
<button type="button" onclick="cctvData();">cctv 보기</button>
<a href="/highmap">high</a>

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6d00eac2ad03dd3b680a9af94cd77521&libraries=services"></script>
<script>
var mapContainer = document.getElementById('map'),
    mapOption = { 
        center: new daum.maps.LatLng(37.553850, 126.969623),
        level: 8
    };

var map = new daum.maps.Map(mapContainer, mapOption);
var flag=true;
var geocoder = new daum.maps.services.Geocoder();


daum.maps.event.addListener(map, 'dragend', function() {
    var latlng = map.getCenter();
    var message = '현재 지도의 중심 위도는 ' + latlng.getLat() + ' 이고, ';
    message += '경도는 ' + latlng.getLng() + ' 입니다';
    locationSuccess(latlng.getLat(), latlng.getLng());
    var resultDiv = document.getElementById('result'); 
    
	searchDetailAddrFromCoords(latlng, function(result, status) {
		if (status === daum.maps.services.Status.OK) {
			var detailAddr = !!result[0].road_address ? '<div>도로명주소 : '
					+ result[0].road_address.address_name + '</div>'
					: '';
			detailAddr += '<div>지번 주소 : '
					+ result[0].address.address_name + '</div>';

			var content = '<div class="bAddr">'
					+ '<span class="title">법정동 주소정보</span>'
					+ detailAddr + '</div>';

		    resultDiv.innerHTML = message + "\n"+content;
		}
	});
});

function searchAddrFromCoords(coords, callback) {
	geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
	geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

function traffic(){
	if(flag==true){
		map.addOverlayMapTypeId(daum.maps.MapTypeId.TRAFFIC);
		flag=false;
	} else{
		map.removeOverlayMapTypeId(daum.maps.MapTypeId.TRAFFIC);
		flag=true;
	}
}

var iwRemoveable=true;
var overlay = new daum.maps.CustomOverlay({
	removable: iwRemoveable
});
function translate(){
	//iwContent = sub;
	for(var i=0;i<positions.length;i++){
		geocoder.transCoord(positions[i][0].pos_x, positions[i][0].pos_y, transCoordCB, {
    		input_coord: daum.maps.services.Coords.TM, // 변환을 위해 입력한 좌표계 입니다
    		output_coord: daum.maps.services.Coords.WGS84 // 변환 결과로 받을 좌표계 입니다 
		});
		overlay.setContent(positions[i][0].content);
	}
}

// 좌표 변환 결과를 받아서 처리할 콜백함수 입니다.
function transCoordCB(result, status) {
	    // 정상적으로 검색이 완료됐으면 
	if (status === daum.maps.services.Status.OK) {
	        // 마커를 변환된 위치에 표시합니다
		var marker = new daum.maps.Marker({
			position: new daum.maps.LatLng(result[0].y, result[0].x), // 마커를 표시할 위치입니다
		    map: map, // 마커를 표시할 지도객체입니다
		    clickable: true
		})
		daum.maps.event.addListener(marker, 'click', function(){
			overlay.setPosition(new daum.maps.LatLng(result[0].y, result[0].x))
			overlay.setMap(map);
		});
	}
}

// 도로 cctv 붙이기
</script>
</body>
</html>