package kr.co.drpnd.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.service.DocService;

@RequestMapping("/doc")
@Controller
public class DocController {

	@Resource(name="docService")
	DocService docService;
	
	@PostMapping("normal/list")
	@ResponseBody
	public AjaxVO<Map<String, String>> getNormalDocList() {
		AjaxVO<Map<String, String>> vo = new AjaxVO<>();
		
		try {
			List<Map<String, String>> list = docService.getNormalDocList();
			if(list != null) {
				vo.setDatas(list);
			}
			
			vo.setSuccess(true);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
		
	}
	
	@GetMapping("normal/download/{fileName}/{ext}")
	public void downloadFile(
			HttpServletResponse response,
			@PathVariable("fileName") String fileName,
			@PathVariable("ext") String ext) { 
		
		File fp;
		BufferedInputStream fin = null;
		BufferedOutputStream outs = null;
		
		try {
			fp = ResourceUtils.getFile("classpath:docs/" + fileName + "." + ext);
			int read = 0;
			byte[] b = new byte[(int)fp.length()]; // 파일 크기
			
			if(fp.isFile()) {
				fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
				response.setHeader("Content-Transper-Encoding", "binary");
				response.setHeader("Content-Disposition", "inline; filename=" + fileName + "." + ext);
				response.setHeader("Content-Length", (int)fp.length() + "");
				response.setContentType("application/octet-stream");
				
				fin = new BufferedInputStream(new FileInputStream(fp));
				outs = new BufferedOutputStream(response.getOutputStream());
				while((read = fin.read(b)) != -1) {
			         outs.write(b, 0, read);
			         outs.flush();
			    }
				
			}
		} 
		catch(Exception e) {
			e.printStackTrace();
		}
		finally{
			if(outs != null) {
				try {
					outs.close();
				} 
				catch (IOException e) {
					e.printStackTrace();
				}
			}
			
			if(fin != null) {
				try {
					fin.close();
				} 
				catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	
}
