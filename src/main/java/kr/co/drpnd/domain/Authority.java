package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;
import org.springframework.security.core.GrantedAuthority;

@Alias("Authority")
public class Authority implements GrantedAuthority {

	private String authNum;
	private String authName;
	private String description;
	private String authNameKor;
	
	public String getAuthName() {
		return authName;
	}
	public void setAuthName(String authName) {
		this.authName = authName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getAuthNum() {
		return authNum;
	}
	public void setAuthNum(String authNum) {
		this.authNum = authNum;
	}
	public String getAuthNameKor() {
		return authNameKor;
	}
	public void setAuthNameKor(String authNameKor) {
		this.authNameKor = authNameKor;
	}
	
	@Override
	public String getAuthority() {
		return authName;
	}
	
}
