package kr.co.drpnd.controller;

import java.io.IOException;
import java.io.Serializable;
import java.util.Map;

import javax.annotation.Resource;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.ConferenceReservation;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.service.CalendarService;
import kr.co.drpnd.util.SessionUtil;

@Controller
public class WebSocketController {

	@Resource(name="calendarService")
	CalendarService calendarService;
	
//	@MessageMapping("/conference/reservation")
//	@SendTo("/message/conference/reservation")
//	public AjaxVO<Map<String, String>>  reserveConference(
//			SimpMessageHeaderAccessor headerAccessor, 
//			Map<String, String> reservation ) {
//		AjaxVO vo = new AjaxVO<>();
//		Sawon myInfo = SessionUtil.getSessionSawon();
//		
//		ConferenceReservation cr = new ConferenceReservation();
//		cr.setTitle(reservation.get("title"));
//		cr.setStartTimeFull(reservation.get("ymd") + " " + reservation.get("startTime"));
//		cr.setEndTimeFull(reservation.get("ymd") + " " + reservation.get("endTime"));
//		cr.setStartTime(reservation.get("startTime"));
//		cr.setEndTime(reservation.get("endTime"));
//		cr.setReservationSawonCode(myInfo.getSawonCode());
//		cr.setYmd(reservation.get("ymd"));
//		
//		try {
//			calendarService.reserveConference(cr);
//			vo.setSuccess(true);
//			reservation.put("rnum", cr.getReserveNum());
//			vo.addObject(reservation);
//			vo.setToken(myInfo.getToken());
//			//this.template.convertAndSend("/message");
//		}
//		catch(Exception e) {
//			vo.setSuccess(false);
//			vo.setErrMsg(e.getMessage());
//		}
//		return vo;
//		
//	}
	
	private static class Message implements Serializable {
		 public Message() { }
		 
	        public Message(String key, String value) {
	            this.key = key;
	            this.value = value;
	        }
	 
	        public String getKey() {
	            return key;
	        }
	 
	        public String getValue() {
	            return value;
	        }
	 
	        private String key;
	 
	        private String value;
	}
}
