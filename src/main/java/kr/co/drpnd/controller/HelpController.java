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
}
