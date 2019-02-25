package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository("statisticDao")
public class StatisticDaoImpl implements StatisticDao {

	private final static String namespace = "mappers.statisticMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public List<List<Map<String, Object>>> selectOverwork(Map<String, Object> param) {
		return msSqlSession.selectList(namespace + ".selectOverwork", param);
	}

	@Override
	public List<Map<String, Object>> selectOverworkMonth(Map<String, Object> param) {
		return msSqlSession.selectList(namespace + ".selectOverworkMonth", param);
	}
	

	
}
