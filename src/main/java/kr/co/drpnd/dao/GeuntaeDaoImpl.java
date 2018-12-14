package kr.co.drpnd.dao;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository("geuntaeDao")
public class GeuntaeDaoImpl implements GeuntaeDao {
	private final static String namespace = "mappers.geuntaeMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;
}
