package kr.co.drpnd.controller;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.AttachFile;
import kr.co.drpnd.domain.Sangsin;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.service.GyeoljaeService;
import kr.co.drpnd.util.SessionUtil;

@RequestMapping("/gyeoljae")
@Controller
public class GyeoljaeController {

	@Resource(name="gyeoljaeService")
	GyeoljaeService gyeoljaeService;
	
	@GetMapping("view/new")
	public String viewNewGyeoljae(ModelMap m) {
		SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");//dd/MM/yyyy
		Date now = new Date();
		String strDate = sdfDate.format(now);
		
		m.addAttribute("time", strDate);
		return "gyeoljae/newgyeoljae";
	}
	
	@GetMapping("view/overview")
	public String overviewGyeoljae() {
		
		return "gyeoljae/overview";
	}
	
	@GetMapping("view/keepbox")
	public String viewKeepBox() {
		
		return "gyeoljae/keepbox";
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
		
		//Thread.sleep(5000);
		return vo;
	}
	
	@PostMapping("reg/newgyeoljae_nofile")
	@ResponseBody
	public AjaxVO regNewGyeoljaeNoFile(@RequestBody Sangsin sangsin) {
		AjaxVO vo = new AjaxVO();
		
		vo.setSuccess(true);
		
		ObjectMapper om = new ObjectMapper();
		try {
			System.err.println(om.writeValueAsString(sangsin));
		} catch (JsonProcessingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
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
			@RequestParam("file") MultipartFile[] files) {
		AjaxVO vo = new AjaxVO();
		
		vo.setSuccess(true);
		
		System.err.println("title ==>" + title);
		System.err.println("gyeoljaeLines ==>" + gyeoljaeLines);
		System.err.println("content ==>" + content);
		
		try {
			Sawon myInfo = SessionUtil.getSessionSawon();
			
			Gson gson = new Gson();
			List<Map<String, Object>> lines = gson.fromJson(gyeoljaeLines, new TypeToken<List<Map<String, Object>>>(){}.getType());
			
			String gyeoljaeja = "";
			for(Map<String, Object> line: lines) {
				if("1".equals(line.get("order"))) {
					gyeoljaeja = String.valueOf(line.get("sawonCode"));
					break;
				}
			}
			
			Sangsin sangsin = new Sangsin();
			sangsin.setTitle(title);
			sangsin.setContent(content);
			sangsin.setPlainContent(plainContent);
			sangsin.setGyeoljaeLines(lines);
			sangsin.setGianja(myInfo.getSawonCode());
			sangsin.setGyeoljaeja(gyeoljaeja);
			
			List<AttachFile> attachFiles = new ArrayList<>();
			
			for(MultipartFile file: files) {
				AttachFile attachFile = new AttachFile();
				attachFile.setName(file.getOriginalFilename());
				attachFile.setSize(file.getSize());
				attachFile.setExt(FilenameUtils.getExtension(file.getOriginalFilename()));
				attachFile.setFileByte(file.getBytes());
				
				attachFiles.add(attachFile);
				
				System.err.println("fileName ==>" + file.getOriginalFilename());
				System.err.println("fileSize ==>" + file.getSize());
				System.err.println("fileExt ==>" + FilenameUtils.getExtension(file.getOriginalFilename()));
				//FileCopyUtils.copy(file.getBytes(), new File(UPLOAD_LOCATION + file.getOriginalFilename()));
			}
			
			sangsin.setAttachFiles(attachFiles);
			
			gyeoljaeService.regNewGyeoljae(sangsin);
			
			vo.setSuccess(true);
			
//			ObjectMapper om = new ObjectMapper();
//			System.err.println(om.writeValueAsString(sangsin.getAttachFiles()));
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
	
	@GetMapping("mysangsin")
	@ResponseBody
	public AjaxVO<Map<String, String>> getMySangsin() {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		try {
			List<Map<String, String>> list = gyeoljaeService.getMySangsin(myInfo.getSawonCode());
			vo.setSuccess(true);
			vo.setDatas(list);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
	
		return vo;
		
	}
	
	@GetMapping("mygyeoljae")
	@ResponseBody
	public AjaxVO<Map<String, String>> getMyGyeoljae() {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		try {
			List<Map<String, String>> list = gyeoljaeService.getMyGyeoljae(myInfo.getSawonCode());
			vo.setSuccess(true);
			vo.setDatas(list);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
	
		return vo;
		
	}
}
