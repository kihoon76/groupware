package kr.co.drpnd.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/gyeoljae")
@Controller
public class GyeoljaeController {

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
}
