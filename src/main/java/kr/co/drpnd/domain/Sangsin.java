package kr.co.drpnd.domain;

import java.util.List;
import java.util.Map;

public class Sangsin {

	private int gyeoljaeNum;
	private String title;
	private List<Map<String, Object>> gyeoljaeLines;
	private String content;
	private List<AttachFile> attachFiles;
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public List<Map<String, Object>> getGyeoljaeLines() {
		return gyeoljaeLines;
	}
	public void setGyeoljaeLines(List<Map<String, Object>> gyeoljaeLines) {
		this.gyeoljaeLines = gyeoljaeLines;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public List<AttachFile> getAttachFiles() {
		return attachFiles;
	}
	public void setAttachFiles(List<AttachFile> attachFiles) {
		this.attachFiles = attachFiles;
	}
	public int getGyeoljaeNum() {
		return gyeoljaeNum;
	}
	public void setNum(int gyeoljaeNum) {
		this.gyeoljaeNum = gyeoljaeNum;
	}
}
