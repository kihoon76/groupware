package kr.co.drpnd.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.service.SawonService;
import kr.co.drpnd.util.MsSqlException;
import kr.co.drpnd.util.SessionUtil;

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
	
	@GetMapping("myinfo")
	@ResponseBody
	public AjaxVO<Map<String, String>> getMyInfo() {
		Sawon sawon = SessionUtil.getSessionSawon();
		Map<String, String> info = new HashMap<String, String>();
		info.put("sawonName", sawon.getSawonName());
		info.put("department", sawon.getSawonDepartment());
		info.put("position", sawon.getSawonPosition());
		info.put("team", sawon.getSawonTeam());
		info.put("sawonId", sawon.getSawonId());
		info.put("phone", sawon.getSawonPhone());
		info.put("innerPhone", sawon.getSawonInnerPhone());
		info.put("birthday", sawon.getSawonBirthday());
		info.put("email", sawon.getSawonEmail());
		info.put("leader", sawon.getSawonTeamLeader() == null ? "N" : sawon.getSawonTeamLeader());
		info.put("positionGubun", sawon.getPositionGubun());
		info.put("positionName", sawon.getSawonPositionName());
		
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		vo.setSuccess(true);
		vo.addObject(info);
		
		return vo;
	}
	
	@PostMapping("mod/myinfo")
	@ResponseBody
	public AjaxVO modifyMyInfo(@RequestBody Sawon sawon) {
		
		AjaxVO vo = new AjaxVO<>();
		
		try {
			Sawon mine = SessionUtil.getSessionSawon();
			sawon.setSawonCode(mine.getSawonCode());
			
			sawonService.modifySawon(sawon);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			System.err.println(e.getMessage());
			vo.setSuccess(false);
			Map<String, Object> result = MsSqlException.getErrorCode(e);
			vo.setErrCode(result.get("code").toString());
		}
		
		return vo;
	}
}
