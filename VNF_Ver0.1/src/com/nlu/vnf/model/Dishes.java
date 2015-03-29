package com.nlu.vnf.model;

public class Dishes {
	private String name;
	private String imgURL;
	private String price;

	public Dishes() {
		// TODO Auto-generated constructor stub
	}

	public Dishes(String name, String imgURL, String price) {
		super();
		this.name = name;
		this.imgURL = imgURL;
		this.price = price;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getImgURL() {
		return imgURL;
	}

	public void setImgURL(String imgURL) {
		this.imgURL = imgURL;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

}
