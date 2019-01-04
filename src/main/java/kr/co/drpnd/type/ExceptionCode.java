package kr.co.drpnd.type;

public enum ExceptionCode {

	INVALID_RESERVATION_Time("1000", "이미 예약된 시간입니다."),
	INVALID_RESERVATION_USER("1001", "허용된 사용자가 아닙니다."),
	ALREADY_GOTOWORK("1002", "이미 출근처리 되었습니다."),
	INVALID_GOTOWORK_TIME("1003", "처리할수 없는 시간입니다.(가능시간[07:00 ~ 23:59])"),
	ALREADY_OFFWORK("1004", "이미 퇴근처리 되었습니다"),
	NOT_EXIST_GOTOWORK("1005", "출근정보가 없습니다."),
	INVALID_MODIFY_USER("1006", "수정권한이 없습니다.");
	
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
