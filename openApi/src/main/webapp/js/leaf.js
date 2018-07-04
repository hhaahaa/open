//날씨 그래프, 교통상황, 돌발사고, 대기 농도

var markers = [];
var flag=false;
var city, gu = '';
var cctvFlag, trafficFlag, accidentFlag, weatherFlag = false;

$(document).ready(function(){
	cctvFlag,trafficFlag = false;
	toggleCCTV();
	toggleTraffic();
	
	$(".menuView li a img").hover(function(){
		imgOver(this);
	}, function(){
		imgOut(this);
	})
	
	$.ajax({
		url:"/cityselect",
		dataType:'json',
		success: function(data){
			console.log(data);
			var list = data.list;
			var content='<option value="">광역시/도</option>';
			$.each(list, function(index, item){
				content+='<option value='+item.admCode+'>'+item.admCodeNm+'</option>';
			});
			$("#city").append(content);
		}
	});
});

function toggleCCTV(){
	if(cctvFlag){
		$("#toggleCctv").attr('src', 'http://www.utic.go.kr/contents/images/btn_cctv_off.gif');
		$("#toggleCctv").attr('alt', 'CCTV OFF');
		hidecctv();
		cctvFlag = false;
	} else{
		$("#toggleCctv").attr('src', 'http://www.utic.go.kr/contents/images/btn_cctv_on.gif');
		$("#toggleCctv").attr('alt', 'CCTV ON');
		cctv();
		cctvFlag = true;
	}
}

function toggleTraffic(){
	if(trafficFlag){
		$("#toggleTraFFic").attr('src', 'http://www.utic.go.kr/contents/images/btn_traffic_info_off.gif');
		$("#toggleTraFFic").attr('alt', '교통정보 OFF');
		map.removeOverlayMapTypeId(daum.maps.MapTypeId.TRAFFIC);    
		trafficFlag = false;
	} else{
		$("#toggleTraFFic").attr('src', 'http://www.utic.go.kr/contents/images/btn_traffic_info_on.gif');
		$("#toggleTraFFic").attr('alt', '교통정보 ON');
		map.addOverlayMapTypeId(daum.maps.MapTypeId.TRAFFIC);    
		trafficFlag = true;
	}
}

function toggleIncidentPop(){
	if(accidentFlag){
		$("#toggleInCident").attr('src', 'http://www.utic.go.kr/contents/images/btn_unexpected_off.gif');
		$("#toggleInCident").attr('alt', '돌발정보 OFF');
		hideAccident();
		accidentFlag = false;
	} else{
		$("#toggleInCident").attr('src', 'http://www.utic.go.kr/contents/images/btn_unexpected_on.gif');
		$("#toggleInCident").attr('alt', '돌발정보 ON');
		accident();
		accidentFlag = true;
	}
}

function toggleWeather(){
	if(weatherFlag){
		$("#toggleInCident").attr('src', 'http://www.utic.go.kr/contents/images/btn_unexpected_off.gif');
		$("#toggleInCident").attr('alt', '돌발정보 OFF');
		hideAccident();
		weatherFlag = false;
	} else{
		$("#toggleInCident").attr('src', 'http://www.utic.go.kr/contents/images/btn_unexpected_on.gif');
		$("#toggleInCident").attr('alt', '돌발정보 ON');
		accident();
		weatherFlag = true;
	}
}

function change(value){
	var queryParams= encodeURIComponent('admCode')+'='+ encodeURIComponent(value); 
	$.ajax({
		url:"/gugun",
		data:queryParams,
		dataType:'json',
		success: function(data){
			console.log(data);
			$("#country").find('option').remove();
			var list = data.list;
			var content='';
			content+='<option value="">구(군)선택</option>';
			$.each(list, function(index, item){
				content+='<option value='+item.admCodeNm+'>'+item.lowestAdmCodeNm+'</option>';
			});
			$("#country").append(content);
		}
	});
}

function setAddr(){
	var addrNow = $("#city option:checked").text();
	if($("#country option:checked").text()!=null){
		addrNow += $("#country option:checked").text();
	}
	console.log(addrNow);
	findXY(addrNow, "a");
}

