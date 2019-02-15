package kr.co.drpnd.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.ExtjsStoreVO;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.service.ProjectService;
import kr.co.drpnd.util.DateUtil;
import kr.co.drpnd.util.SessionUtil;

@RequestMapping("/project")
@Controller
public class ProjectController {

	@Resource(name="projectService")
	ProjectService projectService;
	
	@GetMapping("newwbs")
	public String viewNewWBS(ModelMap m) {
		m.put("currentDate", DateUtil.getCurrentDateString());
		return "project/newwbs";
	}
	
	@GetMapping("listwbs")
	public String viewListWBS(ModelMap m) {
		m.put("currentDate", DateUtil.getCurrentDateString());
		return "project/listwbs";
	}
	
	@PostMapping("reg/wbs")
	@ResponseBody
	public AjaxVO regWbs(@RequestBody Map<String, String> param) {
		Sawon sawon = SessionUtil.getSessionSawon();
		
		System.err.println(param.get("resources"));
		System.err.println(param.get("events"));
		System.err.println(param.get("title"));
		System.err.println(param.get("start"));
		System.err.println(param.get("range"));
		AjaxVO vo = new AjaxVO<>();
		
		try {
			param.put("writer", sawon.getSawonCode());
			projectService.createNewWBS(param);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@PostMapping("list/wbs")
	@ResponseBody
	public ExtjsStoreVO<Map> getListWbs(
			@RequestParam("limit") int limit,
			@RequestParam("start") int start,
			@RequestParam(name="ip", required=false) String ip) {
		Sawon sawon = SessionUtil.getSessionSawon();
		
		Map param = new HashMap();
		param.put("start", start);
		param.put("limit", limit);
		param.put("writer", sawon.getSawonCode());
		return projectService.getListWBS(param);
	}
}
