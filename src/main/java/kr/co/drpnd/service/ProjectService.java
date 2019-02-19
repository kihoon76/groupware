package kr.co.drpnd.service;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.ProjectDao;
import kr.co.drpnd.domain.ExtjsStoreVO;
import kr.co.drpnd.domain.Wbs;

@Service("projectService")
public class ProjectService {

	@Resource(name="projectDao")
	ProjectDao projectDao;

	public void createNewWBS(Map<String, String> param) {
		projectDao.insertNewWBS(param);
	}

	public ExtjsStoreVO<Wbs> getListWBS(Map param) {
		return projectDao.selectListWBS(param);
	}
}
