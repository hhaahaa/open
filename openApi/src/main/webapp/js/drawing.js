	function doDraw(str){
		if(str == 'distance'){
			line();
			stopArea();
		}else{
			stopLine();
			area();
		}
	}
	
	function stopDraw(){
		stopArea();
		stopLine();
	}

	var drawingFlag = false;
	var moveLine;
	var clickLine;
	var distanceOverlay;
	var dots = {};
	function line(){
		$("#mapMenuDistance").attr('src','http://www.utic.go.kr/contents/images/map/btn_distance_on.gif');
		daum.maps.event.addListener(map, 'click', clickE);
		daum.maps.event.addListener(map, 'mousemove', moveE);               
		daum.maps.event.addListener(map, 'rightclick', rightCE);
	} //line end+++++++++++++++++++++++++++++++++++
	
	function clickE(mouseEvent){
		 var clickPosition = mouseEvent.latLng;
		    if (!drawingFlag) {
		        drawingFlag = true;
		        deleteClickLine();
		        deleteDistnce();
		        deleteCircleDot();
		    
		        clickLine = new daum.maps.Polyline({
		            map: map,
		            path: [clickPosition],
		            strokeWeight: 3,
		            strokeColor: '#db4040',
		            strokeOpacity: 1,
		            strokeStyle: 'solid'
		        });
		        
		        moveLine = new daum.maps.Polyline({
		            strokeWeight: 3,
		            strokeColor: '#db4040',
		            strokeOpacity: 0.5,
		            strokeStyle: 'solid'
		        });
		        displayCircleDot(clickPosition, 0);
		    } else {
		        var path = clickLine.getPath();
		        path.push(clickPosition);
		        clickLine.setPath(path);
		        var distance = Math.round(clickLine.getLength());
		        displayCircleDot(clickPosition, distance);
		    }
	} //clickE end
	
	function moveE(mouseEvent){
		 if (drawingFlag){
		        var mousePosition = mouseEvent.latLng; 
		        var path = clickLine.getPath();
		        var movepath = [path[path.length-1], mousePosition];
		        moveLine.setPath(movepath);    
		        moveLine.setMap(map);
		        
		        var distance = Math.round(clickLine.getLength() + moveLine.getLength()),
		            content = '<div class="dotOverlay distanceInfo">총거리 <span class="number">' + distance + '</span>m</div>';
		        showDistance(content, mousePosition);
		    }  
	}
	
	function rightCE(mouseEvent){
		if (drawingFlag) {
	        moveLine.setMap(null);
	        moveLine = null;  
	        var path = clickLine.getPath();
	        if (path.length > 1) {
	            if (dots[dots.length-1].distance) {
	                dots[dots.length-1].distance.setMap(null);
	                dots[dots.length-1].distance = null;    
	            }
	            var distance = Math.round(clickLine.getLength()),
	                content = getTimeHTML(distance);
	            showDistance(content, path[path.length-1]);  
	        } else {
	            deleteClickLine();
	            deleteCircleDot(); 
	            deleteDistnce();
	        }
	        drawingFlag = false;          
	    }  
	}// rightCE end
	
	function stopLine(){
		$("#mapMenuDistance").attr('src','http://www.utic.go.kr/contents/images/map/btn_distance_off.gif');
		deleteClickLine();
		deleteDistnce();
		deleteCircleDot();
		daum.maps.event.removeListener(map, 'click', clickE);
		daum.maps.event.removeListener(map, 'mousemove', moveE);                 
		daum.maps.event.removeListener(map, 'rightclick', rightCE); 
	}
	
	function deleteClickLine() {
	    if (clickLine) {
	        clickLine.setMap(null);    
	        clickLine = null;        
	    }
	}

	function showDistance(content, position) {
	    if (distanceOverlay) {
	        distanceOverlay.setPosition(position);
	        distanceOverlay.setContent(content);
	    } else {
	        distanceOverlay = new daum.maps.CustomOverlay({
	            map: map,
	            content: content,
	            position: position,
	            xAnchor: 0,
	            yAnchor: 0,
	            zIndex: 3  
	        });      
	    }
	}

	function deleteDistnce () {
	    if (distanceOverlay) {
	        distanceOverlay.setMap(null);
	        distanceOverlay = null;
	    }
	}

	function displayCircleDot(position, distance) {
	    var circleOverlay = new daum.maps.CustomOverlay({
	        content: '<span class="dot"></span>',
	        position: position,
	        zIndex: 1
	    });
	    circleOverlay.setMap(map);
	    if (distance > 0) {
	        var distanceOverlay = new daum.maps.CustomOverlay({
	            content: '<div class="dotOverlay">거리 <span class="number">' + distance + '</span>m</div>',
	            position: position,
	            yAnchor: 1,
	            zIndex: 2
	        });
	        distanceOverlay.setMap(map);
	    }
	    dots.push({circle:circleOverlay, distance: distanceOverlay});
	}

	function deleteCircleDot() {
	    var i;
	    for ( i = 0; i < dots.length; i++ ){
	        if (dots[i].circle) { 
	            dots[i].circle.setMap(null);
	        }
	        if (dots[i].distance) {
	            dots[i].distance.setMap(null);
	        }
	    }
	    dots = [];
	}

	function getTimeHTML(distance) {
		var content = '<ul class="dotOverlay distanceInfo">';
	    content += '    <li>';
	    content += '        <span class="label">총거리</span><span class="number">' + distance + '</span>m';
	    content += '    </li>';
	    content += '</ul>'
	    return content;
	}
	
	var aDrawingFlag = false;
	var drawingPolygon;
	var polygon;
	var areaOverlay;
	function area(){
		$("#mapMenuArea").attr('src','http://www.utic.go.kr/contents/images/map/btn_area_on.gif');
		daum.maps.event.addListener(map, 'click', aClickE);
		daum.maps.event.addListener(map, 'mousemove', aMoveE);     
		daum.maps.event.addListener(map, 'rightclick', aRightClickE);   
	}
	
	function aClickE(mouseEvent){
		 var clickPosition = mouseEvent.latLng; 
		    if (!aDrawingFlag) {
		        aDrawingFlag = true;
		        if (polygon) {  
		            polygon.setMap(null);      
		            polygon = null;  
		        }
		        if (areaOverlay) {
		            areaOverlay.setMap(null);
		            areaOverlay = null;
		        }
		    
		        drawingPolygon = new daum.maps.Polygon({
		            map: map,
		            path: [clickPosition],
		            strokeWeight: 3,
		            strokeColor: '#00a0e9',
		            strokeOpacity: 1,
		            strokeStyle: 'solid',
		            fillColor: '#00a0e9',
		            fillOpacity: 0.2
		        }); 
		        
		        polygon = new daum.maps.Polygon({ 
		            path: [clickPosition],
		            strokeWeight: 3,
		            strokeColor: '#00a0e9',
		            strokeOpacity: 1,
		            strokeStyle: 'solid',
		            fillColor: '#00a0e9',
		            fillOpacity: 0.2
		        });
		        
		    } else {
		        var drawingPath = drawingPolygon.getPath();
		        drawingPath.push(clickPosition);
		        drawingPolygon.setPath(drawingPath);
		        var path = polygon.getPath();
		        path.push(clickPosition);
		        polygon.setPath(path);
		    }
	} //aClickE end
	
	function aMoveE(mouseEvent){
		if (aDrawingFlag){
	        var mousePosition = mouseEvent.latLng; 
	        var path = drawingPolygon.getPath();
	        if (path.length > 1) {
	            path.pop();
	        } 
	        path.push(mousePosition);
	        drawingPolygon.setPath(path);
	    }
	}
	
	function aRightClickE(mouseEvent){
		 if (aDrawingFlag) {
		        drawingPolygon.setMap(null);
		        drawingPolygon = null;  
		        
		        var path = polygon.getPath();
		        if (path.length > 2) {
		            polygon.setMap(map); 
		            var area = Math.round(polygon.getArea()),
		                content = '<div class="info">총면적 <span class="number"> ' + area + '</span> m<sup>2</sup></div>';
		            areaOverlay = new daum.maps.CustomOverlay({
		                map: map,
		                content: content,
		                xAnchor: 0,
		                yAnchor: 0,
		                position: path[path.length-1]
		            });      
		        } else { 
		            polygon = null;
		        }
		        aDrawingFlag = false;          
		 }
	}
	
	function stopArea(){
		if (polygon) {  
            polygon.setMap(null);      
            polygon = null;  
        }
		if (areaOverlay) {
            areaOverlay.setMap(null);
            areaOverlay = null;
        }
		$("#mapMenuArea").attr('src','http://www.utic.go.kr/contents/images/map/btn_area_off.gif');
		daum.maps.event.removeListener(map, 'click', aClickE);
		daum.maps.event.removeListener(map, 'mousemove', aMoveE);     
		daum.maps.event.removeListener(map, 'rightclick', aRightClickE); 
	}
