package kr.co.drpnd.dao;

import java.util.List;

public interface CodeDao {

	List<Object> selectDepartment();

	List<Object> selectTeam(String pCode);

	List<Object> selectPosition();

	List<Object> selectOverwork();

	List<Object> selectGyeoljae();

}
