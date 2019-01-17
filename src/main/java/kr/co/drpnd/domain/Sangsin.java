package kr.co.drpnd.domain;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.type.Alias;

@Alias("Sangsin")
public class Sangsin {

	private int sangsinNum;
	private String title;
	private List<Map<String, Object>> gyeoljaeLines;
	private String content;
	private String plainContent;
	private String gyeoljaeja;//결재처리자
	private String gianja;  //p-r-c 처리
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
	public int getSangsinNum() {
		return sangsinNum;
	}
	public void setSangsinNum(int sangsinNum) {
		this.sangsinNum = sangsinNum;
	}
	public String getPlainContent() {
		return plainContent;
	}
	public void setPlainContent(String plainContent) {
		this.plainContent = plainContent;
	}
	public String getGyeoljaeja() {
		return gyeoljaeja;
	}
	public void setGyeoljaeja(String gyeoljaeja) {
		this.gyeoljaeja = gyeoljaeja;
	}
	public String getGianja() {
		return gianja;
	}
	public void setGianja(String gianja) {
		this.gianja = gianja;
	}
	
}
