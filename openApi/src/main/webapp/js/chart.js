/*
 *  - Highmaps
 * 	Example : http://www.highcharts.com/maps/demo/map-drilldown
 *  Document : http://api.highcharts.com/highmaps
 * */
//var cityName;
function highMaps() {
    
	var me = this;

	me.chart = null;
	me.selected = '0';
	me.event = {
		select : function(){
			
		},
		unselect : function(){
			
		},
		drillup : function(){
			
		}
	};
	
	//me.init();
};
var d_data = [];
function dust(cityName, geojson2, e, chart, data1){
	console.log(cityName)
	var q = "cityName="+cityName;
	$.ajax({
		url:"/dust",
		type: 'post',
		data: q,
		success: function(data){
			console.log(data);
			for(var i=0;i<data.list.length;i++){
				d_data.push({
					key: data.list[i].cityName, value: data.list[i].pm25Value
				});
				console.log(d_data[i])
			}
			tinyCityDust(geojson2, e, chart, data1);
			console.log("성공");
		},
		error: function(e){
			console.log("실패");
		}
	});
}
var seoul, busan, daegu, incheon, gwangju, daejeon, ulsan, gyeonggi, gangwon,
	chungbuk, chungnam, jeonbuk, jeonnam, gyeongbuk, gyeongnam, jeju, sejong;
$(document).ready(function(){
	$.ajax({
		url:"/sido",
		type: 'post',
		success: function(data){
			seoul=data.list[0].seoul;
			busan=data.list[0].busan;
			daegu=data.list[0].daegu;
			incheon=data.list[0].incheon;
			gwangju=data.list[0].gwangju;
			daejeon=data.list[0].daejeon;
			ulsan=data.list[0].ulsan;
			gyeonggi=data.list[0].gyeonggi;
			gangwon = data.list[0].gangwon;
			chungbuk = data.list[0].chungbuk;
			chungnam = data.list[0].chungnam;
			jeonbuk = data.list[0].jeonbuk;
			jeonnam = data.list[0].jeonnam;
			gyeongbuk = data.list[0].gyeongbuk;
			gyeongnam = data.list[0].gyeongnam;
			jeju = data.list[0].jeju;
			sejong = data.list[0].sejong;
			console.log("성공");
			highMap.init();
		},
		error: function(e){
			console.log("실패");
		}
	});
});

highMaps.prototype.init = function(){
	var me = this;
	// 전국단위 지도 로드
	$.getJSON('./json/0.json', function (geojson) {
        var data = Highcharts.geojson(geojson, 'map');
        //pm25 대기 정보
        tinyDust(geojson);
        geomap(data, me);
        me.chart = $("#map").highcharts();
    });
};

function tinyDust(geojson){
	$.each(geojson.features, function(i, item) {
  	  var e_name = item.properties.eng_name.toLowerCase();
  	  if(e_name.indexOf('seoul')!=-1){
  		  this.properties.value = seoul;
  	 } else if(e_name.indexOf('busan')!=-1){
  		 this.properties.value = busan;
  	 }else if(e_name.indexOf('daegu')!=-1){
  		 this.properties.value = daegu;
  	 }else if(e_name.indexOf('incheon')!=-1){
  		 this.properties.value = incheon;
  	 }else if(e_name.indexOf('gwangju')!=-1){
  		 this.properties.value = gwangju;
  	 }else if(e_name.indexOf('daejeon')!=-1){
  		 this.properties.value =daejeon;
  	 }else if(e_name.indexOf('ulsan')!=-1){
  		 this.properties.value = ulsan;
  	 }else if(e_name.indexOf('gyeonggi')!=-1){
  		 this.properties.value = gyeonggi;
  	 }else if(e_name.indexOf('gangwon')!=-1){
  		 this.properties.value = gangwon;
  	 }else if(e_name.indexOf('chungcheongbuk')!=-1){
  		 this.properties.value = chungbuk;
  	 }else if(e_name.indexOf('chungcheongnam')!=-1){
  		 this.properties.value = chungnam;
  	 }else if(e_name.indexOf('jeollabuk')!=-1){
  		 this.properties.value = jeonbuk;
  	 }else if(e_name.indexOf('jellanam')!=-1){
  		 this.properties.value = jeonnam;
  	 }else if(e_name.indexOf('gyeongsangbuk')!=-1){
  		 this.properties.value = gyeongbuk;
  	 }else if(e_name.indexOf('gyeongsangnam')!=-1){
  		 this.properties.value = gyeongnam;
  	 }else if(e_name.indexOf('jeju')!=-1){
  		 this.properties.value = jeju;
  	 }else if(e_name.indexOf('sejong')!=-1){
  		 this.properties.value = sejong;
  	 }
  });
}

