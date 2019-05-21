package kr.co.drpnd.dao;

import java.util.Map;

import kr.co.drpnd.domain.Design;

public interface DesignDao {

	Design selectDesignDetail(Map<String, String> param);

}
