package com.example.rainmainwater;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
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

import java.util.HashMap;
import java.util.Map;

public class ControlActivity extends AppCompatActivity {

    TextView mode;
    Boolean manual = false;
    TextView source;
    Boolean usingRain = false;
    Button ChangeSource;
    Button ChangeMode;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_control);

        ChangeSource = findViewById(R.id.changeSource);
        ChangeMode = findViewById(R.id.changeMode);

        mode = findViewById(R.id.mode);
        source = findViewById(R.id.waterType);

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
                            source.setText(sourceText);
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