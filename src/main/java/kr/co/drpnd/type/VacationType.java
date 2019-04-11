package kr.co.drpnd.type;

import java.util.EnumSet;

public enum VacationType {

	YEONCHA("1"), BOGEON("2"), CHEONGWON("3"), GONGA("4"), BYEONGA("5"), EDUCATION("6"), ETC("7"), BANCHA("8"), DAECHE("9");
	
	private String value;
	
	VacationType(String value) {
		this.value = value;
	}
	
	public static VacationType getType(String type) {
		for(VacationType code: EnumSet.allOf(VacationType.class)) {
			if(type.equals(code.toString())) return code;
		}
		
		throw new IllegalArgumentException(type + "값은 유효하지 않습니다.");
	}

	@Override
	public String toString() {
		return value;
	}
}
