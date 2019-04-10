package kr.co.drpnd.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/help")
@Controller
public class HelpController {

	@GetMapping("gyeoljae/{cate}")
	public String viewGyeoljae(@PathVariable("cate") String cate) {
		return "help/gyeoljae/" + cate;
	}
	
	@GetMapping("statistics")
	public String viewStatistics() {
		return "help/statistics/statistics";
	}
	
	@GetMapping("company/event")
	public String viewCompany() {
		return "help/company/event";
	}
	
	@GetMapping("doc/{cate}")
	public String viewDocs(@PathVariable("cate") String cate) {
		return "help/doc/" + cate;
	}
	
	@GetMapping("project/{cate}")
	public String viewProject(@PathVariable("cate") String cate) {
		return "help/project/" + cate;
	}
}
