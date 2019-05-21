package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("Design")
public class Design {

	private String id;
	private String title;
	private String startDate;
	private String endDate;
	private String reqSawonCode;
	private String reqSawonName;
	private String modifyCount;
	private String modifierCode;
	private String modifierName;
	private String prevStartDate;
	private String prevEndDate;
	private String content;
	private String reqSawonTeamName;
	private String reqSawonTeamCode;
	private String teamBgcolor;
	private String teamTextColor;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getReqSawonCode() {
		return reqSawonCode;
	}
	public void setReqSawonCode(String reqSawonCode) {
		this.reqSawonCode = reqSawonCode;
	}
	public String getReqSawonName() {
		return reqSawonName;
	}
	public void setReqSawonName(String reqSawonName) {
		this.reqSawonName = reqSawonName;
	}
	public String getModifyCount() {
		return modifyCount;
	}
	public void setModifyCount(String modifyCount) {
		this.modifyCount = modifyCount;
	}
	public String getModifierCode() {
		return modifierCode;
	}
	public void setModifierCode(String modifierCode) {
		this.modifierCode = modifierCode;
	}
	public String getModifierName() {
		return modifierName;
	}
	public void setModifierName(String modifierName) {
		this.modifierName = modifierName;
	}
	public String getPrevStartDate() {
		return prevStartDate;
	}
	public void setPrevStartDate(String prevStartDate) {
		this.prevStartDate = prevStartDate;
	}
	public String getPrevEndDate() {
		return prevEndDate;
	}
	public void setPrevEndDate(String prevEndDate) {
		this.prevEndDate = prevEndDate;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getReqSawonTeamName() {
		return reqSawonTeamName;
	}
	public void setReqSawonTeamName(String reqSawonTeamName) {
		this.reqSawonTeamName = reqSawonTeamName;
	}
	public String getReqSawonTeamCode() {
		return reqSawonTeamCode;
	}
	public void setReqSawonTeamCode(String reqSawonTeamCode) {
		this.reqSawonTeamCode = reqSawonTeamCode;
	}
	public String getTeamBgcolor() {
		return teamBgcolor;
	}
	public void setTeamBgcolor(String teamBgcolor) {
		this.teamBgcolor = teamBgcolor;
	}
	public String getTeamTextColor() {
		return teamTextColor;
	}
	public void setTeamTextColor(String teamTextColor) {
		this.teamTextColor = teamTextColor;
	}
	
}
