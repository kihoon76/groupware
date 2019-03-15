package kr.co.drpnd.domain;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.type.Alias;

@Alias("VacationDocs")
public class VacationDocs {
	private String sangsinNum;
	private String mySign;
	private String departmentName;
	private String sawonName;
	private String startYear;
	private String startMonth;
	private String startDay;
	private String endYear;
	private String endMonth;
	private String endDay;
	private String todayYear;
	private String todayMonth;
	private String todayDay;
	private String type;
	private String term;
	private String positionName;
	
	private List<Map<String, Object>> signs;
	

	public String getDepartmentName() {
		return departmentName;
	}
	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}
	public String getSawonName() {
		return sawonName;
	}
	public void setSawonName(String sawonName) {
		this.sawonName = sawonName;
	}
	public String getStartYear() {
		return startYear;
	}
	public void setStartYear(String startYear) {
		this.startYear = startYear;
	}
	public String getStartMonth() {
		return startMonth;
	}
	public void setStartMonth(String startMonth) {
		this.startMonth = startMonth;
	}
	public String getStartDay() {
		return startDay;
	}
	public void setStartDay(String startDay) {
		this.startDay = startDay;
	}
	public String getEndYear() {
		return endYear;
	}
	public void setEndYear(String endYear) {
		this.endYear = endYear;
	}
	public String getEndMonth() {
		return endMonth;
	}
	public void setEndMonth(String endMonth) {
		this.endMonth = endMonth;
	}
	public String getEndDay() {
		return endDay;
	}
	public void setEndDay(String endDay) {
		this.endDay = endDay;
	}
	public List<Map<String, Object>> getSigns() {
		return signs;
	}
	public void setSigns(List<Map<String, Object>> signs) {
		this.signs = signs;
	}
	public String getPositionName() {
		return positionName;
	}
	public void setPositionName(String positionName) {
		this.positionName = positionName;
	}
	public String getMySign() {
		return mySign;
	}
	public void setMySign(String mySign) {
		this.mySign = mySign;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getTerm() {
		return term;
	}
	public void setTerm(String term) {
		this.term = term;
	}
	public String getTodayYear() {
		return todayYear;
	}
	public void setTodayYear(String todayYear) {
		this.todayYear = todayYear;
	}
	public String getTodayMonth() {
		return todayMonth;
	}
	public void setTodayMonth(String todayMonth) {
		this.todayMonth = todayMonth;
	}
	public String getTodayDay() {
		return todayDay;
	}
	public void setTodayDay(String todayDay) {
		this.todayDay = todayDay;
	}
	public String getSangsinNum() {
		return sangsinNum;
	}
	public void setSangsinNum(String sangsinNum) {
		this.sangsinNum = sangsinNum;
	}
}
