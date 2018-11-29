package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("Position")
public class Position {

	private String positionCode;
	private String positionName;
	
	public String getPositionCode() {
		return positionCode;
	}
	public void setPositionCode(String positionCode) {
		this.positionCode = positionCode;
	}
	public String getPositionName() {
		return positionName;
	}
	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}
	
	
}
