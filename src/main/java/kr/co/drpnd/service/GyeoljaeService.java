package kr.co.drpnd.service;

import java.nio.charset.Charset;
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
import kr.co.drpnd.domain.VacationDocs;
import kr.co.drpnd.exception.InvalidUser;
import kr.co.drpnd.exception.ModifySangsin;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.util.DataUtil;

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

	public List<Map<String, String>> getMySangsin(Map<String, Object> param) {
		return gyeoljaeDao.selectMySangsin(param);
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
		else if("-500".equals(r)) {
			throw new ModifySangsin(ExceptionCode.MODIFY_SANGSIN.getMsg());
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
		else if("-500".equals(r)) {
			throw new ModifySangsin(ExceptionCode.MODIFY_SANGSIN.getMsg());
		}
	}

	public Sangsin getMySangsinDetail(Map<String, String> param) {
		return gyeoljaeDao.selectMySangsinDetail(param);
	}

	public String getGyeoljaeComment(Map<String, String> param) {
		return gyeoljaeDao.selectGyeoljaeComment(param);
	}

	public Map<String, Object> getMySangsinTotalCount(Map<String, Object> param) {
		return gyeoljaeDao.selectMySangsinTotalCount(param);
	}

	public Map<String, Object> getMyGyeoljaeTotalCount(Map<String, Object> param) {
		return gyeoljaeDao.selectMyGyeoljaeTotalCount(param);
	}

	public Map<String, Object> getMyCommitedGyeoljaeTotalCount(Map<String, Object> param) {
		return gyeoljaeDao.selectMyCommitedGyeoljaeTotalCount(param);
	}

	public Map<String, Object> getAllCommitedGyeoljaeTotalCount(Map<String, Object> param) {
		return gyeoljaeDao.selectMyCommitedGyeoljaeTotalCount(param);
	}

	public List<Map<String, String>> getAllCommitedGyeoljae(Map<String, Object> param) {
		return gyeoljaeDao.selectMyCommitedGyeoljae(param);
	}

	public Sangsin getCommittedSangsinDetail(Map<String, String> param) {
		return gyeoljaeDao.selectMySangsinDetail(param);
	}

	public List<Map<String, Object>> getVacationGyeoljaeLine(Map<String, String> param) {
		return gyeoljaeDao.selectVacationDefaultGyeoljaeLine(param);
	}

	public boolean isEditableSangsin(Map<String, String> param) {
		int r = gyeoljaeDao.selectSangsin(param); 
		if(r != 1) return false;
		
		r = gyeoljaeDao.selectEditableSangsin(param);
		
		if(r > 0) return false;
		
		return true;
	}

	public Sangsin getMyModifySangsin(Map<String, String> param) {
		return gyeoljaeDao.selectMyModifySangsin(param);
	}

	public boolean confirmMySangsin(Map<String, String> param) {
		return 1 == gyeoljaeDao.selectSangsin(param);
	}

	public boolean alarmModifySangsin(String sangsinNum) {
		return 1 == gyeoljaeDao.updateModifySangsin(sangsinNum);
	}

	public boolean alarmModifyCancelSangsin(String sangsinNum) {
		return 1 == gyeoljaeDao.updateModifyCancelSangsin(sangsinNum);
	}

	@Transactional(
			isolation=Isolation.DEFAULT, 
			propagation=Propagation.REQUIRED, 
			rollbackFor=Exception.class,
			timeout=10)//timeout 초단위
	public void modifyGyeoljae(Sangsin sangsin) {
		gyeoljaeDao.updateMySangsin(sangsin);
		
		int lineCount = sangsin.getGyeoljaeLines().size();
		
		try {
			gyeoljaeDao.deleteGyeoljaeLines(String.valueOf(sangsin.getSangsinNum()));
			int r = gyeoljaeDao.insertGyeoljaeLines(sangsin);
			
			if(r != lineCount) {
				throw new RuntimeException("결재라인입력중 오류가 발생했습니다.");
			}
			
			if(sangsin.getAttachFiles() != null) {
				gyeoljaeDao.deleteGyeoljaeAttachFiles(sangsin.getSangsinNum());
				int fileCount = sangsin.getAttachFiles().size();
				int rFiles = gyeoljaeDao.insertGyeoljaeAttachFiles(sangsin);
				
				if(rFiles != fileCount) {
					throw new RuntimeException("첨부파일 입력중 오류가 발생했습니다.");
				}
			}
			else {
				//기존 첨부만 삭제할 경우
				String delAttachCode = sangsin.getDelAttachCode();
				if(delAttachCode != null && !"".equals(delAttachCode)) {
					gyeoljaeDao.deleteGyeoljaeAttachFileByCode(delAttachCode);
				}
			}
			
			//상신수정중 변경
			gyeoljaeDao.updateSangsinModifyFlag(sangsin.getSangsinNum());
			
		}
		catch(Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		}
		
	}

	public Map<String, String> getFirstGyeoljaeja(String sangsinNum) {
		return gyeoljaeDao.selectFirstGyeoljaeja(sangsinNum);
	}

	public void deleteMySangsin(Map<String, Integer> rltMap) {
		gyeoljaeDao.deleteMySangsin(rltMap);
		
	}

	public VacationDocs getVacationDocsInfo(Map<String, String> param) {
		VacationDocs docs = gyeoljaeDao.selectVacationDocsInfo(param);
		String mySign = docs.getMySign();
		List<Map<String, Object>> signs = docs.getSigns();
		
		if(mySign != null) {
			byte[] signByte = DataUtil.hexStringToByteArray(mySign); 
			docs.setMySign(new String(signByte, Charset.forName("UTF-8")));
		}
		
		if(signs != null) {
			int len = signs.size();
			for(int i=0; i<len; i++) {
				byte[] b = (byte[])signs.get(i).get("sign");
				if(b != null) {
					signs.get(i).put("sign", new String(b, Charset.forName("UTF-8")));
				}
			}
		}
		
		return docs;
	}

}
