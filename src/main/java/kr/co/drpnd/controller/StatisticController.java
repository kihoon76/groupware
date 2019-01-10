package kr.co.drpnd.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

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
	public void getOverwork(
			@RequestParam("searchYear") int searchYear,
			@RequestParam("searchMonth") int searchMonth
			
	) {
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, Object> param = new HashMap<String, Object>();
		param.put("searchYear", searchYear);
		param.put("searchMonth", searchMonth);
		param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
	}
}
