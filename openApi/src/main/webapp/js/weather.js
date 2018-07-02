
//좌표 => 날씨 좌표 변환 => 날씨 => 마크찍기
//===============================================================날씨
var weather_m = [];
function weather(){
	flag = false;
	var sido = ["서울", "부산", "대구", "인천", "광주광역시", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"];
	for(var i=0;i<sido.length;i++){
		findXY(sido[i], "w");
	}
}

function findXY(addrFind, s){
	geocoder.addressSearch(addrFind, function(result, status) {
		locationSuccess(result[0].y, result[0].x);
		if(s=="a"){
			var moveLatLon = new daum.maps.LatLng(result[0].y, result[0].x);
			map.setCenter(moveLatLon);
		}
	});
}

// 날씨 숨기기
function hideWeather(){
	for(var i=0;i<weather_m.length;i++){
		daum.maps.event.removeListener(weather_m[i], 'click', (function(marker) {
			return function() {
				var infowindow = new daum.maps.InfoWindow({
					content: content,
					removable : true
				});
				infowindow.open(map, marker);
			}
		})(weather_m[i]));
		weather_m[i].setMap(null);
	}
}

//기상청 제공 ==> 좌표 변환 함수
function locationSuccess(lat, lng){
	var rs = dfs_xy_conv("toXY",lat,lng);
	// 위도/경도 -> 기상청 좌표x / 좌표 y 변환
	xml2jsonCurrentWth(rs.nx, rs.ny, lat, lng);
}

function xml2jsonCurrentWth(nx, ny, lat, lng){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	var hours = today.getHours();
	var minutes = today.getMinutes();
	
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
			var image = "",
			content='',
			imageSize = new daum.maps.Size(64, 69),
			imageOption = {offset: new daum.maps.Point(27, 69)};
			
			var rain_state = data.list[1].obsrValue;
			var humidity = data.list[2].obsrValue;
			var rain = data.list[3].obsrValue; //1시간 강수량
			var sky = data.list[4].obsrValue;
			var state = '';
			var temp = data.list[5].obsrValue;
			if(!flag){
				if(rain_state!=0){
					if(rain_state==1){ //비
						image = "http://www.weather.go.kr/images/icon/DY/DB05_B.png";
						state = '비';
					}else if(rain_state==2){ //비/눈
						image = "http://www.weather.go.kr/images/icon/DY/DB06_B.png";
						state = '진눈깨비';
					}else if(rain_state==3){ //눈
						image = "http://www.weather.go.kr/images/icon/DY/DB08_B.png";
						state = '눈';
					}
				} else {
					if(sky==1){ //맑음
						image = "http://www.weather.go.kr/images/icon/DY/DB01_B.png";
						state = '맑음';
					}else if(sky==2){ //구름 조금
						image = "http://www.weather.go.kr/images/icon/DY/DB02_B.png";
						state = '구름 조금';
					}else if(sky==3){ //구름많음
						image = "http://www.weather.go.kr/images/icon/DY/DB03_B.png";
						state = '구름 많음';
					}else if(sky==4){ //흐림
						image = "http://www.weather.go.kr/images/icon/DY/DB03_B.png";
						state = '흐림';
					}
				}
				
				content += '<img src="'+image+'"> '+state;
				content += '<p style="padding:5px;font-size:12px;">온도: ' + temp + '° </p>';
				content += '<p style="padding:5px;font-size:12px;">습도: ' + humidity + '% </p>';
				content += '<a href="http://www.weather.go.kr/weather/forecast/digital_forecast.jsp?x='+nx+'&y='+ny+'">자세히보기</a>';
				
				var markerImage = new daum.maps.MarkerImage(image, imageSize, imageOption),
				markerPosition = new daum.maps.LatLng(lat, lng);
				var marker = new daum.maps.Marker({
					map:map,
					position: markerPosition, 
					image: markerImage
				});
				weather_m.push(marker);
				daum.maps.event.addListener(marker, 'click', (function(marker) {
					return function() {
						var infowindow = new daum.maps.InfoWindow({
							content: content,
							removable : true
						});
						infowindow.open(map, marker);
					}
				})(marker));
			}else{
				if(rain_state!=0){
					if(rain_state==1){
						$('.weather-state-text').text("비");
						$("#weatherIcon").attr('class','wt png25 spm_ws spm_ws4');
						$('.weather-rain-text').html("<strong>1시간 강수량:</strong>"+rain+"mm");
					}else if(rain_state==2){
						$('.weather-state-text').text("비/눈");
						$("#weatherIcon").attr('class','wt png25 spm_ws spm_ws6');
						$('.weather-rain-text').html("<strong>1시간 강수량:</strong>"+rain+"mm");
					}else if(rain_state==3){
						$('.weather-state-text').text("눈");
						$("#weatherIcon").attr('class','wt png25 spm_ws spm_ws5');
						$('.weather-rain-text').html("<strong>1시간 강수량:</strong>"+rain+"mm");
					}
				} else {
					$('.weather-rain-text').html("<strong>1시간 강수량:</strong> --");
					if(sky==1){
						$('.weather-state-text').text("맑음");
						$("#weatherIcon").attr('class','wt png25 spm_ws spm_ws1');
					}else if(sky==2){
						$('.weather-state-text').text("구름조금");
						$("#weatherIcon").attr('class','wt png25 spm_ws spm_ws2');
					}else if(sky==3){
						$('.weather-state-text').text("구름많음");
						$("#weatherIcon").attr('class','wt png25 spm_ws spm_ws21');
					}else if(sky==4){
						$('.weather-state-text').text("흐림");
						$("#weatherIcon").attr('class','wt png25 spm_ws spm_ws3');
					}
				}
				$('#weather-temp-text').text(temp+"℃");
				$('.weather-humidity-text').html("<strong>습도: </strong>"+humidity+"%");
			}
			
			
		},
		error:function(request,status,error){
			alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
		}
	});
	
}
// xml2jsonCurrentWth
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
