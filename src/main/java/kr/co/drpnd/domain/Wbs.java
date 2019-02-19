package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("WBS")
public class Wbs {

	private int code;
	private String name;
	private String defaultDay;
	private String writeDate;
	private String writer;
	private String resources;
	private String events;
	private String range;
	
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
	public String getDefaultDay() {
		return defaultDay;
	}
	public void setDefaultDay(String defaultDay) {
		this.defaultDay = defaultDay;
	}
	public String getWriteDate() {
		return writeDate;
	}
	public void setWriteDate(String writeDate) {
		this.writeDate = writeDate;
	}
	public String getWriter() {
		return writer;
	}
	public void setWriter(String writer) {
		this.writer = writer;
	}
	public String getResources() {
		return resources;
	}
	public void setResources(String resources) {
		this.resources = resources;
	}
	public String getEvents() {
		return events;
	}
	public void setEvents(String events) {
		this.events = events;
	}
	public String getRange() {
		return range;
	}
	public void setRange(String range) {
		this.range = range;
	}
}
