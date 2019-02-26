package kr.co.drpnd.push;

import java.io.Serializable;

public class FCMVo implements Serializable {

	private static final long serialVersionUID = -7204545453020796283L;
	private boolean isSuccess;				// is Success
	private String resultStr = null;		// result info
	private String errorMsg = null;			// error message

	public FCMVo() {
		isSuccess = false;
		resultStr = "";
	}

	public boolean isSuccess() {
		return isSuccess;
	}

	public void setSuccess(boolean isSuccess) {
		this.isSuccess = isSuccess;
	}

	public String getResultStr() {
		return resultStr;
	}

	public void setResultStr(String resultStr) {
		this.resultStr = resultStr;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}
}
