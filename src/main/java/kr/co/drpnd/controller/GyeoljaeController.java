package kr.co.drpnd.controller;

import java.io.PrintWriter;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.AttachFile;
import kr.co.drpnd.domain.Sangsin;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.exception.InvalidUser;
import kr.co.drpnd.exception.ModifySangsin;
import kr.co.drpnd.push.FCMLog;
import kr.co.drpnd.push.FCMManager;
import kr.co.drpnd.service.CodeService;
import kr.co.drpnd.service.GyeoljaeService;
import kr.co.drpnd.service.SawonService;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.type.VacationType;
import kr.co.drpnd.util.CommonUtil;
import kr.co.drpnd.util.SessionUtil;
import kr.co.drpnd.util.StringUtil;

@RequestMapping("/gyeoljae")
@Controller
public class GyeoljaeController {

	@Resource(name="gyeoljaeService")
	GyeoljaeService gyeoljaeService;
	
	@Resource(name="sawonService")
	SawonService sawonService;
	
	@Resource(name="codeService")
	CodeService codeService;
	
	@Resource(name="commonUtil")
	CommonUtil commonUtil;
	
	@Resource(name="fcmLog")
	FCMLog fcmLog;
	
	@Resource(name="fcmManager")
	FCMManager fcmManager;
	
	@Autowired
	private SimpMessagingTemplate template;
	
	@SuppressWarnings("unchecked")
	@GetMapping("view/new")
	public String viewNewGyeoljae(ModelMap m) {
		SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");//dd/MM/yyyy
		Date now = new Date();
		String strDate = sdfDate.format(now);
		List<Object> gyeoljaeType = codeService.getGyeoljae();
		
		if(gyeoljaeType != null) {
			int len = gyeoljaeType.size();
			List<Map<String, String>> listMap = new ArrayList<>();
			for(int i=0; i<len; i++) {
				listMap.add((Map<String, String>)gyeoljaeType.get(i));
			}
			
			m.addAttribute("gyeoljaeType", listMap);
		}
		m.addAttribute("time", strDate);
		
		return "gyeoljae/newgyeoljae";
	}
	
	@GetMapping("view/overview")
	public String overviewGyeoljae() {
		return "gyeoljae/overview";
	}
	
	@GetMapping("view/keepbox")
	public String viewKeepBox(ModelMap m) {
		Map<String, String> map = StringUtil.getMonthStartEnd();
		m.addAttribute("start", map.get("start"));
		m.addAttribute("end", map.get("end"));
		m.addAttribute("tab", "keepbox");
		return "gyeoljae/keepbox";
	}
	
	@GetMapping("view/sangsinbox")
	public String viewSangsinBox(ModelMap m) {
		Map<String, String> map = StringUtil.getMonthStartEnd();
		m.addAttribute("start", map.get("start"));
		m.addAttribute("end", map.get("end"));
		m.addAttribute("tab", "sangsinbox");
		return "gyeoljae/sangsinbox";
	}
	
	@GetMapping("view/receivedbox")
	public String viewReceivedBox(ModelMap m) {
		Map<String, String> map = StringUtil.getMonthStartEnd();
		m.addAttribute("start", map.get("start"));
		m.addAttribute("end", map.get("end"));
		m.addAttribute("tab", "receivedbox");
		return "gyeoljae/receivedbox";
	}
	
	@GetMapping("m/view/receivedbox")
	public String viewReceivedBoxMobile(ModelMap m) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
			param.put("summary", 10000);
			
