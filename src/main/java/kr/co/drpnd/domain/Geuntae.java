package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("Geuntae")
public class Geuntae {

	private String geuntaeCode;
	private String sawonCode;
	private String gotoworkTime;
	private String offworkTime;
	private int gotoworkYear;
	private int gotoworkMonth;
	private int gotoworkDay;
	private int gotoworkHour;
	private int gotoworkMinute;
	private int offworkYear;
	private int offworkMonth;
	private int offworkDay;
	private int offworkHour;
	private int offworkMinute;
	private String outworkYN;
	private float lat;
	private float lng;
	private String workContent;
	private String outworkContent;
	private String gotoworkMethod;		//P (PC) M(Mobile)
	private String offworkMethod;
	private int overworkType;
	private String startFrom6;
	
	public String getGeuntaeCode() {
		return geuntaeCode;
	}
	public void setGeuntaeCode(String geuntaeCode) {
		this.geuntaeCode = geuntaeCode;
	}
	public String getSawonCode() {
		return sawonCode;
	}
	public void setSawonCode(String sawonCode) {
		this.sawonCode = sawonCode;
	}
	public String getGotoworkTime() {
		return gotoworkTime;
	}
	public void setGotoworkTime(String gotoworkTime) {
		this.gotoworkTime = gotoworkTime;
	}
	public String getOffworkTime() {
		return offworkTime;
	}
	public void setOffworkTime(String offworkTime) {
		this.offworkTime = offworkTime;
	}
	public int getGotoworkYear() {
		return gotoworkYear;
	}
	public void setGotoworkYear(int gotoworkYear) {
		this.gotoworkYear = gotoworkYear;
	}
	public int getGotoworkMonth() {
		return gotoworkMonth;
	}
	public void setGotoworkMonth(int gotoworkMonth) {
		this.gotoworkMonth = gotoworkMonth;
	}
	public int getGotoworkDay() {
		return gotoworkDay;
	}
	public void setGotoworkDay(int gotoworkDay) {
		this.gotoworkDay = gotoworkDay;
	}
	public int getGotoworkHour() {
		return gotoworkHour;
	}
	public void setGotoworkHour(int gotoworkHour) {
		this.gotoworkHour = gotoworkHour;
	}
	public int getGotoworkMinute() {
		return gotoworkMinute;
	}
	public void setGotoworkMinute(int gotoworkMinute) {
		this.gotoworkMinute = gotoworkMinute;
	}
	public int getOffworkYear() {
		return offworkYear;
	}
	public void setOffworkYear(int offworkYear) {
		this.offworkYear = offworkYear;
	}
	public int getOffworkMonth() {
		return offworkMonth;
	}
	public void setOffworkMonth(int offworkMonth) {
		this.offworkMonth = offworkMonth;
	}
	public int getOffworkDay() {
		return offworkDay;
	}
	public void setOffworkDay(int offworkDay) {
		this.offworkDay = offworkDay;
	}
	public int getOffworkHour() {
		return offworkHour;
	}
	public void setOffworkHour(int offworkHour) {
		this.offworkHour = offworkHour;
	}
	public int getOffworkMinute() {
		return offworkMinute;
	}
	public void setOffworkMinute(int offworkMinute) {
		this.offworkMinute = offworkMinute;
	}
	public String getOutworkYN() {
		return outworkYN;
	}
	public void setOutworkYN(String outworkYN) {
		this.outworkYN = outworkYN;
	}
	public float getLat() {
		return lat;
	}
	public void setLat(float lat) {
		this.lat = lat;
	}
	public float getLng() {
		return lng;
	}
	public void setLng(float lng) {
		this.lng = lng;
	}
	public String getWorkContent() {
		return workContent;
	}
	public void setWorkContent(String workContent) {
		this.workContent = workContent;
	}
	public String getOutworkContent() {
		return outworkContent;
	}
	public void setOutworkContent(String outworkContent) {
		this.outworkContent = outworkContent;
	}
	public String getGotoworkMethod() {
		return gotoworkMethod;
	}
	public void setGotoworkMethod(String gotoworkMethod) {
		this.gotoworkMethod = gotoworkMethod;
	}
	public String getOffworkMethod() {
		return offworkMethod;
	}
	public void setOffworkMethod(String offworkMethod) {
		this.offworkMethod = offworkMethod;
	}
	public int getOverworkType() {
		return overworkType;
	}
	public void setOverworkType(int overworkType) {
		this.overworkType = overworkType;
	}
	public String getStartFrom6() {
		return startFrom6;
	}
	public void setStartFrom6(String startFrom6) {
		this.startFrom6 = startFrom6;
	}
	
}
