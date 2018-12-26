package kr.co.drpnd.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import kr.co.drpnd.dao.SawonDao;
import kr.co.drpnd.domain.Sawon;

@Service("sawonService")
public class SawonService {

	@Resource(name="sawonDao")
	SawonDao sawonDao;
	
	public Sawon getSawonInfo(String username) {
		return sawonDao.selectSawonInfo(username);
	}

	@Transactional(isolation=Isolation.DEFAULT, 
			   propagation=Propagation.REQUIRED, 
			   rollbackFor=Exception.class,
			   timeout=10)//timeout 초단위
	public void regist(Sawon sawon) throws Exception {
		 sawonDao.insertSawon(sawon);
		 
		 if(sawon.getSawonCode() == null) throw new Exception("사원키가 생성되지 않았습니다.");
		 
		 int r = sawonDao.insertAuthority(sawon.getSawonCode());
		 
		 if(r != 1) throw new Exception("권한이 설정되지 않았습니다.");
	}

	public List<Sawon> getMyDepartmentAllSawon(String sawonDepartment) {
		return sawonDao.selectMyDepartmentSawonList(sawonDepartment);
	}

	public void modifySawon(Sawon sawon) {
		sawonDao.updateSawon(sawon);
	}

	public List<Map<String, Object>> getTodayVacationAllSawon(String sawonDepartment) {
		Map<String, Integer> param = new HashMap<>();
		param.put("department", Integer.parseInt(sawonDepartment));
		return sawonDao.selectTodayVacationAllSawon(param);
	}
}
