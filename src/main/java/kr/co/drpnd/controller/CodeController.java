package kr.co.drpnd.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.co.drpnd.domain.ExtjsStoreVO;
import kr.co.drpnd.service.CodeService;
import kr.co.drpnd.type.Code;

@RequestMapping("/code")
@Controller
public class CodeController {

	@Resource(name="codeService")
	CodeService codeService;
	
	@PostMapping("{type}")
	@ResponseBody
	public ExtjsStoreVO<Object> getTeamList(
			@PathVariable("type") String type,
			@RequestParam(name="pCode", required=false) String pCode) {
		
		ExtjsStoreVO<Object> vo = new ExtjsStoreVO<>();
		List<Object> list = null;
		
		
		switch(Code.getType(type)) {
		case DEPARTMENT:
			list = codeService.getDepartment();
			break;
		case TEAM:
			list = codeService.getTeam(pCode);
			break;
		case POSITION:
			list = codeService.getPosition();
			break;
		case OVERWORK:
			list = codeService.getOverwork();
			break;
		case GYEOLJAE:
			list = codeService.getGyeoljae();
			break;
		default :
			break;
		}
		

		vo.setDatas(list);
		
		return vo;
	}
}
