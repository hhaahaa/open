<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>cctv 데이터</title>
<link rel="stylesheet" href="../../css/leaf.css">
<script src="http://code.jquery.com/jquery-latest.min.js"></script>
</head>
<body style="text-align: center;width: 1000px;">
<div id="addrSearch" style="width: 1000px;">
	<div id="content" style="width: 33.3%; float: left; margin-top: 35px;">
		<select name="city" id="city" onchange="change(this.value);">
		</select> 
		<select name="country" id="country" OnClick="setAddr(this.value)">
			<option value="">구(군)선택</option>
		</select>
	</div>
	<div style="width: 33.3%; float:left; margin-top: 15px;">
		<div style="margin:auto;">
			<input type="checkbox" id="allcheck">전체선택
			<input type="checkbox" id="view_chk" class="cctv" value="cctv" onclick="changeShow(this.value);" checked="checked">cctv
			<input type="checkbox" id="view_chk" class="accident" value="accident" onclick="changeShow(this.value);">돌발상황
			<input type="checkbox" id="view_chk" class="weather" value="weather" onclick="changeShow(this.value);">날씨
		</div>
		<div id="result" style="margin:auto;"></div>
	</div>

	<div class="weather_info" style="width: 33.3%; float: left;">
		<div class="w-icon">
			<strong>&nbsp;</strong>
			<img id="weatherIcon" class="wt png25">
			<span class="weather-state-text">맑음</span>
		</div>
		<div class="w-element">
			<ul>
				<li><span id="weather-temp-text" class="temp plus"></span></li>
				<li class="weather-humidity-text"></li>
				<li class="weather-dust-text"></li>
				<li class="weather-pm25-text"></li>
				<li class="weather-rain-text"></li>
			</ul>
		</div>
	</div>
</div>
<div class="map_control02">
	<div class="f_l">
		<button type="button" onclick="toggleTraffic();" title="클릭하면 지도 위에 교통정보가 보여집니다."><img id="toggleTraFFic" width="40" height="22" src="http://www.utic.go.kr/contents/images/btn_traffic_info_on.gif" alt="교통정보 OFF"></button>
		<button type="button" onclick="javascript:toggleCCTV();" title="클릭하면 지도 위에 CCTV 정보가 보여집니다."><img id="toggleCctv" width="40" height="22" src="http://www.utic.go.kr/contents/images/btn_cctv_on.gif" alt="CCTV OFF"></button>
		<button type="button" onclick="javascript:toggleIncidentPop();" title="클릭하면 지도 위에 돌발정보가 보여집니다."><img id="toggleInCident" width="40" height="22" src="http://www.utic.go.kr/contents/images/btn_unexpected_off.gif" alt="돌발정보 OFF"></button>
	</div>
</div>
<div id="map" style="width:1000px;height:500px;">
	<div class="menuMap">
		<ul class="menuView">
		 	<li><a onclick="javascript:;"><img onclick="mapZoomIn(this)" alt="확대" src="http://www.utic.go.kr/contents/images/map/btn_expand_off.gif"></a></li>
			<li><a onclick="javascript:;"><img onclick="mapZoomOut(this)" alt="축소" src="http://www.utic.go.kr/contents/images/map/btn_reduce_off.gif"></a></li>
			<li><a onclick="javascript:;"><img id="mapMenuDistance" onclick="doDraw('distance');" alt="거리" src="http://www.utic.go.kr/contents/images/map/btn_distance_off.gif"></a></li>
			<li><a onclick="javascript:;"><img id="mapMenuArea" onclick="doDraw('area');" alt="면적" src="http://www.utic.go.kr/contents/images/map/btn_area_off.gif"></a></li>
			<li class="char3"><a onclick="javascript:;"><img onclick="stopDraw(this)" alt="초기화" src="http://www.utic.go.kr/contents/images/map/btn_reset_off.gif"></a></li>
		</ul>
	</div>
</div>
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=6d00eac2ad03dd3b680a9af94cd77521&libraries=services,clusterer"></script>
<script type="text/javascript" src="../../js/leaf.js"></script>
<script type="text/javascript" src="../../js/drawing.js"></script>
<script type="text/javascript" src="../../js/weather.js"></script>
</body>
</html>