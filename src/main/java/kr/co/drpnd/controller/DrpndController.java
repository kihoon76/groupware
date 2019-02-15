package kr.co.drpnd.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.domain.Team;
import kr.co.drpnd.service.CalendarService;
import kr.co.drpnd.service.GeuntaeService;
import kr.co.drpnd.service.GyeoljaeService;
import kr.co.drpnd.service.SawonService;
import kr.co.drpnd.type.TokenKey;
import kr.co.drpnd.util.DateUtil;
import kr.co.drpnd.util.RequestUtil;
import kr.co.drpnd.util.SessionUtil;
import kr.co.drpnd.util.StringUtil;

@RequestMapping("/")
@Controller
public class DrpndController {

	@Resource(name="sawonService")
	SawonService sawonService;
	
	@Resource(name="geuntaeService")
	GeuntaeService geuntaeService;
	
	@Resource(name="calendarService")
	CalendarService calendarService;
	
	@Resource(name="gyeoljaeService")
	GyeoljaeService gyeoljaeService;
	
	@GetMapping(value={"main", "m/main"})
	public String index(HttpServletRequest request, ModelMap m) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		boolean gotoworkChecked = false;
		boolean offworkChecked = false;
		String cuttentTime10 = "";
		String mygyeoljaeCount = "0";
		List<Team> teamList = null;
		
		try {
			cuttentTime10 = geuntaeService.getCuttentTime10();
			gotoworkChecked = geuntaeService.checkMyTodayGotowork(myInfo.getSawonCode());
			offworkChecked = geuntaeService.checkMyTodayOffwork(myInfo.getSawonCode());
			
			Map<String, Object> param = new HashMap<>();
			param.put("searchStatus", "A");
			param.put("searchTextType", "A");
			param.put("limitDate", "Y");
			param.put("sawonCode", myInfo.getSawonCode());
			param.put("size", 1);
			
			Map<String, Object> r = gyeoljaeService.getMyGyeoljaeTotalCount(param);
			mygyeoljaeCount = String.valueOf(r.get("total"));
		
			teamList = geuntaeService.getTeamList(myInfo.getSawonDepartment());
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		
		m.put("mygyeoljaeCount", mygyeoljaeCount);
		m.put("currentDate", DateUtil.getCurrentDateString());
		m.put("isGotoworkChecked", gotoworkChecked);
		m.put("isOffworkChecked", offworkChecked);
		m.put("sawonName", myInfo.getSawonName());
		m.put("sawonCode", myInfo.getSawonCode());
		m.put("currentTime10", cuttentTime10);
		
		
		if(RequestUtil.isMobile(request)) {
			m.put("footbar", "home");
			return "mobile/main";
		}
		else {
			if(teamList != null) {
				Gson g = new Gson();
				m.put("team", g.toJson(teamList));
			}
		}
		
		return "main";
	}
	
	@GetMapping("m/info")
	public String useInfo(ModelMap m) {
		m.put("footbar", "info");
		
		return "mobile/useInfo";
	}
	
	@GetMapping("signin")
	public String signin(HttpServletRequest request) {
		if(RequestUtil.isMobile(request)) {
			return "mobile/signin";
		}
		
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
		List<Map<String, Object>> todayVacationList = sawonService.getTodayVacationAllSawon(sawon.getSawonDepartment());
		List<Map<String, Object>> todayPlanList = sawonService.getTodayPlanAllSawon(sawon.getSawonDepartment());
		String reservationCount = calendarService.getTodayConferenceReservationCount();
		
		Gson g = new Gson();
		m.addAttribute("list", g.toJson(sawonList));
		m.addAttribute("vacation", g.toJson(todayVacationList));
		m.addAttribute("plan", g.toJson(todayPlanList));
		m.addAttribute("cr_count", reservationCount);
		m.addAttribute("currentDate", DateUtil.getCurrentDateString());
		m.addAttribute("mySeatNum", sawon.getSeatNum());
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
	
	@GetMapping("signatureview")
	public String viewSignature() {
		return "signature";
	}
	
	@PostMapping("reg/signature")
	@ResponseBody
	public AjaxVO regSignature(@RequestParam("sign") String sign) {
		
		AjaxVO vo = new AjaxVO();
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		try {
			System.err.println(sign);
			Map<String, String> m = new HashMap<>();
			m.put("sawonCode", myInfo.getSawonCode());
			m.put("sign", sign);
			sawonService.regSignature(m);
			
			myInfo.setSignature(sign);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("view/orgchart")
	public String viewChart() {
		return "orgchart";
	}
	
	private void createToken(ModelMap m, TokenKey key) {
		String token = SessionUtil.createToken();
		SessionUtil.getSessionSawon().setToken(key, token);
		
		m.addAttribute("_csrfToken", token);
	}
}
