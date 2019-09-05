package kr.co.drpnd.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

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
import kr.co.drpnd.domain.VacationDocs;
import kr.co.drpnd.exception.AppTokenError;
import kr.co.drpnd.service.CalendarService;
import kr.co.drpnd.service.CodeService;
import kr.co.drpnd.service.GeuntaeService;
import kr.co.drpnd.service.GyeoljaeService;
import kr.co.drpnd.service.SawonService;
import kr.co.drpnd.type.TokenKey;
import kr.co.drpnd.util.CommonUtil;
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
	
	@Resource(name="codeService")
	CodeService codeService;
	
	@Resource(name="commonUtil")
	CommonUtil commonUtil;
	
	@GetMapping(value={"main", "m/main"})
	public String index(
			HttpServletRequest request,
			HttpServletResponse response,
			ModelMap m,
			@RequestParam(name="token", required=false) String token,
			@RequestParam(name="kind", required=false) String kind) throws IOException {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		boolean gotoworkChecked = false;
		boolean offworkChecked = false;
		boolean yesterdayOffworkNotAuto = true;
		
		String cuttentTime10 = "";
		//String mygyeoljaeCount = "0";
		List<Team> teamList = null;
		List<Object> overworkTypes = null;
		
		try {
			cuttentTime10 = geuntaeService.getCuttentTime10();
			if("Y".equals(myInfo.getJaetaeg())) {
				gotoworkChecked = true;
				offworkChecked = true;
			}
			else {
				gotoworkChecked = geuntaeService.checkMyTodayGotowork(myInfo.getSawonCode());
				offworkChecked = geuntaeService.checkMyTodayOffwork(myInfo.getSawonCode());
			}
			
			yesterdayOffworkNotAuto = geuntaeService.checkYesterdayOffworkNotAuto(myInfo.getSawonCode());
			
			
			/*Map<String, Object> param = new HashMap<>();
			param.put("searchStatus", "A");
			param.put("searchTextType", "A");
			param.put("searchGyeoljaeType", "A");
			param.put("limitDate", "Y");
			param.put("sawonCode", myInfo.getSawonCode());
			param.put("size", 1);
			
			Map<String, Object> r = gyeoljaeService.getMyGyeoljaeTotalCount(param);
			mygyeoljaeCount = String.valueOf(r.get("total"));*/
			
			teamList = geuntaeService.getTeamList(myInfo.getSawonDepartment());
			overworkTypes = codeService.getOverwork();
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		
		//m.put("mygyeoljaeCount", commonUtil.getMyGyeoljaeTotalCount(myInfo.getSawonCode()));
		commonUtil.getMyGyeoljaeTotalCount(m, myInfo.getSawonCode());
		m.put("currentDate", DateUtil.getCurrentDateString());
		m.put("isGotoworkChecked", gotoworkChecked);
		m.put("isOffworkChecked", offworkChecked);
		m.put("sawonName", myInfo.getSawonName());
		m.put("sawonCode", myInfo.getSawonCode());
		m.put("currentTime10", cuttentTime10);
		m.put("yesterdayOffworkNotAuto", yesterdayOffworkNotAuto);
		
		if(RequestUtil.isMobile(request)) {
			
			/**
			 * 모바일에서 외근/내근 전환 
			 */
			try {
				Map<String, Integer> meMap = new HashMap<>();
				meMap.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
				meMap.put("department", Integer.parseInt(myInfo.getSawonDepartment()));
				Sawon me = sawonService.getTodayMyGeuntaeByMobile(meMap);
				m.put("me", me);
			}
			catch(Exception e) {
				e.printStackTrace();
			}
			
			
			StringBuilder options = new StringBuilder();
			if(overworkTypes != null) {
				int len = overworkTypes.size();
				for(int i=0; i<len; i++) {
					Map o = (Map)overworkTypes.get(i);
					options.append("<option value='" + o.get("overworkCode") + "'>" + o.get("overworkName") + "</option>");
				}
				
				m.put("overworkTypes", options.toString());
			}
			
			//app으로 접속했을 경우
			if(token != null) {
				if(!myInfo.isAppChecked()) {
					Map<String, String> app = new HashMap<>();
					app.put("token", token);
					app.put("kind", kind);
					app.put("sawonCode", myInfo.getSawonCode());
					app.put("result", "");
					
					try {
						sawonService.regDevice(app);
						myInfo.setAppChecked(true);
					}
					catch(AppTokenError e) {
						response.sendRedirect("/logout");
					}
					catch(Exception e) {
						response.sendRedirect("/logout");
					}
				}
			}
			
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
		commonUtil.getMyGyeoljaeTotalCount(m, SessionUtil.getSessionSawon().getSawonCode());
		m.put("footbar", "info");
		return "mobile/useInfo";
	}
	
	@GetMapping("signin")
	public String signin(
			HttpServletRequest request,
			ModelMap m) {
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
		
		if("Y".equals(sawon.getJaetaeg())) {
			m.addAttribute("mySeatNum", 100000);
		}
		else {
			m.addAttribute("mySeatNum", sawon.getSeatNum());
		}
	
		return "floormap";
	}
	
	@GetMapping("reservation")
	public String reserve(ModelMap m) {
		return "reservation";
	}
	
	@GetMapping("forbidden")
	public String forbidden() {
		return "err/403";
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
	
	@GetMapping("view/photos")
	public String viewPhotoInfo() {
		return "photo";
	}
	
	@GetMapping("doc/vacation/{sangsinNum}")
	public String getDocVacation(
			@PathVariable("sangsinNum") String sangsinNum,
			ModelMap m) {
		Sawon sawon = SessionUtil.getSessionSawon();
		
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", sawon.getSawonCode());
		param.put("sangsinNum", sangsinNum);
		param.put("gyeoljaeType", "2");
		param.put("status", "C");
		
		try {
			boolean b = gyeoljaeService.confirmMySangsin(param);
			if(b) {
				VacationDocs result = gyeoljaeService.getVacationDocsInfo(param);
				
				if(result.getStartMonth().startsWith("0")) {
					result.setStartMonth(result.getStartMonth().substring(1));
				}
				if(result.getStartDay().startsWith("0")) {
					result.setStartDay(result.getStartDay().substring(1));
				}
				if(result.getEndMonth().startsWith("0")) {
					result.setEndMonth(result.getEndMonth().substring(1));
				}
				if(result.getEndDay().startsWith("0")) {
					result.setEndDay(result.getEndDay().substring(1));
				}
				
				m.addAttribute("docs", result);
			}
			else {
				m.addAttribute("msg", "내문서가 아니거나 문서타입이 휴가가 아닙니다.");
				return "err/404";
			}
		}
		catch(Exception e) {
			m.addAttribute("msg", e.getMessage());
			return "err/500";
		}
		
		return "docs/vacation";
	}
	
	private void createToken(ModelMap m, TokenKey key) {
		String token = SessionUtil.createToken();
		SessionUtil.getSessionSawon().setToken(key, token);
		
		m.addAttribute("_csrfToken", token);
	}
}
