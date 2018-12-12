package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import kr.co.drpnd.domain.CalendarCategory;
import kr.co.drpnd.domain.CalendarEvent;
import kr.co.drpnd.domain.ConferenceReservation;

public interface CalendarDao {

	void insertCalendarEvents(Map<String, Object> m);

	List<CalendarEvent> selectCalendarDataList(Map param);

	List<CalendarCategory> selectCalendarCategory();

	void updateCalendarEvents(Map<String, Object> m);

	void deleteCalendarEvents(Map<String, Object> m);

	void insertConferenceReservation(ConferenceReservation cr);

	int selectInReservation(ConferenceReservation cr);

	List<Map<String, String>> selectConferenceReservationList(Map<String, String> param);

}
