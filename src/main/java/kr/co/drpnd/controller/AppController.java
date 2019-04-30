package kr.co.drpnd.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RequestMapping("/app/m")
@Controller
public class AppController {

	@GetMapping("downloadpage")
	public String viewDownloadPage() {
		return "app/downloadpage";
	}
	
	@PostMapping("download")
	public void downloadApp(
			HttpServletRequest request, 
			HttpServletResponse response,
			@RequestParam("device") String device) throws Exception  {
		
		String fileName = "GroupWareV1.2";
			//fileName = new String(fileName.getBytes("UTF-8"), "ISO-8859-1");
			
		response.setHeader("Content-Transper-Encoding", "binary");
		response.setHeader("Content-Disposition", "inline; filename=" + fileName + ".apk");
		response.setContentType("application/octet-stream");
		
		/** 파일 다운로드 */

		File fp = ResourceUtils.getFile("classpath:apps/" + fileName + ".apk");
		
		//File fp = new File
		int read = 0;
		byte[] b = new byte[(int)fp.length()]; // 파일 크기

		if(fp.isFile()) {
			BufferedInputStream fin = new BufferedInputStream(new FileInputStream(fp));
			BufferedOutputStream outs =	new BufferedOutputStream(response.getOutputStream());

			// 파일 읽어서 브라우저로 출력하기
			try {
		       while((read = fin.read(b)) != -1) {
		         outs.write(b, 0, read);
		       }
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			finally{
				if(outs != null) {outs.close();}
				if(fin != null) {fin.close();}
			}
		}
	}
}
