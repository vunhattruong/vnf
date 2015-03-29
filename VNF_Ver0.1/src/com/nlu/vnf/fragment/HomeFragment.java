package com.nlu.vnf.fragment;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Fragment;
import android.app.ProgressDialog;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ListView;

import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.VolleyLog;
import com.android.volley.toolbox.JsonArrayRequest;
import com.nlu.controller.AppController;
import com.nlu.vnf.R;
import com.nlu.vnf.adapter.CustomListAdapter;
import com.nlu.vnf.model.Comments;
import com.nlu.vnf.model.DeveloperKey;
import com.nlu.vnf.model.Dishes;
import com.nlu.vnf.model.Location;
import com.nlu.vnf.model.Restaurant;

/**
 * 
 * @author TruongVN
 *
 */
public class HomeFragment extends Fragment {
	// Log tag
	private static final String TAG = HomeFragment.class.getSimpleName();
	private ProgressDialog pDialog;
	private List<Restaurant> restaurants = new ArrayList<Restaurant>();
	private ListView listView;
	private CustomListAdapter adapter;

	// private TextView txtResponse;
	// temporary string to show the parsed response
	// private String jsonResponse;

	public HomeFragment() {
	}

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		setHasOptionsMenu(true);
		View rootView = inflater.inflate(R.layout.fragment_home, container,
				false);
		listView = (ListView) rootView.findViewById(R.id.list);

		getWidgetsControl();
		getJsonVolley();
		return rootView;
	}

	private void getJsonVolley() {
		// Creating volley request obj
		System.out.println("VAO");
		JsonArrayRequest restaurantReq = new JsonArrayRequest(
				DeveloperKey.URL_HOME, new Response.Listener<JSONArray>() {
					@Override
					public void onResponse(JSONArray response) {
						Log.d(TAG, response.toString());
						hidePDialog();

						// Parsing json
						for (int i = 0; i < response.length(); i++) {
							try {

								JSONObject obj = response.getJSONObject(i);
								Restaurant restaurant = new Restaurant();
								restaurant.setCity(obj.getString("city"));
								restaurant.setName(obj.getString("name"));
								restaurant.setPhone(obj.getString("phone"));
								restaurant.setAddress(obj.getString("address"));
								// Get Location
								JSONArray locationArry = obj
										.getJSONArray("location");
								List<Location> locationList = new ArrayList<Location>();
								for (int j = 0; j < locationArry.length(); j++) {
									JSONObject dishObj = locationArry
											.getJSONObject(j);
									Location location = new Location();
									location.setLat(Double.parseDouble(dishObj
											.getString("lat")));
									location.setLon(Double.parseDouble(dishObj
											.getString("lon")));
									locationList.add(location);
								}

								restaurant.setArrayLocation(locationList);

								restaurant.setImageShop(obj
										.getString("imageshop"));
								restaurant.setOcTime(obj.getString("octime"));
								restaurant.setRate(obj.getInt("rate"));
								restaurant.setPrice(obj.getString("price"));
								// Dishes is JSon array
								JSONArray dishArry = obj.getJSONArray("dishes");
								List<Dishes> dishesList = new ArrayList<Dishes>();
								for (int j = 0; j < dishArry.length(); j++) {
									JSONObject dishObj = dishArry
											.getJSONObject(j);
									Dishes dishes = new Dishes();
									dishes.setName(dishObj.getString("name"));
									dishes.setImgURL(dishObj
											.getString("imgURL"));
									dishes.setPrice(dishObj.getString("price"));
									dishesList.add(dishes);
								}

								restaurant.setArrayDishes(dishesList);

								// Comments is JSon array
								JSONArray commentArry = obj
										.getJSONArray("comments");
								List<Comments> comments = new ArrayList<Comments>();
								for (int j = 0; j < commentArry.length(); j++) {
									JSONObject commentObj = commentArry
											.getJSONObject(j);
									Comments cmt = new Comments();
									cmt.setUsername(commentObj
											.getString("username"));
									cmt.setDetail(commentObj
											.getString("detail"));
									comments.add(cmt);
								}

								restaurant.setArrayComments(comments);

								// adding restaurant to movies array
								restaurants.add(restaurant);

							} catch (JSONException e) {
								e.printStackTrace();
							}

						}

						// notifying list adapter about data changes
						// so that it renders the list view with updated data
						adapter.notifyDataSetChanged();
					}
				}, new Response.ErrorListener() {
					@Override
					public void onErrorResponse(VolleyError error) {
						VolleyLog.d(TAG, "Error: " + error.getMessage());
						hidePDialog();

					}
				});

		// Adding request to request queue
		AppController.getInstance().addToRequestQueue(restaurantReq);

	}

	@Override
	public void onDestroy() {
		super.onDestroy();
		hidePDialog();
	}

	// tắt dialog loading
	private void hidePDialog() {
		if (pDialog != null) {
			pDialog.dismiss();
			pDialog = null;
		}
	}

	private void getWidgetsControl() {
		adapter = new CustomListAdapter(getActivity(), restaurants,
				getActivity().getBaseContext());
		listView.setAdapter(adapter);

		pDialog = new ProgressDialog(getActivity());
		// Showing progress dialog before making http request
		pDialog.setMessage("Loading...");
		pDialog.show();

		// changing action bar color
		getActivity().getActionBar().setBackgroundDrawable(
				new ColorDrawable(Color.parseColor("#1bbc9b")));

	}
}
