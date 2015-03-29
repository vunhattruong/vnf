package com.nlu.vnf.model;

public class Location {
	private double lat, lon;

	public Location() {
		// TODO Auto-generated constructor stub
	}

	public Location(double lat, double lon) {
		super();
		this.lat = lat;
		this.lon = lon;
	}

	public double getLat() {
		return lat;
	}

	public void setLat(double lat) {
		this.lat = lat;
	}

	public double getLon() {
		return lon;
	}

	public void setLon(double lon) {
		this.lon = lon;
	}

	@Override
	public String toString() {
		return "Location [lat=" + lat + ", lon=" + lon + "]";
	}

}
