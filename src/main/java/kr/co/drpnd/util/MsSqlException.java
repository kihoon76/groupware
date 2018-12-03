package kr.co.drpnd.util;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.CannotAcquireLockException;
import org.springframework.dao.CannotSerializeTransactionException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DeadlockLoserDataAccessException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.InvalidResultSetAccessException;

public class MsSqlException {

	public static Map<String, Object> getErrorCode(Exception ex) {
		Map<String, Object> resultMap = new HashMap<>();
		
		SQLException se = null;
		if(ex instanceof BadSqlGrammarException) {
			se = ((BadSqlGrammarException) ex).getSQLException();
			resultMap.put("code", se.getErrorCode());
			resultMap.put("msg", se.getMessage());
		}
		else if (ex instanceof InvalidResultSetAccessException) {
			se = ((InvalidResultSetAccessException) ex).getSQLException();
			resultMap.put("code", se.getErrorCode());
			resultMap.put("msg", se.getMessage());
		}
		else if (ex instanceof DuplicateKeyException) {
			resultMap.put("code", 10000);
			resultMap.put("msg", ex.getMessage());
		}
		else if (ex instanceof DataIntegrityViolationException) {
			resultMap.put("code", 10001);
			resultMap.put("msg", ex.getMessage());
		}
		else if (ex instanceof DataAccessResourceFailureException) {
			resultMap.put("code", 10002);
			resultMap.put("msg", ex.getMessage());
		}
		else if (ex instanceof CannotAcquireLockException) {
			resultMap.put("code", 10003);
			resultMap.put("msg", ex.getMessage());
		}
		else if (ex instanceof DeadlockLoserDataAccessException) {
			resultMap.put("code", 10004);
			resultMap.put("msg", ex.getMessage());

		}
		else if (ex instanceof CannotSerializeTransactionException) {
			resultMap.put("code", 10005);
			resultMap.put("msg", ex.getMessage());
		}
		else {
			resultMap.put("code", 10006);
			resultMap.put("msg", ex.getMessage());
		}
		
		return resultMap;
	}
}
