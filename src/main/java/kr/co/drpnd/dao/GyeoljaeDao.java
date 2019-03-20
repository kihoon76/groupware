package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import kr.co.drpnd.domain.AttachFile;
import kr.co.drpnd.domain.Sangsin;
import kr.co.drpnd.domain.VacationDocs;

public interface GyeoljaeDao {
	List<Map<String, String>> selectGyeoljaeSawonList(Map<String, Object> param);

	List<Map<String, Object>> selectMyDefaultGyeoljaeLine(Map<String, String> param);

	void insertNewGyeoljae(Sangsin sangsin);

	int insertGyeoljaeLines(Sangsin sangsin);

	int insertGyeoljaeAttachFiles(Sangsin sangsin);

	List<Map<String, String>> selectMySangsin(Map<String, Object> param);

	List<Map<String, String>> selectMyGyeoljae(Map<String, Object> param);

	Sangsin selectMyGyeoljaeDetail(Map<String, String> param);

	AttachFile selectAttachFile(Map<String, String> param);

	void updateCommitMyGyeoljae(Map map);

	List<Map<String, String>> selectMyCommitedGyeoljae(Map<String, Object> param);

	void updateRejectMyGyeoljae(Map map);

	Sangsin selectMySangsinDetail(Map<String, String> param);

	String selectGyeoljaeComment(Map<String, String> param);

	Map<String, Object> selectMySangsinTotalCount(Map<String, Object> param);

	Map<String, Object> selectMyGyeoljaeTotalCount(Map<String, Object> param);

	Map<String, Object> selectMyCommitedGyeoljaeTotalCount(Map<String, Object> param);

	List<Map<String, Object>> selectVacationDefaultGyeoljaeLine(Map<String, String> param);

	int selectSangsin(Map<String, String> param);

	int selectEditableSangsin(Map<String, String> param);

	Sangsin selectMyModifySangsin(Map<String, String> param);

	int updateModifySangsin(String sangsinNum);

	int updateModifyCancelSangsin(String sangsinNum);

	void updateMySangsin(Sangsin sangsin);

	void deleteGyeoljaeLines(String valueOf);

	Map<String, String> selectFirstGyeoljaeja(String sangsinNum);

	int deleteGyeoljaeAttachFiles(int sangsinNum);

	void updateSangsinModifyFlag(int sangsinNum);

	void deleteMySangsin(Map<String, Integer> rltMap);

	void deleteGyeoljaeAttachFileByCode(String delAttachCode);

	VacationDocs selectVacationDocsInfo(Map<String, String> param);

}
