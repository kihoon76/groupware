package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("Department")
public class Department {

	private String departmentCode;
	private String departmentName;
	
	public String getDepartmentCode() {
		return departmentCode;
	}
	public void setDepartmentCode(String departmentCode) {
		this.departmentCode = departmentCode;
	}
	public String getDepartmentName() {
		return departmentName;
	}
	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}
	
}
