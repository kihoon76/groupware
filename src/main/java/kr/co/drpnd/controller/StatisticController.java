package kr.co.drpnd.controller;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;

import kr.co.drpnd.domain.ExtjsStoreVO;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.service.StatisticService;
import kr.co.drpnd.util.SessionUtil;

@RequestMapping("/statistic")
@Controller
public class StatisticController {
	
	@Resource(name="statisticService")
	StatisticService statisticService;

	@PostMapping("overwork")
	@ResponseBody
	public ExtjsStoreVO<Map<String, Object>> getOverwork(
			@RequestParam("searchYear") int searchYear,
			@RequestParam("searchMonth") int searchMonth
			
	) {
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("searchYear", searchYear);
		param.put("searchMonth", searchMonth);
		param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
		
		
		List<Map<String, Object>> result = statisticService.getOverwork(param);
		
		ExtjsStoreVO<Map<String, Object>> extjsVo = new ExtjsStoreVO<>();
		extjsVo.setTotal(result.size());
		extjsVo.setDatas(result);
		
		return extjsVo;
	}
	
	@PostMapping("overwork/weekend")
	@ResponseBody
	public ExtjsStoreVO<Map<String, Object>> getOverworkWeekend(
			@RequestParam("searchYear") int searchYear,
			@RequestParam("searchMonth") int searchMonth
			
	) {
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("searchYear", searchYear);
		param.put("searchMonth", searchMonth);
		param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
		param.put("weekend", "Y");
		
		
		List<Map<String, Object>> result = statisticService.getOverwork(param);
		
		ExtjsStoreVO<Map<String, Object>> extjsVo = new ExtjsStoreVO<>();
		extjsVo.setTotal(result.size());
		extjsVo.setDatas(result);
		
		return extjsVo;
	}
	
	@PostMapping("overwork/teammonth")
	@ResponseBody
	public ExtjsStoreVO<Map<String, Object>> getOverworkTeamMonth(
			@RequestParam("searchYear") int searchYear
			
	) {
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("searchYear", searchYear);
		param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
		
		
		List<Map<String, Object>> result = statisticService.getOverworkTeamMonth(param);
		
		ExtjsStoreVO<Map<String, Object>> extjsVo = new ExtjsStoreVO<>();
		extjsVo.setTotal(result.size());
		extjsVo.setDatas(result);
		
		return extjsVo;
	}
	
	@PostMapping("overwork/teammonth/weekend")
	@ResponseBody
	public ExtjsStoreVO<Map<String, Object>> getOverworkWeekendTeamMonth(
			@RequestParam("searchYear") int searchYear
			
	) {
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("searchYear", searchYear);
		param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
		param.put("weekend", "Y");
		
		List<Map<String, Object>> result = statisticService.getOverworkTeamMonth(param);
		
		ExtjsStoreVO<Map<String, Object>> extjsVo = new ExtjsStoreVO<>();
		extjsVo.setTotal(result.size());
		extjsVo.setDatas(result);
		
		return extjsVo;
	}
}
