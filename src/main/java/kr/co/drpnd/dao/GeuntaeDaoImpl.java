package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import kr.co.drpnd.domain.Geuntae;
import kr.co.drpnd.domain.Team;

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
	public Map<String, Integer> selectMyTodayGotowork(String sawonCode) {
		return msSqlSession.selectOne(namespace + ".selectMyTodayGotowork", sawonCode);
	}

	@Override
	public int selectTime(Map<String, String> param) {
		return msSqlSession.selectOne(namespace + ".selectTime", param);
	}

	@Override
	public void updateOffwork(Geuntae geuntae) {
		msSqlSession.update(namespace + ".updateOffwork", geuntae);
		
	}

	@Override
	public int selectMyTodayOffwork(int sawonCode) {
		return msSqlSession.selectOne(namespace + ".selectMyTodayOffwork", sawonCode);
	}

	@Override
	public Map<String, Object> selectGeuntaeDetail(Map<String, Integer> param) {
		return msSqlSession.selectOne(namespace + ".selectGeuntaeDetail", param);
	}

	@Override
	public String selectCuttentTime10() {
		return msSqlSession.selectOne(namespace + ".selectCurrentTime10");
	}

	@Override
	public int updateGeuntae(Map<String, String> param) {
		return msSqlSession.update(namespace + ".updateGeuntae", param);
	}

	@Override
	public List<Team> selectTeamList(String sawonDepartment) {
		return msSqlSession.selectList(namespace + ".selectTeamList", sawonDepartment);
	}

	@Override
	public int updateGeuntaeOutworkToIn(Map<String, String> param) {
		return msSqlSession.update(namespace + ".updateGeuntaeOutworkToIn", param);
	}

	@Override
	public int updateGeuntaeInworkToOut(Map<String, String> param) {
		return msSqlSession.update(namespace + ".updateGeuntaeInworkToOut", param);
	}

	@Override
	public String selectMyYesterdayOffwork(String sawonCode) {
		return msSqlSession.selectOne(namespace + ".selectMyYesterdayOffwork", sawonCode);
	}

	@Override
	public void updateAutoOffwork() {
		msSqlSession.update(namespace + ".updateAutoOffwork");
	}

	@Override
	public int selectMyYesterdayGotowork(String sawonCode) {
		return msSqlSession.selectOne(namespace + ".selectMyYesterdayGotowork", sawonCode);
	}

	@Override
	public int selectMyYesterdayOffworkNotAuto(String sawonCode) {
		return msSqlSession.selectOne(namespace + ".selectMyYesterdayOffworkNotAuto", sawonCode);
	}


}
