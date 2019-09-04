package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("Holiday")
public class HolidayFlexible {

	private String start;
	private String end;
	private final String rendering = "background";
	private final String backgroundColor = "@color";
	private String bgTitle;
	
	public String getStart() {
		return start;
	}
	public void setStart(String start) {
		this.start = start;
	}
	public String getEnd() {
		return end;
	}
	public void setEnd(String end) {
		this.end = end;
	}
	public String getBgTitle() {
		return bgTitle;
	}
	public void setBgTitle(String bgTitle) {
		this.bgTitle = bgTitle;
	}
	public String getRendering() {
		return rendering;
	}
	public String getBackgroundColor() {
		return backgroundColor;
	}
}
