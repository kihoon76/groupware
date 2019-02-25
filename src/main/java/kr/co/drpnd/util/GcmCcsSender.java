package kr.co.drpnd.util;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component("GcmCcsSender")
public class GcmCcsSender {
	 	private static final Logger LOG = LoggerFactory.getLogger(GcmCcsSender.class);
	 
	    private static final long senderId = 1;//{SENDER_ID};
	    private static final String password = "{PASSWORD}";
	    private SmackCcsClient mCssClient = new SmackCcsClient();
	 
	    @PostConstruct
	    public void init() {
	        try {
	            mCssClient.connect(senderId, password);
	        } catch (Exception e) {
	            LOG.error(e.getLocalizedMessage());
	        }
	    }
	 
	    @Async
	    public void send(String registrationId, String message) {
	        try {
	            Map<String, String> payload = new HashMap<String, String>();
	            payload.put("msg", message);
	 
	            String jsonMessage = mCssClient.createJsonMessage(registrationId, mCssClient.nextMessageId(), payload, "", 10000L, true);
	            mCssClient.sendDownstreamMessage(jsonMessage);
	        } catch (Exception e) {
	            LOG.error(e.getLocalizedMessage());
	        }
	    }
}
