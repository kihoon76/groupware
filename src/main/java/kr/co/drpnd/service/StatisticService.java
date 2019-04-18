package kr.co.drpnd.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.StatisticDao;

@Service("statisticService")
public class StatisticService {

	@Resource(name="statisticDao")
	StatisticDao statisticDao;
	
	private Map<String, Object> findTeamOverwork(int teamCode, List<Map<String, Object>> teamOverworkList) {
		for(Map<String, Object> teamOverwork : teamOverworkList) {
			if((int)teamOverwork.get("teamCode") == teamCode) {
				return teamOverwork;
			}
		}
		
		return null;
	}
	
	private String getTipsMessage(Object time) {
		String timeStr = String.valueOf(time);
		int timeInt = Integer.parseInt(timeStr);
		int timeH = 0;
		int timeM = 0;
		if(timeInt >= 60) {
			timeH = timeInt/60;
			timeM = timeInt%60;
			timeStr = String.valueOf(time) + "분/<span class=\"chart-tips-strong\">" + timeH + "</span>시간" + timeM + "분";
		}
		else {
			timeStr = timeStr + "분";
		}
		
		return " (총 야근시간: " + timeStr + ")";
	}
	
	public List<Map<String, Object>> getOverwork(Map<String, Object> param) {
		List<List<Map<String, Object>>> result = statisticDao.selectOverwork(param);
		
		List<Map<String, Object>> teamOverworkList = result.get(0); 
		List<Map<String, Object>> sawonOverworkList = result.get(1); 
		List<Map<String, Object>> chartData = new ArrayList<>();
		
		int sawonOverworkListLen = sawonOverworkList.size();
		int teamCode = 0;
		Map<String, Object> m = null;
		int sawonIdx = 0;
		
		for(int i=0; i<=sawonOverworkListLen; i++) {
			
			if(i == sawonOverworkListLen) {
				chartData.add(m);
				break;
			}
			
			Map<String, Object> sawonOverwork = sawonOverworkList.get(i);
			
			
			int sawonTeamCode = (int)sawonOverwork.get("teamCode");
			String teamLeader = String.valueOf(sawonOverwork.get("teamLeader"));
			Object time = sawonOverwork.get("time");
			String sawonName = String.valueOf(sawonOverwork.get("sawonName"));
			
			if(teamCode != sawonTeamCode) {
				if(i > 0) {
					chartData.add(m);
				}
				
				sawonIdx = 0;
				m = new HashMap<>();
				sawonIdx++;
				Map<String, Object> teamMap = findTeamOverwork(sawonTeamCode, teamOverworkList);
				m.put("teamName", teamMap.get("teamName"));
				m.put("teamTotal", teamMap.get("time"));
				m.put("teamTotal_tips", teamMap.get("teamName") + getTipsMessage(teamMap.get("time")));
				
				teamCode = sawonTeamCode;
			}
			
			if("Y".equals(teamLeader)) {
				m.put("teamLeader", time);
				m.put("teamLeader_tips", "[팀장] " + sawonName + getTipsMessage(time));
			}
			else {
				m.put("sawon" + sawonIdx, time);
				m.put("sawon" + sawonIdx + "_tips", sawonName + getTipsMessage(time));
				sawonIdx++;
			}
		}
		
		return chartData;
	}

	public List<Map<String, Object>> getOverworkTeamMonth(Map<String, Object> param) {
		List<Map<String, Object>> result = statisticDao.selectOverworkMonth(param);
		
		List<Map<String, Object>> chartData = new ArrayList<>();
		int size = result.size();
		int idx = 0;
		for(int m=1; m<=12; m++) {
			List<Map<String, Object>> monthList = null;
			
			for(int i=idx, start = idx; i<size; i++) {
				Map<String, Object> teamOverwork = result.get(i);
				
				if(i == start) {
					monthList = new ArrayList<Map<String, Object>>();
				}
				
				if(String.valueOf(m).equals(String.valueOf(teamOverwork.get("month")))) {
					monthList.add(teamOverwork);
					idx++;
				}
				else {
					makeMonthRow(chartData, monthList);
					break;
				}
			}
			
			if(m == 12) {
				makeMonthRow(chartData, monthList);
			}
		}

		return chartData;
	}
	
	private void makeMonthRow(List<Map<String, Object>> chartData, List<Map<String, Object>> teamOverworkMonth) {
		int size = teamOverworkMonth.size();
		
		Map<String, Object> map = new HashMap<>();
		map.put("month", teamOverworkMonth.get(0).get("month") + "월");
		for(int i=0; i<size; i++) {
			map.put(String.valueOf(teamOverworkMonth.get(i).get("teamName")), teamOverworkMonth.get(i).get("time"));
			//map.put(String.valueOf(teamOverworkMonth.get(i).get("teamName") + "_color"), teamOverworkMonth.get(i).get("color"));
		}
		
		chartData.add(map);
	}
}
