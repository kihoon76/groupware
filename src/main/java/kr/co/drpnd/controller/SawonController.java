package kr.co.drpnd.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
		info.put("sign", sawon.getSignature());
		
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
			vo.setSuccess(false);
			Map<String, Object> result = MsSqlException.getErrorCode(e);
			vo.setErrCode(result.get("code").toString());
		}
		
		return vo;
	}
	
	@PostMapping("/list/vacation")
	@ResponseBody
	public AjaxVO<Map<String, String>> getSawonListForVacation() {
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		String gubun = myInfo.getPositionGubun();
		
		Map<String, String> param = new HashMap<>();
		if("1".equals(gubun) || "2".equals(gubun)) {
			param.put("imwon", "Y");
		}
		else if("Y".equals(myInfo.getSawonTeamLeader())) {
			param.put("leader", "Y");
			param.put("teamCode", myInfo.getSawonTeam());
		}
		
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("department", myInfo.getSawonDepartment());
		
		try {
			List<Map<String, String>> list = sawonService.getSawonInfoForVacation(param);
			vo.setSuccess(true);
			vo.setDatas(list);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		
		return vo;
	}
	
	@PostMapping("vacation/history")
	@ResponseBody 
	public AjaxVO<Map<String, String>> getSawonVacationHistory(@RequestParam("sawonCode") String sawonCode) {
		
		System.err.println("======>" + sawonCode);
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		try {
			Map<String, String> m = new HashMap<>();
			String gubun = myInfo.getPositionGubun();
			
			if("1".equals(gubun) || "2".equals(gubun)) {
				m.put("sawonCode", sawonCode);
				m.put("imwon", "Y");
				m.put("department", myInfo.getSawonDepartment());
			}
			else if("Y".equals(myInfo.getSawonTeamLeader())) {
				m.put("sawonCode", sawonCode);
				m.put("leader", "Y");
				m.put("teamCode", myInfo.getSawonTeam());
				m.put("department", myInfo.getSawonDepartment());
			}
			else if(myInfo.getSawonCode().equals(sawonCode)) {
				m.put("sawonCode", myInfo.getSawonCode());
			}
			else {
				throw new Exception("조회할수 없습니다.");
			}
			
			List<Map<String, String>> history = sawonService.getSawonVacationHistory(m);
			vo.setSuccess(true);
			if(history != null)
				vo.setDatas(history);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		
		return vo;
	}
	
	@PostMapping("overwork/history")
	@ResponseBody
	public AjaxVO<Map<String, String>> getSawonOverworkHistory(
			@RequestParam("sawonCode") String sawonCode,
			@RequestParam("searchYear") String searchYear,
			@RequestParam("searchMonth") String searchMonth
		) {
		
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		try {
			Map<String, Object> m = new HashMap<>();
			m.put("searchYear", Integer.parseInt(searchYear));
			m.put("searchMonth", Integer.parseInt(searchMonth));
			
			String gubun = myInfo.getPositionGubun();
			
			if("1".equals(gubun) || "2".equals(gubun)) {
				m.put("sawonCode", Integer.parseInt(sawonCode));
			}
			/*else if("Y".equals(myInfo.getSawonTeamLeader())) {
				m.put("sawonCode", sawonCode);
				m.put("leader", "Y");
				m.put("teamCode", myInfo.getSawonTeam());
				m.put("department", myInfo.getSawonDepartment());
			}*/
			else if(myInfo.getSawonCode().equals(sawonCode)) {
				m.put("sawonCode", Integer.parseInt(sawonCode));
			}
			else {
				throw new Exception("조회할수 없습니다.");
			}
			
			List<Map<String, String>> history = sawonService.getSawonOverworkHistory(m);
			vo.setSuccess(true);
			if(history != null)
				vo.setDatas(history);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
}
