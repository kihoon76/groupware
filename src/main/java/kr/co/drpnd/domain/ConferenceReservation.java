package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("ConferenceReservation")
public class ConferenceReservation {

	private String reserveNum;
	private String title;
	private String startTimeFull;
	private String endTimeFull;
	private String ymd;
	private String startTime;
	private String endTime;
	private String reservationSawonCode;
	private String reservationDate;
	public String getReserveNum() {
		return reserveNum;
	}
	public void setReserveNum(String reserveNum) {
		this.reserveNum = reserveNum;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getStartTimeFull() {
		return startTimeFull;
	}
	public void setStartTimeFull(String startTimeFull) {
		this.startTimeFull = startTimeFull;
	}
	public String getEndTimeFull() {
		return endTimeFull;
	}
	public void setEndTimeFull(String endTimeFull) {
		this.endTimeFull = endTimeFull;
	}
	public String getYmd() {
		return ymd;
	}
	public void setYmd(String ymd) {
		this.ymd = ymd;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getReservationSawonCode() {
		return reservationSawonCode;
	}
	public void setReservationSawonCode(String reservationSawonCode) {
		this.reservationSawonCode = reservationSawonCode;
	}
	public String getReservationDate() {
		return reservationDate;
	}
	public void setReservationDate(String reservationDate) {
		this.reservationDate = reservationDate;
	}
	
	
}
