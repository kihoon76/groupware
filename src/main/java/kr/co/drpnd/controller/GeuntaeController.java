package kr.co.drpnd.controller;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.exception.AlreadyGotowork;
import kr.co.drpnd.exception.InvalidReservationTime;
import kr.co.drpnd.service.GeuntaeService;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.util.SessionUtil;

@RequestMapping("/geuntae")
@Controller
public class GeuntaeController {

	@Resource(name="geuntaeService")
	GeuntaeService geuntaeService;
	
	@GetMapping("gotowork")
	@ResponseBody
	public AjaxVO checkGotowork() {
		
		AjaxVO vo = new AjaxVO();
		Sawon sawon = SessionUtil.getSessionSawon(); 
		
		try {
			geuntaeService.checkGotowork(sawon.getSawonCode());
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
	
}
