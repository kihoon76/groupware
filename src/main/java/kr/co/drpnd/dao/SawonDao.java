package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import kr.co.drpnd.domain.Sawon;

public interface SawonDao {

	Sawon selectSawonInfo(String username);

	int insertSawon(Sawon sawon);

	List<Sawon> selectMyDepartmentSawonList(String sawonDepartment);

	void updateSawon(Sawon sawon);

	int insertAuthority(String sawonCode);

	List<Map<String, Object>> selectTodayVacationAllSawon(Map<String, Integer> param);

	List<Map<String, Object>> selectTodayPlanAllSawon(Map<String, Integer> param);

	void updateSawonSign(Map<String, Object> param);

}