			List<Map<String, String>> list = gyeoljaeService.getMyGyeoljae(param);
			if(list.size() > 0) {
				m.put("list", list);
			}
		}
		catch(Exception e) {
			m.put("err", e.getMessage());
		}
	
		commonUtil.getMyGyeoljaeTotalCount(m, myInfo.getSawonCode());
		m.put("sawonName", myInfo.getSawonName());
		return "mobile/gyeoljae/receivedbox";
	}
	
	@GetMapping("m/content/{sangsinNum}")
	public String getGyeoljaeContentByMobile(
			@PathVariable("sangsinNum") String sangsinNum,
			ModelMap m) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("sangsinNum", sangsinNum);
		
		Sangsin sangsin = gyeoljaeService.getMyGyeoljaeDetail(param);
		m.addAttribute("sangsin", sangsin);
		return "mobile/gyeoljae/content";
	}
	
	
	@GetMapping("view/mod/mysangsin/{sangsinNum}")
	public String viewModMySangsin(
			@PathVariable("sangsinNum") String sangsinNum,
			ModelMap m) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("sangsinNum", sangsinNum);
		
		try {
			Sangsin mySangsin = gyeoljaeService.getMyModifySangsin(param);
			
			if(mySangsin == null) {
				return "err/403";
			}
			
			m.addAttribute("sangsin", mySangsin);
			m.addAttribute("lines", new Gson().toJson(mySangsin.getGyeoljaeLines()));
			m.addAttribute("attachFile", new Gson().toJson(mySangsin.getAttachFiles()).replaceAll("'", "▦"));
		}
		catch(Exception e) {
			e.printStackTrace();
			return "err/403";
		}
		
		SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");//dd/MM/yyyy
		Date now = new Date();
		String strDate = sdfDate.format(now);
		List<Object> gyeoljaeType = codeService.getGyeoljae();
		
		if(gyeoljaeType != null) {
			int len = gyeoljaeType.size();
			List<Map<String, String>> listMap = new ArrayList<>();
			for(int i=0; i<len; i++) {
				listMap.add((Map<String, String>)gyeoljaeType.get(i));
			}
			
			m.addAttribute("gyeoljaeType", listMap);
		}
		
		m.addAttribute("time", strDate);
		m.addAttribute("sangsinNum", sangsinNum);
		
		return "gyeoljae/modmysangsin";
	}
	
	@PostMapping("search/sawon")
	@ResponseBody
	public AjaxVO<Map<String, String>> getSearchSawon(@RequestBody Map<String, Object> param) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		
		//Map<String, Object> param = new HashMap<>();
		param.put("department", myInfo.getSawonDepartment());
		String excludeSawonStr = String.valueOf(param.get("excludeSawon"));
		if(!StringUtils.isEmpty(excludeSawonStr)) {
			param.put("excludeSawonList", Arrays.asList(excludeSawonStr.split(",")));
		}
		
		try {
			List<Map<String, String>> list = gyeoljaeService.getGyeoljaeSawonList(param);
			vo.setDatas(list);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		
		return vo;
		
	}
	
	@GetMapping("myline")
	@ResponseBody
	public AjaxVO<Map<String, Object>> getMyLine() throws InterruptedException {
		
		AjaxVO<Map<String, Object>> vo = new AjaxVO<>();
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("department", myInfo.getSawonDepartment());
		param.put("teamCode", myInfo.getSawonTeam());
		param.put("position", myInfo.getSawonPosition());
		
		try{
			List<Map<String, Object>> list = gyeoljaeService.getMyDefaultGyeoljaeLine(param);
			vo.setDatas(list);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("vacationline")
	@ResponseBody
	public AjaxVO<Map<String, Object>> getVacationLine() throws InterruptedException {
		
		AjaxVO<Map<String, Object>> vo = new AjaxVO<>();
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("department", myInfo.getSawonDepartment());
		param.put("teamCode", myInfo.getSawonTeam());
		param.put("position", myInfo.getSawonPosition());
		//param.put("lastSawonCode", "34");
		
		try{
			List<Map<String, Object>> list = gyeoljaeService.getVacationGyeoljaeLine(param);
			vo.setDatas(list);
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		//Thread.sleep(5000);
		return vo;
	}
	
	@PostMapping("reg/newgyeoljae_nofile")
	@ResponseBody
	public AjaxVO regNewGyeoljaeNoFile(@RequestBody Sangsin sangsin) {
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		AjaxVO vo = new AjaxVO();
		vo.setSuccess(true);
		
		try {
			
			//결재타입이 2일 경우 서브타입 무결성 체크
			if("2".equals(sangsin.getGyeoljaeType())) {
				VacationType.getType(sangsin.getGyeoljaeSubType()); 
				
				int term = Integer.parseInt(sangsin.getTerm());
				if(term < 1) throw new Exception("휴가기간은 1일 이상입니다");
				
				//반차일 경우 -1로 처리
				if(VacationType.BANCHA == VacationType.getType(sangsin.getGyeoljaeSubType())) {
					sangsin.setTerm("-1");
				}
			}
			
			List<Map<String, Object>> lines = sangsin.getGyeoljaeLines();
			String firstGyeoljaejaCode = null;
			
			for(Map<String, Object> line: lines) {
				if("1".equals(line.get("order"))) {
					line.put("status", "D");
					firstGyeoljaejaCode = String.valueOf(line.get("sawonCode"));
				}
				else {
					line.put("status", "W");
				}
			}
			
			String pushMsg = myInfo.getSawonName() + "님이 올린 결재가 도착했습니다.";
			
			sangsin.setGianja(myInfo.getSawonCode());
			sangsin.setPushContent(pushMsg);
			gyeoljaeService.regNewGyeoljae(sangsin);
			
			try {
				Map<String, String> socketMap = new HashMap<>();
				socketMap.put("msg", myInfo.getSawonName());
				this.template.convertAndSend("/message/gyeoljae/received/" + firstGyeoljaejaCode + "/alarm", (new Gson()).toJson(socketMap));
				
				//push
				sendPush(firstGyeoljaejaCode, "결재알림", pushMsg);
			}
			catch(Exception e) {
				e.printStackTrace();
			}
		} 
		catch (Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@PostMapping("reg/newgyeoljaeWithfile")
	@ResponseBody
	public AjaxVO regNewGyeoljaeWithFile(
			@RequestParam("title") String title,
			@RequestParam("gyeoljaeLines") String gyeoljaeLines,
			@RequestParam("content") String content,
			@RequestParam("plainContent") String plainContent,
			@RequestParam("gyeoljaeType") String gyeoljaeType,
			@RequestParam("file") MultipartFile[] files,
			@RequestParam(name="gyeoljaeSubType", required=false) String gyeoljaeSubType,
			@RequestParam(name="term", required=false) String term,
			@RequestParam(name="startDate", required=false) String startDate,
			@RequestParam(name="endDate", required=false) String endDate,
			@RequestParam(name="docNum", required=false) String docNum) {
		AjaxVO vo = new AjaxVO();
		
		vo.setSuccess(true);
		
//		System.err.println("title ==>" + title);
//		System.err.println("gyeoljaeLines ==>" + gyeoljaeLines);
//		System.err.println("content ==>" + content);
		
		try {
			
			//결재타입이 2일 경우 서브타입 무결성 체크
			if("2".equals(gyeoljaeType)) {
				VacationType.getType(gyeoljaeSubType); 
				int termInt = Integer.parseInt(term);
				if(termInt < 1) throw new Exception("휴가기간은 1일 이상입니다");
				
				if(VacationType.BANCHA == VacationType.getType(gyeoljaeSubType)) {
					term = "-1";
				}
			}
			
			Sawon myInfo = SessionUtil.getSessionSawon();
			String firstGyeoljaejaCode = null;
			
			Gson gson = new Gson();
			List<Map<String, Object>> lines = gson.fromJson(gyeoljaeLines, new TypeToken<List<Map<String, Object>>>(){}.getType());
			
			for(Map<String, Object> line: lines) {
				if("1".equals(line.get("order"))) {
					line.put("status", "D");
					firstGyeoljaejaCode = String.valueOf(line.get("sawonCode"));
				}
				else {
					line.put("status", "W");
				}
			}
			
			Sangsin sangsin = new Sangsin();
			sangsin.setTitle(title);
			sangsin.setContent(content);
			sangsin.setPlainContent(plainContent);
			sangsin.setGyeoljaeLines(lines);
			sangsin.setGianja(myInfo.getSawonCode());
			sangsin.setGyeoljaeType(gyeoljaeType);
			sangsin.setGyeoljaeSubType(gyeoljaeSubType);
			sangsin.setTerm(term);
			sangsin.setStartDate(startDate);
			sangsin.setEndDate(endDate);
			sangsin.setDocNum(docNum);
			
			
			List<AttachFile> attachFiles = new ArrayList<>();
			String pushMsg = myInfo.getSawonName() + "님이 올린 결재가 도착했습니다.";
			
//			for(MultipartFile file: files) {
//				AttachFile attachFile = new AttachFile();
//				attachFile.setName(file.getOriginalFilename());
//				attachFile.setSize(file.getSize());
//				attachFile.setExt(FilenameUtils.getExtension(file.getOriginalFilename()));
//				attachFile.setFileByte(file.getBytes());
//				
//				attachFiles.add(attachFile);
//				
////				System.err.println("fileName ==>" + file.getOriginalFilename());
////				System.err.println("fileSize ==>" + file.getSize());
////				System.err.println("fileExt ==>" + FilenameUtils.getExtension(file.getOriginalFilename()));
//				//FileCopyUtils.copy(file.getBytes(), new File(UPLOAD_LOCATION + file.getOriginalFilename()));
//			}
			
			//파일 하나만 허용
			AttachFile attachFile = new AttachFile();
			attachFile.setName(files[0].getOriginalFilename());
			attachFile.setSize(files[0].getSize());
			attachFile.setExt(FilenameUtils.getExtension(files[0].getOriginalFilename()));
			attachFile.setFileByte(files[0].getBytes());
			
			attachFiles.add(attachFile);
				
			
			sangsin.setAttachFiles(attachFiles);
			sangsin.setPushContent(pushMsg);
			gyeoljaeService.regNewGyeoljae(sangsin);
			
			try {
				Map<String, String> socketMap = new HashMap<>();
				socketMap.put("msg", myInfo.getSawonName());
				this.template.convertAndSend("/message/gyeoljae/received/" + firstGyeoljaejaCode + "/alarm", gson.toJson(socketMap));
				
				//push
				sendPush(firstGyeoljaejaCode, "결재알림", pushMsg);
			}
			catch(Exception e) {
				e.printStackTrace();
			}
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@PostMapping("mod/mysangsinNoNewFile")
	@ResponseBody
	public AjaxVO modMysangsinNoNewFile(@RequestBody Sangsin sangsin) {
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		AjaxVO vo = new AjaxVO();
		vo.setSuccess(true);
		
		try {
			
			//결재타입이 2일 경우 서브타입 무결성 체크
			if("2".equals(sangsin.getGyeoljaeType())) {
				VacationType.getType(sangsin.getGyeoljaeSubType()); 
				
				int term = Integer.parseInt(sangsin.getTerm());
				if(term < 1) throw new Exception("휴가기간은 1일 이상입니다");
				
				//반차일 경우 -1로 처리
				if(VacationType.BANCHA == VacationType.getType(sangsin.getGyeoljaeSubType())) {
					sangsin.setTerm("-1");
				}
			}
			
			String sangsinNum = String.valueOf(sangsin.getSangsinNum());
			Map<String, String> param = new HashMap<>();
			param.put("sawonCode", myInfo.getSawonCode());
			param.put("sangsinNum", sangsinNum);
			boolean b = gyeoljaeService.confirmMySangsin(param);
			
			if(b) {
				//결재수정 가능한지 조사
				boolean result = gyeoljaeService.alarmModifySangsin(sangsinNum);
				if(result) {
					List<Map<String, Object>> lines = sangsin.getGyeoljaeLines();
					String firstGyeoljaejaCode = null;
					
					//알림이 전달된 첫번째 결재자에게  수정사실을 알린다.
					Map<String, String> sm = gyeoljaeService.getFirstGyeoljaeja(sangsinNum);
					
					for(Map<String, Object> line: lines) {
						if("1".equals(line.get("order"))) {
							line.put("status", "D");
							firstGyeoljaejaCode = String.valueOf(line.get("sawonCode"));
						}
						else {
							line.put("status", "W");
						}
					}
					
					String pushMsg = myInfo.getSawonName() + "님이 올린 결재가 도착했습니다.";
					
					sangsin.setGianja(myInfo.getSawonCode());
					sangsin.setPushContent(pushMsg);
					gyeoljaeService.modifyGyeoljae(sangsin);
					
					try {
						Map<String, String> socketMap = new HashMap<>();
						socketMap.put("msg", myInfo.getSawonName());
						
						String prevSawon = String.valueOf(sm.get("sawonCode"));
						
						//String.valueOf(sm.get("sawonCode")) : converter안하면 오류남
						if(firstGyeoljaejaCode.equals(prevSawon)) {
							//결재라인 첫번째 결재자가 동일
							this.template.convertAndSend("/message/gyeoljae/modified/" + firstGyeoljaejaCode + "/alarm", (new Gson()).toJson(socketMap));
							//push
							sendPush(firstGyeoljaejaCode, "결재수정알림", myInfo.getSawonName() + "님이 올린 결재내용이 수정되었습니다.");
						}
						else {
							//기존 결재자
							this.template.convertAndSend("/message/gyeoljae/delete/line/" + prevSawon + "/alarm", (new Gson()).toJson(socketMap));
							
							//새결재자
							this.template.convertAndSend("/message/gyeoljae/received/" + firstGyeoljaejaCode + "/alarm", (new Gson()).toJson(socketMap));
							
							sendPush(prevSawon, "결재수정알림", myInfo.getSawonName() + "님이 올린 결재의 결재라인이 변경되었습니다.");
							sendPush(firstGyeoljaejaCode, "결재알림", pushMsg);
						}
					}
					catch(Exception e) {
						e.printStackTrace();
					}
				}
				else {
					vo.setSuccess(false);
					vo.setErrMsg("결재진행중입니다. 수정하실수 없습니다.");
				}
			}
			else {
				vo.setSuccess(false);
				vo.setErrMsg("내 상신문서가 아닙니다.");
			}
		} 
		catch (Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@PostMapping("mod/mysangsinWithNewFile")
	@ResponseBody
	public AjaxVO modMysangsinWithNewFile(
			@RequestParam("title") String title,
			@RequestParam("gyeoljaeLines") String gyeoljaeLines,
			@RequestParam("content") String content,
			@RequestParam("plainContent") String plainContent,
			@RequestParam("gyeoljaeType") String gyeoljaeType,
			@RequestParam("sangsinNum") String sangsinNum,
			@RequestParam("file") MultipartFile[] files,
			@RequestParam(name="gyeoljaeSubType", required=false) String gyeoljaeSubType,
			@RequestParam(name="term", required=false) String term,
			@RequestParam(name="startDate", required=false) String startDate,
			@RequestParam(name="endDate", required=false) String endDate,
			@RequestParam(name="docNum", required=false) String docNum
			) {
		AjaxVO vo = new AjaxVO();
		
		vo.setSuccess(true);
		
		try {
			
			//결재타입이 2일 경우 서브타입 무결성 체크
			if("2".equals(gyeoljaeType)) {
				VacationType.getType(gyeoljaeSubType); 
				
				int termInt = Integer.parseInt(term);
				if(termInt < 1) throw new Exception("휴가기간은 1일 이상입니다");
				
				//반차일 경우 -1로 처리
				if(VacationType.BANCHA == VacationType.getType(gyeoljaeSubType)) {
					term = "-1";
				}
			}
			
			Sawon myInfo = SessionUtil.getSessionSawon();
			
			Map<String, String> param = new HashMap<>();
			param.put("sawonCode", myInfo.getSawonCode());
			param.put("sangsinNum", sangsinNum);
			boolean b = gyeoljaeService.confirmMySangsin(param);
			
			if(b) {
				//결재수정 가능한지 조사
				boolean result = gyeoljaeService.alarmModifySangsin(sangsinNum);
				
				if(result) {
					String firstGyeoljaejaCode = null;
					Gson gson = new Gson();
					
					//알림이 전달된 첫번째 결재자에게  수정사실을 알린다.
					Map<String, String> sm = gyeoljaeService.getFirstGyeoljaeja(sangsinNum);
					List<Map<String, Object>> lines = gson.fromJson(gyeoljaeLines, new TypeToken<List<Map<String, Object>>>(){}.getType());
					
					for(Map<String, Object> line: lines) {
						if("1".equals(line.get("order"))) {
							line.put("status", "D");
							firstGyeoljaejaCode = String.valueOf(line.get("sawonCode"));
						}
						else {
							line.put("status", "W");
						}
					}
					
					Sangsin sangsin = new Sangsin();
					sangsin.setTitle(title);
					sangsin.setContent(content);
					sangsin.setPlainContent(plainContent);
					sangsin.setGyeoljaeLines(lines);
					sangsin.setGianja(myInfo.getSawonCode());
					sangsin.setGyeoljaeType(gyeoljaeType);
					sangsin.setSangsinNum(Integer.parseInt(sangsinNum));
					sangsin.setDocNum(docNum);
					sangsin.setTerm(term);
					
					List<AttachFile> attachFiles = new ArrayList<>();
					String pushMsg = myInfo.getSawonName() + "님이 올린 결재가 도착했습니다.";
					
					//파일 하나만 허용
					AttachFile attachFile = new AttachFile();
					attachFile.setName(files[0].getOriginalFilename());
					attachFile.setSize(files[0].getSize());
					attachFile.setExt(FilenameUtils.getExtension(files[0].getOriginalFilename()));
					attachFile.setFileByte(files[0].getBytes());
					
					attachFiles.add(attachFile);
						
					
					sangsin.setAttachFiles(attachFiles);
					sangsin.setPushContent(pushMsg);
					gyeoljaeService.modifyGyeoljae(sangsin);
					
					try {
						Map<String, String> socketMap = new HashMap<>();
						socketMap.put("msg", myInfo.getSawonName());
						
						String prevSawon = String.valueOf(sm.get("sawonCode"));
						
						//String.valueOf(sm.get("sawonCode")) : converter안하면 오류남
						if(firstGyeoljaejaCode.equals(prevSawon)) {
							//결재라인 첫번째 결재자가 동일
							this.template.convertAndSend("/message/gyeoljae/modified/" + firstGyeoljaejaCode + "/alarm", (new Gson()).toJson(socketMap));
							//push
							sendPush(firstGyeoljaejaCode, "결재수정알림", myInfo.getSawonName() + "님이 올린 결재내용이 수정되었습니다.");
						}
						else {
							//기존 결재자
							this.template.convertAndSend("/message/gyeoljae/delete/line/" + prevSawon + "/alarm", (new Gson()).toJson(socketMap));
							
							//새결재자
							this.template.convertAndSend("/message/gyeoljae/received/" + firstGyeoljaejaCode + "/alarm", (new Gson()).toJson(socketMap));
							
							sendPush(prevSawon, "결재수정알림", myInfo.getSawonName() + "님이 올린 결재의 결재라인이 변경되었습니다.");
							sendPush(firstGyeoljaejaCode, "결재알림", pushMsg);
						}
					}
					catch(Exception e) {
						e.printStackTrace();
					}
				}
				else {
					vo.setSuccess(false);
					vo.setErrMsg("결재진행중입니다. 수정하실수 없습니다.");
				}
			}
			else {
				vo.setSuccess(false);
				vo.setErrMsg("내 상신문서가 아닙니다.");
			}
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("del/mysangsin/{sangsinNum}")
	@ResponseBody
	public AjaxVO deleteMySangsin(@PathVariable("sangsinNum") String sangsinNum) {
		
		AjaxVO vo = new AjaxVO();
		Sawon myInfo = SessionUtil.getSessionSawon();
		vo.setSuccess(true);
		try {
			Map<String, String> param = new HashMap<>();
			param.put("sawonCode", myInfo.getSawonCode());
			param.put("sangsinNum", sangsinNum);
			boolean b = gyeoljaeService.confirmMySangsin(param);
			
			if(b) {
				//결재삭제 가능한지 조사
				boolean result = gyeoljaeService.alarmModifySangsin(sangsinNum);
				
				if(result) {
					Map<String, String> sm = gyeoljaeService.getFirstGyeoljaeja(sangsinNum);
					Map<String, String> socketMap = new HashMap<>();
					socketMap.put("msg", myInfo.getSawonName());
					
					String firstGyeoljaejaCode = String.valueOf(sm.get("sawonCode"));
					
					Map<String, Integer> rltMap = new HashMap<>();
					rltMap.put("sangsinNum", Integer.parseInt(sangsinNum));
					rltMap.put("result", -1);
					gyeoljaeService.deleteMySangsin(rltMap);
					
					int r = rltMap.get("result");
					if(r == -1) {
						vo.setSuccess(false);
						vo.setErrMsg("상신삭제중 오류가 발생했습니다.");
					}
					else {
						//결재라인 첫번째 결재자가 동일
						this.template.convertAndSend("/message/gyeoljae/delete/" + firstGyeoljaejaCode + "/alarm", (new Gson()).toJson(socketMap));
						//push
						sendPush(firstGyeoljaejaCode, "결재삭제알림", myInfo.getSawonName() + "님이 올린 결재를 삭제하셨습니다.");
					}
				}
				else {
					vo.setSuccess(false);
					vo.setErrMsg("결재진행중입니다. 삭제하실수 없습니다.");
				}
			}
			else {
				vo.setSuccess(false);
				vo.setErrMsg("내 상신문서가 아닙니다.");
			}
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
	
		return vo;
	}
	
	@GetMapping("mysangsin")
	@ResponseBody
	public AjaxVO<Map<String, String>> getMySangsin(
			@RequestParam(name="summary", required=false) String summary,
			@RequestParam(name="page", required=false) Integer page,
			@RequestParam(name="size", required=false) Integer size,
			@RequestParam(name="searchStatus", required=false) String searchStatus,
			@RequestParam(name="searchTextType", required=false) String searchTextType,
			@RequestParam(name="searchGyeoljaeType", required=false) String searchGyeoljaeType, 
			@RequestParam(name="searchText", required=false) String searchText,
			@RequestParam(name="searchStartDate", required=false) String searchStartDate,
			@RequestParam(name="searchEndDate", required=false) String searchEndDate) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("gianja", myInfo.getSawonCode());
			int totalPage = 0;
			int totalRow = 0;
			
			if(summary == null) {
				int start = ((page-1)*size) + 1;
				param.put("summary", -1);
				param.put("start", start);
				param.put("end", start + size);
				param.put("size", size);
				param.put("searchStatus", searchStatus);
				param.put("searchTextType", searchTextType);
				param.put("searchGyeoljaeType", searchGyeoljaeType);
				param.put("searchText", StringUtil.escapeMsSql(searchText));
				param.put("searchStartDate", searchStartDate);
				param.put("searchEndDate", searchEndDate + " 23:59:59");
				Map<String, Object> r = gyeoljaeService.getMySangsinTotalCount(param);
				totalPage = Integer.parseInt(String.valueOf(r.get("page")));
				totalRow = Integer.parseInt(String.valueOf(r.get("total")));
			}
			else {
				param.put("summary", Integer.parseInt(summary));
			}
			
			List<Map<String, String>> list = gyeoljaeService.getMySangsin(param);
			vo.setSuccess(true);
			vo.setDatas(list);
			vo.setTotalPage(totalPage);
			vo.setTotalRow(totalRow);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
	
		return vo;
	}
	
	@GetMapping("mysangsin/{sangsinNum}")
	@ResponseBody
	public AjaxVO<Sangsin> getMySangsinDetail(@PathVariable("sangsinNum") String sangsinNum) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("sangsinNum", sangsinNum);
		
		AjaxVO<Sangsin> vo = new AjaxVO<>();
		
		try {
			Sangsin gyeoljaeDetail = gyeoljaeService.getMySangsinDetail(param);
			if(gyeoljaeDetail != null) gyeoljaeDetail.setGianja(myInfo.getSawonName());
			vo.setSuccess(true);
			vo.addObject(gyeoljaeDetail);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("committedsangsin/{sangsinNum}")
	@ResponseBody
	public AjaxVO<Sangsin> getCommitedSangsinDetail(@PathVariable("sangsinNum") String sangsinNum) {
		Map<String, String> param = new HashMap<>();
		param.put("sangsinNum", sangsinNum);
		
		AjaxVO<Sangsin> vo = new AjaxVO<>();
		
		try {
			Sangsin gyeoljaeDetail = gyeoljaeService.getCommittedSangsinDetail(param);
			vo.setSuccess(true);
			vo.addObject(gyeoljaeDetail);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("mygyeoljae")
	@ResponseBody
	public AjaxVO<Map<String, String>> getMyGyeoljae(
			@RequestParam(name="summary", required=false) String summary,
			@RequestParam(name="page", required=false) Integer page,
			@RequestParam(name="size", required=false) Integer size,
			@RequestParam(name="searchStatus", required=false) String searchStatus,
			@RequestParam(name="searchTextType", required=false) String searchTextType,
			@RequestParam(name="searchGyeoljaeType", required=false) String searchGyeoljaeType,
			@RequestParam(name="searchText", required=false) String searchText,
			@RequestParam(name="searchStartDate", required=false) String searchStartDate,
			@RequestParam(name="searchEndDate", required=false) String searchEndDate) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
			
			int totalPage = 0;
			int totalRow = 0;
			
			if(summary == null) {
				int start = ((page-1)*size) + 1;
				param.put("summary", -1);
				param.put("start", start);
				param.put("end", start + size);
				param.put("size", size);
				param.put("searchStatus", searchStatus);
				param.put("searchTextType", searchTextType);
				param.put("searchGyeoljaeType", searchGyeoljaeType);
				param.put("searchText", StringUtil.escapeMsSql(searchText));
				param.put("searchStartDate", searchStartDate);
				param.put("searchEndDate", searchEndDate + " 23:59:59");
				
				Map<String, Object> r = gyeoljaeService.getMyGyeoljaeTotalCount(param);
				totalPage = Integer.parseInt(String.valueOf(r.get("page")));
				totalRow = Integer.parseInt(String.valueOf(r.get("total")));
			}
			else {
				param.put("summary", Integer.parseInt(summary));
			}
			
			
			List<Map<String, String>> list = gyeoljaeService.getMyGyeoljae(param);
			vo.setSuccess(true);
			vo.setDatas(list);
			vo.setTotalPage(totalPage);
			vo.setTotalRow(totalRow);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
	
		return vo;
		
	}
	
	@GetMapping("mycommited")
	@ResponseBody
	public AjaxVO<Map<String, String>> getMyCommitedGyeoljae(
			@RequestParam(name="summary", required=false) String summary,
			@RequestParam(name="page", required=false) Integer page,
			@RequestParam(name="size", required=false) Integer size,
			@RequestParam(name="searchStatus", required=false) String searchStatus,
			@RequestParam(name="searchTextType", required=false) String searchTextType,
			@RequestParam(name="searchGyeoljaeType", required=false) String searchGyeoljaeType,
			@RequestParam(name="searchText", required=false) String searchText,
			@RequestParam(name="searchStartDate", required=false) String searchStartDate,
			@RequestParam(name="searchEndDate", required=false) String searchEndDate
		) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		try {
			Map<String, Object> param = new HashMap<>();
			param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
			
			int totalPage = 0;
			int totalRow = 0;
			
			if(summary == null) {
				int start = ((page-1)*size) + 1;
				param.put("summary", -1);
				param.put("start", start);
				param.put("end", start + size);
				param.put("size", size);
				param.put("searchStatus", searchStatus);
				param.put("searchTextType", searchTextType);
				param.put("searchGyeoljaeType", searchGyeoljaeType);
				param.put("searchText", StringUtil.escapeMsSql(searchText));
				param.put("searchStartDate", searchStartDate);
				param.put("searchEndDate", searchEndDate + " 23:59:59");
				
				Map<String, Object> r = gyeoljaeService.getMyCommitedGyeoljaeTotalCount(param);
				totalPage = Integer.parseInt(String.valueOf(r.get("page")));
				totalRow = Integer.parseInt(String.valueOf(r.get("total")));
			}
			else {
				param.put("summary", Integer.parseInt(summary));
			}
			
			List<Map<String, String>> list = gyeoljaeService.getMyCommitedGyeoljae(param);
			vo.setSuccess(true);
			vo.setDatas(list);
			vo.setTotalPage(totalPage);
			vo.setTotalRow(totalRow);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("allcommited")
	@ResponseBody
	public AjaxVO<Map<String, String>> getAllCommitedGyeoljae(
			@RequestParam(name="summary", required=false) String summary,
			@RequestParam(name="page", required=false) Integer page,
			@RequestParam(name="size", required=false) Integer size,
			@RequestParam(name="searchStatus", required=false) String searchStatus,
			@RequestParam(name="searchTextType", required=false) String searchTextType,
			@RequestParam(name="searchGyeoljaeType", required=false) String searchGyeoljaeType,
			@RequestParam(name="searchText", required=false) String searchText,
			@RequestParam(name="searchStartDate", required=false) String searchStartDate,
			@RequestParam(name="searchEndDate", required=false) String searchEndDate
		) {
		//Sawon myInfo = SessionUtil.getSessionSawon();
		
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		try {
			Map<String, Object> param = new HashMap<>();
			//param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
			
			int totalPage = 0;
			int totalRow = 0;
			
			if(summary == null) {
				int start = ((page-1)*size) + 1;
				param.put("summary", -1);
				param.put("start", start);
				param.put("end", start + size);
				param.put("size", size);
				param.put("searchStatus", searchStatus);
				param.put("searchTextType", searchTextType);
				param.put("searchGyeoljaeType", searchGyeoljaeType);
				param.put("searchText", StringUtil.escapeMsSql(searchText));
				param.put("searchStartDate", searchStartDate);
				param.put("searchEndDate", searchEndDate + " 23:59:59");
				
				Map<String, Object> r = gyeoljaeService.getAllCommitedGyeoljaeTotalCount(param);
				totalPage = Integer.parseInt(String.valueOf(r.get("page")));
				totalRow = Integer.parseInt(String.valueOf(r.get("total")));
			}
			else {
				param.put("summary", Integer.parseInt(summary));
			}
			
			List<Map<String, String>> list = gyeoljaeService.getAllCommitedGyeoljae(param);
			vo.setSuccess(true);
			vo.setDatas(list);
			vo.setTotalPage(totalPage);
			vo.setTotalRow(totalRow);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("mygyeoljae/{sangsinNum}")
	@ResponseBody
	public AjaxVO<Sangsin> getMyGyeoljaeDetail(@PathVariable("sangsinNum") String sangsinNum) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("sangsinNum", sangsinNum);
		
		AjaxVO<Sangsin> vo = new AjaxVO<>();
		
		try {
			Sangsin gyeoljaeDetail = gyeoljaeService.getMyGyeoljaeDetail(param);
			vo.setSuccess(true);
			vo.addObject(gyeoljaeDetail);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	private void download(String code,  HttpServletRequest request, HttpServletResponse response, String ios) throws Exception {
		Sawon myInfo = SessionUtil.getSessionSawon();
		String positionGubun = myInfo.getPositionGubun();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("attachFileCode", code);
		param.put("positionGubun", positionGubun);
		
		AttachFile file = gyeoljaeService.getAttachFile(param);
		
		//한글파일명 라우저 별 처리
		if(file != null) {
			String fileName = file.getName().substring(0, file.getName().lastIndexOf("."));
			
			if(request.getHeader("User-Agent").contains("MSIE") || 
			   request.getHeader("User-Agent").contains("Trident") ||
			   "Y".equals(ios)) {
				fileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
			}
			else {
				fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
				//fileName = new String(fileName.getBytes("UTF-8"), "UTF-8");
				//System.err.println(fileName);
			}
			
			response.setHeader("Content-Transper-Encoding", "binary");
			response.setHeader("Content-Disposition", "inline; filename=" + fileName + "." + file.getExt());
			response.setHeader("Content-Length", file.getFileByte().length + "");
			response.setContentType("application/octet-stream");
			
			
			ServletOutputStream out = response.getOutputStream();
			out.write(file.getFileByte());
			out.flush();
			//System.err.println("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
		}
		else {
			response.setContentType("text/html;charset=utf-8");
			PrintWriter writer = response.getWriter();
			writer.println("<h3>첨부파일이 삭제되었거나 파일을 볼 권한이 없습니다.</h3><hr/>");
			writer.println("<h3>파일은 기안자나 결재라인에 있는 결재자들 또는 임원분들만 보실수 있습니다.</h3>");
			writer.close();
			
			
		}
	}
	
	@PostMapping(value={"/file/{code}"})
	public void downloadReport(@PathVariable("code") String code,
							   @RequestParam(name="ios", required=false) String ios,
							   HttpServletRequest request, HttpServletResponse response) throws Exception  {
		download(code, request, response, ios);
	}
	
	@GetMapping(value={"/m/file/{code}"})
	public void downloadMobile(@PathVariable("code") String code, 
							   @RequestParam(name="ios", required=false) String ios,
							   HttpServletRequest request, HttpServletResponse response) throws Exception  {
		//Thread.sleep(10000);
		System.err.println("---------------------------------");
		download(code, request, response, ios);
	}
	
	@PostMapping(value={"commit", "m/commit"})
	@ResponseBody
	public AjaxVO commit(@RequestBody Map<String, String> map) {
		AjaxVO vo = new AjaxVO<>();
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, Object> param = new HashMap<>();
		param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
		param.put("sangsinCode", Integer.parseInt(map.get("sangsinCode")));
		param.put("result", -2);
		param.put("opinion", map.get("opinion"));
		param.put("gianja", -1);
		param.put("nextGyeoljaeja", -1);
		param.put("gianjaName", "");
		
		try {
			gyeoljaeService.commitGyeoljae(param);
			
			try {
				Map<String, String> socketMap = new HashMap<>();
				socketMap.put("msg", String.valueOf(param.get("gianjaName")));
				
				String result = String.valueOf(param.get("result"));
				
				if("0".equals(result)) {//다음결재자로 알림
					this.template.convertAndSend("/message/gyeoljae/received/" + String.valueOf(param.get("nextGyeoljaeja")) + "/alarm", (new Gson()).toJson(socketMap));
					sendPush(String.valueOf(param.get("nextGyeoljaeja")), "결재알림", String.valueOf(param.get("gianjaName")) + "님이 올린 결재가 도착했습니다.");
				}
				else if("1".equals(result)) { //최종결재됨
					this.template.convertAndSend("/message/gyeoljae/keepbox/" + String.valueOf(param.get("gianja")) + "/alarm", (new Gson()).toJson(socketMap));
					sendPush(String.valueOf(param.get("gianja")), "결재알림", String.valueOf(param.get("gianjaName")) + "님이 올린 결재가  최종승인 되었습니다..");
				}
			}
			catch(Exception e) {
				e.printStackTrace();
			}
			
			vo.setSuccess(true);
		}
		catch(InvalidUser e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.INVALID_GYEOLJAE_USER.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(ModifySangsin e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.MODIFY_SANGSIN.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(RuntimeException e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
		
	}
	
	@PostMapping(value={"reject","m/reject"})
	@ResponseBody
	public AjaxVO reject(@RequestBody Map<String, String> map) {
		AjaxVO vo = new AjaxVO<>();
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, Object> param = new HashMap<>();
		param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
		param.put("sangsinCode", Integer.parseInt(map.get("sangsinCode")));
		param.put("result", -2);
		param.put("gianja", -1);
		param.put("gianjaName", "");
		param.put("opinion", map.get("opinion"));
		
		try {
			gyeoljaeService.rejectGyeoljae(param);
			
			try {
				Map<String, String> socketMap = new HashMap<>();
				socketMap.put("msg", String.valueOf(param.get("gianjaName")));
				this.template.convertAndSend("/message/gyeoljae/reject/" + String.valueOf(param.get("gianja")) + "/alarm", (new Gson()).toJson(socketMap));
				sendPush(String.valueOf(param.get("gianja")), "결재알림", String.valueOf(param.get("gianjaName")) + "님이 올린 결재가  반려되었습니다..");
			}
			catch(Exception e) {
				e.printStackTrace();
			}
			
			vo.setSuccess(true);
		}
		catch(InvalidUser e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.INVALID_GYEOLJAE_USER.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(ModifySangsin e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.MODIFY_SANGSIN.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(RuntimeException e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
		
	}
	
	@GetMapping("comment/{gyeoljaeLineCode}")
	@ResponseBody
	public AjaxVO<String> getGyeoljaeComment(
			@PathVariable("gyeoljaeLineCode") String gyeoljaeLineCode,
			@RequestParam(name="committed", required=false) String committed) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("gyeoljaeLineCode", gyeoljaeLineCode);
		
		if(committed != null) {
			param.put("committed", "Y");
		}
		
		AjaxVO<String> vo = new AjaxVO<>();
		
		try {
			String comment = gyeoljaeService.getGyeoljaeComment(param);
			vo.setSuccess(true);
			if(comment != null)	vo.addObject(comment);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("check/editable/{sangsinNum}")
	@ResponseBody
	public AjaxVO checkEditableSangsin(@PathVariable("sangsinNum") String sangsinNum) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		AjaxVO vo = new AjaxVO();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("sangsinNum", sangsinNum);
		
		try {
			boolean b = gyeoljaeService.isEditableSangsin(param);
			if(b) {
				vo.setSuccess(true);
			}
			else {
				vo.setSuccess(false);
				vo.setErrMsg("결재진행중입니다.");
			}
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
	
		return vo;
	}
	
	@GetMapping("modify/alarm/{sangsinNum}")
	@ResponseBody
	public AjaxVO updateModifyAlarm(
			@PathVariable("sangsinNum") String sangsinNum) {
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		AjaxVO vo = new AjaxVO();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("sangsinNum", sangsinNum);
		
		try {
			boolean b = gyeoljaeService.confirmMySangsin(param);
			if(b) {
				boolean result = gyeoljaeService.alarmModifySangsin(sangsinNum);
				if(result) {
					vo.setSuccess(true);
				}
				else {
					vo.setSuccess(false);
					vo.setErrMsg("결재진행중입니다. 수정하실수 없습니다.");
				}
			}
			else {
				vo.setSuccess(false);
				vo.setErrMsg("내 상신문서가 아닙니다.");
			}
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		
		return vo;
	}
	
	@GetMapping("modify/cancel/alarm/{sangsinNum}")
	@ResponseBody
	public AjaxVO updateModifyCancelAlarm(
			@PathVariable("sangsinNum") String sangsinNum) {
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		AjaxVO vo = new AjaxVO();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("sangsinNum", sangsinNum);
		
		try {
			boolean b = gyeoljaeService.confirmMySangsin(param);
			if(b) {
				boolean result = gyeoljaeService.alarmModifyCancelSangsin(sangsinNum);
				if(result) {
					vo.setSuccess(true);
				}
				else {
					vo.setSuccess(false);
					vo.setErrMsg("수정중이 아닙니다. 취소하실수 없습니다.");
				}
			}
			else {
				vo.setSuccess(false);
				vo.setErrMsg("내 상신문서가 아닙니다.");
			}
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		
		return vo;
	}
	
	private void sendPush(String sawonCode, String title, String msg) throws Exception {
		//push
		List<String> devices = sawonService.getSawonDevices(sawonCode);
		
		//forground push
		Map<String, String> m = new HashMap<>();
		m.put("title", title);
		m.put("message", msg);
		
		if(devices.size() > 0) {
			fcmManager.postFCM(
				devices, 
				title, 
				msg, 
				m,
				fcmLog
			);
		}
	}
}
