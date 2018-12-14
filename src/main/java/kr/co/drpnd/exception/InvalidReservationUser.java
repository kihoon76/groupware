package kr.co.drpnd.exception;

public class InvalidReservationUser extends RuntimeException {
	public InvalidReservationUser(String msg) {
		super(msg);
	}
}
