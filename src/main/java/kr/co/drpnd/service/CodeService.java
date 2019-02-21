package kr.co.drpnd.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.CodeDao;

@Service("codeService")
public class CodeService {

	@Resource(name="codeDao")
	CodeDao codeDao;
	
	public List<Object> getDepartment() {
		return codeDao.selectDepartment();
	}

	public List<Object> getTeam(String pCode) {
		return codeDao.selectTeam(pCode);
	}

	public List<Object> getPosition() {
		return codeDao.selectPosition();
	}

	public List<Object> getOverwork() {
		return codeDao.selectOverwork();
	}

	public List<Object> getGyeoljae() {
		return codeDao.selectGyeoljae();
	}
}
