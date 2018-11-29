package kr.co.drpnd.exception;

import org.springframework.security.core.AuthenticationException;

public class NotAuthorized extends AuthenticationException {

	public NotAuthorized(String msg) {
		super(msg);
	}
	
	public NotAuthorized(String msg, Throwable t) {
		super(msg, t);
	}
}
