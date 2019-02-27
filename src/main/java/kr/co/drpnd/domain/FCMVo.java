package kr.co.drpnd.domain;

import java.util.List;

import org.apache.ibatis.type.Alias;

@Alias("FCMVo")
public class FCMVo {

	private List<String> tokens;
	private String successFail;
	private String title;
	private String content;
	private String result;
	
	public List<String> getTokens() {
		return tokens;
	}
	public void setTokens(List<String> tokens) {
		this.tokens = tokens;
	}
	public String getSuccessFail() {
		return successFail;
	}
	public void setSuccessFail(String successFail) {
		this.successFail = successFail;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	
	
}
