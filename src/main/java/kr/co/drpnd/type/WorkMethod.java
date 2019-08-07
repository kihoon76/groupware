package kr.co.drpnd.type;

import java.util.EnumSet;

public enum WorkMethod {

	PC("P"), MOBILE("M"), FINGER_PRINT("F"), RFID("R");
	
	private String value;
	
	WorkMethod(String value) {
		this.value = value;
	}
	
	public static WorkMethod getType(String type) {
		for(WorkMethod code: EnumSet.allOf(WorkMethod.class)) {
			if(type.equals(code.toString())) return code;
		}
		
		throw new IllegalArgumentException(type + "값은 유효하지 않습니다.");
	}

	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return value;
	}
}
