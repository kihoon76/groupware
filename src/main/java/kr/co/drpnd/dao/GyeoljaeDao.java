package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import kr.co.drpnd.domain.Sangsin;

public interface GyeoljaeDao {
	List<Map<String, String>> selectGyeoljaeSawonList(Map<String, Object> param);

	List<Map<String, Object>> selectMyDefaultGyeoljaeLine(Map<String, String> param);

	void insertNewGyeoljae(Sangsin sangsin);

	int insertGyeoljaeLines(Sangsin sangsin);

	int insertGyeoljaeAttachFiles(Sangsin sangsin);
}
