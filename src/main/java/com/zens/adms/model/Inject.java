package com.zens.adms.model;

import com.jfinal.plugin.activerecord.Record;

import spin.common.util.GUIDCreateUT;
import spin.common.util.TimeUT;

public class Inject {
	private String style;

	public Inject(String style) {
		this.style = style;
	}

	public String getStyle() {
		return style;
	}

	public void setStyle(String style) {
		this.style = style;
	}

	public synchronized boolean upload(Record record) {
		Media media = new Media();
		record.set("CreateTime", TimeUT.getCurrTime()).set("GUID", GUIDCreateUT.guid()).set("InjectStyle", style).set("Desc", record.get("Intro"));
		return media.uploadMedia(record);
	}
}
