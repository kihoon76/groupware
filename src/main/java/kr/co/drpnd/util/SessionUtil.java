package kr.co.drpnd.util;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kr.co.drpnd.domain.Authority;
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
	
	public static boolean hasAuthority(String searchAuth) {
		Sawon sawon = getSessionSawon();
		
		for(Authority auth: sawon.getAuthorities()) {
			if(searchAuth.equals(auth.getAuthName())) return true;
		}
		
		return false;
	}
	
	public static boolean hasAnyAuthority(String... searchAuths) {
		int authCnt = searchAuths.length;
		
		for(int i=0; i<authCnt; i++) {
			if(hasAuthority(searchAuths[i])) return true; 
		}
		
		return false;
	}
}
