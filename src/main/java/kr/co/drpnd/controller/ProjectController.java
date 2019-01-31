package kr.co.drpnd.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.co.drpnd.util.DateUtil;

@RequestMapping("/project")
@Controller
public class ProjectController {

	@GetMapping("newproject")
	public String viewNewProject(ModelMap m) {
		m.put("currentDate", DateUtil.getCurrentDateString());
		return "project/newproject";
	}
}
