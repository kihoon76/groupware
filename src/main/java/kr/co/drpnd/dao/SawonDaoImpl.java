package kr.co.drpnd.dao;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import kr.co.drpnd.domain.Sawon;

@Repository("sawonDao")
public class SawonDaoImpl implements SawonDao {
	
	private final static String namespace = "mappers.sawonMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;
	
	@Override
	public Sawon selectSawonInfo(String username) {
		return msSqlSession.selectOne(namespace + ".selectSawonInfo", username);
	}

}
