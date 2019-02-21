package kr.co.drpnd.type;

import java.util.EnumSet;

public enum Code {

	DEPARTMENT("department"), TEAM("team"), POSITION("position"), OVERWORK("overwork"), GYEOLJAE("gyeoljae");
	
	private String value;
	
	Code(String value) {
		this.value = value;
	}
	
	public static Code getType(String type) {
		for(Code code: EnumSet.allOf(Code.class)) {
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
