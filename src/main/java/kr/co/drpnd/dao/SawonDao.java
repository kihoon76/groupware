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

	void insertDevice(Map<String, String> app);

	List<String> selectSawonDeviceList(String sawonCode);

	List<String> selectSawonAllDevices();

	Sawon selectTodayMyGeuntaeByMobile(Map<String, Integer> me);

	List<Map<String, String>> selectSawonInfoForVacation(Map<String, String> param);

	List<Map<String, String>> selectSawonVacationHistory(Map<String, String> m);

	List<Map<String, String>> selectSawonOverworkHistory(Map<String, Object> m);

	String selectSawonSeatNum(String sawonCode);

	String selectSawonCodeByRfid(String rfid);

}
