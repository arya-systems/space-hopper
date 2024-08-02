import MapCanvas from "@/components/MapCanvas";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { FAB, Text, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";

export default function index() {
  const theme = useTheme();
  const { top, bottom } = useSafeAreaInsets();

  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  //NOTE: main
  const [alignOnDso, setalignOnDso] = useState();
  const [showStarNames, setshowStarNames] = useState();
  const [targetsList, settargetsList] = useState();
  const [prevXy, setprevXy] = useState();
  const [startZoomSize, setstartZoomSize] = useState();
  const [startZoom, setstartZoom] = useState();
  const [allowPinchZoom, setallowPinchZoom] = useState();
  const [touchStartTime, settouchStartTime] = useState();
  const [targetIndex, settargetIndex] = useState();
  const [alignIndex, setalignIndex] = useState();
  const [expectingSelect, setexpectingSelect] = useState();
  const [cameraProjection, setcameraProjection] = useState();
  const [expectedFrameRateMs, setexpectedFrameRateMs] = useState();
  const [useCompass, setuseCompass] = useState();

  const [largeFont, setlargeFont] = useState();
  const [fovValues, setfovValues] = useState();
  const [fov, setfov] = useState();
  const [mag, setmag] = useState();
  const [gData, setgData] = useState();
  const [alignMatrix, setalignMatrix] = useState();
  const [useGyro, setuseGyro] = useState();
  const [fullScreen, setfullScreen] = useState<boolean>(false);

  const [status, setstatus] = useState();
  const [watchList, setwatchList] = useState();

  return (
    <>
      <MapCanvas />

      <View className="absolute bottom-0 left-0 p-4">
        <Text>{text}</Text>
      </View>

      <View
        className="absolute top-0 right-0"
        style={{
          padding: 16,
          paddingTop: top + 16,
          display: fullScreen ? "none" : "flex",
        }}
      >
        <FAB
          size="small"
          icon="settings"
          onPress={() => router.navigate("settings")}
        />
      </View>
      <FAB
        size="medium"
        icon={fullScreen ? "eye" : "eye-off"}
        onPress={() => setfullScreen((prev) => !prev)}
        className="absolute bottom-0 right-0"
        style={{ margin: 16, marginBottom: bottom + 16 }}
      />
    </>
  );
}
