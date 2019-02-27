package kr.co.drpnd.dao;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import kr.co.drpnd.domain.FCMVo;

@Repository("fcmDao")
public class FcmDaoImpl implements FcmDao {

	private final static String namespace = "mappers.fcmMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public void insertFcmLog(FCMVo vo) {
		msSqlSession.insert(namespace + ".insertFcmLog", vo);
	}
}
