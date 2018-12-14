package kr.co.drpnd.service;

import java.util.Calendar;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.GeuntaeDao;

@Service("geuntaeService")
public class GeuntaeService {

	@Resource(name="geuntaeDao")
	GeuntaeDao geuntaeDao;
	
	public void checkGotowork(String sawonCode) {
		Calendar cal = Calendar.getInstance();
		
		//int r = geuntaeDao.
		
	}

}
