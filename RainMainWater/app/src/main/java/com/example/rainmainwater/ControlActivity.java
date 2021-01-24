package com.example.rainmainwater;

import androidx.appcompat.app.AppCompatActivity;

import android.annotation.SuppressLint;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.Spinner;
import android.widget.TextView;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ControlActivity extends AppCompatActivity {

    TextView mode;
    Boolean manual = false;
    TextView source;
    Boolean usingRain = true;
    Button ChangeSource;
    Button ChangeMode;
    Spinner spinner;
    ProgressBar bar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_control);

        ChangeSource = findViewById(R.id.changeSource);
        ChangeMode = findViewById(R.id.changeMode);
        spinner = findViewById(R.id.spinner);
        List<String> categories = new ArrayList<String>();
        categories.add("Low");
        categories.add("Medium");
        categories.add("High");

        ArrayAdapter<String> dataAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_spinner_item, categories);
        dataAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(dataAdapter);

        spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @SuppressLint("ResourceAsColor")
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id)
            {
                String selectedItem = parent.getItemAtPosition(position).toString(); //this is your selected item
                switch(position) {
                    case 0:
                        bar.setProgress(20, true);
                        bar.setBackgroundColor(R.color.hot);
                        break;
                    case 1:
                        bar.setProgress(50, true);
                        bar.setBackgroundColor(R.color.burnt);
                        break;
                    case 2:
                        bar.setProgress(90, true);
                        bar.setBackgroundColor(R.color.hippyStatus);
                        break;
                }
            }
            public void onNothingSelected(AdapterView<?> parent)
            {

            }
        });

        mode = findViewById(R.id.mode);
        source = findViewById(R.id.waterType);

        bar = findViewById(R.id.progressBar);
        Drawable draw = getDrawable(R.drawable.progress_style);
        bar.setProgressDrawable(draw);

        RestSingleton restSingleton = RestSingleton.getInstance(getApplicationContext());
//        StringRequest stringRequest = new StringRequest(Request.Method.GET, restSingleton.getUrl() + "getMode",
//                new Response.Listener<String>() {
//                    @Override
//                    public void onResponse(String response) {
//                        try {
//                            String modeText = new JSONObject(response).getString("result");
//                            mode.setText(modeText);
//                            manual = modeText.equals("manual");
//                            // Need to finish this endpoint still
//                        } catch (JSONException e) {
//                            e.printStackTrace();
//                        }
//                    }
//                }, new Response.ErrorListener() {
//            @Override
//            public void onErrorResponse(VolleyError error) {
//                Log.d("Error connecting", String.valueOf(error));
//            }
//        });
//        restSingleton.addToRequestQueue(stringRequest);

        StringRequest stringRequest = new StringRequest(Request.Method.GET, restSingleton.getUrl() + "getWaterSource",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            String sourceText = new JSONObject(response).getString("result");
                            sourceText = Character.toUpperCase(sourceText.charAt(0)) + sourceText.substring(1);
                            source.setText(sourceText + " Water");
                            usingRain = sourceText.equals("rain");
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

        ChangeSource.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(!manual) {
                    ChangeMode.performClick();
                }
                if (usingRain) {
                    source.setText("Main Water");
                    usingRain = false;
                }
                else {
                    source.setText("Rain Water");
                    usingRain = true;
                }
                updateSource();
            }
        });

        ChangeMode.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (manual) {
                    mode.setText("Automatic");
                    manual = false;
                } else {
                    mode.setText("Manual");
                    manual = true;
                }
                updateMode();
            }
        });
    }

    private void updateMode() {
        // mode.setText(res.getString("mode"));
    }

    private void updateSource() {
        RestSingleton restSingleton = RestSingleton.getInstance(getApplicationContext());
        JSONObject body = new JSONObject();
        try {
            body.put("func", "photonHandle");
            body.put("args", usingRain ? "rain" : "main");
        } catch (JSONException e) {
            e.printStackTrace();
        }

        /* this isn't working for some reason */
        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest(Request.Method.POST, restSingleton.getUrl() + "handle", body,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        System.out.println(response.toString());
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.d("Error connecting", String.valueOf(error));
            }
        }) {
            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                Map<String, String> params = new HashMap<String, String>();
                params.put("photonHandle", "da75d772427c03de8c622dfe934592f44d5e23dc");
                return params;
            }
        };
        restSingleton.addToRequestQueue(jsonObjectRequest);
    }
}