package kr.co.drpnd.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.service.GyeoljaeService;
import kr.co.drpnd.util.SessionUtil;

@RequestMapping("/gyeoljae")
@Controller
public class GyeoljaeController {

	@Resource(name="gyeoljaeService")
	GyeoljaeService gyeoljaeService;
	
	@GetMapping("view/new")
	public String viewNewGyeoljae(ModelMap m) {
		SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");//dd/MM/yyyy
		Date now = new Date();
		String strDate = sdfDate.format(now);
		
		m.addAttribute("time", strDate);
		return "gyeoljae/newgyeoljae";
	}
	
	@GetMapping("view/overview")
	public String overviewGyeoljae() {
		
		return "gyeoljae/overview";
	}
	
	@PostMapping("search/sawon")
	@ResponseBody
	public AjaxVO<Map<String, String>> getSearchSawon(@RequestBody Map<String, Object> param) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		
		//Map<String, Object> param = new HashMap<>();
		param.put("department", myInfo.getSawonDepartment());
		String excludeSawonStr = String.valueOf(param.get("excludeSawon"));
		if(!StringUtils.isEmpty(excludeSawonStr)) {
			param.put("excludeSawonList", Arrays.asList(excludeSawonStr.split(",")));
		}
		
		try {
			List<Map<String, String>> list = gyeoljaeService.getGyeoljaeSawonList(param);
			vo.setDatas(list);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		
		return vo;
		
	}
	
	@GetMapping("myline")
	@ResponseBody
	public AjaxVO<Map<String, Object>> getMyLine() throws InterruptedException {
		
		AjaxVO<Map<String, Object>> vo = new AjaxVO<>();
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("department", myInfo.getSawonDepartment());
		param.put("teamCode", myInfo.getSawonTeam());
		param.put("position", myInfo.getSawonPosition());
		
		List<Map<String, Object>> list = gyeoljaeService.getMyDefaultGyeoljaeLine(param);
//		Map<String, Object> map1 = new HashMap<>();
//		
//		map1.put("sawonCode", "1");
//		map1.put("sawonName", "남기훈");
//		map1.put("sawonId", "khnam");
//		map1.put("sawonPosition", "차장");
//		map1.put("email", "test@tyty.com");
//		
//		vo.addObject(map1);
		vo.setDatas(list);
		vo.setSuccess(true);
		
		//Thread.sleep(5000);
		return vo;
	}
}
