package kr.co.drpnd.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.ExtjsStoreVO;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.domain.Wbs;
import kr.co.drpnd.service.ProjectService;
import kr.co.drpnd.util.DateUtil;
import kr.co.drpnd.util.SessionUtil;
import kr.co.drpnd.util.StringUtil;

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
	
	@GetMapping("mywbs")
	public String viewMyWBS(ModelMap m) {
		m.put("currentDate", DateUtil.getCurrentDateString());
		return "project/mywbs";
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
	
	@PostMapping("mod/wbs")
	@ResponseBody
	public AjaxVO modWbs(@RequestBody Map<String, String> param) {
		Sawon sawon = SessionUtil.getSessionSawon();
		
		System.err.println(param.get("resources"));
		System.err.println(param.get("events"));
		System.err.println(param.get("title"));
		System.err.println(param.get("start"));
		System.err.println(param.get("range"));
		System.err.println(param.get("code"));
		AjaxVO vo = new AjaxVO<>();
		
		try {
			param.put("writer", sawon.getSawonCode());
			projectService.modifyMyWBS(param);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("del/wbs/{code}")
	@ResponseBody 
	public AjaxVO delWbs(@PathVariable("code") String code) {
		Sawon sawon = SessionUtil.getSessionSawon();
		
		AjaxVO vo = new AjaxVO<>();
		
		try {
			Map<String, String> param = new HashMap<>();
			param.put("writer", sawon.getSawonCode());
			param.put("code", code);
			projectService.removeMyWBS(param);
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
	public ExtjsStoreVO<Wbs> getListWbs(
			@RequestParam("limit") int limit,
			@RequestParam("start") int start,
			@RequestParam(name="wbsName", required=false) String wbsName,
			@RequestParam(name="writer", required=false) String writer,
			@RequestParam(name="range", required=false) String range) {
		Sawon sawon = SessionUtil.getSessionSawon();
		
		Map param = new HashMap();
		param.put("start", start);
		param.put("limit", limit);
		param.put("sawonCode", sawon.getSawonCode());
		param.put("myTeam", sawon.getSawonTeam());
		param.put("department", sawon.getSawonDepartment());
		param.put("range", (range == null) ? "D" : range );
		
		
		if(wbsName != null && !"".equals(wbsName)) {
			param.put("wbsName", StringUtil.escapeMsSql(wbsName));
		}
		
		if(writer != null && !"".equals(writer)) {
			param.put("writer", writer);
		}
		
		return projectService.getListWBS(param);
	}
	
	@PostMapping("list/mywbs")
	@ResponseBody
	public ExtjsStoreVO<Wbs> getListMyWbs(
			@RequestParam("limit") int limit,
			@RequestParam("start") int start,
			@RequestParam(name="wbsName", required=false) String wbsName,
			@RequestParam(name="range", required=false) String range) {
		Sawon sawon = SessionUtil.getSessionSawon();
		
		Map param = new HashMap();
		param.put("start", start);
		param.put("limit", limit);
		param.put("sawonCode", sawon.getSawonCode());
		param.put("range", (range == null) ? "D" : range );
		
		
		if(wbsName != null && !"".equals(wbsName)) {
			param.put("wbsName", StringUtil.escapeMsSql(wbsName));
		}
		
		return projectService.getListMyWBS(param);
	}
}
