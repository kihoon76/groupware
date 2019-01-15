package kr.co.drpnd.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.GyeoljaeDao;

@Service("gyeoljaeService")
public class GyeoljaeService {

	@Resource(name="gyeoljaeDao")
	GyeoljaeDao gyeoljaeDao;
	
	public List<Map<String, String>> getGyeoljaeSawonList(Map<String, Object> param) {
		return gyeoljaeDao.selectGyeoljaeSawonList(param);
	}

	public List<Map<String, Object>> getMyDefaultGyeoljaeLine(String sawonCode) {
		return gyeoljaeDao.selectMyDefaultGyeoljaeLine(sawonCode);
	}

}
