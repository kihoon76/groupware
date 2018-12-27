package kr.co.drpnd.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.Geuntae;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.exception.AlreadyGotowork;
import kr.co.drpnd.exception.AlreadyOffwork;
import kr.co.drpnd.exception.InvalidGotoworkTime;
import kr.co.drpnd.exception.InvalidReservationTime;
import kr.co.drpnd.exception.NotExistGotowork;
import kr.co.drpnd.service.GeuntaeService;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.util.SessionUtil;

@RequestMapping("/geuntae")
@Controller
public class GeuntaeController {

	@Resource(name="geuntaeService")
	GeuntaeService geuntaeService;
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@GetMapping("gotowork")
	@ResponseBody
	public AjaxVO<String> checkGotowork() {
		
		AjaxVO<String> vo = new AjaxVO<>();
		Sawon sawon = SessionUtil.getSessionSawon(); 
		
		try {
			String gotoworkTime = geuntaeService.checkGotowork(sawon.getSawonCode());
			vo.setSuccess(true);
			vo.addObject(gotoworkTime);
			
			this.template.convertAndSend("/message/geuntae/gotowork", sawon.getSeatNum());
		}
		catch(InvalidGotoworkTime e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.INVALID_GOTOWORK_TIME.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(AlreadyGotowork e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.ALREADY_GOTOWORK.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@PostMapping("offwork")
	@ResponseBody
	public AjaxVO<String> checkOffwork(@RequestBody Map<String, String> param) {
		
		AjaxVO<String> vo = new AjaxVO<>();
		Sawon sawon = SessionUtil.getSessionSawon(); 
		
		try {
			param.put("sawonCode", sawon.getSawonCode());
			Geuntae geuntae = geuntaeService.checkOffwork(param);
			vo.setSuccess(true);
			vo.addObject(geuntae.getGotoworkTime());
			vo.addObject(geuntae.getOffworkTime());
			
			this.template.convertAndSend("/message/geuntae/offwork", sawon.getSeatNum());
		}
		catch(AlreadyOffwork e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.ALREADY_OFFWORK.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(NotExistGotowork e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.NOT_EXIST_GOTOWORK.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("detail/{geuntaeCode}")
	@ResponseBody
	public AjaxVO<Map<String, Object>> getGeuntaeDetail(@PathVariable("geuntaeCode") String geuntaeCode) {
		AjaxVO<Map<String, Object>> vo = new AjaxVO<>();
		Sawon sawon = SessionUtil.getSessionSawon();
		Map<String, Integer> param = new HashMap<String, Integer>();
		param.put("sawonCode", Integer.parseInt(sawon.getSawonCode()));
		param.put("geuntaeCode", Integer.parseInt(geuntaeCode));
		Map<String, Object> detail = geuntaeService.getGeuntaeDetail(param);
		
		return vo;
	}
	
}
