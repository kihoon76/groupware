package kr.co.drpnd.dao;

import java.util.HashMap;
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
		Map<String, Integer> m = new HashMap<>();
		m.put("department", Integer.parseInt(sawonDepartment));
		return msSqlSession.selectList(namespace + ".selectMyDepartmentSawonList", m);
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

	@Override
	public void insertDevice(Map<String, String> app) {
		msSqlSession.insert(namespace + ".insertDevice", app);
	}

	@Override
	public List<String> selectSawonDeviceList(String sawonCode) {
		return msSqlSession.selectList(namespace + ".selectSawonDeviceList", sawonCode);
	}

	@Override
	public List<String> selectSawonAllDevices() {
		return msSqlSession.selectList(namespace + ".selectSawonAllDevices");
	}

	@Override
	public Sawon selectTodayMyGeuntaeByMobile(Map<String, Integer> me) {
		return msSqlSession.selectOne(namespace + ".selectTodayMyGeuntaeByMobile", me);
	}

	@Override
	public List<Map<String, String>> selectSawonInfoForVacation(Map<String, String> param) {
		return msSqlSession.selectList(namespace + ".selectSawonInfoForVacation", param);
	}

	@Override
	public List<Map<String, String>> selectSawonVacationHistory(Map<String, String> m) {
		return msSqlSession.selectList(namespace + ".selectSawonVacationHistory", m);
	}

	@Override
	public List<Map<String, String>> selectSawonOverworkHistory(Map<String, Object> m) {
		return msSqlSession.selectList(namespace + ".selectSawonOverworkHistory", m);
	}

	@Override
	public String selectSawonSeatNum(String sawonCode) {
		return msSqlSession.selectOne(namespace + ".selectSawonSeatNum", sawonCode);
	}

	@Override
	public String selectSawonCodeByRfid(String rfid) {
		return msSqlSession.selectOne(namespace + ".selectSawonCodeByRfid", rfid);
	}

}
