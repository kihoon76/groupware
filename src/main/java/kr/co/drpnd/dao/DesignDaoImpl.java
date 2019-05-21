package kr.co.drpnd.dao;

import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import kr.co.drpnd.domain.Design;

@Repository("designDao")
public class DesignDaoImpl implements DesignDao {

	private final static String namespace = "mappers.designMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public Design selectDesignDetail(Map<String, String> param) {
		return msSqlSession.selectOne(namespace + ".selectDesignDetail", param);
	}
}
