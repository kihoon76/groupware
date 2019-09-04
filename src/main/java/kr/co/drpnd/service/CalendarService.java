package kr.co.drpnd.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import kr.co.drpnd.dao.CalendarDao;
import kr.co.drpnd.domain.CalendarCategory;
import kr.co.drpnd.domain.CalendarEvent;
import kr.co.drpnd.domain.ConferenceReservation;
import kr.co.drpnd.domain.HolidayFlexible;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.exception.InvalidReservationTime;
import kr.co.drpnd.exception.InvalidUser;
import kr.co.drpnd.type.ExceptionCode;
import kr.co.drpnd.util.SessionUtil;

@Service("calendarService")
public class CalendarService {

	@Resource(name="CalendarDao")
	CalendarDao calendarDao;
	
	@Value("${colorCfg['mine_bg_color']}")
	String bgColor;
	
	@Value("${colorCfg['mine_txt_color']}")
	String txtColor;
	
	@Transactional(isolation=Isolation.DEFAULT, 
			   propagation=Propagation.REQUIRED, 
			   rollbackFor=Exception.class,
			   timeout=10)//timeout 초단위
	public void saveCalendar(List<CalendarEvent> list) {
		
		
		List<CalendarEvent> addL = null;
		List<CalendarEvent> modL = null;
		List<CalendarEvent> delL = null;
		
		Sawon sawon = SessionUtil.getSessionSawon();
		String sawonCode = sawon.getSawonCode();
		
		for(CalendarEvent cal : list) {
			if(cal.isNew()) { //새로 추가된 것
				if(addL == null) {
					addL = new ArrayList<CalendarEvent>();
				}
				
				//prefix 제거
				cal.setTitle(cal.getTitle().substring(cal.getTitle().indexOf("_") + 1));
				if(cal.getCate() != null) addL.add(cal);
			}
			else if(cal.isModify()) { //수정된 것
				if(modL == null) {
					modL = new ArrayList<CalendarEvent>();
				}
				
				cal.setTitle(cal.getTitle().substring(cal.getTitle().indexOf("_") + 1));
				
				if(cal.getCate() != null) modL.add(cal);
			}
			else if(cal.isDelete()) {
				if(delL == null) {
					delL = new ArrayList<CalendarEvent>();
				}
				
				if(cal.getCate() != null) delL.add(cal);
			}
		}
		
		if(addL != null) {
			Map<String, Object> m = new HashMap<String, Object>();
			
			m.put("code", sawonCode);
			m.put("list", addL);
			m.put("cate", addL.get(0).getCate());
			m.put("isDesigner", SessionUtil.hasAuthority("ROLE_DESIGN_ADMIN") ? "Y":"N");
			calendarDao.insertCalendarEvents(m);
		}
		
		if(modL != null) {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("code", sawonCode);
			m.put("list", modL);
			m.put("cate", modL.get(0).getCate());
			
			//C05 디자인일정에서 디자이너 권한을 받은 사원은 모든사원이 작성한 일정을 수정할수 있다.
			//m.put("isDesigner", SessionUtil.hasAnyAuthority("ROLE_DESIGN", "ROLE_DESIGN_ADMIN") ? "Y":"N");
			m.put("isDesigner", SessionUtil.hasAuthority("ROLE_DESIGN_ADMIN") ? "Y":"N");
			calendarDao.updateCalendarEvents(m);
		}
		
		if(delL != null) {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("code", sawonCode);
			m.put("cate", delL.get(0).getCate());
			m.put("list", delL);
			m.put("isDesigner", SessionUtil.hasAuthority("ROLE_DESIGN_ADMIN") ? "Y":"N");
			calendarDao.deleteCalendarEvents(m);
		}
	}

	public Map<String, List<Map<String, Object>>> getCalendarData(Map param) {
		
		if("C02".equals(String.valueOf(param.get("cate")))) {
			String sDate = String.valueOf(param.get("startDate"));
			sDate = sDate.substring(0, 8) + "01";
			param.put("startDate", sDate);
		}
		List<CalendarEvent> list = calendarDao.selectCalendarDataList(param);
		
		Map<String, List<Map<String, Object>>> m = null;
		
		int cnt = list.size();
		
		if(cnt > 0) {
			m = new HashMap<String, List<Map<String,Object>>>();
			String cate = null;
			Map<String, Object> map = null;
			CalendarEvent cal = null
					;
			for(int i = 0; i < cnt; i++) {
				cal = list.get(i);
				cate = cal.getCate();
				if(m.get(cate) == null) {
					m.put(cate, new ArrayList<Map<String,Object>>());
				}
				
				map = new HashMap<String, Object>();
				map.put("start", cal.getStart());
				map.put("end", cal.getEnd());
				map.put("title", cal.getTitle());
				map.put("id", cal.getId());
				map.put("cate", cal.getCate());
				map.put("cateMonth", param.get("cateMonth"));
				map.put("mine", cal.getMine());
				//근태/회사일정은  editable false
				if("C01".equals(param.get("cate")) || "C04".equals(param.get("cate"))) {
					map.put("editable", false);
				}
				else {
					//휴가일 경우 결재완료된 것은 수정불가
					if("C02".equals(param.get("cate"))) {
						if("Y".equals(cal.getConfirm())) {
							map.put("editable", false);
							map.put("confirm", "Y");
						}
						else {
							map.put("editable", ("Y".equals(cal.getMine()) ? true : false));
							map.put("confirm", "N");
						}
					}
					else if("C05".equals(param.get("cate"))) {
						if("Y".equals(cal.getMine())) {
							map.put("editable", true);
						}
						else {
							//map.put("editable", (SessionUtil.hasAnyAuthority("ROLE_DESIGN", "ROLE_DESIGN_ADMIN") ? true : false));
							map.put("editable", (SessionUtil.hasAuthority("ROLE_DESIGN_ADMIN") ? true : false));
						}
						
						map.put("sawonCode", cal.getSawonCode());
					}
					else {
						map.put("editable", ("Y".equals(cal.getMine()) ? true : false));
					}
				}
				
				map.put("isNew", false);
				map.put("isModify", false);
				map.put("isDelete", false);
				map.put("isDb", true);
				map.put("allDay", true);
				map.put("description", cal.getDescription());
				
				if("Y".equals(cal.getMine())) {
					map.put("backgroundColor", bgColor);
					map.put("textColor", txtColor);
					map.put("borderColor", bgColor);
				}
				else {
					map.put("backgroundColor", cal.getBgColor());
					map.put("textColor", cal.getTxtColor());
					map.put("borderColor", cal.getBorderColor());
				}
			
				m.get(cate).add(map);
			}
		}
		
		return m;
	}

