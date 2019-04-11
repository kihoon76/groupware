<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" trimDirectiveWhitespaces="true"%>
<%@ taglib prefix="c"	uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="req" value="${pageContext.request}" />
<c:set var="url">${req.requestURL}</c:set>
<c:set var="uri" value="${req.requestURI}" />
<content tag="script">
<script src="/resources/lib/jquery.min.js"></script>
<script src="/resources/os/summernote/popper-1.11.0.min.js"></script>
<script src="/resources/lib/bootstrap.min.js"></script>
<script src="/resources/os/bootstrap-datepicker-1.6.4/js/bootstrap-datepicker.min.js"></script>
<script src="/resources/os/bootstrap-datepicker-1.6.4/locales/bootstrap-datepicker.ko.min.js" charset="UTF-8"></script>
<script src="/resources/os/tabulator-4.1/js/tabulator.min.js"></script>
<script src="/resources/os/jQuery-Upload-File/4.0.11/jquery.form.js"></script>
<script src="/resources/os/jQuery-Upload-File/4.0.11/jquery.uploadfile.js"></script>
<script src="/resources/os/summernote/summernote-bs4.min.js"></script>
<script src="/resources/os/summernote/lang/summernote-ko-KR.min.js"></script>
<script src="/resources/js/icommon.js"></script>
<script src="/resources/js/gyeoljae/modmysangsin.js"></script>

</content>
<head>
	<link rel="stylesheet" href="/resources/css/bootstrap.min.css" />
	<link rel="stylesheet" href="/resources/os/bootstrap-datepicker-1.6.4/css/bootstrap-datepicker.standalone.min.css" />
	<link rel="stylesheet" href="/resources/os/summernote/summernote-bs4.css" />
	<link rel="stylesheet" href="/resources/os/font-awesome/css/font-awesome.min.css" />
	<!-- tabulator -->
    <link rel="stylesheet" href="/resources/os/tabulator-4.1/css/tabulator_simple.min.css" />
  	<link rel="stylesheet" href="/resources/os/jQuery-Upload-File/4.0.11/uploadfile.css">
  	<link rel="stylesheet" href="/resources/css/uploadfilecustom.css">
  	<link rel="stylesheet" href="/resources/css/gyeoljae.css" />
  	<style>
  	.modify-disabled {pointer-events:none; opacity:0.4;}
  	.modify-enable {pointer-events:auto; opacity:1;}
  	.modify-alarm {position:relative; top:3px; left:3px; font-size:11px;}
  	</style>
