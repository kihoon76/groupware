package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("TeamOverwork")
public class TeamOverwork {

	private int teamCode;
	private String teamName;
	private float time;
	
	public int getTeamCode() {
		return teamCode;
	}
	public void setTeamCode(int teamCode) {
		this.teamCode = teamCode;
	}
	public String getTeamName() {
		return teamName;
	}
	public void setTeamName(String teamName) {
		this.teamName = teamName;
	}
	public float getTime() {
		return time;
	}
	public void setTime(float time) {
		this.time = time;
	}
	
	
	
	
}
