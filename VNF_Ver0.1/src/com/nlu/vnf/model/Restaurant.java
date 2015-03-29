package com.nlu.vnf.model;

import java.util.ArrayList;
import java.util.List;

public class Restaurant {
	private String city, name, phone, address, imageShop, ocTime, price;
	private int rate;
	private List<Location> arrayLocation = new ArrayList<Location>();
	private List<Dishes> arrayDishes = new ArrayList<Dishes>();
	private List<Comments> arrayComments = new ArrayList<Comments>();

	public Restaurant() {
		// TODO Auto-generated constructor stub
	}

	public Restaurant(String city, String name, String phone, String address,
			String imageShop, String ocTime, String price, int rate,
			List<Location> arrayLocation, List<Dishes> arrayDishes,
			List<Comments> arrayComments) {
		super();
		this.city = city;
		this.name = name;
		this.phone = phone;
		this.address = address;
		this.imageShop = imageShop;
		this.ocTime = ocTime;
		this.price = price;
		this.rate = rate;
		this.arrayLocation = arrayLocation;
		this.arrayDishes = arrayDishes;
		this.arrayComments = arrayComments;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getImageShop() {
		return imageShop;
	}

	public void setImageShop(String imageShop) {
		this.imageShop = imageShop;
	}

	public String getOcTime() {
		return ocTime;
	}

	public void setOcTime(String ocTime) {
		this.ocTime = ocTime;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public int getRate() {
		return rate;
	}

	public void setRate(int rate) {
		this.rate = rate;
	}

	public List<Location> getArrayLocation() {
		return arrayLocation;
	}

	public void setArrayLocation(List<Location> arrayLocation) {
		this.arrayLocation = arrayLocation;
	}

	public List<Dishes> getArrayDishes() {
		return arrayDishes;
	}

	public void setArrayDishes(List<Dishes> arrayDishes) {
		this.arrayDishes = arrayDishes;
	}

	public List<Comments> getArrayComments() {
		return arrayComments;
	}

	public void setArrayComments(List<Comments> arrayComments) {
		this.arrayComments = arrayComments;
	}

}
