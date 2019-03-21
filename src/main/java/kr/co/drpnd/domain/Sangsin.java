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
	private String gianja;  
	private List<AttachFile> attachFiles;
	private String status;
	private String writeDate;
	private String gyeoljaeType;
	private String startDate;
	private String endDate;
	private String pushContent;
	private String modify;  //수정중
	private String delAttachCode;
	private String gyeoljaeSubType;
	private String term;
	private String docNum;
	
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
	public String getGianja() {
		return gianja;
	}
	public void setGianja(String gianja) {
		this.gianja = gianja;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getWriteDate() {
		return writeDate;
	}
	public void setWriteDate(String writeDate) {
		this.writeDate = writeDate;
	}
	public String getGyeoljaeType() {
		return gyeoljaeType;
	}
	public void setGyeoljaeType(String gyeoljaeType) {
		this.gyeoljaeType = gyeoljaeType;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getPushContent() {
		return pushContent;
	}
	public void setPushContent(String pushContent) {
		this.pushContent = pushContent;
	}
	public String getModify() {
		return modify;
	}
	public void setModify(String modify) {
		this.modify = modify;
	}
	public String getDelAttachCode() {
		return delAttachCode;
	}
	public void setDelAttachCode(String delAttachCode) {
		this.delAttachCode = delAttachCode;
	}
	public String getGyeoljaeSubType() {
		return gyeoljaeSubType;
	}
	public void setGyeoljaeSubType(String gyeoljaeSubType) {
		this.gyeoljaeSubType = gyeoljaeSubType;
	}
	public String getTerm() {
		return term;
	}
	public void setTerm(String term) {
		this.term = term;
	}
	public String getDocNum() {
		return docNum;
	}
	public void setDocNum(String docNum) {
		this.docNum = docNum;
	}
	
}
