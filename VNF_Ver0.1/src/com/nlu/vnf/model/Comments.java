package com.nlu.vnf.model;

public class Comments {
	private String username;
	private String detail;

	public Comments() {
		// TODO Auto-generated constructor stub
	}

	public Comments(String username, String detail) {
		super();
		this.username = username;
		this.detail = detail;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}

	@Override
	public String toString() {
		return "Comments [username=" + username + ", detail=" + detail + "]";
	}

}
