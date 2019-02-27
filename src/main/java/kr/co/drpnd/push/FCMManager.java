package kr.co.drpnd.push;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import kr.co.drpnd.util.PropertiesUtil;
import kr.co.drpnd.util.StringUtil;
import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

@Component("fcmManager")
public class FCMManager {

	private static String mUrl =  null; //"https://fcm.googleapis.com/fcm/send";	//request URL
	private static String mServerKey = null;
	private static Logger logger = LoggerFactory.getLogger(FCMManager.class); 
	
	public FCMManager() {
		try {
			Properties p = PropertiesUtil.getProperties("fcm");
			mServerKey = p.getProperty("server_key");
			mUrl = p.getProperty("server_url");
		} 
		catch (IOException e) {
			logger.error(e.getMessage());
		}
	}
	
	public void postFCM(List<String> mDeviceTokenList, String title, String text, FCMLog fcmLog) {
		postFCM(mDeviceTokenList, title, text, null, fcmLog);
	}
	
	public void postFCM(List<String> mDeviceTokenList, String title, String text, Map<String, String> payload, final FCMLog fcmLog) {
		if(StringUtil.isNull(mUrl) || StringUtil.isNull(mServerKey) || StringUtil.isNull(title)) {
			logger.error("Empty fcm url or title or mServerKey");
			return;
		}
		
		JSONObject bodyJson = new JSONObject();
		JSONObject postJson = new JSONObject();
		JSONObject payloadJson = new JSONObject();

		bodyJson.put("title", title);
		bodyJson.put("body", text);
		postJson.put("notification", bodyJson);

		int size = mDeviceTokenList.size();

		if(size > 1) {
			JSONArray rid = new JSONArray();

			for(String data : mDeviceTokenList){
				rid.add(data);
			}
			
			postJson.put("registration_ids", rid);
		}
		else {
			postJson.put("to", mDeviceTokenList.get(0));
		}

		//payload setting
		if(payload != null){
			for(String key : payload.keySet()){
				payloadJson.put(key, payload.get(key));
			}
			postJson.put("data", payloadJson);
		}

		String postStringData = postJson.toJSONString();
		
		OkHttpClient client = new OkHttpClient();
		final MediaType mediaType = MediaType.parse("application/json;charset=utf-8");
		RequestBody body = RequestBody.create(mediaType, postStringData);
		Request request = new Request.Builder()
                .url(mUrl)
                .post(body)
                .addHeader("Authorization", "key=" + mServerKey)
                .build();
		
		client.newCall(request).enqueue(new Callback() {
			
			@Override
			public void onResponse(Call call, Response response) throws IOException {
				if(!response.isSuccessful()) {
					//System.err.println(response.message());
					if(fcmLog != null)
					fcmLog.writeLog(mDeviceTokenList, title, text, "N", response.message());
				}
				else {
					//System.err.println(response.body().string());
					if(fcmLog != null)
					fcmLog.writeLog(mDeviceTokenList, title, text, "Y", response.body().string());
				}
			}
			
			@Override
			public void onFailure(Call call, IOException e) {
				e.printStackTrace();
				
			}
		}); 
			
			
		
		
	}
}
