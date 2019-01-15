package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository("gyeoljaeDao")
public class GyeoljaeDaoImpl implements GyeoljaeDao {

	private final static String namespace = "mappers.gyeoljaeMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public List<Map<String, String>> selectGyeoljaeSawonList(Map<String, Object> param) {
		return msSqlSession.selectList(namespace + ".selectGyeoljaeSawonList", param);
	} 
}
