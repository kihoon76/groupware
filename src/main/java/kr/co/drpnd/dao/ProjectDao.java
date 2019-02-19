package kr.co.drpnd.dao;

import java.util.Map;

import kr.co.drpnd.domain.ExtjsStoreVO;
import kr.co.drpnd.domain.Wbs;

public interface ProjectDao {

	void insertNewWBS(Map<String, String> param);

	ExtjsStoreVO<Wbs> selectListWBS(Map param);

}
