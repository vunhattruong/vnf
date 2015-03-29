package com.nlu.vnf.adapter;

import java.util.List;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;

import com.android.volley.toolbox.ImageLoader;
import com.android.volley.toolbox.NetworkImageView;
import com.nlu.controller.AppController;
import com.nlu.vnf.R;
import com.nlu.vnf.model.Comments;
import com.nlu.vnf.model.Dishes;
import com.nlu.vnf.model.Location;
import com.nlu.vnf.model.Restaurant;

public class CustomListAdapter extends BaseAdapter {
	private Activity activity;
	private LayoutInflater inflater;
	private List<Restaurant> restaurantItems;
	ImageLoader imageLoader = AppController.getInstance().getImageLoader();

	public CustomListAdapter(Activity activity,
			List<Restaurant> restaurantItems, Context ctx) {
		super();
		this.activity = activity;
		this.restaurantItems = restaurantItems;
	}

	@Override
	public int getCount() {
		return restaurantItems.size();
	}

	@Override
	public Object getItem(int location) {
		return restaurantItems.get(location);
	}

	@Override
	public long getItemId(int location) {
		return location;
	}

	@SuppressLint("InflateParams")
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {

		if (inflater == null)
			inflater = (LayoutInflater) activity
					.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		if (convertView == null)
			convertView = inflater.inflate(R.layout.list_row, null);

		if (imageLoader == null)
			imageLoader = AppController.getInstance().getImageLoader();
		NetworkImageView imageShop = (NetworkImageView) convertView
				.findViewById(R.id.imgShop);
		TextView city = (TextView) convertView.findViewById(R.id.tvCity);
		TextView name = (TextView) convertView.findViewById(R.id.tvName);
		TextView phone = (TextView) convertView.findViewById(R.id.tvPhone);
		TextView address = (TextView) convertView.findViewById(R.id.tvAddress);
		TextView location = (TextView) convertView
				.findViewById(R.id.tvLocation);
		TextView ocTime = (TextView) convertView.findViewById(R.id.tvOcTime);
		TextView rate = (TextView) convertView.findViewById(R.id.tvRate);
		TextView dishes = (TextView) convertView.findViewById(R.id.tvDishes);
		TextView comments = (TextView) convertView
				.findViewById(R.id.tvComments);
		TextView price = (TextView) convertView.findViewById(R.id.tvPrice);

		// getting restaurant data for the row
		Restaurant restaurant = restaurantItems.get(position);

		// imageShop image
		imageShop.setImageUrl(restaurant.getImageShop(), imageLoader);

		// city
		city.setText(restaurant.getCity());

		// name
		name.setText(restaurant.getName());

		// phone
		phone.setText(restaurant.getPhone());

		// address
		address.setText(restaurant.getAddress());

		// location
		String locationStr = "";
		for (Location resStr : restaurant.getArrayLocation()) {
			locationStr += resStr.getLat() + ":" + resStr.getLon();
		}
		location.setText(locationStr);

		// OcTime
		ocTime.setText(restaurant.getOcTime());

		// Rate
		rate.setText(restaurant.getRate());

		// Price
		price.setText(restaurant.getPrice());

		// Dishes
		String dishStr = "";
		for (Dishes resStr : restaurant.getArrayDishes()) {
			dishStr += resStr.getName() + ":" + resStr.getImgURL() + ":"
					+ resStr.getPrice();
		}
		dishes.setText(dishStr);

		// Comments
		String commentStr = "";
		for (Comments comStr : restaurant.getArrayComments()) {
			commentStr += comStr.getUsername() + ":" + comStr.getDetail();
		}
		comments.setText(commentStr);

		return convertView;
	}
}
