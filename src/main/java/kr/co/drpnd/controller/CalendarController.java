package kr.co.drpnd.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
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
import kr.co.drpnd.service.CalendarService;
import kr.co.drpnd.util.DateUtil;
import kr.co.drpnd.util.SessionUtil;

@RequestMapping("/calendar")
@Controller
public class CalendarController {

	@Resource(name="calendarService")
	CalendarService calendarService;
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@GetMapping("/view")
	public String viewCalendar(
			@RequestParam(name="dftDate", required=false) String defaultDate,
			@RequestParam(name="dftCate", required=false) String defaultCate,
			ModelMap m) {
		List<CalendarCategory> list = calendarService.getCalendarCategory();
		
		m.put("currentDate", (defaultDate == null ? DateUtil.getCurrentDateString() : defaultDate));
		m.put("category", list);
		m.put("defaultCate", (defaultCate == null ? list.get(0).getCode() : defaultCate));
		m.put("categoryStr", new Gson().toJson(list));
		
		
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
			param.put("sawonCode", sawon.getSawonCode());
			
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
	
	@PostMapping("/conference/reservation")
	@ResponseBody
	public AjaxVO<Map<String, String>> reserveConference(@RequestBody Map<String, String> param) {
		AjaxVO vo = new AjaxVO<>();
		
//		Sawon myInfo = SessionUtil.getSessionSawon();
//		
//		ConferenceReservation cr = new ConferenceReservation();
//		cr.setTitle(param.get("title"));
//		cr.setStartTimeFull(param.get("ymd") + " " + param.get("startTime"));
//		cr.setEndTimeFull(param.get("ymd") + " " + param.get("endTime"));
//		cr.setStartTime(param.get("startTime"));
//		cr.setEndTime(param.get("endTime"));
//		cr.setReservationSawonCode(myInfo.getSawonCode());
//		cr.setYmd(param.get("ymd"));
//		
//		
//		
//		try {
//			calendarService.reserveConference(cr);
//			System.err.println(cr.getReserveNum());
//			vo.setSuccess(true);
//			param.put("rnum", cr.getReserveNum());
//			vo.addObject(param);
//			
//			//this.template.convertAndSend("/message");
//		}
//		catch(Exception e) {
//			vo.setSuccess(false);
//			vo.setErrMsg(e.getMessage());
//		}
		
		Map<String, String> m = new HashMap<>();
		m.put("ppp", "1");
		this.template.convertAndSend("/message/authentication", m);
		return vo;
	}
}
