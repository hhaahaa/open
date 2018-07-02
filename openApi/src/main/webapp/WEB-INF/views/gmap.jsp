<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Marker Clustering</title>
    <style>
      /* Always set the map height explicitly to define the size of the div
       * element that contains the map. */
      #map {
        height: 500px;
        width: 1000px;
      }
      /* Optional: Makes the sample page fill the window. */
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="http://code.jquery.com/jquery-latest.min.js"></script>
    <script>
 
      function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: {lat: 37.553850, lng: 126.969623}
        });
 		
 		google.maps.event.addListener(map, 'click', function() {
 			cctv(map);
			
		});
 		
 		/* google.maps.event.addListener(map, "moveend", function() {            
 			map.clearOverlays();
 	         // Load markers for the current bounds and current zoom level 
 	         loadMarkers(map,map.getBounds(),map.getBoundsZoomLevel(map.getBounds()));
 	 }); */

 		google.maps.event.addListener(map, "zoomend", function() {
 		map.clearOverlays();
 	        // Load markers for the current bounds and current zoom level 
 	       loadMarkers(map,map.getBounds(),map.getBoundsZoomLevel(map.getBounds()));
 	 });
       }
     
    </script>
    <script src="https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js">
    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBPA_xStX4VRi97SvEHjPOjZjlIC6aRWcs&callback=initMap">
    </script>
  </body>
</html>

<script>
function cctv(map){
	
	 /* var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	 
     var markers = locations.map(function(location, i) {
       return new google.maps.Marker({
         position: location,
         label: labels[i % labels.length]
       });
     });
 */
 var markers = [];  
	$.ajax({
        url: "/cctv",
        data: { },
        type: 'post',
        success: function(data) {
        	console.log(data);
        	for(var i=0;i<data.list.length;i++){
        		/* var imageSize = new google.maps.Size(25,25),
            	imageOptions={
            		offset: new google.maps.Point(27, 69)
            	},
            	image = '../../image/cctv1.png'; */
        		
        		var marker = new google.maps.Marker({
        			map:map,
        			//image: new google.maps.MarkerImage(image, imageSize, imageOptions),
        			position: new google.maps.LatLng(data.list[i].yCoord, data.list[i].xCoord),
        			label: data.list[i].cctvId
        		});
        		
        		markers.push(marker);
//        		clusterer.addMarkers(markers);
        		
        		/* google.maps.event.addListener(marker, 'click', (function(marker, i) {
        			return function(){
        				viewCCTV(data.list[i].cctvName, data.list[i].cctvId);
        				var infowindow = new google.maps.InfoWindow({
        					content: ''+data.list[i].cctvName+'',
        					removable:true
        				});
        				
        				infowindow.open(map, marker);
        			}
        		})(marker,i)); */
        	}
	     var markerCluster = new MarkerClusterer(map, markers,
	         {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        },
        error:function(request,status,error){
            alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
	});
}

function placeMarker(location) {
	var marker = new google.maps.Marker({
		position : location,
		map : map
	});
	getMarkPos(marker);
	map.setCenter(location);
}
</script>

<!-- 
$(document).ready(function(){
	
	var southWest = new google.maps.LatLng(40.744656,-74.005966); // Los Angeles, CA
	var northEast = new google.maps.LatLng(34.052234,-118.243685); // New York, NY
	var lngSpan = northEast.lng() - southWest.lng();
	var latSpan = northEast.lat() - southWest.lat();
		
	function MyOverlay( options )
	{
	    this.setValues( options );
	    this.markerLayer = $('<div />').addClass('overlay');
	};

	// MyOverlay is derived from google.maps.OverlayView
	MyOverlay.prototype = new google.maps.OverlayView;

	MyOverlay.prototype.onAdd = function()
	{
	    var $pane = $(this.getPanes().overlayImage); // Pane 4
        $pane.append( this.markerLayer );
	};

	MyOverlay.prototype.onRemove = function()
	{
		this.markerLayer.remove();
	};

	MyOverlay.prototype.draw = function()
	{
	    var projection = this.getProjection();
	    var zoom = this.getMap().getZoom();
	    var fragment = document.createDocumentFragment();
	    
	    this.markerLayer.empty(); // Empty any previous rendered markers
	    
		for(var i = 1; i < 1001; i++){
			// Determine a random location from the bounds set previously
			var randomLatlng = new google.maps.LatLng(
					southWest.lat() + latSpan * Math.random(),
					southWest.lng() + lngSpan * Math.random()
			);
			
			var randomLocation = projection.fromLatLngToDivPixel( randomLatlng );
				var $point = $('<div '
									+'class="map-point" '
									+'id="p'+i+'"'
									+'title="'+i+'" '
									+'style="'
										+'width:8px; '
										+'height:8px; '
										+'left:'+randomLocation.x+'px; '
										+'top:'+randomLocation.y+'px; '
										+'position:absolute; '
										+'cursor:pointer; '
								+'">'
									+'<img '
										+'src="fish-mini-20.png" '
										+'style="position: absolute; top: -6px; left: -6px" '
									+'/>'
								+'</div>');
				
				// For zoom 8 and closer show a title above the marker icon
				if( zoom >= 8 ){
					$point.append('<span '
									+'style="'
										+'position:absolute; '
										+'top:-22px; '
										+'left:-37px; '
										+'width:75px; '
										+'background-color:#fff; '
										+'border:solid 1px #000; '
										+'font-family: Arial, Helvetica, sans-serif; '
										+'font-size:10px; '
										+'text-align:center; '
									+'">'
										+'Custom ID '+i
									+'</span>');
				}
				
				// Append the HTML to the fragment in memory
				fragment.appendChild( $point.get(0) );
		}
		
		// Now append the entire fragment from memory onto the DOM
		this.markerLayer.append(fragment);
	};
	
	var myLatlng = new google.maps.LatLng(38.392303,-86.931067); // Jasper, IN
	
	var map = new google.maps.Map(document.getElementById("map-canvas"),
			{
				zoom: 4,
				center: myLatlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			});
	
	var OverlayMap = new MyOverlay( { map: map } );
	
	// A simple jQuery UI dialog for each marker
	var $dialog = $('<div id="dialog"></div>')
		.append('body')
		.dialog({
			autoOpen:false,
			width: 300,
			height: 200
		});

	$('#dialog').bind( "dialogopen", function( event, ui ){
		if($('body #dialog')){
			$dialog.parent().appendTo('#map-canvas');
		}
	});
	
	// Make sure to use live because the markers are rendered by javascript after initial DOM load
	$('.map-point').live('click',function( e ){
		$dialog.empty().append($(this).attr('id'));
		$dialog.dialog('open');
	});
});

 -->