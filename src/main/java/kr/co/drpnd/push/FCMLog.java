package kr.co.drpnd.push;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;

import kr.co.drpnd.dao.FcmDao;
import kr.co.drpnd.domain.FCMVo;

@Component("fcmLog")
public class FCMLog {

	@Resource(name="fcmDao")
	FcmDao fcmDao;
	
	public void writeLog(List<String> mDeviceTokenList, String title, String content, String sf, String msg) {
//		System.err.println(mDeviceTokenList.size());
//		System.err.println(msg);
		
		FCMVo vo = new FCMVo();
		vo.setTokens(mDeviceTokenList);
		vo.setTitle(title);
		vo.setSuccessFail(sf);
		vo.setContent(content);
		vo.setResult(msg);
		
		fcmDao.insertFcmLog(vo);
	}
}
