package com.service.starter;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.os.Bundle;
import android.util.Log;

import androidx.core.app.ActivityCompat;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ServiceStarter";
  }
  
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new ReactActivityDelegate(this, getMainComponentName()) {
      @Override
      protected ReactRootView createRootView() {
       return new RNGestureHandlerEnabledRootView(MainActivity.this);
      }
    };
  }
  
  @Override
  public void onCreate(Bundle bundle) {
    super.onCreate(null);
    Log.d("keyHash", ""+getKeyHash(MainActivity.this));
  }


  public static String getKeyHash(final Context context) {
    PackageManager pm = context.getPackageManager();
    try {
      PackageInfo packageInfo = pm.getPackageInfo(context.getPackageName(), PackageManager.GET_SIGNATURES);
      if (packageInfo == null)
        return null;

      for (Signature signature : packageInfo.signatures) {
        try {
          MessageDigest md = MessageDigest.getInstance("SHA");
          md.update(signature.toByteArray());
          return android.util.Base64.encodeToString(md.digest(), android.util.Base64.NO_WRAP);
        } catch (NoSuchAlgorithmException e) {
          e.printStackTrace();
        }
      }
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
    }
    return null;
  }

}
