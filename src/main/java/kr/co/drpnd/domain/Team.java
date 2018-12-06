package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("Team")
public class Team {

	private String teamCode;
	private String teamName;
	private String teamFontColor;
	private String teamBackColor;
	
	public String getTeamCode() {
		return teamCode;
	}
	public void setTeamCode(String teamCode) {
		this.teamCode = teamCode;
	}
	public String getTeamName() {
		return teamName;
	}
	public void setTeamName(String teamName) {
		this.teamName = teamName;
	}
	public String getTeamFontColor() {
		return teamFontColor;
	}
	public void setTeamFontColor(String teamFontColor) {
		this.teamFontColor = teamFontColor;
	}
	public String getTeamBackColor() {
		return teamBackColor;
	}
	public void setTeamBackColor(String teamBackColor) {
		this.teamBackColor = teamBackColor;
	}
	
}
