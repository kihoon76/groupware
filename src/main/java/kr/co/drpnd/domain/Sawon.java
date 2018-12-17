package kr.co.drpnd.domain;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.type.Alias;

import kr.co.drpnd.type.TokenKey;

@Alias("Sawon")
public class Sawon {

	private String sawonCode;
	private String sawonName;
	private String sawonDepartment;
	private String sawonTeam;
	private String sawonPosition;
	private String sawonId;
	private String sawonPassword;
	private String sawonPhone;
	private String sawonInnerPhone;
	private String sawonEmail;
	private String sawonBirthday;
	private String sawonManWoman;
	private boolean sawonQuit;
	private boolean sawonTeamLeader;
	private String sawonQuitDay;
	private String regDate;
	private int seatNum = -1;
	private String isGotowork;
	
	private Map<TokenKey, String> token = new HashMap<>();

	
	private List<Authority> authorities;
	private List<Team> manageTeams;
	
	public List<Authority> getAuthorities() {
		return authorities;
	}

	public String getSawonCode() {
		return sawonCode;
	}

	public void setSawonCode(String sawonCode) {
		this.sawonCode = sawonCode;
	}

	public String getSawonName() {
		return sawonName;
	}

	public void setSawonName(String sawonName) {
		this.sawonName = sawonName;
	}

	public String getSawonDepartment() {
		return sawonDepartment;
	}

	public void setSawonDepartment(String sawonDepartment) {
		this.sawonDepartment = sawonDepartment;
	}

	public String getSawonTeam() {
		return sawonTeam;
	}

	public void setSawonTeam(String sawonTeam) {
		this.sawonTeam = sawonTeam;
	}

	public String getSawonPosition() {
		return sawonPosition;
	}

	public void setSawonPosition(String sawonPosition) {
		this.sawonPosition = sawonPosition;
	}

	public String getSawonId() {
		return sawonId;
	}

	public void setSawonId(String sawonId) {
		this.sawonId = sawonId;
	}

	public String getSawonPassword() {
		return sawonPassword;
	}

	public void setSawonPassword(String sawonPassword) {
		this.sawonPassword = sawonPassword;
	}

	public String getSawonPhone() {
		return sawonPhone;
	}

	public void setSawonPhone(String sawonPhone) {
		this.sawonPhone = sawonPhone;
	}

	public String getSawonEmail() {
		return sawonEmail;
	}

	public void setSawonEmail(String sawonEmail) {
		this.sawonEmail = sawonEmail;
	}

	public String getSawonBirthday() {
		return sawonBirthday;
	}

	public void setSawonBirthday(String sawonBirthday) {
		this.sawonBirthday = sawonBirthday;
	}

	public String getSawonManWoman() {
		return sawonManWoman;
	}

	public void setSawonManWoman(String sawonManWoman) {
		this.sawonManWoman = sawonManWoman;
	}
	public boolean isSawonQuit() {
		return sawonQuit;
	}

	public void setSawonQuit(boolean sawonQuit) {
		this.sawonQuit = sawonQuit;
	}

	public boolean isSawonTeamLeader() {
		return sawonTeamLeader;
	}

	public void setSawonTeamLeader(boolean sawonTeamLeader) {
		this.sawonTeamLeader = sawonTeamLeader;
	}

	public String getSawonQuitDay() {
		return sawonQuitDay;
	}

	public void setSawonQuitDay(String sawonQuitDay) {
		this.sawonQuitDay = sawonQuitDay;
	}

	public String getRegDate() {
		return regDate;
	}

	public void setRegDate(String regDate) {
		this.regDate = regDate;
	}

	public List<Team> getManageTeams() {
		return manageTeams;
	}

	public void setManageTeams(List<Team> manageTeams) {
		this.manageTeams = manageTeams;
	}

	public void setAuthorities(List<Authority> authorities) {
		this.authorities = authorities;
	}

	public String getSawonInnerPhone() {
		return sawonInnerPhone;
	}

	public void setSawonInnerPhone(String sawonInnerPhone) {
		this.sawonInnerPhone = sawonInnerPhone;
	}
	
	public String getToken(TokenKey key) {
		return token.get(key);
	}

	public void setToken(TokenKey key, String value) {
		this.token.put(key, value);
	}
	
	public int getSeatNum() {
		return seatNum;
	}

	public void setSeatNum(int seatNum) {
		this.seatNum = seatNum;
	}
	
	public String getIsGotowork() {
		return isGotowork;
	}

	public void setIsGotowork(String isGotowork) {
		this.isGotowork = isGotowork;
	}

	@Override
	public boolean equals(Object o) {
		 if (o instanceof Sawon) {
            return sawonCode.equals(((Sawon) o).getSawonCode());
        }
		 
        return false;
	}
	
	@Override
	public int hashCode() {
		return sawonCode.hashCode();
	}
	
}
