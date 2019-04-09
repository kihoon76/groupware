package kr.co.drpnd.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.DocDao;

@Service("docService")
public class DocService {

	@Resource(name="docDao")
	DocDao docDao;
	
	public List<Map<String, String>> getNormalDocList() {
		return docDao.selectNormalDocList();
	}

}
