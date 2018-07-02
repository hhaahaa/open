package com.open.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public interface OpenApiService {
	
	public ArrayList<Map<String, Object>> callList(Map<String, Object> model);
	public ArrayList<Map<String, Object>> callSidoDust(Map<String, Object> model); 
	public ArrayList<Map<String, Object>> sido(); 
	public ArrayList<Map<String, Object>> trafficInfo(); 

	public ArrayList<Map<String, Object>> readAccident(); 
	public ArrayList<Map<String, Object>> streetCctv();
	
	public List<Map<String, Object>> citySelect();
	public List<Map<String, Object>> gugunSelect(String sido);

}
