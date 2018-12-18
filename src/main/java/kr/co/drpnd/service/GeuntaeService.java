package kr.co.drpnd.service;

import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.GeuntaeDao;
import kr.co.drpnd.domain.Geuntae;
import kr.co.drpnd.exception.AlreadyGotowork;
import kr.co.drpnd.exception.AlreadyOffwork;
import kr.co.drpnd.exception.InvalidGotoworkTime;
import kr.co.drpnd.exception.NotExistGotowork;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.type.WorkMethod;

@Service("geuntaeService")
public class GeuntaeService {

	@Resource(name="geuntaeDao")
	GeuntaeDao geuntaeDao;
	
	public String checkGotowork(String sawonCode) {
		Geuntae geuntae = new Geuntae();
		geuntae.setSawonCode(sawonCode);
		geuntae.setOutworkYN("N");
		geuntae.setGotoworkMethod(WorkMethod.PC.toString());
		geuntae.setLat(0);
		geuntae.setLng(0);
		
		geuntaeDao.insertGotowork(geuntae);
		
		if(geuntae.getGotoworkTime().equals("0")) throw new AlreadyGotowork(ExceptionCode.ALREADY_GOTOWORK.getMsg());
		if(geuntae.getGotoworkTime().equals("-1")) throw new InvalidGotoworkTime(ExceptionCode.INVALID_GOTOWORK_TIME.getMsg());
		
		return geuntae.getGotoworkTime();
	}

	public boolean checkMyTodayGotowork(String sawonCode) {
		Map<String, Integer> r = geuntaeDao.selectMyTodayGotowork(sawonCode);
		int hour = r.get("hr");
		
		if(r.get("cnt") == 0) {
			if(hour >= 0 && hour <=6) {
				throw new InvalidGotoworkTime(ExceptionCode.INVALID_GOTOWORK_TIME.getMsg());
			}
			
			return false;
		} 
		
		return true;
	}

	public Geuntae checkOffwork(Map<String, String> param) {
		Geuntae geuntae = new Geuntae();
		geuntae.setSawonCode(param.get("sawonCode"));
		geuntae.setOffworkMethod(WorkMethod.PC.toString());
		geuntae.setLat(0);
		geuntae.setLng(0);
		geuntae.setWorkContent(param.get("workContent"));
		geuntae.setOutworkContent(param.get("outworkContent"));
		
		geuntaeDao.updateOffwork(geuntae);
		
		String returnVal = geuntae.getOffworkTime();
		
		//이미 퇴근처리됨
		if("-1".equals(returnVal)) {
			throw new AlreadyOffwork(ExceptionCode.ALREADY_OFFWORK.getMsg());
		}
		else if("0".equals(returnVal)) { //출근정보가 없음
			throw new NotExistGotowork(ExceptionCode.NOT_EXIST_GOTOWORK.getMsg());
		}
		
		return geuntae;
	}
	

}
