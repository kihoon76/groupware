package kr.co.drpnd.service;

import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.DesignDao;
import kr.co.drpnd.domain.Design;

@Service("designService")
public class DesignService {

	@Resource(name="designDao")
	DesignDao designDao;
	
	public Design getDesignDetail(Map<String, String> param) {
		return designDao.selectDesignDetail(param);
	}

}
