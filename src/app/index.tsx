import MapCanvas from "@/components/MapCanvas";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useAppTheme } from "@/components/providers/Material3ThemeProvider";
import { allstars } from "@/data/allstars";
import { allstars_index } from "@/data/allstars_index";
import JulianDate from "@/data/julian-date";
import CPReduce from "@/data/CPReduce";
import { allstars_index_name } from "@/data/allstars_index_name";
import { constellation_lines } from "@/data/constellation_lines";

export default function index() {
  const { colors } = useAppTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { width, height } = Dimensions.get("screen");

  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);

  // useEffect(() => {
  //   (async () => {
  //     let { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       setErrorMsg("Permission to access location was denied");
  //       return;
  //     }
  //
  //     let location = await Location.getCurrentPositionAsync({});
  //     setLocation(location);
  //   })();
  // }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  //NOTE: main

  const [showObj, setshowObj] = useState<any>({
    S: true,
    Oc: true,
    Gc: true,
    Ca: true,
    Ga: true,
    Ne: true,
    P: true,
    U: true,
  });

  const [alignOnDso, setalignOnDso] = useState<boolean>(false);
  const [showStarNames, setshowStarNames] = useState<boolean>(true);
  const [targetsList, settargetsList] = useState<any>([]);
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
  const [gData, setgData] = useState<any>({
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

  const [alignMatrix, setalignMatrix] = useState<number[]>([
    1, 0, 0, 0, 1, 0, 0, 0, 1,
  ]);
  const [useGyro, setuseGyro] = useState<boolean>(false);
  const [fullScreen, setfullScreen] = useState<boolean>(false);

  const [status, setstatus] = useState<string>("");
  const [watchList, setwatchList] = useState();

  //NOTE:  Metjods
  var degtorad = Math.PI / 180; // Degree-to-Radian conversion
  const getRotationMatrix = (alpha: any, beta: any, gamma: any) => {
    var _x = beta ? beta * degtorad : 0; // beta value
    var _y = gamma ? gamma * degtorad : 0; // gamma value
    var _z = alpha ? alpha * degtorad : 0; // alpha value

    var cX = Math.cos(_x);
    var cY = Math.cos(_y);
    var cZ = Math.cos(_z);
    var sX = Math.sin(_x);
    var sY = Math.sin(_y);
    var sZ = Math.sin(_z);

    //
    // ZXY rotation matrix construction.
    //

    var m11 = cZ * cY - sZ * sX * sY;
    var m12 = -cX * sZ;
    var m13 = cY * sZ * sX + cZ * sY;

    var m21 = cY * sZ + cZ * sX * sY;
    var m22 = cZ * cX;
    var m23 = sZ * sY - cZ * cY * sX;

    var m31 = -cX * sY;
    var m32 = sX;
    var m33 = cX * cY;

    return [m11, m12, m13, m21, m22, m23, m31, m32, m33];
  };

  const mvec = (m: any, v: any) => {
    return [
      m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
      m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
      m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
    ];
  };

  const crossProd = (a: any, b: any) => {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ];
  };

  const getCameraRays = () => {
    var alpha = useGyro
      ? gData.alpha_gyro + gData.alpha_diff
      : gData.alpha + gData.alpha_user_offset;
    var M = getRotationMatrix(alpha, gData.beta, gData.gamma);

    var fwd = mvec(M, [0, 1, 0]);

    var fwd_hlen = Math.sqrt(fwd[0] * fwd[0] + fwd[1] * fwd[1]);
    var fwd_hor = [fwd[0] / fwd_hlen, fwd[1] / fwd_hlen, 0.0];

    var lft = [-fwd_hor[1], fwd_hor[0], 0.0];
    var top = crossProd(fwd, lft);

    if (useGyro) {
      return [
        mvec(alignMatrix, top),
        mvec(alignMatrix, lft),
        mvec(alignMatrix, fwd),
      ];
    } else {
      return [top, lft, fwd];
    }
  };

  const updateDebugTime = (v: any) => {
    const mins = Math.floor(v / 60000);
    const h = Math.floor(mins / 60) % 24;
    const m = mins % 60;
    // document.getElementById("utc_time").innerHTML =
    //   ("" + h).padStart(2, "0") + ":" + (m + "").padStart(2, "0");
  };

  const getSolarSystemObject = (p: any) => {
    var r2d = 180 / Math.PI;
    var d2r = Math.PI / 180;
    var rLat = gData.lat * d2r;
    var rLon = gData.lon * d2r;
    var date = new Date();
    var date = new Date();
    var jd = JulianDate.gregorianDateToJulianDate(
      date.getUTCFullYear(),
      date.getUTCMonth() + 1,
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      date.getUTCSeconds(),
    );
    var body = CPReduce.bodies.indexOf(p);
    var res = CPReduce.reduce(body, jd, [rLat, rLon, 0]);
    var RA = res[0];
    var DEC = res[1];

    return { RA: RA * r2d, DE: DEC * r2d, name: p, AM: -1 };
  };

  const getFOV = () => {
    var ratio = width / height;
    var fov_td, fov_lr;
    if (ratio < 1) {
      fov_td = fov;
      fov_lr = fov_td * ratio;
    } else {
      fov_lr = fov;
      fov_td = fov_lr / ratio;
    }
    return { lr: fov_lr, td: fov_td };
  };

  const xyzTo2d = (xyz: any, in_fov = true) => {
    var deg2rad = Math.PI / 180;
    var fov = getFOV();
    var fov_td = (fov.td * deg2rad) / 2;
    var fov_lr = (fov.lr * deg2rad) / 2;
    var x = xyz.x;
    var y = xyz.y;
    var z = xyz.z;

    if (z <= 0) return null;
    if (cameraProjection) {
      var lim_x = Math.sin(fov_lr);
      var lim_y = Math.sin(fov_td);
    } else {
      x = Math.asin(x);
      y = Math.asin(y);
      var lim_x = fov_lr;
      var lim_y = fov_td;
    }
    if (in_fov) {
      if (x < -lim_x || x > lim_x) return null;
      if (y < -lim_y || y > lim_y) return null;
    }
    return { x: (x + lim_x) / (lim_x * 2), y: 1 - (y + lim_y) / (lim_y * 2) };
  };

  const rayFromPos = (RAd: any, DEd: any) => {
    var deg2rad = Math.PI / 180;
    let RA = RAd * deg2rad;
    let DE = DEd * deg2rad;
    var jd = (gData.time * 1e-3) / 86400.0 + 2440587.5;
    var tu = jd - 2451545.0;
    var angle = Math.PI * 2 * (0.779057273264 + 1.00273781191135448 * tu);
    var q = angle + gData.lon * deg2rad;
    var H = q - RA;

    var f = deg2rad * gData.lat;

    var az_y = Math.sin(H);
    var az_x = Math.cos(H) * Math.sin(f) - Math.tan(DE) * Math.cos(f);
    var az = Math.atan2(az_y, az_x);
    var sinH =
      Math.sin(f) * Math.sin(DE) + Math.cos(f) * Math.cos(DE) * Math.cos(H);
    var hz = Math.asin(sinH);
    var ray_n = -Math.cos(az) * Math.cos(hz);
    var ray_e = -Math.sin(az) * Math.cos(hz);
    var ray_u = Math.sin(hz);
    return [ray_e, ray_n, ray_u];
  };

  const sprod = (v1: any, v2: any) => {
    return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
  };

  const cameraBearing = (RAd: any, DEd: any, cameraRays: any) => {
    var ray = rayFromPos(RAd, DEd);
    var top = cameraRays[0];
    var lft = cameraRays[1];
    var fwd = cameraRays[2];
    var x = -sprod(lft, ray);
    var y = sprod(top, ray);
    var z = sprod(fwd, ray);
    return { x: x, y: y, z: z };
  };

  const projectToCamera = (
    RAd: any,
    DEd: any,
    cameraRays: any,
    in_fov = true,
  ) => {
    var xyz = cameraBearing(RAd, DEd, cameraRays);
    return xyzTo2d(xyz, in_fov);
  };

  const largeF = (n: any, s: any) => {
    return s + largeFont + "mm " + n;
  };

  const formatSize = (arcmin: any) => {
    var res = "";
    const lim_factor = 3;
    if (arcmin >= 60) {
      var deg = Math.floor(arcmin / 60);
      res += deg + "°";
      var m = Math.floor(arcmin - deg * 60);
      if (arcmin < 60 * lim_factor && m != 0) {
        res += m + "′";
      }
    } else if (arcmin >= 1) {
      var m = Math.floor(arcmin);
      res += m + "′";
      var s = Math.floor((arcmin - m) * 60);
      if (arcmin < 1 * lim_factor && s != 0) {
        res += s + "″";
      }
    } else {
      res = Math.floor(arcmin * 60) + "″";
    }
    return res;
  };

  const plotStar = (star: any, camRays: any, highlight: any) => {
    // var pos = projectToCamera(star.RA, star.DE, camRays);
    // if (!pos) return null;
    // context.beginPath();
    // var size = star.t == "S" ? 6.5 - star.AM : 6;
    // if (size < 1) size = 1;
    // var color;
    // if (highlight >= 2) {
    //   color = highlight == 3 ? colors.tertiary : colors.onSurfaceVariant;
    //   size = 10;
    // } else {
    //   color = colors.primary;
    // }
    // if (star.t == "S") context.fillStyle = color;
    // else context.fillStyle = "black";
    // var pix_x = pos.x * width;
    // var pix_y = pos.y * height;
    // let result = { x: pix_x, y: pix_y, index: -1 };
    // if (highlight == 0) return result;
    // if (star.t != "Ca") {
    //   context.strokeStyle = color;
    //   context.lineWidth = 1;
    //   if (star.t == "Ga") {
    //     context.ellipse(
    //       pix_x,
    //       pix_y,
    //       size * 1.5,
    //       size / 1.5,
    //       Math.PI / 4,
    //       0,
    //       2 * Math.PI,
    //       false,
    //     );
    //     context.fill();
    //     context.stroke();
    //     context.beginPath();
    //     context.arc(pix_x, pix_y, size / 3, 0, 2 * Math.PI, false);
    //     context.fillStyle = color;
    //     context.fill();
    //     context.stroke();
    //   } else if (star.t == "Gc") {
    //     context.lineWidth = 2;
    //     context.setLineDash([1, 3]);
    //     context.arc(pix_x, pix_y, size, 2 * Math.PI, false);
    //     context.stroke();
    //     context.beginPath();
    //     context.setLineDash([]);
    //     context.fillStyle = color;
    //     context.arc(pix_x, pix_y, size / 3, 0, 2 * Math.PI, false);
    //     context.fill();
    //     context.stroke();
    //   } else if (star.t == "Oc") {
    //     context.lineWidth = 2;
    //     context.setLineDash([1, 3]);
    //     context.arc(pix_x, pix_y, size, 2 * Math.PI, false);
    //     context.stroke();
    //     context.beginPath();
    //     context.setLineDash([1, 3]);
    //     context.arc(pix_x, pix_y, size / 3, 0, 2 * Math.PI, false);
    //     context.fill();
    //     context.stroke();
    //     context.setLineDash([]);
    //   } else if (star.t == "Ne") {
    //     context.lineWidth = 1;
    //     context.moveTo(pix_x - size, pix_y - size);
    //     var f = 4;
    //     context.bezierCurveTo(
    //       pix_x + f * size,
    //       pix_y - size,
    //       pix_x - f * size,
    //       pix_y + size,
    //       pix_x + size,
    //       pix_y + size,
    //     );
    //     context.stroke();
    //     context.beginPath();
    //     context.fillStyle = color;
    //     context.arc(pix_x, pix_y, size / 3, 0, 2 * Math.PI, false);
    //     context.fill();
    //     context.stroke();
    //   } else if (star.t == "U") {
    //     context.lineWidth = 2;
    //     context.beginPath();
    //     context.moveTo(pix_x - size, pix_y);
    //     context.lineTo(pix_x, pix_y + size);
    //     context.lineTo(pix_x + size, pix_y);
    //     context.lineTo(pix_x, pix_y - size);
    //     context.lineTo(pix_x - size, pix_y);
    //     context.fillStyle = "black";
    //     context.fill();
    //     context.stroke();
    //   } else {
    //     context.arc(pix_x, pix_y, size, 0, 2 * Math.PI, false);
    //     context.fill();
    //     context.stroke();
    //   }
    // }
    // if (star.name || highlight >= 2) {
    //   if (star.t == "Ca") {
    //     color = colors.outline; //NOTE: construction color
    //   }
    //   context.strokeStyle = color;
    //   context.fillStyle = color;
    //   if (star.t == "Ca") {
    //     context.font = largeF("Sans", 4);
    //     context.textBaseline = "middle";
    //     context.textAlign = "center";
    //     context.fillText(star.name, pix_x, pix_y);
    //   } else {
    //     let text = star.name ? star.name : "";
    //     if (star.t == "S" && !showStarNames && highlight < 3) text = "";
    //     let text_extra = [];
    //     let name_extra = [];
    //     if (highlight > 1) {
    //       context.font = largeF("Sans", 6);
    //       if (highlight == 3) {
    //         if (star.AM != -1) text_extra.push("m=" + star.AM.toFixed(1));
    //         if (star.s) {
    //           text_extra.push(formatSize(star.s));
    //         }
    //         if ("n2" in star) {
    //           name_extra = star.n2;
    //         }
    //       }
    //     } else {
    //       context.font = largeF("Sans", 3);
    //     }
    //     context.textBaseline = "bottom";
    //     context.textAlign = "start";
    //     context.fillText(text, pix_x + size + 1, pix_y - size - 1);
    //     if (text_extra) {
    //       context.textBaseline = "top";
    //       context.fillText(
    //         text_extra.join(", "),
    //         pix_x + size + 1,
    //         pix_y - size / 2 - 1,
    //       );
    //       context.textBaseline = "bottom";
    //     }
    //     if (name_extra) {
    //       context.textBaseline = "top";
    //       context.fillText(
    //         name_extra.join(", "),
    //         pix_x + size + 1,
    //         pix_y + 2 * size - 1,
    //       );
    //       context.textBaseline = "bottom";
    //     }
    //   }
    // }
    // return result;
  };

  const doNothing = (index: any) => {};

  const normV = (v: any) => {
    var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return [v[0] / len, v[1] / len, v[2] / len];
  };

  const matAdd = (A: any, alpha: any, B: any, beta: any) => {
    var res = [];
    for (var i = 0; i < 9; i++) {
      res.push(A[i] * alpha + B[i] * beta);
    }
    return res;
  };

  const matEye = () => {
    return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  };

  const matMul = (A: any, B: any) => {
    var v1 = mvec(A, [B[0], B[3], B[6]]);
    var v2 = mvec(A, [B[1], B[4], B[7]]);
    var v3 = mvec(A, [B[2], B[5], B[8]]);
    return [v1[0], v2[0], v3[0], v1[1], v2[1], v3[1], v1[2], v2[2], v3[2]];
  };

  const setUseGyro = (val: any, message = null, message_tiny = null) => {
    setuseGyro(val);
    if (message) {
      var status: string = message;
    } else {
      var status = useGyro ? "Aligned" : "Not Aligned";
    }
    if (message_tiny) {
      var status_t: string = message_tiny;
    } else {
      var status_t = useGyro ? "✓" : "✗";
    }
    // document.getElementById("alignment").innerHTML = status;
    // document.getElementById("alignment_tiny").innerHTML = status_t;
  };

  const normalizeName = (name: any) => {
    name = name.toUpperCase();
    const re = /^(.*)(([A-Z]+)[ 0]+)([^0].*)$/;
    var match = name.match(re);
    if (match) {
      return normalizeName(match[1] + match[3] + match[4]);
    }
    return name;
  };

  const isOpenWikiAllowed = () => {
    var has_obj = targetIndex >= 0 && allstars[targetIndex].name;
    if (!has_obj) return false;
    var enabled = null; //document.getElementById("wiki_info_opt").value;
    if (enabled == "no") return false;
    var nm_enabled = enabled == "always";
    // if (global_style == global_night_style && !nm_enabled) return false;
    return true;
  };

  const showHideInfoIcon = () => {
    var el = null; //document.getElementById("show_info");
    if (isOpenWikiAllowed()) el.style.display = "block";
    else el.style.display = "none";
  };

  const findTargetByName = (_name = "") => {
    var found = null; //document.getElementById("find_status");
    var name = normalizeName(_name);
    var N = allstars_index_name.names.length;
    var found_index = -1;
    if (name != "") {
      for (var i = 0; i < N; i++) {
        let candidate = allstars_index_name.names[i];
        if (candidate == name) {
          found_index = i;
          break;
        } else if (found_index != -2 && candidate.startsWith(name)) {
          if (found_index == -1) {
            found_index = i;
          } else {
            found_index = -2;
          }
        }
      }
    }
    if (found_index >= 0) {
      settargetIndex(allstars_index_name.index[found_index]);
      found.innerHTML = allstars[targetIndex].name;
      showHideInfoIcon();
      return true;
    } else {
      settargetIndex(-1);
      found.innerHTML = "";
      showHideInfoIcon();
      return false;
    }
  };

  const selectTarget = (index: any) => {
    findTargetByName();
    settargetIndex(index);
    showHideInfoIcon();
  };

  const selectAlign = (index: any) => {
    var camRays = getCameraRays();
    var st = allstars[index];
    var tr = rayFromPos(st.RA, st.DE);
    var fw = camRays[2];
    var left = camRays[1];
    var dAZ = Math.asin(
      crossProd(normV([tr[0], tr[1], 0]), normV([fw[0], fw[1], 0]))[2],
    );
    var dAlt = Math.asin(tr[2]) - Math.asin(fw[2]);
    // rotate around AZ axis
    var daz_mat = [
      Math.cos(dAZ),
      Math.sin(dAZ),
      0,
      -Math.sin(dAZ),
      Math.cos(dAZ),
      0,
      0,
      0,
      1,
    ];
    // rotate around up/dwn - axis of the camera
    var u0 = left[0];
    var u1 = left[1];
    var u2 = left[2];
    var W = [0, -u2, u1, u2, 0, -u0, -u1, u0, 0];
    var dalt_mat = matAdd(matEye(), 1, W, Math.sin(-dAlt));
    dalt_mat = matAdd(
      dalt_mat,
      1,
      matMul(W, W),
      2 * Math.sin(-dAlt / 2) * Math.sin(-dAlt / 2),
    );

    //global_align_matrix = daz_mat;
    setalignMatrix(matMul(daz_mat, dalt_mat));

    setUseGyro(true);
    gData.alpha_diff = gData.alpha + gData.alpha_user_offset - gData.alpha_gyro;
    setalignIndex(index);
    setexpectingSelect(selectTarget);
  };

  const selectAlignWithTimer = (index: any, start_val = 3) => {
    // var cd = document.getElementById("countdown");
    setalignIndex(index);
    setexpectingSelect(doNothing);
    if (start_val <= 0) {
      // cd.innerHTML = "";
      selectAlign(index);
    } else {
      // document.getElementById("alignment").innerHTML = "";
      // document.getElementById("alignment_tiny").innerHTML = "";
      // cd.innerHTML = start_val.toFixed(1) + "s";
      setTimeout(function () {
        selectAlignWithTimer(index, start_val - 0.1);
      }, 100);
    }
  };

  const validAlignType = (t: any) => {
    if (!alignOnDso) return t == "S" || t == "P";
    return t != "Ca";
  };

  const plotCross = () => {
    // context.strokeStyle = colors.primary; //style.cross
    // context.fillStyle = colors.primary; //style.cross
    // context.lineWidth = 3;
    // var dirs = [
    //   [1, 0],
    //   [0, 1],
    //   [-1, 0],
    //   [0, -1],
    // ];
    // var length = 50;
    // var offset = 10;
    // for (var i = 0; i < dirs.length; i++) {
    //   context.moveTo(
    //     width / 2 + offset * dirs[i][0],
    //     height / 2 + offset * dirs[i][1],
    //   );
    //   context.lineTo(
    //     width / 2 + length * dirs[i][0],
    //     height / 2 + length * dirs[i][1],
    //   );
    // }
    // context.stroke();
  };

  const plotBearing = (xyz: any) => {
    // context.beginPath();
    // context.strokeStyle = colors.outline; //style.bearing
    // context.fillStyle = colors.outline; //style.bearing
    // context.lineWidth = 5;
    // context.arc(width / 2, height / 2, 10, 0, 2 * Math.PI, false);
    // context.moveTo(width / 2, height / 2);
    // var dx = xyz.x;
    // var dy = -xyz.y;
    // var r = 1 / Math.sqrt(dx * dx + dy * dy);
    // dx = dx * r;
    // dy = dy * r;
    // var length = 100;
    // var pos = xyzTo2d(xyz);
    // if (pos) {
    //   var px = width * (pos.x - 0.5);
    //   var py = height * (pos.y - 0.5);
    //   var dist = Math.sqrt(px * px + py * py);
    //   if (dist < length) length = dist;
    // }
    // context.lineTo(width / 2 + dx * length, height / 2 + dy * length);
    // var updn =
    //   (dy > 0 ? "Down" : "Up") +
    //   " " +
    //   Math.abs((Math.atan2(-xyz.y, xyz.z) / Math.PI) * 180).toFixed(1) +
    //   "\u00b0";
    // var left =
    //   (dx > 0 ? "Right" : "Left") +
    //   " " +
    //   Math.abs((Math.atan2(xyz.x, xyz.z) / Math.PI) * 180).toFixed(1) +
    //   "\u00b0";
    // context.stroke();
    // context.lineWidth = 0;
    // context.font = largeF("Serif", 6);
    // context.strokeStyle = colors.outline; //style.bearing
    // context.fillStyle = colors.outline; //style.bearing
    // context.textBaseline = "middle";
    // context.textAlign = "end";
    // context.fillText(updn, width - 5, height / 2);
    // context.textAlign = "center";
    // context.textBaseline = "bottom";
    // context.fillText(left, width / 2, height - 5);
  };

  const plotLines = (camRays: any) => {
    // if (!showObj.Ca) return;
    // for (var i = 0; i < constellation_lines.length; i++) {
    //   let line = constellation_lines[i];
    //   var p1 = projectToCamera(line.r0, line.d0, camRays, false);
    //   var p2 = projectToCamera(line.r1, line.d1, camRays, false);
    //   if (!p1 || !p2) continue;
    //   context.beginPath();
    //   context.strokeStyle = colors.primary; //style.constelations
    //   context.lineWidth = 1;
    //   context.moveTo(p1.x * width, p1.y * height);
    //   context.lineTo(p2.x * width, p2.y * height);
    //   context.stroke();
    // }
  };

  const plotAltAz = (fwd: any) => {
    // var alt: any = (Math.asin(fwd[2]) / Math.PI) * 180;
    // var az: any = (Math.atan2(fwd[0], fwd[1]) / Math.PI) * 180;
    // alt = "Alt:" + alt.toFixed(1);
    // if (az < 0) az = 360 + az;
    // az = "Az:" + az.toFixed(1);
    // context.font = largeF("Sans", 5);
    // context.textBaseline = "bottom";
    // context.textAlign = "end";
    // context.fillStyle = colors.secondary; //style.altaz
    // context.fillText(alt, width - 5, height - 5);
    // context.textAlign = "start";
    // context.fillText(az, 5, height - 5);
  };

  const plotStars = () => {
    // let start = Date.now();
    //
    // settargetsList([]);
    // setgData({ ...gData, time: Date.now() });
    // updateDebugTime(gData.time);
    // var camRays = getCameraRays();
    // context.fillStyle = "black";
    // context.fillRect(0, 0, width, height);
    // context.fillStyle = colors.primary;
    //
    // for (var i = 0; i < allstars.length; i++) {
    //   var st = allstars[i].t;
    //
    //   if (st == "P") {
    //     let pos = getSolarSystemObject(allstars[i].name);
    //     allstars[i].RA = pos.RA;
    //     allstars[i].DE = pos.DE;
    //   }
    //
    //   var _mag = allstars[i].AM;
    //   if (
    //     (st == "S" && _mag > mag) ||
    //     (st != "S" && _mag > mag) ||
    //     !showObj[st]
    //   ) {
    //     i = allstars_index[st] - 1;
    //     continue;
    //   }
    //   var highlight = 1;
    //   if (i == targetIndex || i == alignIndex) highlight = 0;
    //   var pos = plotStar(allstars[i], camRays, highlight);
    //   // select only stars if not aligned
    //   // if aligned select all but constellations
    //   var waiting_for_align = expectingSelect == selectAlignWithTimer;
    //   if (pos && st != "Ca" && (validAlignType(st) || !waiting_for_align)) {
    //     pos.index = i;
    //     settargetsList((prev: any) => prev.push(pos)); //NOTE: push pos
    //   }
    // }
    // if (alignIndex >= 0 && alignIndex != targetIndex) {
    //   plotStar(allstars[alignIndex], camRays, 2);
    // }
    // if (targetIndex >= 0) {
    //   var star = allstars[targetIndex];
    //   var xyz = cameraBearing(star.RA, star.DE, camRays);
    //   plotBearing(xyz);
    //   var target_pos = plotStar(star, camRays, 3);
    //   // handle a case were target < mag but it is valid align target
    //   // ususally it means it is shown due to search
    //   if (target_pos && validAlignType(star.t)) {
    //     target_pos.index = targetIndex;
    //     var found = false;
    //     for (var i = 0; i < targetsList.length; i++) {
    //       if (targetsList[i].index == target_pos.index) {
    //         found = true;
    //         break;
    //       }
    //     }
    //     if (!found) {
    //       settargetsList((prev: any) => prev.push(target_pos)); //NOTE: push target_pos
    //     }
    //   }
    // } else if (useGyro) {
    //   plotCross();
    // }
    // plotLines(camRays);
    // plotAltAz(camRays[2]);
    // var passed = Date.now() - start;
    // if (passed > expectedFrameRateMs / 2) {
    //   setTimeout(plotStars, expectedFrameRateMs);
    // } else {
    //   setTimeout(plotStars, expectedFrameRateMs - passed);
    // }
  };

  useEffect(() => {
    plotStars();
  }, []);

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
