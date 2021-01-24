package com.example.rainmainwater;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class dataPoint {
    // String sDate6;
    String sDate6 = "31-Dec-1998 23:37:50";
    SimpleDateFormat formatter6 = new SimpleDateFormat("dd-MMM-yyyy HH:mm:ss");
    Date date6;
    public dataPoint() {
        try {
            date6 = formatter6.parse(sDate6);
            }
        catch (ParseException e) {
            System.out.println(e);
        }
    }
}
