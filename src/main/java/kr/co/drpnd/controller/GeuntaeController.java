package kr.co.drpnd.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
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
import kr.co.drpnd.exception.InvalidUser;
import kr.co.drpnd.exception.NotExistGotowork;
import kr.co.drpnd.exception.NotFoundRfid;
import kr.co.drpnd.service.GeuntaeService;
import kr.co.drpnd.service.SawonService;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.type.TokenKey;
import kr.co.drpnd.type.WorkMethod;
import kr.co.drpnd.util.RequestUtil;
import kr.co.drpnd.util.SessionUtil;

@RequestMapping("/geuntae")
@Controller
public class GeuntaeController {

	@Resource(name="geuntaeService")
	GeuntaeService geuntaeService;
	
	@Resource(name="sawonService")
	SawonService sawonService;
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@PostMapping("rfid/gotowork")
	@ResponseBody
	public Map<String, String> gotoworkByRfid(
			@RequestParam("sawonCode") String sawonCode,
			@RequestParam("token") String token,
			HttpServletRequest request) {
		
		//아두이노를 통해서  왔는지 검사
		String userAgent = request.getHeader("User-Agent");
		Map<String, String> resultMap = new HashMap<>();
		resultMap.put("success", "F");
		resultMap.put("msg", "err");
		resultMap.put("code", "-1");
		
		if(userAgent != null) {
			userAgent = userAgent.trim().toLowerCase();
			if("arduino".equals(userAgent) && "db0f65c9005e".equals(token)) {
				try {
										
					sawonCode = sawonService.getSawonCodeByRfid(sawonCode.toUpperCase());
					if(sawonCode == null || "".equals(sawonCode)) {
						throw new NotFoundRfid(null);
					}
					Geuntae geuntae = new Geuntae();
					geuntae.setSawonCode(sawonCode);
					geuntae.setOutworkYN("N");
					geuntae.setGotoworkMethod(WorkMethod.RFID.toString());
					geuntae.setLat(0.0f);
					geuntae.setLng(0.0f);
					
					String gotoworkTime = geuntaeService.checkGotowork(geuntae);
					String sawonSeatNum = sawonService.getSawonSeatNum(sawonCode);
					
					resultMap.put("success", "T");
					resultMap.put("code", "000");
					resultMap.put("msg", gotoworkTime);
					
					if(!"-1".equals(sawonSeatNum)) {
						Map<String, Object> param = new HashMap<>();
						param.put("seatNum", sawonSeatNum);
						param.put("isOutwork", "N");
						param.put("geuntaeCode", geuntae.getGeuntaeCode());
						this.template.convertAndSend("/message/geuntae/gotowork", param);
					}
				}
				catch(InvalidGotoworkTime e) {
					e.printStackTrace();
					resultMap.put("code", ExceptionCode.INVALID_GOTOWORK_TIME.getCode());
				}
				catch(AlreadyGotowork e) {
					e.printStackTrace();
					resultMap.put("code", ExceptionCode.ALREADY_GOTOWORK.getCode());
				}
				catch(NotFoundRfid e) {
					e.printStackTrace();
					resultMap.put("code", ExceptionCode.NOT_FOUND_RFID.getCode());
				}
				catch(Exception e) {
					e.printStackTrace();
				}
			}
		}
		
		//System.err.println("sawonCode===" + sawonCode);
		//System.err.println("token===="+token);
		return resultMap;
	}
	
	@PostMapping("fingerprint/gotowork")
	@ResponseBody
	public Map<String, String> gotoworkByFingerprint(
			@RequestParam("sawonCode") String sawonCode,
			@RequestParam("token") String token,
			HttpServletRequest request) {
		
		//아두이노 지문인식으로 왔는지 검사
		String userAgent = request.getHeader("User-Agent");
		Map<String, String> resultMap = new HashMap<>();
		resultMap.put("success", "F");
		resultMap.put("msg", "err");
		resultMap.put("code", "-1");
		
		if(userAgent != null) {
			userAgent = userAgent.trim().toLowerCase();
			if("arduino".equals(userAgent) && "db0f65c9005e".equals(token)) {
				try {
					Geuntae geuntae = new Geuntae();
					geuntae.setSawonCode(sawonCode);
					geuntae.setOutworkYN("N");
					geuntae.setGotoworkMethod(WorkMethod.FINGER_PRINT.toString());
					geuntae.setLat(0.0f);
					geuntae.setLng(0.0f);
					
					String gotoworkTime = geuntaeService.checkGotowork(geuntae);
					String sawonSeatNum = sawonService.getSawonSeatNum(sawonCode);
					
					resultMap.put("success", "T");
					resultMap.put("code", "000");
					resultMap.put("msg", gotoworkTime);
					
					if(!"-1".equals(sawonSeatNum)) {
						Map<String, Object> param = new HashMap<>();
						param.put("seatNum", sawonSeatNum);
						param.put("isOutwork", "N");
						param.put("geuntaeCode", geuntae.getGeuntaeCode());
						this.template.convertAndSend("/message/geuntae/gotowork", param);
					}
				}
				catch(InvalidGotoworkTime e) {
					e.printStackTrace();
					resultMap.put("code", ExceptionCode.INVALID_GOTOWORK_TIME.getCode());
				}
				catch(AlreadyGotowork e) {
					e.printStackTrace();
					resultMap.put("code", ExceptionCode.ALREADY_GOTOWORK.getCode());
				}
				catch(Exception e) {
					e.printStackTrace();
				}
			}
		}
		
		//System.err.println("sawonCode===" + sawonCode);
		//System.err.println("token===="+token);
		return resultMap;
	}
	
