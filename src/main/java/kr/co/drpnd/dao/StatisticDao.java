package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

public interface StatisticDao {

	public List<List<Map<String, Object>>> selectOverwork(Map<String, Object> param);
}
