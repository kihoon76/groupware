package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import kr.co.drpnd.domain.Geuntae;
import kr.co.drpnd.domain.Team;

public interface GeuntaeDao {

	int insertGotowork(Geuntae geuntae);

	Map<String, Integer> selectMyTodayGotowork(String sawonCode);

	int selectTime(Map<String, String> param);

	void updateOffwork(Geuntae geuntae);

	int selectMyTodayOffwork(int sawonCode);

	Map<String, Object> selectGeuntaeDetail(Map<String, Integer> param);

	String selectCuttentTime10();

	int updateGeuntae(Map<String, String> param);

	List<Team> selectTeamList(String sawonDepartment);

	int updateGeuntaeOutworkToIn(Map<String, String> param);

	int updateGeuntaeInworkToOut(Map<String, String> param);
	
	String selectMyYesterdayOffwork(String sawonCode);
	
	int selectMyYesterdayGotowork(String sawonCode);

	void updateAutoOffwork();

	int selectMyYesterdayOffworkNotAuto(String sawonCode);

}
