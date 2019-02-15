package kr.co.drpnd.service;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.ProjectDao;

@Service("projectService")
public class ProjectService {

	@Resource(name="projectDao")
	ProjectDao projectDao;

	public void createNewWBS(Map<String, String> param) {
		projectDao.insertNewWBS(param);
		
	}
}
