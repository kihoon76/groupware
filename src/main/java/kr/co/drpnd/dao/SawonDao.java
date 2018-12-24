package kr.co.drpnd.dao;

import java.util.List;

import kr.co.drpnd.domain.Sawon;

public interface SawonDao {

	Sawon selectSawonInfo(String username);

	int insertSawon(Sawon sawon);

	List<Sawon> selectMyDepartmentSawonList(String sawonDepartment);

	void updateSawon(Sawon sawon);

	int insertAuthority(String sawonCode);

}
