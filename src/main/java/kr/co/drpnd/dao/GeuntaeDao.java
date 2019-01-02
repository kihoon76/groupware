package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import kr.co.drpnd.domain.Geuntae;

public interface GeuntaeDao {

	int insertGotowork(Geuntae geuntae);

	Map<String, Integer> selectMyTodayGotowork(String sawonCode);

	int selectTime(Map<String, String> param);

	void updateOffwork(Geuntae geuntae);

	int selectMyTodayOffwork(int sawonCode);

	Map<String, Object> selectGeuntaeDetail(Map<String, Integer> param);

	String selectCuttentTime10();

}
