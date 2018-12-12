package kr.co.drpnd.exception;

public class InvalidReservationTime extends RuntimeException {

	public InvalidReservationTime(String msg) {
		super(msg);
	}
}
