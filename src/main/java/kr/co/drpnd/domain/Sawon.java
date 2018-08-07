package kr.co.drpnd.domain;

import java.util.List;

import org.apache.ibatis.type.Alias;

@Alias("Sawon")
public class Sawon {

	private String code;
	private String num;
	private String name;
	private String password;
	private String phone;
	private String email;
	private String ipsaDate;
	private String booseo;
	private String jiggeub;
	
	private List<Authority> authorities;
	
	public List<Authority> getAuthorities() {
		return authorities;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getIpsaDate() {
		return ipsaDate;
	}

	public void setIpsaDate(String ipsaDate) {
		this.ipsaDate = ipsaDate;
	}

	public void setAuthorities(List<Authority> authorities) {
		this.authorities = authorities;
	}

	public String getBooseo() {
		return booseo;
	}

	public void setBooseo(String booseo) {
		this.booseo = booseo;
	}

	public String getJiggeub() {
		return jiggeub;
	}

	public void setJiggeub(String jiggeub) {
		this.jiggeub = jiggeub;
	}

	public String getNum() {
		return num;
	}

	public void setNum(String num) {
		this.num = num;
	}
	
	@Override
	public boolean equals(Object o) {
		 if (o instanceof Sawon) {
            return num.equals(((Sawon) o).getNum());
        }
		 
        return false;
	}
	
	@Override
	public int hashCode() {
		return num.hashCode();
	}
	
}
