package kr.co.drpnd.domain;

import org.apache.ibatis.type.Alias;

@Alias("CalendarEvent")
public class CalendarEvent {
	private String title;
	private String id;
	private String start;
	private String end;
	private String cate;
	private String cateMonth;
	private String description;
	private String bigo;
	private String mine;
	private String txtColor;
	private String bgColor;
	private String borderColor;
	private String sawonCode;
	private boolean isNew;
	private boolean isModify;
	private boolean isDelete;
	private boolean isDb;
	private String confirm;
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getStart() {
		return start;
	}
	public void setStart(String start) {
		this.start = start;
	}
	public String getCate() {
		return cate;
	}
	public void setCate(String cate) {
		this.cate = cate;
	}
	public String getCateMonth() {
		return cateMonth;
	}
	public void setCateMonth(String cateMonth) {
		this.cateMonth = cateMonth;
	}
	public String getMine() {
		return mine;
	}
	public void setMine(String mine) {
		this.mine = mine;
	}
	public boolean isNew() {
		return isNew;
	}
	public void setNew(boolean isNew) {
		this.isNew = isNew;
	}
	public String getSawonCode() {
		return sawonCode;
	}
	public void setSawonCode(String sawonCode) {
		this.sawonCode = sawonCode;
	}
	public boolean isModify() {
		return isModify;
	}
	public void setModify(boolean isModify) {
		this.isModify = isModify;
	}
	public boolean isDb() {
		return isDb;
	}
	public void setDb(boolean isDb) {
		this.isDb = isDb;
	}
	public boolean isDelete() {
		return isDelete;
	}
	public void setDelete(boolean isDelete) {
		this.isDelete = isDelete;
	}
	public String getEnd() {
		return end;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public void setEnd(String end) {
		this.end = end;
	}
	public String getTxtColor() {
		return txtColor;
	}
	public void setTxtColor(String txtColor) {
		this.txtColor = txtColor;
	}
	public String getBgColor() {
		return bgColor;
	}
	public void setBgColor(String bgColor) {
		this.bgColor = bgColor;
	}
	
	public String getBorderColor() {
		return borderColor;
	}
	public void setBorderColor(String borderColor) {
		this.borderColor = borderColor;
	}
	public String getBigo() {
		return bigo;
	}
	public void setBigo(String bigo) {
		this.bigo = bigo;
	}
	public String getConfirm() {
		return confirm;
	}
	public void setConfirm(String confirm) {
		this.confirm = confirm;
	}
	
}
