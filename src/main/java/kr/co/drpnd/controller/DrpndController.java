package kr.co.drpnd.controller;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import com.google.gson.Gson;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.service.GeuntaeService;
import kr.co.drpnd.service.SawonService;
import kr.co.drpnd.type.TokenKey;
import kr.co.drpnd.util.DateUtil;
import kr.co.drpnd.util.SessionUtil;
import kr.co.drpnd.util.StringUtil;

@RequestMapping("/")
@Controller
public class DrpndController {

	@Resource(name="sawonService")
	SawonService sawonService;
	
	@Resource(name="geuntaeService")
	GeuntaeService geuntaeService;
	
	@GetMapping("main")
	public String index(ModelMap m) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		boolean gotoworkChecked = false;
		boolean offworkChecked = false;
		
		try {
			gotoworkChecked = geuntaeService.checkMyTodayGotowork(myInfo.getSawonCode());
			offworkChecked = geuntaeService.checkMyTodayOffwork(myInfo.getSawonCode());
		}
		catch(Exception e) {}
		
		m.put("currentDate", DateUtil.getCurrentDateString());
		m.put("isGotoworkChecked", gotoworkChecked);
		m.put("isOffworkChecked", offworkChecked);
		return "main";
	}
	
	@GetMapping("signin")
	public String signin() {
		return "signin";
	}
	
	@GetMapping("result/{errCode}")
	public String resultWithErrcode(@PathVariable(name="errCode", required=true) String errCode, ModelMap m) {
		m.addAttribute("errCode", StringUtil.getStringNullValue(errCode));
		return "result";
	}
	
	@GetMapping("result")
	public String result(ModelMap m) {
		m.addAttribute("errCode", "");
		return "result";
	}
	
	@GetMapping("floormap")
	public String floormap(ModelMap m) {
		createToken(m, TokenKey.FLOORMAP);
		Sawon sawon = SessionUtil.getSessionSawon();
		
		List<Sawon> sawonList = sawonService.getMyDepartmentAllSawon(sawon.getSawonDepartment());
		Gson g = new Gson();
		m.addAttribute("list", g.toJson(sawonList));
		return "floormap";
	}
	
	@GetMapping("reservation")
	public String reserve(ModelMap m) {
		return "reservation";
	}
	
	@GetMapping("forbidden")
	public String forbidden() {
		return "forbidden";
	}
	
	@GetMapping("checkSession")
	public String checkSession(ModelMap m) {
		return result(m);
	}
	
	private void createToken(ModelMap m, TokenKey key) {
		String token = SessionUtil.createToken();
		SessionUtil.getSessionSawon().setToken(key, token);
		
		m.addAttribute("_csrfToken", token);
	}
}
