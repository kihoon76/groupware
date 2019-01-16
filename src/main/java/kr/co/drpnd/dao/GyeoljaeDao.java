package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

public interface GyeoljaeDao {
	List<Map<String, String>> selectGyeoljaeSawonList(Map<String, Object> param);

	List<Map<String, Object>> selectMyDefaultGyeoljaeLine(Map<String, String> param);
}
