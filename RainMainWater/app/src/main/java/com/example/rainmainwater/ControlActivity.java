package com.example.rainmainwater;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class ControlActivity extends AppCompatActivity {

    TextView mode;
    Boolean manual;
    TextView source;
    Boolean usingRain;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_control);

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
}