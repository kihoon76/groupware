package kr.co.drpnd.util;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kr.co.drpnd.domain.Sawon;

public class SessionUtil {

	public static String getSessionSawonId() {
		
		return SecurityContextHolder.getContext().getAuthentication().getName();
	}
	
	public static Sawon getSessionSawon() {
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Sawon sawon = (Sawon)auth.getPrincipal();
		return sawon;
	}
	
	public static String createToken() {
		return UUID.randomUUID().toString().toLowerCase().replace("-", "");
	}
}
