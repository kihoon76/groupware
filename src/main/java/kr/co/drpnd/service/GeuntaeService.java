package kr.co.drpnd.service;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.GeuntaeDao;
import kr.co.drpnd.domain.Geuntae;
import kr.co.drpnd.exception.AlreadyGotowork;
import kr.co.drpnd.exception.InvalidGotoworkTime;
import kr.co.drpnd.type.ExceptionCode;

@Service("geuntaeService")
public class GeuntaeService {

	@Resource(name="geuntaeDao")
	GeuntaeDao geuntaeDao;
	
	public String checkGotowork(String sawonCode) {
		if(!checkValidHour()) {
			throw new InvalidGotoworkTime(ExceptionCode.INVALID_GOTOWORK_TIME.getMsg());
		}
		
		Geuntae geuntae = new Geuntae();
		geuntae.setSawonCode(sawonCode);
		geuntae.setOutworkYN("N");
		geuntae.setGotoworkMethod("P");
		geuntae.setLat(0);
		geuntae.setLng(0);
		
		geuntaeDao.insertGotowork(geuntae);
		
		if(geuntae.getGotoworkTime().equals("0")) throw new AlreadyGotowork(ExceptionCode.ALREADY_GOTOWORK.getMsg());
		
		return geuntae.getGotoworkTime();
	}

	public boolean checkMyTodayGotowork(String sawonCode) {
		if(!checkValidHour()) {
			throw new InvalidGotoworkTime(ExceptionCode.INVALID_GOTOWORK_TIME.getMsg());
		}
		
		int r = geuntaeDao.selectMyTodayGotowork(sawonCode);
		
		return r == 1;
	}
	
	private boolean checkValidHour() {
		Map<String, String> param = new HashMap<>();
		param.put("type",  "HOUR");
		int hour = geuntaeDao.selectTime(param);
		
		if(hour >= 0 && hour <=6) {
			return false;
		}
		
		return true;
	}

}
