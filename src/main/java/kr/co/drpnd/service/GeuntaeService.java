package kr.co.drpnd.service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import kr.co.drpnd.dao.GeuntaeDao;
import kr.co.drpnd.domain.Geuntae;
import kr.co.drpnd.domain.Team;
import kr.co.drpnd.exception.AlreadyGotowork;
import kr.co.drpnd.exception.AlreadyOffwork;
import kr.co.drpnd.exception.InvalidGotoworkTime;
import kr.co.drpnd.exception.InvalidUser;
import kr.co.drpnd.exception.NotExistGotowork;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.type.WorkMethod;

@Service("geuntaeService")
public class GeuntaeService {

	@Resource(name="geuntaeDao")
	GeuntaeDao geuntaeDao;
	
	public String checkGotowork(Geuntae geuntae) {
		geuntaeDao.insertGotowork(geuntae);
		
		if(geuntae.getGotoworkTime().equals("0")) throw new AlreadyGotowork(ExceptionCode.ALREADY_GOTOWORK.getMsg());
		//if(geuntae.getGotoworkTime().equals("-1")) throw new InvalidGotoworkTime(ExceptionCode.INVALID_GOTOWORK_TIME.getMsg());
		
		return geuntae.getGotoworkTime();
	}
	
	public boolean checkYesterdayOffworkNotAuto(String sawonCode) {
		int yesterdayGotowork = geuntaeDao.selectMyYesterdayGotowork(sawonCode);
		
		if(yesterdayGotowork == 0) {
			return true;
		}
		
		return 1 == geuntaeDao.selectMyYesterdayOffworkNotAuto(sawonCode);
	}

	public boolean checkMyTodayGotowork(String sawonCode) {
		Map<String, Integer> r = geuntaeDao.selectMyTodayGotowork(sawonCode);
		
		int hour = r.get("hr");
		if(r.get("cnt") == 0) {
			int yesterdayGotowork = geuntaeDao.selectMyYesterdayGotowork(sawonCode);
			
			//어제 출근 기록이 없으면 열어준다
			if(yesterdayGotowork == 0) {
				return false;
			}
			
			String yesterdayOffwork = geuntaeDao.selectMyYesterdayOffwork(sawonCode);
			
			//어제 출퇴 처리를 다 한사람은 익일 00:00시 부터 출근 활성화
			if("Y".equals(yesterdayOffwork)) {
				return false;
			}
			
			if(hour >= 0 && hour <=7) {
				//throw new InvalidGotoworkTime(ExceptionCode.INVALID_GOTOWORK_TIME.getMsg());
				return true;
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
		geuntae.setOverworkType(Integer.parseInt(param.get("overworkType")));
		geuntae.setStartFrom6(param.get("startFrom6"));
		
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

	public boolean checkMyTodayOffwork(String sawonCode) {
		int r = geuntaeDao.selectMyTodayOffwork(Integer.parseInt(sawonCode));
		return r == 0;
	}

	public Map<String, Object> getGeuntaeDetail(Map<String, Integer> param) {
		return geuntaeDao.selectGeuntaeDetail(param);
	}

	public String getCuttentTime10() {
		return geuntaeDao.selectCuttentTime10();
	}

	public void modifyGeuntae(Map<String, String> param) {
		int r = geuntaeDao.updateGeuntae(param);
		if(r != 1) new InvalidUser(ExceptionCode.INVALID_MODIFY_USER.getMsg());
		
	}

	public List<Team> getTeamList(String sawonDepartment) {
		return geuntaeDao.selectTeamList(sawonDepartment);
	}

	public boolean changeOutwork(Map<String, String> param) {
		int r = geuntaeDao.updateGeuntaeOutworkToIn(param);
		return r == 1;
	}

	public boolean changeInwork(Map<String, String> param) {
		int r = geuntaeDao.updateGeuntaeInworkToOut(param);
		return r == 1;
	}

	public void autoOffwork() {
		geuntaeDao.updateAutoOffwork();
	}
	

}
