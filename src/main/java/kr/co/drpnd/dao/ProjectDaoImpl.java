package kr.co.drpnd.dao;

import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import kr.co.drpnd.domain.ExtjsStoreVO;
import kr.co.drpnd.domain.Wbs;

@Repository("projectDao")
public class ProjectDaoImpl implements ProjectDao {

	private final static String namespace = "mappers.projectMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public void insertNewWBS(Map<String, String> param) {
		msSqlSession.insert(namespace + ".insertNewWBS", param);
		
	}

	@Override
	public ExtjsStoreVO<Wbs> selectListWBS(Map param) {
		return msSqlSession.selectOne(namespace + ".selectListWBS", param);
	}
}
