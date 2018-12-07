package kr.co.drpnd.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import kr.co.drpnd.dao.CalendarDao;
import kr.co.drpnd.domain.CalendarCategory;
import kr.co.drpnd.domain.CalendarEvent;
import kr.co.drpnd.domain.ConferenceReservation;
import kr.co.drpnd.domain.Sawon;
import kr.co.drpnd.util.SessionUtil;

@Service("calendarService")
public class CalendarService {

	@Resource(name="CalendarDao")
	CalendarDao calendarDao;
	
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
				
				addL.add(cal);
			}
			else if(cal.isModify()) { //수정된 것
				if(modL == null) {
					modL = new ArrayList<CalendarEvent>();
				}
				
				modL.add(cal);
			}
			else if(cal.isDelete()) {
				if(delL == null) {
					delL = new ArrayList<CalendarEvent>();
				}
				
				delL.add(cal);
			}
		}
		
		if(addL != null) {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("code", sawonCode);
			m.put("list", addL);
			calendarDao.insertCalendarEvents(m);
		}
		
		if(modL != null) {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("code", sawonCode);
			m.put("list", modL);
			calendarDao.updateCalendarEvents(m);
		}
		
		if(delL != null) {
			Map<String, Object> m = new HashMap<String, Object>();
			m.put("code", sawonCode);
			m.put("list", delL);
			calendarDao.deleteCalendarEvents(m);
		}
	}

	public Map<String, List<Map<String, Object>>> getCalendarData(Map param) {
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
				map.put("editable", ("Y".equals(cal.getMine()) ? true : false));
				map.put("isNew", false);
				map.put("isModify", false);
				map.put("isDelete", false);
				map.put("isDb", true);
				map.put("allDay", true);
				map.put("description", cal.getDescription());
			
				m.get(cate).add(map);
			}
		}
		
		return m;
	}

	public List<CalendarCategory> getCalendarCategory() {
		return calendarDao.selectCalendarCategory();
	}

	public void reserveConference(ConferenceReservation cr) {
		calendarDao.insertConferenceReservation(cr);
		
	}

}
