package kr.co.drpnd.service;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.SawonDao;
import kr.co.drpnd.domain.Sawon;

@Service("sawonService")
public class SawonService {

	@Resource(name="sawonDao")
	SawonDao sawonDao;
	
	public Sawon getSawonInfo(String username) {
		return sawonDao.selectSawonInfo(username);
	}

	public boolean regist(Sawon sawon) {
		return 1 == sawonDao.insertSawon(sawon);
	}
}
