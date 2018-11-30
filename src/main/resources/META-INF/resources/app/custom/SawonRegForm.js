Ext.define('Drpnd.custom.SawonRegForm', function(){
	var trim = Ext.String.trim;
	var CommonFn = Drpnd.util.CommonFn;
	var isImwon = false;
	var DEPARTMENT_MSG = '부서를 선택하세요.',
		TEAM_MSG = '소속팀을 선택해 주세요',
		POSITION_MSG = '직급을 선택해 주세요',
		NAME_MSG = '사원명을 입력해 주세요',
		ID_MSG = '아이디를 입력해 주세요',
		PW_MSG = '비밀번호를 입력해주세요',
		PW_CONFIRM_MSG = '비밀번호가 일치하지 않습니다.',
		EMAIL_BLK_MSG = '이메일을 입력해 주세요.',
		EMAIL_FRM_MSG = '이메일형식이 올바르지 않습니다.';
	
	function markInvalid(component, msg) {
		component.markInvalid(msg);
	}
	
	function validBlank(component, msg) {
		var v = component.getValue();
		v = (v != null) ? trim(v) : v;
		
		if(!v) {
			markInvalid(component, msg);
			return false;
		}
		
		return true;
	}
	
	function validDepartmentCombo(departmentCombo) {
		return validBlank(departmentCombo, DEPARTMENT_MSG);
	}
	
	function validTeamCombo(teamCombo) {
		//직급이 임원이면 선택않함
		if(isImwon) return true;
		
		if(!teamCombo.getValue()) {
			markInvalid(teamCombo, TEAM_MSG);
			return false;
		}
		
		return true;
	}
	
	function validPositionCombo(positionCombo) {
		return validBlank(positionCombo, POSITION_MSG);
	}
	
	function vaildNameTxt(nameTxt) {
		return validBlank(nameTxt, NAME_MSG);
	}
	
	function validIdTxt(idTxt) {
		return validBlank(idTxt, ID_MSG);
	}
	
	function validPwTxt(pwTxt, pwConfirmTxt) {
		var pwTxtVal = trim(pwTxt.getValue());
		var pwConfirmTxtVal = trim(pwConfirmTxt.getValue());
		
		if(pwTxtVal == '') {
			return validBlank(pwTxt, PW_MSG);
		}
		
		if(pwConfirmTxtVal == '') {
			return validBlank(pwConfirmTxt, PW_MSG);
		}
		
		if(pwTxtVal != pwConfirmTxtVal) {
			markInvalid(pwTxt, PW_CONFIRM_MSG);
			markInvalid(pwConfirmTxt, PW_CONFIRM_MSG);
			return false;
		}
		
		return true;
	}
	
	function validEmailTxt(emailTxt) {
		if(validBlank(emailTxt, EMAIL_BLK_MSG)) {
			var v = trim(emailTxt.getValue());
			if(CommonFn.validEmail(v)) {
				return true;
			}
			
			markInvalid(emailTxt, EMAIL_FRM_MSG);
			return false;
		}
		
		return false;
	}
	
	return {
		requires: ['Drpnd.util.CommonFn'],
		config: {
			departmentCombo: null,
			teamCombo: null,
			positionCombo: null,
			nameTxt: null,
			idTxt: null,
			pwTxt: null,
			pwConfirmTxt: null,
			phoneTxt: null,
			emailTxt: null,
			birthdayDate: null,
			manWomanRdoGrp: null,
			teamLeaderRdoGrp: null,
			departmentChanged: true
		},
		getJsonParam: function() {
			return {
				sawonName: this.nameTxt.getValue(),
				sawonDepartment: this.departmentCombo.getValue(),
				sawonTeam: this.teamCombo.getValue(),
				sawonPosition: this.positionCombo.getValue(),
				sawonId: this.idTxt.getValue(),
				sawonManWoman: (this.manWomanRdoGrp.getChecked())[0]._value
			}
		},
		isValid: function() {
			return validDepartmentCombo(this.departmentCombo) && 
				   validTeamCombo(this.teamCombo) &&
				   validPositionCombo(this.positionCombo) &&
				   vaildNameTxt(this.nameTxt) &&
				   validIdTxt(this.idTxt) && 
				   validPwTxt(this.pwTxt, this.pwConfirmTxt) &&
				   validEmailTxt(this.emailTxt);
		},
		adjustTeamCombo: function() {
			//부서 값이 없으면  무조건 비활성, 직급이 임원이면 비활성
			if(!this.departmentCombo.getValue() || isImwon) {
				this.teamCombo.setDisabled(true);
			}
			else {
				this.teamCombo.setDisabled(false);
			}
		},
		setImwon: function(positionGubun) {
			if(positionGubun == '1' || positionGubun == '2') {
				isImwon = true;
			}
			else {
				isImwon = false;
			}
			
			this.adjustTeamCombo();
		},
		onSelectDepartmentCombo: function() {
			//if(this.teamCombo.isDisabled()) this.teamCombo.setDisabled(false);
			var departmentCode = this.departmentCombo.getValue();
			this.setDepartmentChanged(true);
			
			this.teamCombo.clearValue();
			this.teamCombo.getStore().setPCode(departmentCode);
			
			this.adjustTeamCombo();
		},
		initSetting: function() {
			isImwon = false;
			this.setDepartmentChanged(true);
		}
	}
});