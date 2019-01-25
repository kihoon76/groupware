package kr.co.drpnd.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import kr.co.drpnd.dao.GyeoljaeDao;
import kr.co.drpnd.domain.AttachFile;
import kr.co.drpnd.domain.Sangsin;
import kr.co.drpnd.exception.InvalidUser;
import kr.co.drpnd.type.ExceptionCode;

@Service("gyeoljaeService")
public class GyeoljaeService {

	@Resource(name="gyeoljaeDao")
	GyeoljaeDao gyeoljaeDao;
	
	public List<Map<String, String>> getGyeoljaeSawonList(Map<String, Object> param) {
		return gyeoljaeDao.selectGyeoljaeSawonList(param);
	}

	public List<Map<String, Object>> getMyDefaultGyeoljaeLine(Map<String, String> param) {
		return gyeoljaeDao.selectMyDefaultGyeoljaeLine(param);
	}

	@Transactional(
			isolation=Isolation.DEFAULT, 
			propagation=Propagation.REQUIRED, 
			rollbackFor=Exception.class,
			timeout=10)//timeout 초단위
	public void regNewGyeoljae(Sangsin sangsin) {
		
		gyeoljaeDao.insertNewGyeoljae(sangsin);
		
		if(sangsin.getSangsinNum() == 0) {
			throw new RuntimeException("상신코드가 생성되지 않았습니다.");
		}
		
		int lineCount = sangsin.getGyeoljaeLines().size();
		int r = gyeoljaeDao.insertGyeoljaeLines(sangsin);
		
		if(r != lineCount) {
			throw new RuntimeException("결재라인입력중 오류가 발생했습니다.");
		}
		
		if(sangsin.getAttachFiles() != null) {
			int fileCount = sangsin.getAttachFiles().size();
			int rFiles = gyeoljaeDao.insertGyeoljaeAttachFiles(sangsin);
			
			if(rFiles != fileCount) {
				throw new RuntimeException("첨부파일 입력중 오류가 발생했습니다.");
			}
		}
	}

	public List<Map<String, String>> getMySangsin(String sawonCode) {
		return gyeoljaeDao.selectMySangsin(sawonCode);
	}

	public List<Map<String, String>> getMyGyeoljae(Map<String, Object> param) {
		return gyeoljaeDao.selectMyGyeoljae(param);
	}

	public Sangsin getMyGyeoljaeDetail(Map<String, String> param) {
		return gyeoljaeDao.selectMyGyeoljaeDetail(param);
	}

	public AttachFile getAttachFile(Map<String, String> param) {
		return gyeoljaeDao.selectAttachFile(param);
	}

	public void commitGyeoljae(Map map) {
		gyeoljaeDao.updateCommitMyGyeoljae(map);
		
		String r = String.valueOf(map.get("result"));
		if("-2".equals(r)) {
			throw new InvalidUser(ExceptionCode.INVALID_GYEOLJAE_USER.getMsg());
		}
		else if("-1".equals(r)) {
			throw new RuntimeException("오류가 발생했습니다.");
		}
	}

	public List<Map<String, String>> getMyCommitedGyeoljae(Map<String, Object> param) {
		return gyeoljaeDao.selectMyCommitedGyeoljae(param);
	}

	public void rejectGyeoljae(Map map) {
		gyeoljaeDao.updateRejectMyGyeoljae(map);
		
		String r = String.valueOf(map.get("result"));
		if("-2".equals(r)) {
			throw new InvalidUser(ExceptionCode.INVALID_GYEOLJAE_USER.getMsg());
		}
		else if("-1".equals(r)) {
			throw new RuntimeException("오류가 발생했습니다.");
		}
	}

	public Sangsin getMySangsinDetail(Map<String, String> param) {
		return gyeoljaeDao.selectMySangsinDetail(param);
	}

	public String getGyeoljaeComment(Map<String, String> param) {
		return gyeoljaeDao.selectGyeoljaeComment(param);
	}

}
