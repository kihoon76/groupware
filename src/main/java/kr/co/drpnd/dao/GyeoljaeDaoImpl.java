package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import kr.co.drpnd.domain.Sangsin;

@Repository("gyeoljaeDao")
public class GyeoljaeDaoImpl implements GyeoljaeDao {

	private final static String namespace = "mappers.gyeoljaeMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public List<Map<String, String>> selectGyeoljaeSawonList(Map<String, Object> param) {
		return msSqlSession.selectList(namespace + ".selectGyeoljaeSawonList", param);
	}

	@Override
	public List<Map<String, Object>> selectMyDefaultGyeoljaeLine(Map<String, String> param) {
		return msSqlSession.selectList(namespace + ".selectMyDefaultGyeoljaeLine", param);
	}

	@Override
	public void insertNewGyeoljae(Sangsin sangsin) {
		msSqlSession.insert(namespace + ".insertNewGyeoljae", sangsin);
		
	}

	@Override
	public int insertGyeoljaeLines(Sangsin sangsin) {
		return msSqlSession.insert(namespace + ".insertGyeoljaeLines", sangsin);
	}

	@Override
	public int insertGyeoljaeAttachFiles(Sangsin sangsin) {
		return msSqlSession.insert(namespace + ".insertGyeoljaeAttachFiles", sangsin);
	}

	@Override
	public List<Map<String, String>> selectMySangsin(String sawonCode) {
		return msSqlSession.selectList(namespace + ".selectMySangsin", sawonCode);
	}

	@Override
	public List<Map<String, String>> selectMyGyeoljae(Map<String, Object> param) {
		return msSqlSession.selectList(namespace + ".selectMyGyeoljae", param);
	} 
}
