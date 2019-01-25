package kr.co.drpnd.domain;

import java.util.ArrayList;
import java.util.List;

public class AjaxVO<T> {

	private boolean success;
	private String errCode;
	private String errMsg;
	private String token;
	private List<T> datas;
	private int totalPage;
	private int totalRow;
	
	public AjaxVO() {
		datas = new ArrayList<T>();
	}
	
	public boolean isSuccess() {
		return success;
	}
	public void setErrCode(String errCode) {
		this.errCode = errCode;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}
	public String getErrMsg() {
		return errMsg;
	}
	public void setErrMsg(String errMsg) {
		this.errMsg = errMsg;
	}
	
	public void addObject(T t) {
		datas.add(t);
	}

	public List<T> getDatas() {
		return datas;
	}

	public void setDatas(List<T> datas) {
		this.datas = datas;
	}

	public String getErrCode() {
		return errCode;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public int getTotalRow() {
		return totalRow;
	}

	public void setTotalRow(int totalRow) {
		this.totalRow = totalRow;
	}

	
	
	
}
