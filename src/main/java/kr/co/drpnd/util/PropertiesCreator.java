package kr.co.drpnd.util;

import java.io.IOException;
import java.io.InputStream;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.Collection;
import java.util.Properties;

import javax.net.ssl.TrustManager;
import javax.net.ssl.TrustManagerFactory;
import javax.net.ssl.X509TrustManager;

public class PropertiesCreator {

	private static final String ROOT = "config/";
	private static final String CERTS_ROOT = "certs/";
	
	public static Properties getProperties(String name) {
		String resource = ROOT + name + ".properties";
		
		Properties properties = new Properties();
		
		try {
			properties.load(PropertiesCreator.class.getClassLoader().getResourceAsStream(resource));
		} 
		catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return properties;
	}
	
	public static X509TrustManager trustManagerForCertificates(String name) {
		
		InputStream caInput = PropertiesCreator.class.getClassLoader().getResourceAsStream(CERTS_ROOT + name);
		Certificate ca = null;
		X509TrustManager x509TrustManager = null;
		
		try {
			CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
			ca = certificateFactory.generateCertificate(caInput);
			if(ca == null) return null;
			
			// Create a KeyStore containing our trusted CAs
			String keyStoreType = KeyStore.getDefaultType();
			KeyStore keyStore = KeyStore.getInstance(keyStoreType);
			keyStore.load(null,  null);
			
			keyStore.setCertificateEntry("ca", ca);
			
			//Create a TrustManager that trusts the CAs in our KeyStore
			String tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
			TrustManagerFactory tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
			tmf.init(keyStore);
			
			TrustManager[] trustManagers = tmf.getTrustManagers();
			
			 if (trustManagers.length != 1 || !(trustManagers[0] instanceof X509TrustManager)) {
				 System.err.println("Unexpected default trust managers:" + Arrays.toString(trustManagers));
			 }
			 else {
				 x509TrustManager =  (X509TrustManager) trustManagers[0];
			 }
		} 
		catch (CertificateException e) {
			e.printStackTrace();
		}
		catch (KeyStoreException e) {
			e.printStackTrace();
		}
        catch (NoSuchAlgorithmException | IOException e) {
			e.printStackTrace();
		}
		finally {
			if(caInput != null) {
				try {
					caInput.close();
				} 
				catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		
		return x509TrustManager;
	}
}
