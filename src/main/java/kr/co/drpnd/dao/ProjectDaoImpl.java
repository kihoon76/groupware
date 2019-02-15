package kr.co.drpnd.dao;

import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository("projectDao")
public class ProjectDaoImpl implements ProjectDao {

	private final static String namespace = "mappers.projectMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public void insertNewWBS(Map<String, String> param) {
		msSqlSession.insert(namespace + ".insertNewWBS", param);
		
	}
}
