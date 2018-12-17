package kr.co.drpnd.dao;

import java.util.Map;

import kr.co.drpnd.domain.Geuntae;

public interface GeuntaeDao {

	int insertGotowork(Geuntae geuntae);

	int selectMyTodayGotowork(String sawonCode);

	int selectTime(Map<String, String> param);

}
