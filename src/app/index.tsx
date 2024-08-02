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
  const [alignOnDso, setalignOnDso] = useState<boolean>(false);
  const [showStarNames, setshowStarNames] = useState<boolean>(true);
  const [targetsList, settargetsList] = useState([]);
  const [prevXy, setprevXy] = useState();
  const [startZoomSize, setstartZoomSize] = useState();
  const [startZoom, setstartZoom] = useState();
  const [allowPinchZoom, setallowPinchZoom] = useState<boolean>(true);
  const [touchStartTime, settouchStartTime] = useState();
  const [targetIndex, settargetIndex] = useState(-1);
  const [alignIndex, setalignIndex] = useState(-1);
  const [expectingSelect, setexpectingSelect] = useState();
  const [cameraProjection, setcameraProjection] = useState<boolean>(true);
  const [expectedFrameRateMs, setexpectedFrameRateMs] = useState(66);
  const [useCompass, setuseCompass] = useState<boolean>(false);

  const [largeFont, setlargeFont] = useState(0);
  const [fovValues, setfovValues] = useState([7, 15, 30, 60, 90, 120, 150]);
  const [fov, setfov] = useState(60);
  const [mag, setmag] = useState(4);
  const [gData, setgData] = useState({
    lat: 31.9,
    lon: 34.8,
    compass_alpha: 0,
    alpha: 0,
    alpha_user_offset: 0,
    alpha_gyro: 0,
    alpha_diff: 0,
    beta: 0,
    gamma: 0,
    time: Date.now(), //1614716453109
  });

  const [alignMatrix, setalignMatrix] = useState([1, 0, 0, 0, 1, 0, 0, 0, 1]);
  const [useGyro, setuseGyro] = useState<boolean>(false);
  const [fullScreen, setfullScreen] = useState<boolean>(false);

  const [status, setstatus] = useState<string>("");
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
