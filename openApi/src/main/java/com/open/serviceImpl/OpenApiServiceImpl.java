package com.open.serviceImpl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import com.open.service.OpenApiService;

@Service("openApiServiceImpl")
public class OpenApiServiceImpl implements OpenApiService{
	private static String URL = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService2/ForecastGrib";
	private static String KEY = "9pUaOiX4C%2BiH1Rt21Bq0dLJbh2Edo6TOS4JFKHcsNK69ezsQ2p1uHBJUWTcAF4Pzybzv5RkKh7gDMY6TL2YvlQ%3D%3D";
	
	private static String DUSTURL="http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/";
	private static String S_KEY="9pUaOiX4C%2BiH1Rt21Bq0dLJbh2Edo6TOS4JFKHcsNK69ezsQ2p1uHBJUWTcAF4Pzybzv5RkKh7gDMY6TL2YvlQ%3D%3D";
	private static DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();

	@Override
	public ArrayList<Map<String, Object>> callList(Map<String, Object> model) {
		ArrayList<Map<String, Object>> allList = new ArrayList<Map<String, Object>>();
	        try {
	        	String serviceKey= "?" + URLEncoder.encode("ServiceKey","UTF-8") + "=" + KEY;
	        	String parameter="&" + URLEncoder.encode("base_time","UTF-8") + "=" + model.get("base_time");
	        	parameter += "&" + URLEncoder.encode("base_date","UTF-8") + "=" + model.get("base_date");
	        	parameter += "&" + URLEncoder.encode("nx","UTF-8") + "=" + model.get("nx");
	        	parameter += "&" + URLEncoder.encode("ny","UTF-8") + "=" + model.get("ny");
	        	parameter += "&pageNo=1&numOfRows=20";
	        	
	        	String urlstr = URL+serviceKey+ parameter;
	        	System.out.println(urlstr);
	        	
	        	DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
				Document doc = dBuilder.parse(urlstr);
	
				Element root = doc.getDocumentElement();
				NodeList nList = root.getElementsByTagName("item");
				
				//System.out.println("가져올 리스트 수 : " + nList.getLength());
				if(nList.getLength()==0) {
					HashMap<String, Object> map = new HashMap<String, Object>();
					map.put("obsrValue", root.getElementsByTagName("resultCode")); 
				}else {
					for(int i=0;i<nList.getLength();i++) {
						HashMap<String, Object> map = new HashMap<String, Object>();
						map.put("obsrValue", root.getElementsByTagName("obsrValue").item(i).getTextContent().toString()); 
						map.put("category", root.getElementsByTagName("category").item(i).getTextContent().toString()); 
						
						allList.add(map);
					}
				}
	        }catch (Exception e) {
				System.out.println(e.getMessage());
			}
	        return allList;
	} // END
	
