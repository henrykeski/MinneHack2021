package com.example.rainmainwater;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.jjoe64.graphview.GraphView;
import com.jjoe64.graphview.series.DataPoint;
import com.jjoe64.graphview.series.LineGraphSeries;

import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import  java.util.Calendar;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.GregorianCalendar;

import static java.lang.Math.round;

public class AnalyticsActivity extends AppCompatActivity {

    ProgressBar PWaterLevel;
    TextView waterUsage;
    TextView waterLevel;
    TextView waterRatio;

    int array[];
    GraphView graph;
    GraphView graph2;
    GraphView graph3;

    FloatingActionButton refreshButton;


    private static DecimalFormat df = new DecimalFormat("0.00");


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_analytics);
        graph = (GraphView) findViewById(R.id.graph);
        graph2 = (GraphView) findViewById(R.id.graph2);
        graph3 = (GraphView) findViewById(R.id.graph3);
        refreshButton = (FloatingActionButton) findViewById(R.id.floatingActionButton);
//        waterUsage = findViewById(R.id.WaterUsage);
        waterLevel = findViewById(R.id.WaterLevel);
//        waterRatio = findViewById(R.id.WaterRatio);
        PWaterLevel = findViewById(R.id.progressBar);
        PWaterLevel.setMax(100);

        refresh(refreshButton);

    }


    private void makeGraph(JSONObject response) throws JSONException {
   //     parseString(response.getString("points"));  //Parses the getStrings of the data
        JSONArray c = response.getJSONArray("pairs");
        SimpleDateFormat formatter6=new SimpleDateFormat("MM-dd-yyyy");
        LineGraphSeries<DataPoint> series = new LineGraphSeries<>(new DataPoint[]{});
        for (int i = 0 ; i < c.length(); i++) {
            JSONObject obj = c.getJSONObject(i);
            double level = Double.parseDouble(df.format(obj.getDouble("dailyAvgLevel")));
            String date = "";


            try {
                  date = obj.getString("_id") + "-2021";
//                  date = formatter6.parse(obj.getString("date").split("T")[0]);
                  System.out.println(date);
            }
            catch (Exception e) {
                System.out.println(e);
                System.out.println("Having a hard time parsing in makeGraph... here's the raw _id: " + obj.getString("_id"));

            }
            series.appendData(new DataPoint(i, level), false, 31);

        }

        graph.addSeries(series);
        graph.setTitle("Tank water level vs. elapsed days");
    }
    private void makeMainsConsumptGraph(JSONObject response) throws JSONException {
        //     parseString(response.getString("points"));  //Parses the getStrings of the data
        JSONArray c = response.getJSONArray("pairs");
        SimpleDateFormat formatter6=new SimpleDateFormat("MM-dd-yyyy");
        LineGraphSeries<DataPoint> series = new LineGraphSeries<>(new DataPoint[]{});
        for (int i = 0 ; i < c.length(); i++) {
            JSONObject obj = c.getJSONObject(i);
            double level = Double.parseDouble(df.format(obj.getDouble("dailyVolume")));
            Date date = new Date();
            try {
                date = formatter6.parse(obj.getString("_id")+ "-2021");
                System.out.println(obj.getString("_id"));
            }
            catch (ParseException e) {
                System.out.println("Having a hard time parsing in makeMainsConsumpt... here's the raw date: " + obj.getString("_id"));
                System.out.println(e);
            }
            series.appendData(new DataPoint(i, level), false, 31);

        }

        graph2.setTitle("City water consumed (liters) vs. elapsed days");
        graph2.addSeries(series);
    }

    public void refresh(View view){
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
        JsonObjectRequest JsonObjectRequest = new JsonObjectRequest(Request.Method.GET, restSingleton.getUrl() + "getWaterLevelPoints", null,
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



//         mains avg daily consumption
        JsonObjectRequest = new JsonObjectRequest(Request.Method.GET, restSingleton.getUrl() + "avgDailyConsmpMonthMain", null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            makeMainsConsumptGraph(response); //
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

//        waterUsage = findViewById(R.id.WaterUsage);
        waterLevel = findViewById(R.id.WaterLevel);
//        waterRatio = findViewById(R.id.WaterRatio);

    }

    private void updateWaterUsage(JSONObject res) throws JSONException {
        waterUsage.setText(res.getString("waterUsage"));
    }
    private void updateWaterLevel(JSONObject res) throws JSONException {
        double level = res.getDouble("result");
        waterLevel.setText(Double.toString(Double.parseDouble(df.format(level/4095*100))));
        PWaterLevel.setProgress((int) (level/4095*100));
    }

    private void updateWaterRatio(JSONObject res) throws JSONException {
        waterRatio.setText(res.getString("waterRatio"));
    }
}