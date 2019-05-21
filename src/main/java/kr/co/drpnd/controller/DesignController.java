package kr.co.drpnd.controller;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.drpnd.domain.AjaxVO;
import kr.co.drpnd.domain.Design;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.service.DesignService;
import kr.co.drpnd.util.SessionUtil;

@RequestMapping("design")
@Controller
public class DesignController {

	@Resource(name="designService")
	DesignService designService;
	
	@GetMapping("detail/{designId}")
	@ResponseBody
	public AjaxVO<Design> getDesignDetail(@PathVariable("designId") String designId) {
		
		AjaxVO<Design> vo = new AjaxVO<>();
		Sawon myInfo = SessionUtil.getSessionSawon();
		
		try {
			Map<String, String> param = new HashMap<>();
			param.put("designId", designId);
			param.put("department", myInfo.getSawonDepartment());
			
			Design designDetail = designService.getDesignDetail(param);
			vo.setSuccess(true);
			vo.addObject(designDetail);
		}
		catch(Exception e) {
			vo.setSuccess(false);
			vo.setErrMsg(e.getMessage());
		}
		
		return vo;
	}
}
