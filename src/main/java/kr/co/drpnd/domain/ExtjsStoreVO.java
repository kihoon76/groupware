package kr.co.drpnd.domain;

import java.util.List;

import org.apache.ibatis.type.Alias;

@Alias("ExtjsStoreVO")
public class ExtjsStoreVO<T> {

	private int total;
	private String searchType;
	private String searchValue;
	private String wbsName;
	private String writerCode;
	private String myTeamCode;
	private String myDepartmentCode;
	
	private int start;
	private int limit;
	private List<T> datas;
	
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public List<T> getDatas() {
		return datas;
	}
	public void setDatas(List<T> datas) {
		this.datas = datas;
	}
	public String getSearchType() {
		return searchType;
	}
	public void setSearchType(String searchType) {
		this.searchType = searchType;
	}
	public String getSearchValue() {
		return searchValue;
	}
	public void setSearchValue(String searchValue) {
		this.searchValue = searchValue;
	}
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	public int getLimit() {
		return limit;
	}
	public void setLimit(int limit) {
		this.limit = limit;
	}
	public String getWbsName() {
		return wbsName;
	}
	public void setWbsName(String wbsName) {
		this.wbsName = wbsName;
	}
	public String getWriterCode() {
		return writerCode;
	}
	public void setWriterCode(String writerCode) {
		this.writerCode = writerCode;
	}
	public String getMyTeamCode() {
		return myTeamCode;
	}
	public void setMyTeamCode(String myTeamCode) {
		this.myTeamCode = myTeamCode;
	}
	public String getMyDepartmentCode() {
		return myDepartmentCode;
	}
	public void setMyDepartmentCode(String myDepartmentCode) {
		this.myDepartmentCode = myDepartmentCode;
	}
	
}
