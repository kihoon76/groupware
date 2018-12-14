package kr.co.drpnd.controller;

import java.io.IOException;
import java.util.Map;

import javax.annotation.Resource;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.service.SawonService;
import kr.co.drpnd.util.MsSqlException;

@RequestMapping("/sawon")
@Controller
public class SawonController {

	@Resource(name="sawonService")
	SawonService sawonService;
	
	@PostMapping("reg")
	@ResponseBody
	public AjaxVO regist(@RequestBody Sawon sawon) {
		
		AjaxVO vo = new AjaxVO<>();
		
		try {
			sawonService.regist(sawon);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			Map<String, Object> result = MsSqlException.getErrorCode(e);
			vo.setErrCode(result.get("code").toString());
			
		}
		
		return vo;
	}
}
