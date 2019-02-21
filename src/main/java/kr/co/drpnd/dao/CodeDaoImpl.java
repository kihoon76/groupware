package kr.co.drpnd.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository("codeDao")
public class CodeDaoImpl implements CodeDao {

	private final static String namespace = "mappers.codeMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public List<Object> selectDepartment() {
		return msSqlSession.selectList(namespace + ".selectDepartment");
	}

	@Override
	public List<Object> selectTeam(String departmentCode) {
		return msSqlSession.selectList(namespace + ".selectTeam", departmentCode);
	}

	@Override
	public List<Object> selectPosition() {
		return msSqlSession.selectList(namespace + ".selectPosition");
	}

	@Override
	public List<Object> selectOverwork() {
		return msSqlSession.selectList(namespace + ".selectOverwork");
	}

	@Override
	public List<Object> selectGyeoljae() {
		return msSqlSession.selectList(namespace + ".selectGyeoljae");
	}
}
