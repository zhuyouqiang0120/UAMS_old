package com.zens.adms.model;

import com.jfinal.plugin.activerecord.Record;

import spin.common.model.Entity;
import spin.common.service.CacheFactory;

/**
 * 用户数据交互
 * @author huyi@zensvision.com
 */
public class User extends Entity {
	public static final String INDEX = "user";
	public static final String SESSION_USER = "loginUser";
	
	public User() {
		super( CacheFactory.getCacheTableByRoute(INDEX) );
	}
	
	public boolean isExistUser(String username, String passwd){
		Record record = getEntityByKey("Username", username);
		System.out.println(passwd);
		System.out.println(passwd);
		return record.getStr("Password").equals(passwd);
	}
	
	public static String convertMD5(String inStr){  
		  
        char[] a = inStr.toCharArray();  
        for (int i = 0; i < a.length; i++){  
            a[i] = (char) (a[i] ^ 't');  
        }  
        String s = new String(a);  
        return s;  
  
    }
	
	public static void main(String[] args) {
		System.out.println(convertMD5(convertMD5("e10adc3949ba59abbe56e057f20f883e")));
	}
}
