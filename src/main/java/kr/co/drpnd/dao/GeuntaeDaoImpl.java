package kr.co.drpnd.dao;

import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import kr.co.drpnd.domain.Geuntae;

@Repository("geuntaeDao")
public class GeuntaeDaoImpl implements GeuntaeDao {
	private final static String namespace = "mappers.geuntaeMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public int insertGotowork(Geuntae geuntae) {
		return msSqlSession.insert(namespace + ".insertGotowork", geuntae);
	}

	@Override
	public int selectMyTodayGotowork(String sawonCode) {
		return msSqlSession.selectOne(namespace + ".selectMyTodayGotowork", sawonCode);
	}

	@Override
	public int selectTime(Map<String, String> param) {
		return msSqlSession.selectOne(namespace + ".selectTime", param);
	}


}
