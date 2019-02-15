package kr.co.drpnd.dao;

import java.util.Map;

import kr.co.drpnd.domain.ExtjsStoreVO;

public interface ProjectDao {

	void insertNewWBS(Map<String, String> param);

	ExtjsStoreVO<Map> selectListWBS(Map param);

}
