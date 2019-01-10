package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("SawonOverwork")
public class SawonOverwork {
	private int sawonCode;
	private int teamCode;
	private String teamLeader;
	private String sawonName;
	private float time;
	
	public int getSawonCode() {
		return sawonCode;
	}
	public void setSawonCode(int sawonCode) {
		this.sawonCode = sawonCode;
	}
	public int getTeamCode() {
		return teamCode;
	}
	public void setTeamCode(int teamCode) {
		this.teamCode = teamCode;
	}
	public String getTeamLeader() {
		return teamLeader;
	}
	public void setTeamLeader(String teamLeader) {
		this.teamLeader = teamLeader;
	}
	public String getSawonName() {
		return sawonName;
	}
	public void setSawonName(String sawonName) {
		this.sawonName = sawonName;
	}
	public float getTime() {
		return time;
	}
	public void setTime(float time) {
		this.time = time;
	}
}
