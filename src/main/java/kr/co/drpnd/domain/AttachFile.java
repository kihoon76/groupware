package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("AttachFile")
public class AttachFile {

	private int code;
	private String name;
	private long size;
	private String ext;
	private int sangsinNum;
	private byte[] fileByte;
	
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public long getSize() {
		return size;
	}
	public void setSize(long size) {
		this.size = size;
	}
	public String getExt() {
		return ext;
	}
	public void setExt(String ext) {
		this.ext = ext;
	}
	public int getSangsinNum() {
		return sangsinNum;
	}
	public void setSangsinNum(int sangsinNum) {
		this.sangsinNum = sangsinNum;
	}
	public byte[] getFileByte() {
		return fileByte;
	}
	public void setFileByte(byte[] fileByte) {
		this.fileByte = fileByte;
	}
	
}
