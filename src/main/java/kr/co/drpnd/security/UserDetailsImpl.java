package kr.co.drpnd.security;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;

import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.domain.Authority;

public class UserDetailsImpl implements UserDetails {

	private Sawon sawon;
	
	public UserDetailsImpl(Sawon sawon) {
		
		this.sawon = sawon;
		
	}
	
	@Override
	public String getPassword() {
		return sawon.getSawonPassword();
	}

	@Override
	public String getUsername() {
		return sawon.getSawonCode();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	public Sawon getAccount() {
		return sawon;
	}

	@Override
	public List<Authority> getAuthorities() {
		// TODO Auto-generated method stub
		return sawon.getAuthorities();
	}
}