	@GetMapping(value={"gotowork", "m/gotowork"})
	@ResponseBody
	public AjaxVO<String> checkGotowork(
			HttpServletRequest request, 
			@RequestParam(name="lat", required=true) float lat,
			@RequestParam(name="lng", required=true) float lng) {
		
		AjaxVO<String> vo = new AjaxVO<>();
		Sawon sawon = SessionUtil.getSessionSawon(); 
		
		try {
			boolean isMobile = RequestUtil.isMobile(request);
			
			Geuntae geuntae = new Geuntae();
			geuntae.setSawonCode(sawon.getSawonCode());
			geuntae.setOutworkYN(isMobile ? "Y" : "N");
			geuntae.setGotoworkMethod(isMobile ? WorkMethod.MOBILE.toString() : WorkMethod.PC.toString());
			geuntae.setLat(lat);
			geuntae.setLng(lng);
			
			String gotoworkTime = geuntaeService.checkGotowork(geuntae);
			vo.setSuccess(true);
			vo.addObject(gotoworkTime);
			
			Map<String, Object> param = new HashMap<>();
			param.put("seatNum", sawon.getSeatNum());
			param.put("isOutwork", isMobile ? "Y" : "N");
			param.put("geuntaeCode", geuntae.getGeuntaeCode());
			this.template.convertAndSend("/message/geuntae/gotowork", param);
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
	
	@GetMapping(value={"change/outwork/{geuntaeCode}", "m/change/outwork/{geuntaeCode}"})
	@ResponseBody
	public AjaxVO changeOutwork(
			@PathVariable("geuntaeCode") String geuntaeCode,
			@RequestParam("seatNum") String seatNum) {
		AjaxVO vo = new AjaxVO();
		Sawon sawon = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", sawon.getSawonCode());
		param.put("geuntaeCode", geuntaeCode);
		
		try {
			boolean b = geuntaeService.changeOutwork(param);
			
			if(b) {
				vo.setSuccess(true);
				Map<String, Integer> m = new HashMap<>();
				m.put("seatNum", Integer.parseInt(seatNum));
				this.template.convertAndSend("/message/geuntae/change/outwork", m);
			}
			else {
				vo.setSuccess(false);
				vo.setErrMsg("내근으로 전환할수 없습니다.");
			}
			
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping(value={"change/inwork/{geuntaeCode}", "m/change/inwork/{geuntaeCode}"})
	@ResponseBody
	public AjaxVO changeInwork(
			@PathVariable("geuntaeCode") String geuntaeCode,
			@RequestParam("seatNum") String seatNum) {
		AjaxVO vo = new AjaxVO();
		Sawon sawon = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", sawon.getSawonCode());
		param.put("geuntaeCode", geuntaeCode);
		
		try {
			boolean b = geuntaeService.changeInwork(param);
			
			if(b) {
				vo.setSuccess(true);
				Map<String, Integer> m = new HashMap<>();
				m.put("seatNum", Integer.parseInt(seatNum));
				this.template.convertAndSend("/message/geuntae/change/inwork", m);
			}
			else {
				vo.setSuccess(false);
				vo.setErrMsg("외근으로 전환할수 없습니다.");
			}
			
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@PostMapping(value={"offwork", "m/offwork"})
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
		
		try{
			Map<String, Object> detail = geuntaeService.getGeuntaeDetail(param);
			
			if(detail == null) {
				vo.setSuccess(false);
			}
			else {
				vo.setSuccess(true);
				vo.addObject(detail);
			}
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		
		return vo;
	}
	
	@PostMapping("modify")
	@ResponseBody
	public AjaxVO modifyGeuntae(@RequestBody Map<String, String> param) {
		
		AjaxVO vo = new AjaxVO();
		Sawon sawon = SessionUtil.getSessionSawon();
		param.put("sawonCode", sawon.getSawonCode());
		
		try {
			geuntaeService.modifyGeuntae(param);
			vo.setSuccess(true);
			
			param.put("sawonCode", "");
			param.put("token", sawon.getToken(TokenKey.CALENDAR));
			param.put("startDate", param.get("startDate").replaceAll("-", ""));
			this.template.convertAndSend("/message/geuntae/modify", param);
		}
		catch(InvalidUser e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.INVALID_MODIFY_USER.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	//퇴근처리 안했을 경우 
	//@Scheduled(cron="* 0/1 * * * *")
	@Scheduled(cron="0 10 8 * * *")
	public void autoOffwork() {
		geuntaeService.autoOffwork();
	}
	
}
