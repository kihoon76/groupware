package co.kr.drpnd;

import java.util.List;

import javax.annotation.Resource;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.junit.FixMethodOrder;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.google.gson.Gson;

import kr.co.drpnd.push.FCMLog;
import kr.co.drpnd.push.FCMManager;
import kr.co.drpnd.service.SawonService;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations={
	"file:src/main/webapp/WEB-INF/spring/ds-context.xml",
	"file:src/test/resources/root-context.xml",
	//"file:src/test/resources/servletTest-context.xml"
})
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class PushTest {

	@Resource(name="sawonService")
	SawonService sawonService;
	
	@Resource(name="fcmManager")
	FCMManager fcmManager;
	
	@Resource(name="fcmLog")
	FCMLog fcmLog;
	
//	@Ignore @Test
//	public void getToken() {
//		
//		List<String> devices = sawonService.getSawonDevices("1");
//		
//		int size = devices.size();
//
//		JSONObject json = new JSONObject();
////		JSONArray rid = new JSONArray();
////		
////		for(String data : devices){
////			rid.add(data);
////		}
////			
////		postJson.put("registration_ids", rid);
////		System.err.println(postJson.toJSONString());
//		
//		FCMManager3 manager = FCMManager3.getInstance();
//		
//		try {
//			FCMVo vo = manager.postFCM(devices, "test", "test", null);
//			Gson g = new Gson();
//			System.err.println(g.toJson(vo));
//		} 
//		catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
	
	@Test
	public void asyncTest() throws InterruptedException {
		List<String> devices = sawonService.getSawonDevices("1");
		
		try {
			fcmManager.postFCM(devices, "test", "테스트", fcmLog);
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		
		Thread.sleep(6000);
	}
}
