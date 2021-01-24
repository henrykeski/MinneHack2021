package com.example.rainmainwater;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.jjoe64.graphview.GraphView;
import com.jjoe64.graphview.series.DataPoint;
import com.jjoe64.graphview.series.LineGraphSeries;

import  java.util.Calendar;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;

public class AnalyticsActivity extends AppCompatActivity {

    ProgressBar PWaterLevel;
    TextView waterUsage;
    TextView waterLevel;
    TextView waterRatio;

    int array[];
    GraphView graph;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_analytics);
        graph = (GraphView) findViewById(R.id.graph);
        waterUsage = findViewById(R.id.WaterUsage);
        waterLevel = findViewById(R.id.WaterLevel);
        waterRatio = findViewById(R.id.WaterRatio);
        PWaterLevel = findViewById(R.id.progressBar);
        PWaterLevel.setMax(100);
        JSONObject newEventData = new JSONObject();
        Date today = new Date();
        Calendar cal = new GregorianCalendar();
        cal.setTime(today);
        cal.add(Calendar.DAY_OF_MONTH, -30);
        try {
            newEventData.put("startDate", cal.getTime());
            newEventData.put("endDate", new Date());

        } catch (JSONException e) {
            e.printStackTrace();
        }
        RestSingleton restSingleton = RestSingleton.getInstance(getApplicationContext());
        JsonObjectRequest JsonObjectRequest = new JsonObjectRequest(Request.Method.PUT, restSingleton.getUrl() + "getWaterLevelPoints", newEventData,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            makeGraph(response); //
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error connecting", String.valueOf(error));
            }
        });
        restSingleton.addToRequestQueue(JsonObjectRequest);
/*

        StringRequest stringRequest = new StringRequest(Request.Method.GET, restSingleton.getUrl() + "getUsage",         //Get Request for Water Usage
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            updateWaterUsage(new JSONObject(response)); //
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error connecting", String.valueOf(error));
            }
        });
        restSingleton.addToRequestQueue(stringRequest);
*/

        JsonObjectRequest = new JsonObjectRequest(Request.Method.GET, restSingleton.getUrl() + "getWaterLevel", null,      //Get Request for water Level
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            updateWaterLevel(response); //
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error connecting", String.valueOf(error));
            }
        });
        restSingleton.addToRequestQueue(JsonObjectRequest);

/*
        stringRequest = new StringRequest(Request.Method.GET, restSingleton.getUrl() + "getRatio",      //Get request for water Ratio
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            updateWaterRatio(new JSONObject(response)); //
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error connecting", String.valueOf(error));
            }
        });
        restSingleton.addToRequestQueue(stringRequest);

 */


    }


    private void makeGraph(JSONObject response) throws JSONException {
   //     parseString(response.getString("points"));  //Parses the getStrings of the data
        JSONArray c = response.getJSONArray("pairs");
        SimpleDateFormat formatter6=new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss");
        LineGraphSeries<DataPoint> series = new LineGraphSeries<>(new DataPoint[]{});
        for (int i = 0 ; i < c.length(); i++) {
            JSONObject obj = c.getJSONObject(i);
            double level = obj.getDouble("level");
            Date date = new Date();
            try {
                  date = formatter6.parse(obj.getString("date"));
            }
            catch (ParseException e) {
                System.out.println(e);
            }
            series.appendData(new DataPoint(date, level), false, 100);

        }

        graph.addSeries(series);
    }

    private void updateWaterUsage(JSONObject res) throws JSONException {
        waterUsage.setText(res.getString("waterUsage"));
    }
    private void updateWaterLevel(JSONObject res) throws JSONException {
        double level = res.getDouble("result");
        waterLevel.setText(Double.toString(level/4095*100));
        PWaterLevel.setProgress((int) (level/4095*100));
    }

    private void updateWaterRatio(JSONObject res) throws JSONException {
        waterRatio.setText(res.getString("waterRatio"));
    }
}