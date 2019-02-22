package spin.common.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URLConnection;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.net.ssl.SSLContext;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.client.methods.RequestBuilder;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicHeader;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.ssl.SSLContextBuilder;
import org.apache.http.util.EntityUtils;

/**
 * http解析页面
 * 
 * @author huyi@zensvision.com
 * @date 2016年4月26日
 */
public class HttpClientUT {

    private CloseableHttpClient httpClient;
    private CloseableHttpResponse response;

    public HttpClientUT() {
        init();
    }

    public HttpClientUT(boolean userSSL) throws NoSuchAlgorithmException, KeyStoreException, KeyManagementException {
        if (userSSL)
            httpClient = createSSLClientDefault();
        else
            init();
    }

    private void init() {
        httpClient = HttpClientBuilder.create().build();
    }

    /**
     * get请求
     *
     * @param url
     * @return
     * @throws java.io.IOException
     */
    public String get(String url, boolean closed) throws IOException {
        getResponse(url);
        
        String html = "";
        if(response.getStatusLine().getStatusCode() == 200) {
            html = EntityUtils.toString(response.getEntity());
        }
        if( closed ){
        	close();
        }
        return html;
    }

    /**
     * get请求
     *
     * @param url
     * @return
     * @throws java.io.IOException
     */
    public byte[] getBytes(String url) throws IOException {
        getResponse(url);
        byte[] html = EntityUtils.toByteArray(response.getEntity());
        close();
        return html;
    }

    /**
     * 获取response
     *
     * @param url
     * @throws java.io.IOException
     */
	private void getResponse(String url) throws IOException {
        HttpGet get = new HttpGet(url);

        //设置header
        get.setHeaders(getHeader());
        response = httpClient.execute(get);
    }
	
	public String postXML(String xml, String url) throws ClientProtocolException, IOException{
		String res = "";
		HttpPost post = new HttpPost(url);
		
		post.setHeaders(getHeader());
		post.setEntity(new StringEntity(xml));
		HttpResponse response = httpClient.execute(post);
		
		if(response.getStatusLine().getStatusCode() == 200){
			close();
			res = EntityUtils.toString(response.getEntity());
		}
		return res;
	}
    /**
     * POST 请求
     * 
     * @param url
     * @param params 参数
     * @param paramEncode 参数编码
     * @param closed 是否关闭请求
     * @return
     * @throws IOException
     */
    public String post(String url, Map<String, String> params, String paramEncode, boolean closed) throws IOException {
        HttpPost httpPost = new HttpPost(url);
        //设置header
        httpPost.setHeaders(getHeader());

        List<BasicNameValuePair> nvps = new ArrayList<BasicNameValuePair>();
        for (Map.Entry<String,String> entry : params.entrySet()) {
            nvps.add(new BasicNameValuePair(entry.getKey(), entry.getValue()));
        }
        httpPost.setEntity(new UrlEncodedFormEntity(nvps, paramEncode != null ? paramEncode : "UTF-8"));

        response = httpClient.execute(httpPost);//获取响应消息实体
        String html = null;
        if(response.getStatusLine().getStatusCode() == 200) {
            html = EntityUtils.toString(response.getEntity());
        }
        if( closed ){
        	close();
        }

        return html;
    }

    public String login(String uri, Map<String, String> params) {
        try {
            RequestBuilder rb = RequestBuilder.post().setUri(new URI(uri));
            for (Map.Entry<String, String> entry : params.entrySet()) {
                rb.addParameter(entry.getKey(), entry.getValue());
            }
            HttpUriRequest login = rb.build();
            String html = EntityUtils.toString(httpClient.execute(login).getEntity());

            System.out.println(html);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        } catch (ClientProtocolException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * post请求
     *
     * @param url
     * @param params
     * @return
     * @throws java.io.IOException
     */
    public String get(String url, Map<String, String> params) throws IOException {
        StringBuilder sb = new StringBuilder(url);
        if (url.indexOf("?") == -1) {
            sb.append("?");
        }
        for (String key : params.keySet()) {
            sb.append("&").append(key).append("=").append(params.get(key));
        }
        HttpGet get = new HttpGet(sb.toString().replaceAll("\\s*|\t|\r|\n", ""));
        //设置header
        get.setHeaders(getHeader());
        response = httpClient.execute(get);

        String html = EntityUtils.toString(response.getEntity());

        close();
        return html;
    }
    
    /**
     * 关闭
     *
     * @throws java.io.IOException
     */
    private void close() throws IOException {
        response.close();
        httpClient.close();
    }

    /**
     * 创建ssl登陆
     * 用于https请求
     * @return
     */
    public CloseableHttpClient createSSLClientDefault() throws KeyStoreException, NoSuchAlgorithmException, KeyManagementException {
        SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(null, new TrustStrategy() {
            // 信任所有
            public boolean isTrusted(X509Certificate[] chain, String authType) throws CertificateException {
                return true;
            }
        }).build();
        return HttpClients.custom().setSSLSocketFactory(new SSLConnectionSocketFactory(sslContext)).build();
    }

    /**
     * header
     *
     * @return
     */
    public Header[] getHeader() {
        Header[] headers = new Header[7];
        headers[0] = new BasicHeader("Accept-Language","zh-CN,zh;q=0.8");
        headers[1] = new BasicHeader("Cache-Control", "no-cache");
        headers[2] = new BasicHeader("Accept","text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8;");
        headers[3] = new BasicHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36");
        headers[4] = new BasicHeader("Content-Type", "application/x-www-form-urlencoded");
        headers[5] = new BasicHeader("Accept-Encoding","gzip,deflate");
        headers[6] = new BasicHeader("Connection", "Keep-Alive"); //长连接

        return headers;
    }
    
    public String sendGet(String url, String param) {
		String result = "";
		BufferedReader in = null;
		try {
			String urlNameString = param == "" ? url : url + "?" + param;
			// System.out.println(urlNameString);
			URL realUrl = new URL(urlNameString);
			// 打开和URL之间的连接
			URLConnection connection = realUrl.openConnection();
			// 建立实际的连接
			connection.connect();
			// 定义 BufferedReader输入流来读取URL的响应
			in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "utf-8"));
			String line;
			while ((line = in.readLine()) != null) {
				result += line;
			}
		} catch (Exception e) {
			System.out.println("发送GET请求出现异常！" + e);
			//e.printStackTrace();
		}
		// 使用finally块来关闭输入流
		finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (Exception e2) {
				//e2.printStackTrace();
			}
		}
		return result;
	}

    
//    public static void main(String[] args) throws IOException {
//		System.out.println(new HttpClientHandler().sendGet("http://www.zgyb.cn/PD0607161314/PD0607161314.asp", "ASPSESSIONIDCQTQQTDA=JHOJEODAPIMPELLJBHOPALEB;"));
//	}
}