package kr.co.drpnd.dao;

import java.util.List;
import java.util.Map;

import kr.co.drpnd.domain.CalendarCategory;
import kr.co.drpnd.domain.CalendarEvent;

public interface CalendarDao {

	void insertCalendarEvents(Map<String, Object> m);

	List<CalendarEvent> selectCalendarDataList(Map param);

	List<CalendarCategory> selectCalendarCategory();

	void updateCalendarEvents(Map<String, Object> m);

	void deleteCalendarEvents(Map<String, Object> m);

}
