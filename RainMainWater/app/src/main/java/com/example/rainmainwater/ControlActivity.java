package com.example.rainmainwater;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;

import org.json.JSONException;
import org.json.JSONObject;

public class ControlActivity extends AppCompatActivity {

    TextView mode;
    Boolean manual;
    TextView source;
    Boolean usingRain;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_control);


        RestSingleton restSingleton = RestSingleton.getInstance(getApplicationContext());
        StringRequest stringRequest = new StringRequest(Request.Method.GET, restSingleton.getUrl() + "getMode",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            updateMode(new JSONObject(response));
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

        stringRequest = new StringRequest(Request.Method.GET, restSingleton.getUrl() + "getSource",
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        try {
                            updateSource(new JSONObject(response));
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

        mode = findViewById(R.id.mode);
        manual = true;
        source = findViewById(R.id.waterType);
        usingRain = true;
    }

    public void changeMode(View view) {
        if (manual) {
            mode.setText("Automatic");
            manual = false;
        } else {
            mode.setText("Manual");
            manual = true;
        }
    }

    public void changeSource(View view) {
        if(!manual) {
            changeMode(view);
        }
        if (usingRain) {
            source.setText("Main Water");
            usingRain = false;
        }
        else {
            source.setText("Rain Water");
            usingRain = true;
        }
    }

    private void updateMode(JSONObject res) throws JSONException {
        mode.setText(res.getString("mode"));
    }

    private void updateSource(JSONObject res) throws JSONException {
        source.setText(res.getString("source"));
    }
}