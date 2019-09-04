package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import kr.co.drpnd.domain.CalendarCategory;
import kr.co.drpnd.domain.CalendarEvent;
import kr.co.drpnd.domain.ConferenceReservation;
import kr.co.drpnd.domain.HolidayFlexible;

public interface CalendarDao {

	void insertCalendarEvents(Map<String, Object> m);

	List<CalendarEvent> selectCalendarDataList(Map param);

	List<CalendarCategory> selectCalendarCategory();

	void updateCalendarEvents(Map<String, Object> m);

	void deleteCalendarEvents(Map<String, Object> m);

	void insertConferenceReservation(ConferenceReservation cr);

	int selectInReservation(ConferenceReservation cr);

	List<Map<String, String>> selectConferenceReservationList(Map<String, String> param);

	int updateConferenceReservation(ConferenceReservation cr);

	int deleteReserveConference(ConferenceReservation cr);

	Map<String, String> selectPlanContent(Map<String, String> param);
	
	List<Map<String, String>> selectPlanContentInDayAll(Map<String, String> param);

	String selectTodayConferenceReservationCount();

	List<Map<String, String>> selectMyPlanThisMonthMobile(Map<String, String> param);

	void insertMyPlanByMobile(Map<String, String> param);

	int deleteMyPlanByMobile(Map<String, String> param);

	List<Map<String, Object>> selectCompanyEventsList();

	List<HolidayFlexible> selectHolidayFlexibleList(String year);

}
