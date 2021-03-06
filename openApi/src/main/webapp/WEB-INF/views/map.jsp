<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<style>
	#text {
		height: 50px;
	}
	#list {
		margin : 10px;
	}
	.area {
	    position: absolute;
	    background: #fff;
	    border: 1px solid #888;
	    border-radius: 3px;
	    font-size: 12px;
	    top: -5px;
	    left: 15px;
	    padding:2px;
	}
	#mapwrap{position:relative;overflow:hidden;}
	#menu {cursor:pointer;background-image:url('../../icon.png');position:absolute;overflow:hidden;top:10px;left:10px;width:100px;height:180px;z-index:10;border:1px solid black;background-color:#fff;}
	</style>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6d00eac2ad03dd3b680a9af94cd77521"></script>
	<script type="text/javascript" src="../../js/bPolygon.js"></script>
</head>
<body>

	<div id="text"></div>

	<div id="mapwrap">
		<div id="map" style="width:1000px;height:500px;"></div>
		<div id="menu"></div>
	</div>
	
	<div id="list">
		<input type="button" code="11" value="서울" />
		<input type="button" code="26" value="부산" />
		<input type="button" code="28" value="인천" />
		<input type="button" code="41" value="경기" />
		<input type="button" code="50" value="제주" />
	</div>
<script>
	var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = { 
        center: new daum.maps.LatLng(37.56489752922437, 126.97511613320933), // 지도의 중심좌표
        level: 13 // 지도의 확대 레벨
    };
	map = new daum.maps.Map(mapContainer, mapOption);
	
	var bPolygons = new bPolygon(map);
	bPolygons.init();
	$("#list input").click(function(){
		bPolygons.show($(this).attr('code'));
	});
	
	// 클릭 시, 정보 가져오기
	$("#mapwrap").click(function(){
		var info = bPolygons.getInfo();
		var text = '';
		if(info.code == 0){
			text = info.pname;
		} else if(info.pcode == 0) {
			text = info.name;
		} else {
			text = info.pname + " " + info.name;
		}
		$("#text").html(text);
	});
	
	// 지도 위 메뉴
	$("#menu").click(function(){
		bPolygons.show('0');
		$("#mapwrap").trigger('click');
	});
	
	$("#mapwrap").trigger('click');
</script>
</body>
</html>