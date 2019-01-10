package kr.co.drpnd.domain;

import java.util.List;

import org.apache.ibatis.type.Alias;

@Alias("OverworkStatistic")
public class OverworkStatistic {
	private List<TeamOverwork> teamOverwork;
	private List<SawonOverwork> sawonOverwork;
	
	public List<TeamOverwork> getTeamOverwork() {
		return teamOverwork;
	}
	public void setTeamOverwork(List<TeamOverwork> teamOverwork) {
		this.teamOverwork = teamOverwork;
	}
	public List<SawonOverwork> getSawonOverwork() {
		return sawonOverwork;
	}
	public void setSawonOverwork(List<SawonOverwork> sawonOverwork) {
		this.sawonOverwork = sawonOverwork;
	}
}
