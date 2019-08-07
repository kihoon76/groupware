package kr.co.drpnd.service;

import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

import kr.co.drpnd.dao.SawonDao;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.exception.AppTokenError;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.util.DataUtil;

@Service("sawonService")
public class SawonService {

	@Resource(name="sawonDao")
	SawonDao sawonDao;
	
	public Sawon getSawonInfo(String username) {
		Sawon info = sawonDao.selectSawonInfo(username);
		
		if(info.getSignature() != null) {
			byte[] signByte = DataUtil.hexStringToByteArray(info.getSignature()); 
			//String sign64 = Base64Utils.encodeToString(signByte).replace("dataimage/pngbase64", "");
			
			System.err.println(new String(signByte, Charset.forName("UTF-8")));
			info.setSignature(new String(signByte, Charset.forName("UTF-8")));
		}
		else {
			info.setSignature("NOSIGN");
		}
		
		return info;
	}
	
	public String getSawonCodeByRfid(String rfid) {
		return sawonDao.selectSawonCodeByRfid(rfid);
	}

	@Transactional(isolation=Isolation.DEFAULT, 
			   propagation=Propagation.REQUIRED, 
			   rollbackFor=Exception.class,
			   timeout=10)//timeout 초단위
	public void regist(Sawon sawon) throws Exception {
		 sawonDao.insertSawon(sawon);
		 
		 if(sawon.getSawonCode() == null) throw new Exception("사원키가 생성되지 않았습니다.");
		 
		 int r = sawonDao.insertAuthority(sawon.getSawonCode());
		 
		 if(r != 1) throw new Exception("권한이 설정되지 않았습니다.");
	}

	public List<Sawon> getMyDepartmentAllSawon(String sawonDepartment) {
		return sawonDao.selectMyDepartmentSawonList(sawonDepartment);
	}

	public void modifySawon(Sawon sawon) {
		sawonDao.updateSawon(sawon);
	}

	public List<Map<String, Object>> getTodayVacationAllSawon(String sawonDepartment) {
		Map<String, Integer> param = new HashMap<>();
		param.put("department", Integer.parseInt(sawonDepartment));
		return sawonDao.selectTodayVacationAllSawon(param);
	}

	public List<Map<String, Object>> getTodayPlanAllSawon(String sawonDepartment) {
		Map<String, Integer> param = new HashMap<>();
		param.put("department", Integer.parseInt(sawonDepartment));
		return sawonDao.selectTodayPlanAllSawon(param);
	}

	public void regSignature(Map<String, String> m) {
		try{
			//byte[] signByte = Base64.decodeBase64(m.get("sign"));
			byte[] signByte = m.get("sign").getBytes(Charset.forName("UTF-8"));
			Map<String, Object> param = new HashMap<>();
			param.put("sawonCode", m.get("sawonCode"));
			param.put("sign", signByte);
			
			sawonDao.updateSawonSign(param);
		}
		catch(Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		}
	}

	public void regDevice(Map<String, String> app) {
		try {
			sawonDao.insertDevice(app);
			if("X".equals(app.get("result"))) throw new AppTokenError(ExceptionCode.HAS_APPTOKEN.getMsg());
		}
		catch(AppTokenError e) {
			throw e;
		}
		catch(Exception e) {
			throw e;
		}
	}

	public List<String> getSawonDevices(String sawonCode) {
		return sawonDao.selectSawonDeviceList(sawonCode);
	}
	
	public List<String> getSawonAllDevices() {
		return sawonDao.selectSawonAllDevices();
	}

	public Sawon getTodayMyGeuntaeByMobile(Map<String, Integer> me) {
		return sawonDao.selectTodayMyGeuntaeByMobile(me);
	}

	public List<Map<String, String>> getSawonInfoForVacation(Map<String, String> param) {
		return sawonDao.selectSawonInfoForVacation(param);
	}

	public List<Map<String, String>> getSawonVacationHistory(Map<String, String> m) {
		return sawonDao.selectSawonVacationHistory(m);
	}

	public List<Map<String, String>> getSawonOverworkHistory(Map<String, Object> m) {
		return sawonDao.selectSawonOverworkHistory(m);
	}

	public String getSawonSeatNum(String sawonCode) {
		return sawonDao.selectSawonSeatNum(sawonCode);
	}

}