</head>
<body>
	<button id="chkAlarm" type="button" class="btn btn-default btn-sm" style="margin-left:10px; margin-top:5px;">알림ON</button>
	<button id="btnRefresh" type="button" class="btn btn-primary btn-sm" style="margin-left:10px; margin-top:5px;">새로고침</button>
	<span class="modify-alarm">★결재자에게 수정/삭제중임을 알립니다.(알림ON을 클릭하세요) - ★취소시 꼭  알림OFF 버튼을 눌러주세요 (알림OFF를 누르지 않으면 결재가 진행되지 않습니다)</span>
	<div id="dvContainer" class="modify-disabled">
	<form>
		<div class="form-inline divMB">
			<div class="form-group divMR">
				<span style="font-size:1.5em;" class="divMR"><span class="badge badge-danger">결재타입</span></span>
 				<select class="form-control form-control-sm" id="selGyeoljaeType">
 				<c:forEach items="${gyeoljaeType}" var="map">
 					<option value="${map.code}" <c:if test="${sangsin.gyeoljaeType eq map.code}"> selected</c:if>>${map.name}</option>
 				</c:forEach>
				</select>		
			</div>
			
			<c:choose>
			<c:when test="${sangsin.gyeoljaeType eq '2'}">
			<div class="form-group divMR" id="dvGyeoljaeSubType">
				<select class="form-control form-control-sm" id="selGyeoljaeSubType">
					<option value="1" <c:if test="${sangsin.gyeoljaeSubType eq '1'}">selected</c:if>>연차</option>
					<option value="2" <c:if test="${sangsin.gyeoljaeSubType eq '2'}">selected</c:if>>보건</option>
					<option value="3" <c:if test="${sangsin.gyeoljaeSubType eq '3'}">selected</c:if>>청원</option>
					<option value="4" <c:if test="${sangsin.gyeoljaeSubType eq '4'}">selected</c:if>>공가</option>
					<option value="5" <c:if test="${sangsin.gyeoljaeSubType eq '5'}">selected</c:if>>병가</option>
					<option value="6" <c:if test="${sangsin.gyeoljaeSubType eq '6'}">selected</c:if>>직무교육</option>
					<option value="7" <c:if test="${sangsin.gyeoljaeSubType eq '7'}">selected</c:if>>기타</option>
					<option value="8" <c:if test="${sangsin.gyeoljaeSubType eq '8'}">selected</c:if>>반차</option>
					<option value="9" <c:if test="${sangsin.gyeoljaeSubType eq '9'}">selected</c:if>>대체휴가</option>
				</select> 	
			</div>
			</c:when>
			<c:otherwise>
			<div class="form-group divMR" style="display:none;" id="dvGyeoljaeSubType">
				<select class="form-control form-control-sm" id="selGyeoljaeSubType">
					<option value="1" selected>연차</option>
					<option value="2">보건</option>
					<option value="3">청원</option>
					<option value="4">공가</option>
					<option value="5">병가</option>
					<option value="6">직무교육</option>
					<option value="7">기타</option>
				</select>
			</div>
			</c:otherwise>
			</c:choose>
			
			<div class="input-daterange form-group divMR" id="datepicker" <c:if test="${sangsin.gyeoljaeType eq '1'}"> style="display:none;"</c:if><c:if test="${sangsin.gyeoljaeType eq '2'}"> style="display:;"</c:if>>
				<div class="input-group-prepend">
			  		<input type="text" style="width:120px;" class="form-control" autocomplete="off" readOnly id="txtVacationStart" value="${sangsin.startDate}"/>
			  		<span class="input-group-text"> ~ </span>
			  		<input type="text" style="width:120px;" class="form-control" autocomplete="off" readOnly id="txtVacationEnd" value="${sangsin.endDate}"/>
			  	</div>
			</div>
			
			<div class="form-group divMR" <c:if test="${sangsin.gyeoljaeType eq '1'}">style="display:none;"</c:if> id="dvVacationTerm">
				(<input type="number" class="form-control form-control-sm" style="width:50px;" id="numTerm" min="1" value="<c:out value='${sangsin.term}' />">)일간
			</div>
		</div>
		<div class="form-group" id="dvDocNum" <c:if test="${sangsin.gyeoljaeType eq '2'}">style="display:none;"</c:if>>
    		<input type="text" class="form-control form-control-sm" id="docNum" placeholder="문서번호 (예 19-2)" style="width:150px;" value="<c:out value='${sangsin.docNum}' />">
  		</div>
		<div class="form-group">
    		<input type="text" class="form-control form-control-sm" id="gianTitle" placeholder="기안제목" value="${sangsin.title}">
  		</div>
  		<div class="input-group">
    		<input type="text" class="form-control form-control-sm" placeholder="이름 입력해서  결재자 검색" id="txtSearchSawon">
    		<div class="input-group-append">
      			<button class="btn btn-secondary btn-sm" type="button" id="btnSearchSawon">
        			<i class="fa fa-search"></i>
      			</button>
    		</div>
  		</div>
  		<div class="divMT">
  			<span style="font-size:1.5em;"><span class="badge badge-pill badge-danger">결재라인</span></span>
  			<span style="font-size:1.2em;"><span class="badge badge-pill badge-info">※입력된 순서대로 순차적으로 결재가 진행됩니다.</span></span>
  		</div>
  		<div class="divMT divMB">
  			<div id="gyeoljaeLine"></div>
  		</div>
  		<div class="divMT divMB">
  			<span style="font-size:1.5em;"><span class="badge badge-pill badge-danger">내용</span></span>
  		</div>
  		<textarea id="gyeoljaeContent" name="editordata" style="display:none;"></textarea>
		<div class="divMT divMB">
  			<span style="font-size:1.5em;"><span class="badge badge-pill badge-danger">첨부파일</span></span>
  			<span style="font-size:1.2em;"><span class="badge badge-pill badge-info">※새로 파일을 첨부하시면 기존의 첨부파일은 삭제됩니다.</span></span>
  		</div>
		<div class="divMT divMB">
			<div id="attachedFileInDB"></div>
		</div>
		
		<div class="divMT divMB">
			<div id="gyeoljaeFileUp" style="width:300px;">등록</div>
		</div>
  		<div class="divMT">
  			<button type="button" class="btn btn-primary btn-sm" id="btnModifySangsin">상신수정</button>
  			<button type="button" class="btn btn-danger btn-sm" id="btnDeleteSangsin">상신삭제</button>
  		</div>
  		
  		<input type="hidden" id="lines" value='${lines}' />
  		<input type="hidden" id="hdnContent" value="${sangsin.content}" />
  		<input type="hidden" id="hdnSangsinNum" value="${sangsinNum}" />
  		<input type="hidden" id="hdnAttachFile" value='${attachFile}' />
	</form>
	</div>
</body>