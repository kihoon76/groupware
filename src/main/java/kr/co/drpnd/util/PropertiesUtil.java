package kr.co.drpnd.util;

import java.io.IOException;
import java.util.Properties;

public class PropertiesUtil {

	private static final String ROOT = "config/";
	
	public static Properties getProperties(String name) throws IOException {
		String resource = ROOT + name + ".properties";
		Properties properties = new Properties();
		
		properties.load(PropertiesUtil.class.getClassLoader().getResourceAsStream(resource));
		return properties;
	}
}