//cctv 시작
function cctv(){
	$.ajax({
        url: "/cctv",
        data: { },
        type: 'post',
        success: function(data) {
        	console.log(data);
        	for(var i=0;i<data.list.length;i++){
        		var imageSize = new daum.maps.Size(25,25),
            	imageOptions={
            		offset: new daum.maps.Point(27, 69)
            	},
            	image = '../../image/cctv1.png';
        		
        		var marker = new daum.maps.Marker({
        			map:map,
        			image: new daum.maps.MarkerImage(image, imageSize, imageOptions),
        			position: new daum.maps.LatLng(data.list[i].yCoord, data.list[i].xCoord),
        			title: data.list[i].cctvId
        		});
        		
        		markers.push(marker);
        		daum.maps.event.addListener(marker, 'click', (function(marker, i) {
        			return function(){
        				viewCCTV(data.list[i].cctvName, data.list[i].cctvId);
        				var infowindow = new daum.maps.InfoWindow({
        					content: ''+data.list[i].cctvName+'',
        					removable:true
        				});
        				
        				infowindow.open(map, marker);
        			}
        		})(marker,i));
        	}
        	
        	clusterer.addMarkers(markers);
        },
        error:function(request,status,error){
            alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
	});
}

function hidecctv(){
	for(var i=0;i<markers.length;i++){
		markers[i].setMap(null);
	}
	clusterer.removeMarkers(markers);
}
// cctv end

//돌발상황 시작
var image=[];
var accidents_m = [];
function accident(){
	for(var i=0;i<accidents_m.length;i++){
		accidents_m[i].setMap(null);
	}
	
	var placeOverlay = new daum.maps.CustomOverlay({zIndex:1});
	$.ajax({
        url: "/accident",
        type: 'post',
        success: function(data) {
        	console.log(data);
        	// 1:사고 2: 공사 3:행사 4:기상 5:통제
        	var imageSize = new daum.maps.Size(25,25),
        	imageOptions={
        		offset: new daum.maps.Point(27, 69)
        	}
        	
        	image[1] = '../../image/accident.png';
        	image[2] = '../../image/construction.png';
        	image[3] = '../../image/event.png';
        	image[4] = '../../image/warning.png';
        	image[5] = '../../image/roadcontrol.png';
        	
        	$("table").tablesorter(); 
        	var txt = '<tr><th>지역</th><th>내용</th><th>시작시간</th><th>종료시간</th></tr>';
        	for(var i=0;i<data.list.length;i++){
        		txt += "<tr><td>"+data.list[i].addressNew+"</td><td>"+data.list[i].incidentTitle+"</td><td>"+data.list[i].startDate+"</td><td>"+data.list[i].endDate+"</td></tr>";
        		
        		var num = data.list[i].incidenteTypeCd;
        		var marker = new daum.maps.Marker({
		    			map:map,
		    			image: new daum.maps.MarkerImage(image[num], imageSize, imageOptions),
		    			position: new daum.maps.LatLng(data.list[i].locationDataY, data.list[i].locationDataX),
		    			title: data.list[i].roadName
		    		});
        		
        		accidents_m.push(marker);
	        	daum.maps.event.addListener(marker, 'click', (function(marker, i) {
		        	placeOverlay.setMap(null);
        			return function(){
        				placeOverlay.setContent('<div class="placeinfo"><span class="title">내용: '+data.list[i].incidentTitle+'</span><sapn class="date">기간: '+data.list[i].startDate+' ~ '+data.list[i].endDate+'</span></div>');
        				placeOverlay.setPosition(new daum.maps.LatLng(data.list[i].locationDataY, data.list[i].locationDataX));
        				placeOverlay.setMap(map);
        				map.panTo(placeOverlay.getPosition());
        			}
        		})(marker,i));
	        	
	        	daum.maps.event.addListener(map, 'click', function(){
	        		placeOverlay.setMap(null);
	        	});
        	}
        	$("#accidentTableTr").append(txt);
        	$("table").trigger("update"); 
            // set sorting column and direction, this will sort on the first and third column 
            var sorting = [[2,1],[0,0]]; 
            // sort on the first column 
            $("table").trigger("sorton",[sorting]); 
   		
        },
        error:function(request,status,error){
            alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
	});
	
	setInterval(accident,1000*60*60);
}

function hideAccident(){
	for(var i=0;i<accidents_m.length;i++){
		accidents_m[i].setMap(null);
	}
}
//=============================================돌발상황 끝

//=========================================체크박스
$(function(){
	$("#allcheck").click(function(){
		if($("#allcheck").prop("checked")){
			$("input[id=view_chk]").prop("checked",true);
		}else{
			$("input[id=view_chk]").prop("checked",false);
			hidecctv();hideAccident();hideWeather();
		}
		chk();
	});
});

function chk(){
	var cnt=0;
	$("#view_chk:checked").each(function(){
		cnt++;
	});
	if(cnt<3){
		$("#allcheck").prop("checked",false);
	} else {
		$("#allcheck").prop("checked",true);
		cctv(); accident(); weather();
	}
}

function changeShow(val){
	switch(val){
		case "cctv" : 
			if($(".cctv").is(":checked")) {cctv(); break;}
			else {hidecctv(); break;}
		case "accident":
			if($(".accident").is(":checked")) {accident(); break;}
			else {hideAccident(); break;}
		case "weather":
			if($(".weather").is(":checked")) {weather(); break;}
			else {hideWeather(); break;}
	}
	chk();
}
//체크박스 끝

//미세먼지
var pm10, pm25=0;
function dust(gu){
	$.ajax({
        url: "/dust",
        data:{cityName: city},
        type: 'post',
        success: function(data) {
        	console.log(data);
        	for(var i=0;i<data.list.length;i++){
	        	if(data.list[i].cityName==gu){
	        		pm10 = data.list[i].pm10Value;
	        		pm25 = data.list[i].pm25Value;
		        	grade(pm10, pm25);
	        	}
        	}
        },
        error:function(request,status,error){
            alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
	});
}

function grade(pm10, pm25){
	// pm10 : 0-30 좋음, 31-80 보통, 81-150 나쁨, 151-매우나쁨
	// pm25 : 0-15 좋음, 16-50 보통, 51-100 나쁨, 101-매우나쁨
	if(pm10<31){
		$('.weather-dust-text').html("<strong style='color:black;'>미세먼지: </strong>좋음");
		$('.weather-dust-text').css('color','blue');
	} else if(pm10<81){
		$('.weather-dust-text').html("<strong style='color:black;'>미세먼지: </strong>보통");
		$('.weather-dust-text').css('color','green');
	} else if(pm10<151){
		$('.weather-dust-text').html("<strong style='color:black;'>미세먼지: </strong>나쁨");
		$('.weather-dust-text').css('color','yellow');
	} else if(pm10>151){
		$('.weather-dust-text').html("<strong style='color:black;'>미세먼지: </strong>매우 나쁨");
		$('.weather-dust-text').css('color','red');
	}
	
	if(pm25<15){
		$('.weather-pm25-text').html("<strong style='color:black;'>초미세먼지: </strong>좋음");
		$('.weather-pm25-text').css('color','blue');
	} else if(pm25<51){
		$('.weather-pm25-text').html("<strong style='color:black;'>초미세먼지: </strong>보통");
		$('.weather-pm25-text').css('color','green');
	} else if(pm25<101){
		$('.weather-pm25-text').html("<strong style='color:black;'>초미세먼지: </strong>나쁨");
		$('.weather-pm25-text').css('color','yellow');
	} else if(pm25>101){
		$('.weather-pm25-text').html("<strong style='color:black;'>초미세먼지: </strong>매우 나쁨");
		$('.weather-pm25-text').css('color','red');
	}
}

//지도 생성 
var mapContainer = document.getElementById('map'),
    mapOption = { 
        center: new daum.maps.LatLng(37.553850, 126.969623),
        level: 8
    };

var map = new daum.maps.Map(mapContainer, mapOption);

var mapTypeControl = new daum.maps.MapTypeControl();

map.addControl(mapTypeControl, daum.maps.ControlPosition.TOPRIGHT);

var zoomControl = new daum.maps.ZoomControl();
map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

var flag=true;
var geocoder = new daum.maps.services.Geocoder();

daum.maps.event.addListener(map, 'dragend', function() {
    center();
});

daum.maps.event.addListener(map, 'tilesloaded', function() {
    center();
});

var clusterer = new daum.maps.MarkerClusterer({
	map:map,
	averageCenter: true,
	minLevel: 7,
	disableClickZoom: true
});

daum.maps.event.addListener(clusterer, 'clusterclick', function(cluster) {
    var level = map.getLevel()-1;
    map.setLevel(level, {anchor: cluster.getCenter()});
});

function center(){
	var latlng = map.getCenter();
//    var message = '현재 지도의 중심 위도는 ' + latlng.getLat() + ' 이고, ';
//    message += '경도는 ' + latlng.getLng() + ' 입니다';
//    console.log(message);
    var resultDiv = document.getElementById('result');
    flag = true;
    //지도 중심좌표 날씨 호출
    locationSuccess(latlng.getLat(), latlng.getLng());
    
	searchDetailAddrFromCoords(latlng, function(result, status) {
		if (status === daum.maps.services.Status.OK) {
			var detailAddr = !!result[0].road_address 
					? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>'
					: '';
			detailAddr += '<div>주소 : '
					+ result[0].address.address_name + '</div>';

			var content = '<div class="bAddr">'
					+ '<span class="title">현재 지도 위치</span>'
					+ detailAddr + '</div>';

		    resultDiv.innerHTML = content;
		    
		    city = result[0].address.address_name;
		    var c= city.split(" ");
		    city = c[0];
		    gu = c[1];
		    dust(gu);
		    //auto();
		}
	});
}

function searchAddrFromCoords(coords, callback) {
	geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
	geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

function viewCCTV(title, code){
	alert(title+","+code);
	/* $.ajax({
        url: "/realCctv",
        data: "cctvName="+title,
        type: 'post',
        success: function(data) {
        	console.log(data);
        	var option = "location=no,status=no,titlebar=no, toolbar=no,scrollbars=auto,resizable=no,width=800,height=500, dependant=no";
        	var pop = window.open(null,'Dynamic popup', option);
        	for(var i=0;i<data.list.length;i++){
	        	pop.document.write(data.list[i]);
        	}
        	pop.document.close();
        },
        error:function(request,status,error){
            alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
	}); */
	
	var option = "location=no,status=no,titlebar=no, toolbar=no, menubar=yes,scrollbars=auto,resizable=no,width=800,height=500, dependant=no";
	var pop = window.open(null,'Dynamic popup', option);
	var content = 'http://www.utic.go.kr/guide/cctvOpenData.do?key=aTOySLV39WUOQKd5V96SYaZNbpQszG9TqOCWmWDlRo47tovS955lYEiPjGt';
	var content2 = 'http://www.utic.go.kr/view/map/openDataCctvStream.jsp?key=aTOySLV39WUOQKd5V96SYaZNbpQszG9TqOCWmWDlRo47tovS955lYEiPjGt&cctvid=L310003&cctvName=내남동입구';
//	var content = 'http://www.utic.go.kr/view/map/openDataCctvStream.jsp?key=aTOySLV39WUOQKd5V96SYaZNbpQszG9TqOCWmWDlRo47tovS955lYEiPjGt&cctvid=L310062&cctvName=&kind=v&cctvip=null&cctvch=62&id=10&cctvpasswd=213&cctvport=null';
	pop.document.write('<iframe id="cctv" frameBorder="0" width="800",scrolling=no, height="500" src='+content+' frameborder="0" allowfullscreen></iframe>')
	pop.document.close();

	pop.addEventListener('load', function(){
		var f = $(pop.document).find("#cctv").attr('src',content2)
	}, false);
}
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	function imgOut(val){
		var s = val.src;
		val.src = s.replace("_on","_off");
	}
	
	function imgOver(val){
		var s = val.src;
		val.src = s.replace("_off","_on");
	}
	
	function mapZoomIn(){
		map.setLevel(map.getLevel()-1);
	}
	function mapZoomOut(){
		map.setLevel(map.getLevel()+1);
	}