function geomap(data, me){
	$.each(data, function () {
    	this.drilldown = this.properties['code'];
    });
    $('#map').highcharts('Map', {
    	credits: { enabled: false },
        chart : {
            events: {
            	// drilldown : 클릭시 하위레벨로 진입
                drilldown: function (e) {
                    if (!e.seriesOptions) {
                    	// 상위레벨에서 선택한 부분의 코드값에 따라 하위레벨이 결정
                        var chart = this, mapKey = e.point.drilldown;
                        //하위 지도 오픈
                        $.getJSON('./json/' + mapKey + '.json', function (geojson2) {
                            data = Highcharts.geojson(geojson2, 'map');
                            dust(e.point.name, geojson2, e, chart, data);
                            //detailMap(e, chart, data);
                        });
                    }
                },
                drillup: function (e) {
                	me.selected = '0';
                	me.event.drillup();
                }
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },
        colorAxis: {
            min: 0,
            max: 150,
            //tickInterval: 100,
            minColor: 'blue',
            maxColor: 'red',
            startOnTick: false,
            endOnTick: false
            //stops: [[0, 'blue'], [0.25, 'green'], [0.5, 'yellow'], [0.75, 'red']]
          },
        series : [{
            data : data,
           // showInLegend: true,
            //allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
               // allowOverlap: false,
                //shadow: false,
                format: '{point.properties.name}'
            },
            states: {
            	// 상위 지도 hover 스타일 설정
                hover: {
                    color: 'gray',
                    borderColor: 'white'
                }
            },
            tooltip: {
            	headerFormat: '',
                pointFormat: '{point.properties.value}'
            }
        }],
        // 제목 제거
        title: null,
        // 부제목 제거
        subtitle: null,
        // 줌 설정
        mapNavigation: {
            enableMouseWheelZoom: true,
            enableTouchZoom : true
        },
        // 지역 선택시 하위 지도 띄우는 기능 설정
        drilldown: {
        	// 상위 지도 레이블 스타일 설정
            activeDataLabelStyle: {
            	color : '#000',
            	shadow: false,
                textShadow: '0 0 0px #000000',
                fontWeight: "none",
                textDecoration: 'none'
            },
            // 상위 지도 버튼 스타일 설정
            drillUpButton: {
                relativeTo: 'spacingBox'
            }
        },
        plotOptions: {
            series: {
                point : {
                	events: {
                        select: function () {
                        	// this.properties에 지정한 코드나 이름 값이 저장
                        	me.selected = this.properties.code;
                        	try {
                        		me.event.select();
                        	} catch(err){} 
                        },
                        unselect: function () {
                        	// 기본적으로는 select 이벤트 발생 후 unselect가 발생
                        	// 아래의 코드를 사용하면 unselect 적용 후 select 이벤트가 발생
                        	var p = this.series.chart.getSelectedPoints();
                            if(p.length > 0 && p[0].x == this.x) {
                            	try {
                            		me.event.unselect();
                            	} catch(err){} 
                            }
                            me.selected = this.properties.code.substring(0,2);
                            //alert(this.properties.name)
                        }
                    }
                }
            }
        }
    });
} //geomap end

function tinyCityDust(geojson2, e, chart, data){
	 $.each(geojson2.features, function(i, item) {
	  	 for(var i=0;i<d_data.length;i++){
	  		 if(item.properties.name.indexOf(d_data[i].key)!=-1){
	  			 this.properties.value = d_data[i].value;
	  			 //console.log(this.properties.value)
	  		 }
	  	 }
	 });
	detailMap(e, chart, data);
}


function detailMap(e, chart, data){
	chart.addSeriesAsDrilldown(e.point, {
        name: e.point.name,
        data: data,
        showInLegend: false,
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
            enabled: true,
            allowOverlap: false,
            format: '{point.name}',
            // 하위 지도 레이블 스타일 설정
            /* defaults : {
             * 		"color": "contrast", 
             * 		"fontSize": "11px", 
             * 		"fontWeight": "bold"; 
             * 		"textShadow": "0 0 6px contrast, 0 0 3px contrast" 
             * 	}
             *  디폴트 상태입니다. ex)textShadow: '0 0 0px #000000'를 설정하지 않는다면 textShadow 효과가 지속됩니다.
             *                                      * 
             * */
            /*style : {
            	color : '#000',
                textShadow: '0 0 0px #000000',
                fontWeight: "none",
                textDecoration: 'none'
            }*/
        },
        /*states: {
        	// 하위 지도 hover 스타일 설정
            hover: {
                color: '#99004C'
            },
            // 하위 지도 select 스타일 설정
            select: {
                color: 'blue'
            }
        },*/
        tooltip: {
        	headerFormat: '',
            pointFormat: '{point.properties.value}'
        }
    });
} //detailmap end

highMaps.prototype.drillUp = function(){
	var me = this;
	if( me.chart.drilldownLevels != undefined && me.chart.drilldownLevels.length > 0){
		me.chart.drillUp();
	}
};
highMaps.prototype.drillDown = function(code){
	var me = this;
	if(me.selected.substring(0,2) != code.substring(0,2)){
		// drilldown 상태라면 drillup 후에 drilldown 발생
		if( me.chart.drilldownLevels != undefined && me.chart.drilldownLevels.length > 0){
			me.chart.drillUp();
		}
		// data 중에 파라미터로 넘어온 code 값과 동일한 것이 있다면 그 data를 drilldown
		$.each(me.chart.series[0].data, function(idx, obj){
			if(obj.properties.code == code){
				obj.firePointEvent('click');
			}
		});
	}
};
highMaps.prototype.select = function(code){
	var me = this;
	me.unselect();
	$.each(me.chart.series[0].data, function(idx, obj){
		if(obj.properties.code == code){
			obj.select(true);
		}
	});
};
highMaps.prototype.unselect = function(code){
	var me = this;
	$.each(me.chart.series[0].data, function(idx, obj){
		obj.select(false);
	});
};