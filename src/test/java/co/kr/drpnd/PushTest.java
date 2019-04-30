package co.kr.drpnd;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.junit.FixMethodOrder;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

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
	
	@Test
	public void asyncTest() throws InterruptedException {
		List<String> devices = sawonService.getSawonDevices("27");
		
		try {
			Map<String, String> m = new HashMap<>();
			m.put("title", "test");
			m.put("message", "테스트222223");
			fcmManager.postFCM(devices, "test", "테스트", m, fcmLog);
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		
		Thread.sleep(6000);
	}
	
	@Ignore @Test
	public void broadcastTest() throws InterruptedException {
		List<String> devices = sawonService.getSawonAllDevices();
		
		try {
			Map<String, String> m = new HashMap<>();
			m.put("title", "테스트");
			m.put("message", "알림테스트입니다");
			fcmManager.postFCM(devices, "테스트", "알림테스트입니다", m, fcmLog);
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		
		Thread.sleep(8000);
	}
	
	@Ignore @Test
	public void test() {
		String s = "04".substring(1);
		System.err.println(s);
	}
}