	@Override
	public ArrayList<Map<String, Object>> callSidoDust(Map<String, Object> model) {
		ArrayList<Map<String, Object>> allList = new ArrayList<Map<String, Object>>();
		String sidoName = city((String) model.get("cityName"));
		try {
			String serviceKey= "?" + URLEncoder.encode("ServiceKey","UTF-8") + "=" + S_KEY;
        	String parameter="&" + URLEncoder.encode("sidoName","UTF-8") + "="+sidoName;
        	parameter += "&" + URLEncoder.encode("searchCondition","UTF-8") + "="+URLEncoder.encode("HOUR","UTF-8");
        	parameter += "&pageNo=1&numOfRows=40";
        	
        	String urlstr = DUSTURL+"getCtprvnMesureSidoLIst"+serviceKey+ parameter;
        	
        	System.out.println(urlstr);
        	DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(urlstr);

			Element root = doc.getDocumentElement();
			NodeList nList = root.getElementsByTagName("item");
			
			System.out.println("가져올 리스트 수 : " + nList.getLength());
			for(int i=0;i<nList.getLength();i++) {
				String so2 = "-", co = "-", o3 = "-", no2 = "-", pm10 = "-", pm25 = "-";
				try {
					so2 =  root.getElementsByTagName("so2Value").item(i).getTextContent().toString();
				} catch (Exception e) {
				}
				
				try {
					co =  root.getElementsByTagName("coValue").item(i).getTextContent().toString();
				} catch (Exception e) {
				}
				
				try {
					o3 =  root.getElementsByTagName("o3Value").item(i).getTextContent().toString();
				} catch (Exception e) {
				}
				
				try {
					no2 =  root.getElementsByTagName("no2Value").item(i).getTextContent().toString();
				} catch (Exception e) {
				}
				
				try {
					pm10 =  root.getElementsByTagName("pm10Value").item(i).getTextContent().toString();
				} catch (Exception e) {
				}
				
				try {
					pm25 =  root.getElementsByTagName("pm25Value").item(i).getTextContent().toString();
				} catch (Exception e) {
				}
				/*
				try {
					khai =  root.getElementsByTagName("khai").item(i).getTextContent().toString();
				} catch (Exception e) {
				}
				
				try {
					khaiG =  root.getElementsByTagName("khaiGrade").item(i).getTextContent().toString();
				} catch (Exception e) {
				}*/
				HashMap<String, Object> map = new HashMap<String, Object>();
				//String addr= findStation(sidoName, root.getElementsByTagName("stationName").item(i).getTextContent().toString());
				
				map.put("dataTime", root.getElementsByTagName("dataTime").item(i).getTextContent().toString()); //측정일시
				map.put("cityName",root.getElementsByTagName("cityName").item(i).getTextContent().toString());
				map.put("so2Value", so2); //아황산가스 평균농도
				map.put("coValue", co); //일산화탄소 평균농도
				map.put("o3Value", o3); //오존 평균농도
				map.put("no2Value", no2); //이산화질소 평균농도
				map.put("pm10Value",pm10); //미세먼지 평균농도
				map.put("pm25Value", pm25); //초 미세먼지 평균농도
//				map.put("khai", khai); //통합 대기 환경 수치
//				map.put("khaiGrade", khaiG); // 통합 대기 환경지수
/*				map.put("so2Grade", root.getElementsByTagName("so2Grade").item(i).getTextContent().toString()); //아황산가스 지수
				map.put("coGrade", root.getElementsByTagName("coGrade").item(i).getTextContent().toString()); //일산화탄소 지수
				map.put("o3Grade", root.getElementsByTagName("o3Grade").item(i).getTextContent().toString()); //오존 지수
				map.put("no2Grade", root.getElementsByTagName("no2Grade").item(i).getTextContent().toString()); //이산화질소 지수
				map.put("pm10Grade", root.getElementsByTagName("pm10Grade").item(i).getTextContent().toString()); //미세먼지 24시간 등급
				map.put("pm25Grade", root.getElementsByTagName("pm25Grade").item(i).getTextContent().toString());
				map.put("pm10Grade1H", root.getElementsByTagName("pm10Grade1H").item(i).getTextContent().toString()); //미세먼지 1시간 등급
				map.put("pm25Grade1H", root.getElementsByTagName("pm25Grade1H").item(i).getTextContent().toString());
*/
				allList.add(map);
			}
		} catch (Exception e) {
			System.out.println("실패: "+e.getMessage());
		}
		
		//+ "sidoName=시도명&searchCondition=DAILY&pageNo=1&numOfRows=10&ServiceKey=서비스키";
		return allList;
	}
	
	public String city(String name) {
		String sidoName="";
		//서울, 부산, 대구, 인천, 광주, 대전, 울산, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주, 세종
		// 서울, 부산, 대구 ,인천, 광주, 대전, 울산, 충북, 충남, 전남, 전북, 경남, 경북, 
		if(name.contains("서울")) {
			sidoName="서울";
		} else if(name.contains("광역시")) {
			sidoName=name.replace("광역시", "");
		}else if(name.contains("충청북도")) {
			sidoName="충북";
		}else if(name.contains("충청남도")) {
			sidoName="충남";
		}else if(name.contains("전라북도")) {
			sidoName="전북";
		}else if(name.contains("전라남도")) {
			sidoName="전남";
		}else if(name.contains("경상북도")) {
			sidoName="경북";
		}else if(name.contains("경상남도")) {
			sidoName="경남";
		}else if(name.contains("제주")) {
			sidoName="제주";
		}else if(name.contains("세종")) {
			sidoName="세종";
		}else if(name.contains("도")) {
			sidoName=name.replace("도", "");
		}
		
		return sidoName;
	}
	
