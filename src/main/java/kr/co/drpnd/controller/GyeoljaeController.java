package kr.co.drpnd.controller;

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
import kr.co.drpnd.service.GyeoljaeService;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.util.SessionUtil;
import kr.co.drpnd.util.StringUtil;

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
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		AjaxVO vo = new AjaxVO();
		vo.setSuccess(true);
		
		//ObjectMapper om = new ObjectMapper();
		try {
			//System.err.println(om.writeValueAsString(sangsin));

			List<Map<String, Object>> lines = sangsin.getGyeoljaeLines();
			
			for(Map<String, Object> line: lines) {
				if("1".equals(line.get("order"))) {
					line.put("status", "D");
				}
				else {
					line.put("status", "W");
				}
			}
			
			sangsin.setGianja(myInfo.getSawonCode());
			gyeoljaeService.regNewGyeoljae(sangsin);
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
			@RequestParam("file") MultipartFile[] files) {
		AjaxVO vo = new AjaxVO();
		
		vo.setSuccess(true);
		
//		System.err.println("title ==>" + title);
//		System.err.println("gyeoljaeLines ==>" + gyeoljaeLines);
//		System.err.println("content ==>" + content);
		
		try {
			Sawon myInfo = SessionUtil.getSessionSawon();
			
			Gson gson = new Gson();
			List<Map<String, Object>> lines = gson.fromJson(gyeoljaeLines, new TypeToken<List<Map<String, Object>>>(){}.getType());
			
			for(Map<String, Object> line: lines) {
				if("1".equals(line.get("order"))) {
					line.put("status", "D");
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
			
			List<AttachFile> attachFiles = new ArrayList<>();
			
			for(MultipartFile file: files) {
				AttachFile attachFile = new AttachFile();
				attachFile.setName(file.getOriginalFilename());
				attachFile.setSize(file.getSize());
				attachFile.setExt(FilenameUtils.getExtension(file.getOriginalFilename()));
				attachFile.setFileByte(file.getBytes());
				
				attachFiles.add(attachFile);
				
//				System.err.println("fileName ==>" + file.getOriginalFilename());
//				System.err.println("fileSize ==>" + file.getSize());
//				System.err.println("fileExt ==>" + FilenameUtils.getExtension(file.getOriginalFilename()));
				//FileCopyUtils.copy(file.getBytes(), new File(UPLOAD_LOCATION + file.getOriginalFilename()));
			}
			
			sangsin.setAttachFiles(attachFiles);
			gyeoljaeService.regNewGyeoljae(sangsin);
			
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
	public AjaxVO<Map<String, String>> getMySangsin(
			@RequestParam(name="summary", required=false) String summary,
			@RequestParam(name="page", required=false) Integer page,
			@RequestParam(name="size", required=false) Integer size,
			@RequestParam(name="searchStatus", required=false) String searchStatus,
			@RequestParam(name="searchTextType", required=false) String searchTextType,
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
				param.put("searchText", StringUtil.escapeMsSql(searchText));
				param.put("searchStartDate", searchStartDate);
				param.put("searchEndDate", searchEndDate);
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
	
	@GetMapping("mygyeoljae")
	@ResponseBody
	public AjaxVO<Map<String, String>> getMyGyeoljae(
			@RequestParam(name="summary", required=false) String summary,
			@RequestParam(name="page", required=false) Integer page,
			@RequestParam(name="size", required=false) Integer size,
			@RequestParam(name="searchStatus", required=false) String searchStatus,
			@RequestParam(name="searchTextType", required=false) String searchTextType,
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
				param.put("searchText", StringUtil.escapeMsSql(searchText));
				param.put("searchStartDate", searchStartDate);
				param.put("searchEndDate", searchEndDate);
				
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
				param.put("searchText", StringUtil.escapeMsSql(searchText));
				param.put("searchStartDate", searchStartDate);
				param.put("searchEndDate", searchEndDate);
				
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
	
	@PostMapping("/file/{code}")
	public void downloadReport(@PathVariable("code") String code, 
							   HttpServletRequest request, HttpServletResponse response) throws Exception  {
		
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("attachFileCode", code);
		
		AttachFile file = gyeoljaeService.getAttachFile(param);
		String fileName = file.getName().substring(0, file.getName().lastIndexOf("."));
		
		
		//한글파일명 라우저 별 처리
		if(file != null) {
			if(request.getHeader("User-Agent").contains("MSIE") || request.getHeader("User-Agent").contains("Trident")) {
				fileName = URLEncoder.encode(fileName, "UTF-8").replaceAll("\\+", "%20");
			}
			else {
				fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
			}
			
			response.setHeader("Content-Transper-Encoding", "binary");
			response.setHeader("Content-Disposition", "inline; filename=" + fileName + "." + file.getExt());
			response.setContentType("application/octet-stream");
			
			
			ServletOutputStream out = response.getOutputStream();
			out.write(file.getFileByte());
			out.flush();
		}
	}
	
	@PostMapping("commit")
	@ResponseBody
	public AjaxVO commit(@RequestBody Map<String, String> map) {
		AjaxVO vo = new AjaxVO<>();
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, Object> param = new HashMap<>();
		param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
		param.put("sangsinCode", Integer.parseInt(map.get("sangsinCode")));
		param.put("result", -2);
		param.put("opinion", map.get("opinion"));
		
		try {
			gyeoljaeService.commitGyeoljae(param);
			vo.setSuccess(true);
		}
		catch(InvalidUser e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.INVALID_GYEOLJAE_USER.getCode());
			vo.setErrMsg(e.getMessage());
		}
		catch(RuntimeException e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
		
	}
	
	@PostMapping("reject")
	@ResponseBody
	public AjaxVO reject(@RequestBody Map<String, String> map) {
		AjaxVO vo = new AjaxVO<>();
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, Object> param = new HashMap<>();
		param.put("sawonCode", Integer.parseInt(myInfo.getSawonCode()));
		param.put("sangsinCode", Integer.parseInt(map.get("sangsinCode")));
		param.put("result", -2);
		param.put("opinion", map.get("opinion"));
		
		try {
			gyeoljaeService.rejectGyeoljae(param);
			vo.setSuccess(true);
		}
		catch(InvalidUser e) {
			vo.setSuccess(false);
			vo.setErrCode(ExceptionCode.INVALID_GYEOLJAE_USER.getCode());
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
	public AjaxVO<String> getGyeoljaeComment(@PathVariable("gyeoljaeLineCode") String gyeoljaeLineCode) {
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		Map<String, String> param = new HashMap<>();
		param.put("sawonCode", myInfo.getSawonCode());
		param.put("gyeoljaeLineCode", gyeoljaeLineCode);
		
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
}