	public List<CalendarCategory> getCalendarCategory() {
		return calendarDao.selectCalendarCategory();
	}

	public void reserveConference(ConferenceReservation cr) {
		//이미 예약된 시간인지 체크
		int r = calendarDao.selectInReservation(cr);
		if(r > 0)  throw new InvalidReservationTime(ExceptionCode.INVALID_RESERVATION_Time.getMsg());
		calendarDao.insertConferenceReservation(cr);
		
	}

	public List<Map<String, String>> getConferenceReservationList(Map<String, String> param) {
		return calendarDao.selectConferenceReservationList(param);
	}

	public void modifyReserveConference(ConferenceReservation cr) {
		//이미 예약된 시간인지 체크
		int r = calendarDao.selectInReservation(cr);
		if(r > 0)  throw new InvalidReservationTime(ExceptionCode.INVALID_RESERVATION_Time.getMsg());
				
		r = calendarDao.updateConferenceReservation(cr);
		
		if(r !=1) throw new InvalidUser(ExceptionCode.INVALID_RESERVATION_USER.getMsg());
	}

	public void removeReserveConference(ConferenceReservation cr) {
		int r = calendarDao.deleteReserveConference(cr);
		
		if(r != 1) throw new InvalidUser(ExceptionCode.INVALID_RESERVATION_USER.getMsg());
	}

	public Map<String, String> getPlanContent(Map<String, String> param) {
		return calendarDao.selectPlanContent(param);
	}
	
	public Map<String, String> getPlanContentInDayAll(Map<String, String> param) {
		List<Map<String, String>> list = calendarDao.selectPlanContentInDayAll(param);
		int size = list.size();
		
		Map<String, String> resultMap = new HashMap<>();
		if(size > 0) {
			resultMap.put("sawonName", list.get(0).get("sawonName"));
			
			StringBuilder sb = new StringBuilder();
			for(int i=0; i<size; i++) {
				sb.append("------------------------------------" + list.get(i).get("title") + "------------------------------------");
				sb.append(System.lineSeparator());
				sb.append(list.get(i).get("detail"));
				sb.append(System.lineSeparator());
				sb.append(System.lineSeparator());
			}
			
			resultMap.put("detail", sb.toString());
		}
		
		return resultMap;
	}

	public String getTodayConferenceReservationCount() {
		return calendarDao.selectTodayConferenceReservationCount();
	}

	public List<Map<String, String>> getMyPlanThisMonthMobile(Map<String, String> param) {
		List<Map<String, String>> list = calendarDao.selectMyPlanThisMonthMobile(param);
		
		int size = list.size();
		if(size > 0) {
			List<Map<String, String>> rList = new ArrayList<>();
			String begin = "";
			for(int i=0; i<size; i++) {
				if(begin.equals(list.get(i).get("begin"))) {
					//이전거 꺼내서 summary 합친다.
					String s = rList.get(rList.size()-1).get("summary");
					s = s  + System.lineSeparator() + "------------------------------" + System.lineSeparator();
					s = s + list.get(i).get("summary");
					rList.get(rList.size()-1).put("summary", s);
					rList.get(rList.size()-1).put("union", "Y");
				}
				else {
					begin = list.get(i).get("begin");
					rList.add(list.get(i));
				}
				
			}
			
			return rList;
		}
		
		return list;
	}

	public void regMyPlanByMobile(Map<String, String> param) {
		calendarDao.insertMyPlanByMobile(param);
	}

	@Transactional(isolation=Isolation.DEFAULT, 
			   propagation=Propagation.REQUIRED, 
			   rollbackFor=Exception.class,
			   timeout=10)//timeout 초단위
	public boolean removeMyPlanByMobile(Map<String, String> param) {
		return 1 == calendarDao.deleteMyPlanByMobile(param);
	}

	public List<Map<String, Object>> getCompanyEventsList() {
		return calendarDao.selectCompanyEventsList();
	}

	public List<HolidayFlexible> getHolidayFlexibleList(String year) {
		return calendarDao.selectHolidayFlexibleList(year);
	}


}
