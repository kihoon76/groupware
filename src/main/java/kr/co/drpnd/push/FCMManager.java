package kr.co.drpnd.push;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URL;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.List;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import kr.co.drpnd.util.StringUtil;

public class FCMManager {

	private static FCMManager mFCMManager = null;
	private String mUrl = "https://fcm.googleapis.com/fcm/send";	//request URL
	private String mServerKey = "AIzaSyB851VQL9Bmj8QpFaF4W06ZgHiuquZBeQQ"; //api key
	private HttpsURLConnection httpConnection = null;				// HTTP object
	private OutputStream os = null;
	private BufferedReader in = null;

	public static FCMManager getInstance(){

		if(mFCMManager == null){
			mFCMManager = new FCMManager();
		}

		return mFCMManager;
	}


	/**
	 * no exist url param
	 * @return Boolean IS SUCCESS
	 */

//	public FCMVo postFCM(String title, String text) throws Exception{
//		return postFCM(mUrl, title, text, null);
//	}
	
	public FCMVo postFCM(List<String> mDeviceTokenList, String title, String text, Map<String, String> payload) throws Exception{
		FCMVo fcmVO = new FCMVo();

		if(StringUtil.isNull(title)){
			fcmVO.setErrorMsg("Empty title");
			return fcmVO;
		}

		try{

			URL conUrl = new URL(mUrl);
			httpConnection = (HttpsURLConnection) conUrl.openConnection();
			httpConnection.setSSLSocketFactory(createSslSocketFactory());

			httpConnection.setRequestMethod("POST");
			httpConnection.setRequestProperty("Authorization", "key=" + mServerKey); //server key
			httpConnection.setRequestProperty("Content-Type", "application/json");
			httpConnection.setDoInput(true);
			httpConnection.setDoOutput(true);

			JSONObject bodyJson = new JSONObject();
			JSONObject postJson = new JSONObject();
			JSONObject payloadJson = new JSONObject();

			bodyJson.put("title", title);
			bodyJson.put("text", text);
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
			os = httpConnection.getOutputStream();
			os.write(postStringData.getBytes("UTF-8"));

			// For POST only - END
			int responseCode = httpConnection.getResponseCode();
			if(responseCode != HttpsURLConnection.HTTP_OK){
				fcmVO.setErrorMsg("FAIL FCM STATUS CODE = " + responseCode);
			}

			BufferedReader in = new BufferedReader(new InputStreamReader(httpConnection.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}

			String resultStr = response.toString();
			JSONParser parser = new JSONParser();
			JSONObject resultJson = (JSONObject)parser.parse(resultStr);

			long isSuccess = (Long)resultJson.get("success");

			if(isSuccess > 0){
				fcmVO.setSuccess(true);
			} 
			else {
				fcmVO.setSuccess(false);
			}

			fcmVO.setResultStr(resultStr);

		} 
		catch (Exception e){
			e.printStackTrace();
		} 
		finally{
			if(os != null){
				os.flush();
				os.close();
			}

			if(in != null){
				in.close();
			}
		}

		return fcmVO;

	}

	private static SSLSocketFactory createSslSocketFactory() throws Exception {
		TrustManager[] byPassTrustManagers = new TrustManager[] { new X509TrustManager() {
			@Override
			public X509Certificate[] getAcceptedIssuers() {
				return new X509Certificate[0];
			}

			@Override
			public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {}

			@Override
			public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {}

		} };

		SSLContext sslContext = SSLContext.getInstance("TLS");
		sslContext.init(null, byPassTrustManagers, new SecureRandom());

		return sslContext.getSocketFactory();
	}
}
