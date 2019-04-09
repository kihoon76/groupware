package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository("docDao")
public class DocDaoImpl implements DocDao {

	private final static String namespace = "mappers.docMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public List<Map<String, String>> selectNormalDocList() {
		return msSqlSession.selectList(namespace + ".selectNormalDocList");
	}

}