	public String findStation(String sidoName, String stationName) {
		String s_url =  "http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getMsrstnList";
		String svc_key = "9pUaOiX4C%2BiH1Rt21Bq0dLJbh2Edo6TOS4JFKHcsNK69ezsQ2p1uHBJUWTcAF4Pzybzv5RkKh7gDMY6TL2YvlQ%3D%3D";
		
		String serviceKey;
		String addr="서울 강남구";
		try {
			serviceKey = "?" + URLEncoder.encode("ServiceKey","UTF-8") + "=" + svc_key;
			String parameter="&" + URLEncoder.encode("addr","UTF-8") + "="+sidoName;
			parameter+="&" + URLEncoder.encode("stationName","UTF-8") + "="+stationName;
			parameter += "&pageNo=1&numOfRows=40";
			
			String urlstr = s_url+serviceKey+ parameter;
			
			System.out.println(urlstr);
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(urlstr);

			Element root = doc.getDocumentElement();
			//NodeList nList = root.getElementsByTagName("item");
			try {
				addr =  root.getElementsByTagName("addr").item(0).getTextContent().toString();
			} catch (Exception e) {
			}
			System.out.println(addr);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return addr;
	}

	//지역별 날씨 정보
	@Override
	public ArrayList<Map<String, Object>> sido() {
		ArrayList<Map<String, Object>> allList = new ArrayList<Map<String, Object>>();
		try {
			String serviceKey= "?" + URLEncoder.encode("ServiceKey","UTF-8") + "=" + S_KEY;
        	String parameter="&" + URLEncoder.encode("itemCode","UTF-8") + "="+URLEncoder.encode("PM10","UTF-8");
        	parameter+="&" + URLEncoder.encode("dataGubun","UTF-8") + "="+URLEncoder.encode("HOUR","UTF-8");
        	parameter+="&" + URLEncoder.encode("searchCondition","UTF-8") + "="+URLEncoder.encode("WEEK","UTF-8");
        	parameter += "&pageNo=1&numOfRows=1";
        	
        	String urlstr = DUSTURL+"getCtprvnMesureLIst"+serviceKey+ parameter;
        	
        	System.out.println(urlstr);
        	DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(urlstr);

			Element root = doc.getDocumentElement();
			NodeList nList = root.getElementsByTagName("item");
			
			System.out.println("가져올 리스트 수 : " + nList.getLength());
			for(int i=0;i<nList.getLength();i++) {
				
				HashMap<String, Object> map = new HashMap<String, Object>();
				
				map.put("dataTime", root.getElementsByTagName("dataTime").item(i).getTextContent().toString()); //측정일시
				map.put("서울", root.getElementsByTagName("seoul").item(i).getTextContent().toString());
				map.put("부산", root.getElementsByTagName("busan").item(i).getTextContent().toString());
				map.put("대구", root.getElementsByTagName("daegu").item(i).getTextContent().toString());
				map.put("인천", root.getElementsByTagName("incheon").item(i).getTextContent().toString());
				map.put("광주", root.getElementsByTagName("gwangju").item(i).getTextContent().toString());
				map.put("대전", root.getElementsByTagName("daejeon").item(i).getTextContent().toString());
				map.put("울산", root.getElementsByTagName("ulsan").item(i).getTextContent().toString());
				map.put("경기", root.getElementsByTagName("gyeonggi").item(i).getTextContent().toString());
				map.put("강원", root.getElementsByTagName("gangwon").item(i).getTextContent().toString());
				map.put("충북", root.getElementsByTagName("chungbuk").item(i).getTextContent().toString());
				map.put("충남", root.getElementsByTagName("chungnam").item(i).getTextContent().toString());
				map.put("전북", root.getElementsByTagName("jeonbuk").item(i).getTextContent().toString());
				map.put("전남", root.getElementsByTagName("jeonnam").item(i).getTextContent().toString());
				map.put("경북", root.getElementsByTagName("gyeongbuk").item(i).getTextContent().toString());
				map.put("경남", root.getElementsByTagName("gyeongnam").item(i).getTextContent().toString());
				map.put("제주", root.getElementsByTagName("jeju").item(i).getTextContent().toString());
				map.put("세종", root.getElementsByTagName("sejong").item(i).getTextContent().toString());
				allList.add(map);
			}
		} catch (Exception e) {
			System.out.println("실패: "+e.getMessage());
		}
		
		return allList;
	}

	@Override
	public ArrayList<Map<String, Object>> trafficInfo() {
		ArrayList<Map<String, Object>> allList = new ArrayList<Map<String, Object>>();
		try {
//			String trafUrl = "http://openapi.seoul.go.kr:8088/614c6a736663686c39337a6d614d7a/xml/TrafficInfo/1/5/1220003800";
			String trafUrl = "http://openapi.seoul.go.kr:8088/614c6a736663686c39337a6d614d7a/xml/AccInfo/1/10/";
	    	DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(trafUrl);
			Element root = doc.getDocumentElement();
			
			String totalCount = root.getElementsByTagName("list_total_count").item(0).getTextContent().toString();
			
			trafUrl = "http://openapi.seoul.go.kr:8088/614c6a736663686c39337a6d614d7a/xml/AccInfo/1/"+totalCount+"/";
			doc = dBuilder.parse(trafUrl);
			root = doc.getDocumentElement();
			
			NodeList nList = root.getElementsByTagName("row");
			
			System.out.println("가져올 리스트 수 : " + nList.getLength());
			for(int i=0;i<nList.getLength();i++) {
			
				HashMap<String, Object> map = new HashMap<String, Object>();
				
				map.put("link_id", root.getElementsByTagName("link_id").item(i).getTextContent().toString());
				map.put("occr_date", root.getElementsByTagName("occr_date").item(i).getTextContent().toString());
				map.put("occr_time", root.getElementsByTagName("occr_time").item(i).getTextContent().toString());
				map.put("exp_clr_date", root.getElementsByTagName("exp_clr_date").item(i).getTextContent().toString());
				map.put("exp_clr_time", root.getElementsByTagName("exp_clr_time").item(i).getTextContent().toString());
				map.put("acc_type", root.getElementsByTagName("acc_type").item(i).getTextContent().toString());
				map.put("acc_dtype", root.getElementsByTagName("acc_dtype").item(i).getTextContent().toString());
				map.put("grs80tm_x", root.getElementsByTagName("grs80tm_x").item(i).getTextContent().toString());
				map.put("grs80tm_y", root.getElementsByTagName("grs80tm_y").item(i).getTextContent().toString());
				map.put("acc_info", root.getElementsByTagName("acc_info").item(i).getTextContent().toString());
				allList.add(map);
				System.out.println(map);
			}
	} catch (Exception e) {
		System.out.println("실패: "+e.getMessage());
	}
	
	return allList;
	}

	@Override
	public ArrayList<Map<String, Object>> readAccident() {
		ArrayList<Map<String, Object>> allList = new ArrayList<Map<String, Object>>();
		try {
			String serviceKey= "aTOySLV39WUOQKd5V96SYaZNbpQszG9TqOCWmWDlRo47tovS955lYEiPjGt";
        	String urlstr = "http://www.utic.go.kr/guide/imsOpenData.do?key="+serviceKey;
        	
        	System.out.println(urlstr);
        	DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(urlstr);

			Element root = doc.getDocumentElement();
			NodeList nList = root.getElementsByTagName("record");
			
			System.out.println("돌발사고 가져올 리스트 수 : " + nList.getLength());
			for(int i=0;i<nList.getLength();i++) {
				HashMap<String, Object> map = new HashMap<String, Object>();
				map.put("incidentId", root.getElementsByTagName("incidentId").item(i).getTextContent().toString());
				map.put("incidenteTypeCd", root.getElementsByTagName("incidenteTypeCd").item(i).getTextContent().toString());
				// 1:사고 2: 공사 3:행사 4:기상 5:통제
				map.put("incidenteSubTypeCd", root.getElementsByTagName("incidenteSubTypeCd").item(i).getTextContent().toString());
				map.put("addressJibun", root.getElementsByTagName("addressJibun").item(i).getTextContent().toString());
				map.put("addressJibunCd", root.getElementsByTagName("addressJibunCd").item(i).getTextContent().toString());
				map.put("addressNew", root.getElementsByTagName("addressNew").item(i).getTextContent().toString());
				map.put("linkId", root.getElementsByTagName("linkId").item(i).getTextContent().toString());
				map.put("locationDataX", root.getElementsByTagName("locationDataX").item(i).getTextContent().toString());
				map.put("locationDataY", root.getElementsByTagName("locationDataY").item(i).getTextContent().toString());
				map.put("locationTypeCd", root.getElementsByTagName("locationTypeCd").item(i).getTextContent().toString());
				//C0101 지점 C0103:구간 C0102:영역
				map.put("locationData", root.getElementsByTagName("locationData").item(i).getTextContent().toString());
				map.put("incidenteTrafficCd", root.getElementsByTagName("incidenteTrafficCd").item(i).getTextContent().toString());
				//A0501: 원활 A0502: 지체 A0503:정체
				map.put("incidenteGradeCd", root.getElementsByTagName("incidenteGradeCd").item(i).getTextContent().toString());
				//A0401: A등급 A0402:B등급 A0403:C등급
				map.put("incidentTitle", root.getElementsByTagName("incidentTitle").item(i).getTextContent().toString());
				map.put("incidentRegionCd", root.getElementsByTagName("incidentRegionCd").item(i).getTextContent().toString());
				map.put("startDate", root.getElementsByTagName("startDate").item(i).getTextContent().toString());
				map.put("endDate", root.getElementsByTagName("endDate").item(i).getTextContent().toString());
				map.put("lane", root.getElementsByTagName("lane").item(i).getTextContent().toString());
				map.put("roadName", root.getElementsByTagName("roadName").item(i).getTextContent().toString());
				allList.add(map);
				
				System.out.println(map);
			}
		} catch (Exception e) {
			System.out.println("실패: "+e.getMessage());
		}
		
		return allList;
	}

	@Override
	public ArrayList<Map<String, Object>> streetCctv() {
		File file = new File("C:/Users/Administrator/Desktop/OpenDataCCTV.xlsx");
		XSSFWorkbook wb = null;
		ArrayList<Map<String, Object>> map = new ArrayList<Map<String, Object>>();
		
		try {
 
            // 엑셀 파일 오픈
            wb = new XSSFWorkbook(new FileInputStream(file));
            
            // 첫번재 sheet 내용 읽기
            for (Row row : wb.getSheetAt(0)) { 
            	
            	Map<String, Object> model = new HashMap<>();
                // 셋째줄부터..
                if (row.getRowNum() < 2) {
                    continue;
                }
                
                // 두번째 셀이 비어있으면 for문을 멈춘다.
                if(row.getCell(1) == null){
                    break;
                }
                String cctvName = row.getCell(2).getStringCellValue();
                String cctvId = row.getCell(1).getStringCellValue();
                String centerName = row.getCell(3).getStringCellValue();
                Double xCoord = row.getCell(4).getNumericCellValue();
                String xCoordStr = xCoord.toString();
                Double yCoord = row.getCell(5).getNumericCellValue();
                String yCoordStr = yCoord.toString();
                
                model.put("cctvName", cctvName);
                model.put("cctvId", cctvId);
                model.put("centerName", centerName);
                model.put("xCoord", xCoordStr);
                model.put("yCoord", yCoordStr);
                
                map.add(model);
            }
        } catch (FileNotFoundException fe) {
            System.out.println("FileNotFoundException >> " + fe.toString());
        } catch (IOException ie) {
            System.out.println("IOException >> " + ie.toString());
        }
		
		return map;
	}

	//===========================================================================================
	@Override
	public List<Map<String, Object>> citySelect() {
		List<Map<String, Object>> list = new ArrayList<>();
		
		String url="http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admCodeList.xml"; /* URL */   
        try {
			String key="?" + URLEncoder.encode("authkey","UTF-8") + "=350264dd10fbcc773e94e6";
			url = url+key;
			System.out.println(url);
			
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(url);
			
			Element root = doc.getDocumentElement();
			NodeList nList = root.getElementsByTagName("admVOList");
			for(int i=0;i<nList.getLength();i++) {
				Map<String, Object> model = new HashMap<>();
				model.put("admCodeNm", root.getElementsByTagName("admCodeNm").item(i).getTextContent().toString());
				model.put("admCode", root.getElementsByTagName("admCode").item(i).getTextContent().toString());
				model.put("lowestAdmCodeNm", root.getElementsByTagName("lowestAdmCodeNm").item(i).getTextContent().toString());
				
				list.add(model);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return list;
	}
	
	@Override
	public List<Map<String, Object>> gugunSelect(String sido) {
	List<Map<String, Object>> list = new ArrayList<>();
		String url="http://openapi.nsdi.go.kr/nsdi/eios/service/rest/AdmService/admSiList.xml"; /* URL */   
        try {
			String key="?" + URLEncoder.encode("authkey","UTF-8") + "=c384968ddeccd585e82cc8";
			String q="&" + URLEncoder.encode("admCode","UTF-8") + "="+URLEncoder.encode(sido, "UTF-8");
			url = url+key+q;
			
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(url);
			
			Element root = doc.getDocumentElement();
			NodeList nList = root.getElementsByTagName("admVOList");
			
			for(int i=0;i<nList.getLength();i++) {
				Map<String, Object> model = new HashMap<>();
				model.put("admCodeNm", root.getElementsByTagName("admCodeNm").item(i).getTextContent().toString());
				model.put("admCode", root.getElementsByTagName("admCode").item(i).getTextContent().toString());
				model.put("lowestAdmCodeNm", root.getElementsByTagName("lowestAdmCodeNm").item(i).getTextContent().toString());
				
				list.add(model);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

}//class end
