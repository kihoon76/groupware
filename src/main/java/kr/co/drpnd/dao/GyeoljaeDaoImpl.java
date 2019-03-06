package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import kr.co.drpnd.domain.AttachFile;
import kr.co.drpnd.domain.Sangsin;

@Repository("gyeoljaeDao")
public class GyeoljaeDaoImpl implements GyeoljaeDao {

	private final static String namespace = "mappers.gyeoljaeMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;

	@Override
	public List<Map<String, String>> selectGyeoljaeSawonList(Map<String, Object> param) {
		return msSqlSession.selectList(namespace + ".selectGyeoljaeSawonList", param);
	}

	@Override
	public List<Map<String, Object>> selectMyDefaultGyeoljaeLine(Map<String, String> param) {
		return msSqlSession.selectList(namespace + ".selectMyDefaultGyeoljaeLine", param);
	}

	@Override
	public void insertNewGyeoljae(Sangsin sangsin) {
		msSqlSession.insert(namespace + ".insertNewGyeoljae", sangsin);
		
	}

	@Override
	public int insertGyeoljaeLines(Sangsin sangsin) {
		return msSqlSession.insert(namespace + ".insertGyeoljaeLines", sangsin);
	}

	@Override
	public int insertGyeoljaeAttachFiles(Sangsin sangsin) {
		return msSqlSession.insert(namespace + ".insertGyeoljaeAttachFiles", sangsin);
	}

	@Override
	public List<Map<String, String>> selectMySangsin(Map<String, Object> param) {
		return msSqlSession.selectList(namespace + ".selectMySangsin", param);
	}

	@Override
	public List<Map<String, String>> selectMyGyeoljae(Map<String, Object> param) {
		return msSqlSession.selectList(namespace + ".selectMyGyeoljae", param);
	}

	@Override
	public Sangsin selectMyGyeoljaeDetail(Map<String, String> param) {
		return msSqlSession.selectOne(namespace + ".selectMyGyeoljaeDetail", param);
	}

	@Override
	public AttachFile selectAttachFile(Map<String, String> param) {
		return msSqlSession.selectOne(namespace + ".selectAttachFile", param);
	}

	@Override
	public void updateCommitMyGyeoljae(Map map) {
		msSqlSession.update(namespace + ".updateCommitMyGyeoljae", map);
	}

	@Override
	public List<Map<String, String>> selectMyCommitedGyeoljae(Map<String, Object> param) {
		return msSqlSession.selectList(namespace + ".selectMyCommitedGyeoljae", param);
	}

	@Override
	public void updateRejectMyGyeoljae(Map map) {
		msSqlSession.update(namespace + ".updateRejectMyGyeoljae", map);
		
	}

	@Override
	public Sangsin selectMySangsinDetail(Map<String, String> param) {
		return msSqlSession.selectOne(namespace + ".selectMySangsinDetail", param);
	}

	@Override
	public String selectGyeoljaeComment(Map<String, String> param) {
		return msSqlSession.selectOne(namespace + ".selectGyeoljaeComment", param);
	}

	@Override
	public Map<String, Object> selectMySangsinTotalCount(Map<String, Object> param) {
		return msSqlSession.selectOne(namespace + ".selectMySangsinTotalCount", param);
	}

	@Override
	public Map<String, Object> selectMyGyeoljaeTotalCount(Map<String, Object> param) {
		return msSqlSession.selectOne(namespace + ".selectMyGyeoljaeTotalCount", param);
	}

	@Override
	public Map<String, Object> selectMyCommitedGyeoljaeTotalCount(Map<String, Object> param) {
		return msSqlSession.selectOne(namespace + ".selectMyCommitedGyeoljaeTotalCount", param);
	}

	@Override
	public List<Map<String, Object>> selectVacationDefaultGyeoljaeLine(Map<String, String> param) {
		return msSqlSession.selectList(namespace + ".selectVacationDefaultGyeoljaeLine", param);
	} 
}
