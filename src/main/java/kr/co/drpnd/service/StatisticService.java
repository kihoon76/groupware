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
		return " (총 야근시간: " + String.valueOf(time) + ")";
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
}
