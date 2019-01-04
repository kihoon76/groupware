package kr.co.drpnd.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.Gson;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.CalendarCategory;
import kr.co.drpnd.domain.CalendarEvent;
import kr.co.drpnd.domain.ConferenceReservation;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.exception.InvalidReservationTime;
import kr.co.drpnd.exception.InvalidUser;
import kr.co.drpnd.service.CalendarService;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.type.TokenKey;
import kr.co.drpnd.util.DateUtil;
import kr.co.drpnd.util.SessionUtil;

@RequestMapping("/calendar")
@Controller
public class CalendarController {

	@Resource(name="calendarService")
	CalendarService calendarService;
	
	@Value("${colorCfg['mine_bg_color']}")
	String bgColor;
	
	@Value("${colorCfg['mine_txt_color']}")
	String txtColor;
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@GetMapping("/view")
	public String viewCalendar(
			@RequestParam(name="dftDate", required=false) String defaultDate,
			@RequestParam(name="dftCate", required=false) String defaultCate,
			ModelMap m) {
		
		Sawon sawon = SessionUtil.getSessionSawon();
		
		List<CalendarCategory> list = calendarService.getCalendarCategory();
		
		m.put("currentDate", (defaultDate == null ? DateUtil.getCurrentDateString() : defaultDate));
		m.put("category", list);
		m.put("defaultCate", (defaultCate == null ? list.get(0).getCode() : defaultCate));
		m.put("categoryStr", new Gson().toJson(list));
		m.put("mineBgColor", bgColor);
		m.put("mineTxtColor", txtColor);
		m.put("prefix", sawon.getSawonName() + "(" + sawon.getSawonId() + ")");
		return "calendar";
	}
	
	@PostMapping("/save")
	@ResponseBody
	public AjaxVO saveCalendar(@RequestBody List<CalendarEvent> list) {
		
		AjaxVO vo = new AjaxVO();
		
		try {
			ObjectMapper om = new ObjectMapper();
			System.err.println(om.writeValueAsString(list));
			calendarService.saveCalendar(list);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("/load")
	@ResponseBody
	public AjaxVO getCalendarData(
			@RequestParam("startDate") String startDate,
			@RequestParam("endDate") String endDate,
			@RequestParam("cate") String category) {
		
		AjaxVO<Map<String, List<Map<String, Object>>>> vo = new AjaxVO<Map<String, List<Map<String, Object>>>>();
		try {
			Sawon sawon = SessionUtil.getSessionSawon();
			
			Map param = new HashMap();
			param.put("startDate", startDate);
			param.put("endDate", endDate);
			param.put("cate", category);
			param.put("sawonCode", Integer.parseInt(sawon.getSawonCode()));
			
			Map<String, List<Map<String, Object>>> m = calendarService.getCalendarData(param);
			vo.addObject(m);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@PostMapping("category")
	@ResponseBody
	public AjaxVO<CalendarCategory> getCalendarCategory() {
		AjaxVO<CalendarCategory> vo = new AjaxVO<CalendarCategory>();
		
		try {
			vo.setSuccess(true);
			vo.setDatas(calendarService.getCalendarCategory());
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	
	@GetMapping("/conference/reservation/load")
	@ResponseBody
	public AjaxVO<Map<String, ArrayList<Map<String, String>>>> getConferenceReservationList(@RequestParam("reserveDate") String reserveDate) {
		AjaxVO<Map<String, ArrayList<Map<String, String>>>> vo = new AjaxVO<>();
		
		try {
			Map<String, String> param = new HashMap<>();
			param.put("reserveDate", reserveDate);
			param.put("sawonCode", SessionUtil.getSessionSawon().getSawonCode());
			List<Map<String, String>> list = calendarService.getConferenceReservationList(param);
			Map<String, ArrayList<Map<String, String>>> events = new HashMap<>();
			
			int size = list.size();
			if(size > 0) {
				for(Map<String, String> e : list) {
					if("Y".equals(e.get("mine"))) {
						if(events.get("mine") == null) {
							events.put("mine", new ArrayList<Map<String, String>>());
						}
						
						events.get("mine").add(e);
					}
					else {
						if(events.get("default") == null) {
							events.put("default", new ArrayList<Map<String, String>>());
						}
						
						events.get("default").add(e);
					}
				}
			}
			
			vo.setSuccess(true);
			vo.addObject(events);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	
	@PostMapping("/conference/reservation")
	@ResponseBody
	public AjaxVO<Map<String, String>> reserveConference(@RequestBody Map<String, String> param) {
		AjaxVO vo = new AjaxVO<>();
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		ConferenceReservation cr = new ConferenceReservation();
		cr.setTitle(param.get("title"));
		cr.setStartTimeFull(param.get("ymd") + " " + param.get("startTime"));
		cr.setEndTimeFull(param.get("ymd") + " " + param.get("endTime"));
		cr.setStartTime(param.get("startTime"));
		cr.setEndTime(param.get("endTime"));
		cr.setReservationSawonCode(myInfo.getSawonCode());
		cr.setYmd(param.get("ymd"));
		
		try {
			calendarService.reserveConference(cr);
			vo.setSuccess(true);
			param.put("rnum", cr.getReserveNum());
			param.put("token", myInfo.getToken(TokenKey.FLOORMAP));
			param.put("reserver", myInfo.getSawonName());
			vo.addObject(param);
			
			this.template.convertAndSend("/message/conference/reservation", param);
		}
		catch(InvalidReservationTime e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.INVALID_RESERVATION_Time.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@PostMapping("/conference/mod/reservation")
	@ResponseBody
	public AjaxVO<Map<String, String>> modifyReserveConference(@RequestBody Map<String, String> param) {
		AjaxVO vo = new AjaxVO<>();
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		ConferenceReservation cr = new ConferenceReservation();
		cr.setTitle(param.get("title"));
		cr.setStartTimeFull(param.get("ymd") + " " + param.get("startTime"));
		cr.setEndTimeFull(param.get("ymd") + " " + param.get("endTime"));
		cr.setStartTime(param.get("startTime"));
		cr.setEndTime(param.get("endTime"));
		cr.setReservationSawonCode(myInfo.getSawonCode());
		cr.setYmd(param.get("ymd"));
		cr.setReserveNum(param.get("rnum"));
		
		try {
			calendarService.modifyReserveConference(cr);
			vo.setSuccess(true);
			param.put("token", myInfo.getToken(TokenKey.FLOORMAP));
			param.put("reserver", myInfo.getSawonName());
			param.put("mine", "Y");
			vo.addObject(param);
			
			this.template.convertAndSend("/message/conference/mod/reservation", param);
		}
		catch(InvalidReservationTime e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.INVALID_RESERVATION_Time.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(InvalidUser e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.INVALID_RESERVATION_USER.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("/conference/del/reservation")
	@ResponseBody
	public AjaxVO removeReserveConference(@RequestParam("rnum") String rnum, @RequestParam("ymd") String ymd) {
		AjaxVO vo = new AjaxVO<>();
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		try {
			ConferenceReservation cr = new ConferenceReservation();
			cr.setReserveNum(rnum);
			cr.setReservationSawonCode(myInfo.getSawonCode());
			calendarService.removeReserveConference(cr);
			vo.setSuccess(true);
					
			Map<String, String> param = new HashMap<>();
			param.put("rnum", rnum);
			param.put("ymd", ymd);
			param.put("token", myInfo.getToken(TokenKey.FLOORMAP));
			this.template.convertAndSend("/message/conference/del/reservation", param);
		}
		catch(InvalidUser e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.INVALID_RESERVATION_USER.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
}
