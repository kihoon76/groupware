package kr.co.drpnd.util;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;

import kr.co.drpnd.service.GyeoljaeService;

@Component("commonUtil")
public class CommonUtil {

	@Resource(name="gyeoljaeService")
	GyeoljaeService gyeoljaeService;
	
	public void getMyGyeoljaeTotalCount(ModelMap map, String sawonCode) {
		String mygyeoljaeCount = "0";
		
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("searchStatus", "A");
			param.put("searchTextType", "A");
			param.put("searchGyeoljaeType", "A");
			param.put("limitDate", "Y");
			param.put("sawonCode", sawonCode);
			param.put("size", 1);
			
			Map<String, Object> r = gyeoljaeService.getMyGyeoljaeTotalCount(param);
			mygyeoljaeCount = String.valueOf(r.get("total"));
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		
		if(map != null) {
			map.addAttribute("mygyeoljaeCount", mygyeoljaeCount);
		}
	}
	
	
}
