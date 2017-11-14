package com.matchupmatchapp_3;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.horcrux.svg.SvgPackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.airbnb.android.react.maps.MapsPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.oney.WebRTCModule.WebRTCModulePackage;
import com.zxcpoiu.incallmanager.InCallManagerPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ReactNativePushNotificationPackage(),
            new SvgPackage(),
            new ReactNativeYouTube(),
            new MapsPackage(),
            new OrientationPackage(),
            new WebRTCModulePackage(),
            new InCallManagerPackage(),
            new ReactNativeConfigPackage(),
            new PickerPackage(),
            new ReactNativeI18n(),
            new VectorIconsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
