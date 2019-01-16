package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("AttachFile")
public class AttachFile {

	private String num;
	private String name;
	private long size;
	private String ext;
	private int gyeoljaeNum;
	private byte[] fileByte;
	
	public String getNum() {
		return num;
	}
	public void setNum(String num) {
		this.num = num;
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
	public int getGyeoljaeNum() {
		return gyeoljaeNum;
	}
	public void setGyeoljaeNum(int gyeoljaeNum) {
		this.gyeoljaeNum = gyeoljaeNum;
	}
	public byte[] getFileByte() {
		return fileByte;
	}
	public void setFileByte(byte[] fileByte) {
		this.fileByte = fileByte;
	}
	
}
