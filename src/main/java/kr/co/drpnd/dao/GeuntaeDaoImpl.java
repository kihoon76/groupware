package kr.co.drpnd.dao;

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


}
