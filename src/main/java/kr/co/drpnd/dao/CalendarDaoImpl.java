package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import kr.co.drpnd.domain.CalendarCategory;
import kr.co.drpnd.domain.CalendarEvent;
import kr.co.drpnd.domain.ConferenceReservation;
import kr.co.drpnd.domain.HolidayFlexible;

@Repository("CalendarDao")
public class CalendarDaoImpl implements CalendarDao {

	private final static String namespace = "mappers.calendarMapper";
	
	@Resource(name = "msSqlSession")
	SqlSession msSqlSession;
	
	@Override
	public void insertCalendarEvents(Map<String, Object> map) {
		msSqlSession.insert(namespace + ".insertCalendarEvents", map);
		
	}

	@Override
	public List<CalendarEvent> selectCalendarDataList(Map param) {
		return msSqlSession.selectList(namespace + ".selectCalendarDataList", param);
	}

	@Override
	public List<CalendarCategory> selectCalendarCategory() {
		return msSqlSession.selectList(namespace + ".selectCalendarCategory");
	}

	@Override
	public void updateCalendarEvents(Map<String, Object> m) {
		msSqlSession.update(namespace + ".updateCalendarEvents", m);
		
	}

	@Override
	public void deleteCalendarEvents(Map<String, Object> m) {
		msSqlSession.delete(namespace + ".deleteCalendarEvents", m);
	}

	@Override
	public void insertConferenceReservation(ConferenceReservation cr) {
		msSqlSession.insert(namespace + ".insertConferenceReservation", cr);
		
	}

	@Override
	public int selectInReservation(ConferenceReservation cr) {
		return msSqlSession.selectOne(namespace + ".selectInReservation", cr);
	}

	@Override
	public List<Map<String, String>> selectConferenceReservationList(Map<String, String> param) {
		return msSqlSession.selectList(namespace + ".selectConferenceReservationList", param);
	}

	@Override
	public int updateConferenceReservation(ConferenceReservation cr) {
		return msSqlSession.update(namespace + ".updateConferenceReservation", cr);
	}

	@Override
	public int deleteReserveConference(ConferenceReservation cr) {
		return msSqlSession.delete(namespace + ".deleteReserveConference", cr);
	}

	@Override
	public Map<String, String> selectPlanContent(Map<String, String> param) {
		return msSqlSession.selectOne(namespace + ".selectPlanContent", param);
	}

	@Override
	public String selectTodayConferenceReservationCount() {
		return msSqlSession.selectOne(namespace + ".selectTodayConferenceReservationCount");
	}

	@Override
	public List<Map<String, String>> selectPlanContentInDayAll(Map<String, String> param) {
		return msSqlSession.selectList(namespace + ".selectPlanContentInDayAll", param);
	}

	@Override
	public List<Map<String, String>> selectMyPlanThisMonthMobile(Map<String, String> param) {
		return msSqlSession.selectList(namespace + ".selectMyPlanThisMonthMobile", param);
	}

	@Override
	public void insertMyPlanByMobile(Map<String, String> param) {
		msSqlSession.insert(namespace + ".insertMyPlanByMobile", param);
	}

	@Override
	public int deleteMyPlanByMobile(Map<String, String> param) {
		return msSqlSession.delete(namespace + ".deleteMyPlanByMobile", param);
	}

	@Override
	public List<Map<String, Object>> selectCompanyEventsList() {
		return msSqlSession.selectList(namespace + ".selectCompanyEventsList");
	}

	@Override
	public List<HolidayFlexible> selectHolidayFlexibleList(String year) {
		return msSqlSession.selectList(namespace + ".selectHolidayFlexibleList", year);
	}

}
