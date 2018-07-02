package com.open.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.open.service.OpenApiService;

//@CrossOrigin(origins="*")
@Controller
public class OpenController {
	
	@Autowired
	private OpenApiService service;

	@RequestMapping("/")
	public String main() {
		return "main";
	}
	
	@RequestMapping(value="/weather",method=RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> weather(@RequestParam Map<String, Object> map) {
		System.out.println("기상정보 호출");
		Map<String, Object> model = new HashMap<>();
		ArrayList<Map<String, Object>> list=service.callList(map);
		model.put("list", list);
		return model;
	}
	
	@RequestMapping(value="/dust", method=RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> dust(@RequestParam Map<String, Object> map){
		System.out.println("미세먼지 정보 호출");
		Map<String, Object> model = new HashMap<>();
		ArrayList<Map<String, Object>> list=service.callSidoDust(map);
		model.put("list", list);
		return model;
	}
	
	@RequestMapping(value="/sido", method=RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> sido(){
		Map<String, Object> model = new HashMap<>();
		ArrayList<Map<String, Object>> list=service.sido();
		model.put("list", list);
		return model;
	}

	@RequestMapping(value="/cityselect")
	@ResponseBody
	public Map<String, Object> cityselect(){
		Map<String, Object> model = new HashMap<>();
		List<Map<String, Object>> list=service.citySelect();
		model.put("list", list);
		return model;
	}

	@RequestMapping(value="/gugun")
	@ResponseBody
	public Map<String, Object> gugunselect(@RequestParam String admCode){
		Map<String, Object> model = new HashMap<>();
		List<Map<String, Object>> list=service.gugunSelect(admCode);
		model.put("list", list);
		return model;
	}
	
	@RequestMapping(value="/highmap")
	public String map() {
		return "highmap";
	}
	
	@RequestMapping(value="/map")
	public String omap() {
		return "map";
	}
	
	@RequestMapping(value="/leaf")
	public String leaf() {
		return "leaf";
	}
	
	@RequestMapping(value="/traffic")
	public String traffic() {
		return "traffic";
	}
	
	@RequestMapping(value="/sample")
	public String sample() {
		return "sample";
	}
	
	@RequestMapping(value="/gmap")
	public String gmap() {
		return "gmap";
	}
	
	@RequestMapping(value="/poly")
	public String poly() {
		return "poly";
	}
	
	@RequestMapping("/traf")
	@ResponseBody
	public Map<String, Object> traf(){
		Map<String, Object> map = new HashMap<>();
		ArrayList<Map<String, Object>> list=service.trafficInfo();
		map.put("list", list);
		return map;
	}
	
	@RequestMapping("/cctv")
	@ResponseBody
	public Map<String, Object> cctv(){
		Map<String, Object> map = new HashMap<>();
		ArrayList<Map<String, Object>> list=service.streetCctv();
		map.put("list", list);
		return map;
	}
	
	@RequestMapping("/accident")
	@ResponseBody
	public Map<String, Object> accident(){
		Map<String, Object> map = new HashMap<>();
		ArrayList<Map<String, Object>> list=service.readAccident();
		map.put("list", list);
		return map;
	}
	
/*
	@RequestMapping("/realCctv")
	@ResponseBody
	public Map<String, Object> realCctv(@RequestParam String cctvName, HttpServletResponse response){
		Map<String, Object> model = new HashMap<>();
		BufferedReader in = null;
		List<String> list = new ArrayList<>();
		try {
			URL obj = new URL("http://www.utic.go.kr/guide/cctvOpenData.do?key=aTOySLV39WUOQKd5V96SYaZNbpQszG9TqOCWmWDlRo47tovS955lYEiPjGt");
			HttpURLConnection con = (HttpURLConnection)obj.openConnection();
			
			con.setRequestMethod("GET");
			in = new BufferedReader(new InputStreamReader(con.getInputStream(), "UTF-8"));
			
			String line;
			while((line = in.readLine()) != null) {
				list.add(line);
				System.out.println(line);
			}
			model.put("list", list);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(in!=null) try {in.close();} catch (Exception e2) {e2.printStackTrace();}
		}
		return model;
	}
	*/
}
