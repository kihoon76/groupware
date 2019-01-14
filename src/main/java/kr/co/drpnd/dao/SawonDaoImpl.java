package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

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

	@Override
	public int insertSawon(Sawon sawon) {
		return msSqlSession.insert(namespace + ".insertSawon", sawon);
		
	}

	@Override
	public List<Sawon> selectMyDepartmentSawonList(String sawonDepartment) {
		return msSqlSession.selectList(namespace + ".selectMyDepartmentSawonList", sawonDepartment);
	}

	@Override
	public void updateSawon(Sawon sawon) {
		msSqlSession.update(namespace + ".updateSawon", sawon);
		
	}

	@Override
	public int insertAuthority(String sawonCode) {
		return msSqlSession.insert(namespace + ".insertAuthority", sawonCode);
		
	}

	@Override
	public List<Map<String, Object>> selectTodayVacationAllSawon(Map<String, Integer> param) {
		return msSqlSession.selectList(namespace + ".selectTodayVacationAllSawon", param);
	}

	@Override
	public List<Map<String, Object>> selectTodayPlanAllSawon(Map<String, Integer> param) {
		return msSqlSession.selectList(namespace + ".selectTodayPlanAllSawon", param);
	}

	@Override
	public void updateSawonSign(Map<String, Object> param) {
		msSqlSession.update(namespace + ".updateSawonSign", param);
		
	}

}
