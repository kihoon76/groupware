package kr.co.drpnd.controller;

import java.io.Serializable;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import kr.co.drpnd.util.SessionUtil;

@Controller
public class WebSocketController {

	@MessageMapping("/authorization")
	@SendToUser("/message/authentication")
	public Message authorize(SimpMessageHeaderAccessor headerAccessor, Message message) {
		String csrfToken = message.getValue();
		boolean isCsrfTokenValid = SessionUtil.getSessionSawon().getToken().equals(csrfToken);
		
		//CsrfProtector
		return new Message("isCsrfTokenValid", String.valueOf(isCsrfTokenValid));
	}
	
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
