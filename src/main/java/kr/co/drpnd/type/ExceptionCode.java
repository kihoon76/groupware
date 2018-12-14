package kr.co.drpnd.type;

public enum ExceptionCode {

	INVALID_RESERVATION_Time("1000", "이미 예약된 시간입니다."),
	INVALID_RESERVATION_USER("1001", "허용된 사용자가 아닙니다.");
	
	private String code;
	private String msg;
	
	ExceptionCode(String code, String msg) {
		this.code = code;
		this.msg = msg;
	}
	
	public String getCode() {
		return this.code;
	}
	
	public String getMsg() {
		return this.msg;
	}
}
