package kr.co.drpnd.service;

import java.util.Calendar;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.GeuntaeDao;
import kr.co.drpnd.domain.Geuntae;
import kr.co.drpnd.exception.AlreadyGotowork;
import kr.co.drpnd.type.ExceptionCode;

@Service("geuntaeService")
public class GeuntaeService {

	@Resource(name="geuntaeDao")
	GeuntaeDao geuntaeDao;
	
	public boolean checkGotowork(String sawonCode) {
		
		Geuntae geuntae = new Geuntae();
		geuntae.setSawonCode(sawonCode);
		geuntae.setOutworkYN("N");
		geuntae.setGotoworkMethod("P");
		geuntae.setLat(0);
		geuntae.setLng(0);
		
		geuntaeDao.insertGotowork(geuntae);
		
		if(geuntae.getResult() == -1) throw new AlreadyGotowork(ExceptionCode.ALREADY_GOTOWORK.getMsg());
		
		return true;
	}

}
