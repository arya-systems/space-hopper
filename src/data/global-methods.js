export function showManual(v) {
  document.getElementById("manual").style.display = v ? "inline" : "none";
}

export function qsHide() {
  document.getElementById("quick_start").style.display = "none";
}

export function qsShowHide(show_id, hide_id) {
  document.getElementById("qs_" + hide_id).style.display = "none";
  document.getElementById("qs_" + show_id).style.display = "inline";
}

export function setDisplayByClass(cls, value) {
  var el = document.getElementsByClassName(cls);
  for (var i = 0; i < el.length; i++) {
    el[i].style.display = value;
  }
}

export function smallScreen(v) {
  var tiny = v ? "inline" : "none";
  var tiny_tr = v ? "table-row" : "none";
  var tiny_b = v ? "block" : "none";
  var full = v ? "none" : "inline";
  var full_b = v ? "none" : "block";
  setDisplayByClass("only_tiny_tr", tiny_tr);
  setDisplayByClass("only_tiny", tiny);
  setDisplayByClass("only_tiny_b", tiny_b);
  setDisplayByClass("only_full", full);
  setDisplayByClass("only_full_b", full_b);
}

export function showStatus(v) {
  global_status += v + "<br/>";
  document.getElementById("status").innerHTML = global_status;
}

export function showConfig(v) {
  document.getElementById("config").style.display = v;
}

export function largeF(n, s) {
  return s + global_large_font + "mm " + n;
}

export function toggleFS(fs) {
  if (fs) {
    document.documentElement.requestFullscreen({ navigationUI: "hide" });
  } else {
    document.exitFullscreen();
  }
}

export function hideSettingIfSelectionOk() {
  var value = document.getElementById("search_field").value;
  if (findTargetByName(value)) {
    showConfig("none");
  }
  return false;
}

export function normalizeName(name) {
  name = name.toUpperCase();
  const re = /^(.*)(([A-Z]+)[ 0]+)([^0].*)$/;
  var match = name.match(re);
  if (match) {
    return normalizeName(match[1] + match[3] + match[4]);
  }
  return name;
}

export function reShearchMain() {
  findTargetByName(document.getElementById("search_field_main").value);
}

export function mainSearchOnFocusChange(val) {
  if (!val) {
    var isOk = document.getElementById("search_field_main_ok");
    isOk.style.display = "none";
    var el = document.getElementById("search_field_main");
    var content = el.value;
    reShearchMain();
    if (content.trim() == "") {
      el.value = "search";
    }
  }
  var but = document.getElementById("main_search_button");
  if (!val && global_target_index >= 0) {
    but.style.display = "inline";
  } else {
    but.style.display = "none";
  }
}

export function mainSearchOnSubmit() {
  document.getElementById("search_field_main").blur();
  return false;
}

export function mainSearchDoneCheck(e) {
  if (e.key == "Enter") {
    mainSearchOnSubmit();
  }
}
export function mainSearchFindTarget(name) {
  findTargetByName(name.trim());
  var el = document.getElementById("search_field_main");
  var isOk = document.getElementById("search_field_main_ok");
  isOk.style.display = "inline";
  isOk.innerHTML = global_target_index >= 0 ? "✓" : "✗";
}
export function mainSearchFocus() {
  document.getElementById("search_field_main").value = "";
  event.stopPropagation();
}

export function findTargetByName(name = "") {
  var found = document.getElementById("find_status");
  var name = normalizeName(name);
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
    global_target_index = allstars_index_name.index[found_index];
    found.innerHTML = allstars[global_target_index].name;
    showHideInfoIcon();
    return true;
  } else {
    global_target_index = -1;
    found.innerHTML = "";
    showHideInfoIcon();
    return false;
  }
}

export function starMagUpdate(offset) {
  global_mag += offset;
  global_mag = Math.max(1, Math.min(6, global_mag));
  updateMAG();
}
export function updateMAG() {
  document.getElementById("mag_val").innerHTML = global_mag + "";
  saveMagVal(global_mag, "mag_val");
}

export function incFOV() {
  var N = global_fov_values.length;
  for (var i = 0; i < N - 1; i++) {
    if (
      global_fov == global_fov_values[i] ||
      (global_fov_values[i] < global_fov &&
        global_fov < global_fov_values[i + 1])
    ) {
      global_fov = global_fov_values[i + 1];
      break;
    }
  }
  updateFOV();
}
export function decFOV() {
  var N = global_fov_values.length;
  for (var i = N - 1; i > 0; i--) {
    if (
      global_fov == global_fov_values[i] ||
      (global_fov_values[i - 1] < global_fov &&
        global_fov < global_fov_values[i])
    ) {
      global_fov = global_fov_values[i - 1];
      break;
    }
  }
  updateFOV();
}
export function updateFOV() {
  var vals = document.getElementsByClassName("fov_val");
  for (var i = 0; i < vals.length; i++) {
    vals[i].innerHTML = global_fov + "&deg;";
  }
}

export function setUseGyro(val, message = null, message_tiny = null) {
  global_use_gyro = val;
  if (message) {
    var status = message;
  } else {
    var status = global_use_gyro ? "Aligned" : "Not Aligned";
  }
  if (message_tiny) {
    var status_t = message_tiny;
  } else {
    var status_t = global_use_gyro ? "✓" : "✗";
  }
  document.getElementById("alignment").innerHTML = status;
  document.getElementById("alignment_tiny").innerHTML = status_t;
}

export function resetAll() {
  global_expecting_select = selectTarget;
  findTargetByName();
  global_target_index = -1;
  showHideInfoIcon();
  document.getElementById("find_status").innerHTML = "";
  global_align_index = -1;
  setUseGyro(false);
}

export function align() {
  if (global_expecting_select == doNothing) return;
  /// realign in manual mode
  if (global_use_gyro && !global_use_compass) {
    // keep bearing
    gdata.alpha_user_offset = gdata.alpha_gyro + gdata.alpha_diff - gdata.alpha;
  }
  setUseGyro(false, "Select Star", "?");
  global_align_index = -1;
  global_expecting_select = selectAlignWithTimer;
}

export function normV(v) {
  var len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / len, v[1] / len, v[2] / len];
}

export function matMul(A, B) {
  var v1 = mvec(A, [B[0], B[3], B[6]]);
  var v2 = mvec(A, [B[1], B[4], B[7]]);
  var v3 = mvec(A, [B[2], B[5], B[8]]);
  return [v1[0], v2[0], v3[0], v1[1], v2[1], v3[1], v1[2], v2[2], v3[2]];
}

export function matAdd(A, alpha, B, beta) {
  var res = [];
  for (var i = 0; i < 9; i++) {
    res.push(A[i] * alpha + B[i] * beta);
  }
  return res;
}

export function matEye() {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

export function doNothing(index) {}

export function selectAlignWithTimer(index, start_val = 3) {
  var cd = document.getElementById("countdown");
  global_align_index = index;
  global_expecting_select = doNothing;
  if (start_val <= 0) {
    cd.innerHTML = "";
    selectAlign(index);
  } else {
    document.getElementById("alignment").innerHTML = "";
    document.getElementById("alignment_tiny").innerHTML = "";
    cd.innerHTML = start_val.toFixed(1) + "s";
    setTimeout(function () {
      selectAlignWithTimer(index, start_val - 0.1);
    }, 100);
  }
}

export function selectAlign(index) {
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
  global_align_matrix = matMul(daz_mat, dalt_mat);

  setUseGyro(true);
  gdata.alpha_diff = gdata.alpha + gdata.alpha_user_offset - gdata.alpha_gyro;
  global_align_index = index;
  global_expecting_select = selectTarget;
}

/// rotation matrix is
/// taken from https://www.w3.org/TR/2016/CR-orientation-event-20160818/#worked-example-2

var degtorad = Math.PI / 180; // Degree-to-Radian conversion

export function getRotationMatrix(alpha, beta, gamma) {
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
}

export function mvec(m, v) {
  return [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2],
  ];
}

export function crossProd(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

export function getCameraRays() {
  // zxy
  // after Mul comonents are [S,E,D]
  var alpha = global_use_gyro
    ? gdata.alpha_gyro + gdata.alpha_diff
    : gdata.alpha + gdata.alpha_user_offset;
  var M = getRotationMatrix(alpha, gdata.beta, gdata.gamma);
  //var top = mvec(M,[1,0,0]);
  //var lft = mvec(M,[0,1,0]);
  //var fwd = mvec(M,[0,0,-1]);

  var fwd = mvec(M, [0, 1, 0]);

  // make sure left  is horizontal

  var fwd_hlen = Math.sqrt(fwd[0] * fwd[0] + fwd[1] * fwd[1]);
  var fwd_hor = [fwd[0] / fwd_hlen, fwd[1] / fwd_hlen, 0.0];

  var lft = [-fwd_hor[1], fwd_hor[0], 0.0];
  var top = crossProd(fwd, lft);

  if (global_use_gyro) {
    return [
      mvec(global_align_matrix, top),
      mvec(global_align_matrix, lft),
      mvec(global_align_matrix, fwd),
    ];
  } else {
    return [top, lft, fwd];
  }
}

export function rayFromPos(RAd, DEd) {
  var deg2rad = Math.PI / 180;
  RA = RAd * deg2rad;
  DE = DEd * deg2rad;
  var jd = (gdata.time * 1e-3) / 86400.0 + 2440587.5;
  var tu = jd - 2451545.0;
  var angle = Math.PI * 2 * (0.779057273264 + 1.00273781191135448 * tu);
  var q = angle + gdata.lon * deg2rad;
  var H = q - RA;

  var f = deg2rad * gdata.lat;

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
}

export function sprod(v1, v2) {
  return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

export function cameraBearing(RAd, DEd, cameraRays) {
  var ray = rayFromPos(RAd, DEd);
  var top = cameraRays[0];
  var lft = cameraRays[1];
  var fwd = cameraRays[2];
  var x = -sprod(lft, ray);
  var y = sprod(top, ray);
  var z = sprod(fwd, ray);
  return { x: x, y: y, z: z };
}

export function getFOV() {
  var ratio = canvas.width / canvas.height;
  var fov_td, fov_lr;
  if (ratio < 1) {
    fov_td = global_fov;
    fov_lr = fov_td * ratio;
  } else {
    fov_lr = global_fov;
    fov_td = fov_lr / ratio;
  }
  return { lr: fov_lr, td: fov_td };
}

export function xyzTo2d(xyz, in_fov = true) {
  var deg2rad = Math.PI / 180;
  var fov = getFOV();
  var fov_td = (fov.td * deg2rad) / 2;
  var fov_lr = (fov.lr * deg2rad) / 2;
  var x = xyz.x;
  var y = xyz.y;
  var z = xyz.z;

  if (z <= 0) return null;
  if (global_camera_projection) {
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
}
export function projectToCamera(RAd, DEd, cameraRays, in_fov = true) {
  var xyz = cameraBearing(RAd, DEd, cameraRays);
  return xyzTo2d(xyz, in_fov);
}

export function formatSize(arcmin) {
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
}

export function plotStar(star, camRays, highlight) {
  var pos = projectToCamera(star.RA, star.DE, camRays);
  if (!pos) return null;
  context.beginPath();
  var size = star.t == "S" ? 6.5 - star.AM : 6;
  if (size < 1) size = 1;
  var color;
  if (highlight >= 2) {
    color = highlight == 3 ? global_style.target : global_style.align;
    size = 10;
  } else {
    color = global_style.star;
  }
  if (star.t == "S") context.fillStyle = color;
  else context.fillStyle = "black";
  var pix_x = pos.x * canvas.width;
  var pix_y = pos.y * canvas.height;
  result = { x: pix_x, y: pix_y, index: -1 };
  if (highlight == 0) return result;
  if (star.t != "Ca") {
    context.strokeStyle = color;
    context.lineWidth = 1;
    if (star.t == "Ga") {
      context.ellipse(
        pix_x,
        pix_y,
        size * 1.5,
        size / 1.5,
        Math.PI / 4,
        0,
        2 * Math.PI,
        false,
      );
      context.fill();
      context.stroke();
      context.beginPath();
      context.arc(pix_x, pix_y, size / 3, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.stroke();
    } else if (star.t == "Gc") {
      context.lineWidth = 2;
      context.setLineDash([1, 3]);
      context.arc(pix_x, pix_y, size, 2 * Math.PI, false);
      context.stroke();
      context.beginPath();
      context.setLineDash([]);
      context.fillStyle = color;
      context.arc(pix_x, pix_y, size / 3, 0, 2 * Math.PI, false);
      context.fill();
      context.stroke();
    } else if (star.t == "Oc") {
      context.lineWidth = 2;
      context.setLineDash([1, 3]);
      context.arc(pix_x, pix_y, size, 2 * Math.PI, false);
      context.stroke();
      context.beginPath();
      context.setLineDash([1, 3]);
      context.arc(pix_x, pix_y, size / 3, 0, 2 * Math.PI, false);
      context.fill();
      context.stroke();
      context.setLineDash([]);
    } else if (star.t == "Ne") {
      context.lineWidth = 1;
      context.moveTo(pix_x - size, pix_y - size);
      var f = 4;
      context.bezierCurveTo(
        pix_x + f * size,
        pix_y - size,
        pix_x - f * size,
        pix_y + size,
        pix_x + size,
        pix_y + size,
      );
      context.stroke();
      context.beginPath();
      context.fillStyle = color;
      context.arc(pix_x, pix_y, size / 3, 0, 2 * Math.PI, false);
      context.fill();
      context.stroke();
    } else if (star.t == "U") {
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(pix_x - size, pix_y);
      context.lineTo(pix_x, pix_y + size);
      context.lineTo(pix_x + size, pix_y);
      context.lineTo(pix_x, pix_y - size);
      context.lineTo(pix_x - size, pix_y);
      context.fillStyle = "black";
      context.fill();
      context.stroke();
    } else {
      context.arc(pix_x, pix_y, size, 0, 2 * Math.PI, false);
      context.fill();
      context.stroke();
    }
  }
  if (star.name || highlight >= 2) {
    if (star.t == "Ca") {
      color = global_style.constelations;
    }
    context.strokeStyle = color;
    context.fillStyle = color;
    if (star.t == "Ca") {
      context.font = largeF("Sans", 4);
      context.textBaseline = "middle";
      context.textAlign = "center";
      context.fillText(star.name, pix_x, pix_y);
    } else {
      let text = star.name ? star.name : "";
      if (star.t == "S" && !global_show_star_names && highlight < 3) text = "";
      let text_extra = [];
      let name_extra = [];
      if (highlight > 1) {
        context.font = largeF("Sans", 6);
        if (highlight == 3) {
          if (star.AM != -1) text_extra.push("m=" + star.AM.toFixed(1));
          if (star.s) {
            text_extra.push(formatSize(star.s));
          }
          if ("n2" in star) {
            name_extra = star.n2;
          }
        }
      } else {
        context.font = largeF("Sans", 3);
      }
      context.textBaseline = "bottom";
      context.textAlign = "start";
      context.fillText(text, pix_x + size + 1, pix_y - size - 1);
      if (text_extra) {
        context.textBaseline = "top";
        context.fillText(
          text_extra.join(", "),
          pix_x + size + 1,
          pix_y - size / 2 - 1,
        );
        context.textBaseline = "bottom";
      }
      if (name_extra) {
        context.textBaseline = "top";
        context.fillText(
          name_extra.join(", "),
          pix_x + size + 1,
          pix_y + 2 * size - 1,
        );
        context.textBaseline = "bottom";
      }
    }
  }
  return result;
}

export function plotLines(camRays) {
  if (!global_show_obj.Ca) return;
  for (var i = 0; i < constellation_lines.length; i++) {
    line = constellation_lines[i];
    var p1 = projectToCamera(line.r0, line.d0, camRays, false);
    var p2 = projectToCamera(line.r1, line.d1, camRays, false);
    if (!p1 || !p2) continue;
    context.beginPath();
    context.strokeStyle = global_style.constelations;
    context.lineWidth = 1;
    context.moveTo(p1.x * canvas.width, p1.y * canvas.height);
    context.lineTo(p2.x * canvas.width, p2.y * canvas.height);
    context.stroke();
  }
}

export function plotCross() {
  context.strokeStyle = global_style.cross;
  context.fillStyle = global_style.cross;
  context.lineWidth = 3;
  var dirs = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  var length = 50;
  var offset = 10;
  for (var i = 0; i < dirs.length; i++) {
    context.moveTo(
      canvas.width / 2 + offset * dirs[i][0],
      canvas.height / 2 + offset * dirs[i][1],
    );
    context.lineTo(
      canvas.width / 2 + length * dirs[i][0],
      canvas.height / 2 + length * dirs[i][1],
    );
  }
  context.stroke();
}

export function plotBearing(xyz) {
  context.beginPath();
  context.strokeStyle = global_style.bearing;
  context.fillStyle = global_style.bearing;
  context.lineWidth = 5;
  context.arc(canvas.width / 2, canvas.height / 2, 10, 0, 2 * Math.PI, false);
  context.moveTo(canvas.width / 2, canvas.height / 2);
  var dx = xyz.x;
  var dy = -xyz.y;
  var r = 1 / Math.sqrt(dx * dx + dy * dy);
  dx = dx * r;
  dy = dy * r;
  var length = 100;
  var pos = xyzTo2d(xyz);
  if (pos) {
    var px = canvas.width * (pos.x - 0.5);
    var py = canvas.height * (pos.y - 0.5);
    var dist = Math.sqrt(px * px + py * py);
    if (dist < length) length = dist;
  }
  context.lineTo(
    canvas.width / 2 + dx * length,
    canvas.height / 2 + dy * length,
  );
  var updn =
    (dy > 0 ? "Down" : "Up") +
    " " +
    Math.abs((Math.atan2(-xyz.y, xyz.z) / Math.PI) * 180).toFixed(1) +
    "\u00b0";
  var left =
    (dx > 0 ? "Right" : "Left") +
    " " +
    Math.abs((Math.atan2(xyz.x, xyz.z) / Math.PI) * 180).toFixed(1) +
    "\u00b0";
  context.stroke();
  context.lineWidth = 0;
  context.font = largeF("Serif", 6);
  context.strokeStyle = global_style.bearing;
  context.fillStyle = global_style.bearing;
  context.textBaseline = "middle";
  context.textAlign = "end";
  context.fillText(updn, canvas.width - 5, canvas.height / 2);
  context.textAlign = "center";
  context.textBaseline = "bottom";
  context.fillText(left, canvas.width / 2, canvas.height - 5);
}

export function logObject(thestar) {
  if (
    thestar.name == "Sirius" ||
    thestar.name == "Mars" ||
    thestar.name == "Jupiter" ||
    thestar.name == "Rigel"
  ) {
    document.getElementById("object_log").style.display = "inline";
    if (1) {
      let ray = rayFromPos(thestar.RA, thestar.DE);
      let alt = (Math.asin(ray[2]) / Math.PI) * 180;
      let az = (Math.atan2(ray[0], ray[1]) / Math.PI) * 180;
      if (az < 0) az += 360;
      formatLatLon(thestar.name + "_alt", alt, "+", "-");
      formatLatLon(thestar.name + "_az", az, "+", "-");
    } else {
      let alt = thestar.RA / 15;
      let az = thestar.DE;
      formatLatLon(thestar.name + "_alt", alt, "", "-");
      formatLatLon(thestar.name + "_az", az, "+", "-");
    }
  }
}

export function getSolarSystemObject(p) {
  var r2d = 180 / Math.PI;
  var d2r = Math.PI / 180;
  var rLat = gdata.lat * d2r;
  var rLon = gdata.lon * d2r;
  var date = new Date();
  // actually same
  //var jd = gdata.time * 1e-3 / 86400.0 + 2440587.5;
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
}

export function updateDebugTime(v) {
  var mins = Math.floor(v / 60000);
  var h = Math.floor(mins / 60) % 24;
  var m = mins % 60;
  document.getElementById("utc_time").innerHTML =
    ("" + h).padStart(2, "0") + ":" + (m + "").padStart(2, "0");
}

export function validAlignType(t) {
  if (!global_align_on_dso) return t == "S" || t == "P";
  return t != "Ca";
}

export function plotStars() {
  var start = Date.now();

  if (
    canvas.width != document.body.clientWidth ||
    canvas.height != document.body.clientHeight
  ) {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
  }

  global_targets_list = [];
  gdata.time = Date.now();
  updateDebugTime(gdata.time);
  var camRays = getCameraRays();
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = global_style.star;

  for (var i = 0; i < allstars.length; i++) {
    var st = allstars[i].t;

    if (st == "P") {
      let pos = getSolarSystemObject(allstars[i].name);
      allstars[i].RA = pos.RA;
      allstars[i].DE = pos.DE;
    }

    //logObject(allstars[i]);

    var mag = allstars[i].AM;
    if (
      (st == "S" && mag > global_mag) ||
      (st != "S" && mag > global_dso_mag) ||
      !global_show_obj[st]
    ) {
      i = allstars_index[st] - 1;
      continue;
    }
    var highlight = 1;
    if (i == global_target_index || i == global_align_index) highlight = 0;
    var pos = plotStar(allstars[i], camRays, highlight);
    // select only stars if not aligned
    // if aligned select all but constellations
    var waiting_for_align = global_expecting_select == selectAlignWithTimer;
    if (pos && st != "Ca" && (validAlignType(st) || !waiting_for_align)) {
      pos.index = i;
      global_targets_list.push(pos);
    }
  }
  if (global_align_index >= 0 && global_align_index != global_target_index) {
    plotStar(allstars[global_align_index], camRays, 2);
  }
  if (global_target_index >= 0) {
    var star = allstars[global_target_index];
    var xyz = cameraBearing(star.RA, star.DE, camRays);
    plotBearing(xyz);
    var target_pos = plotStar(star, camRays, 3);
    // handle a case were target < mag but it is valid align target
    // ususally it means it is shown due to search
    if (target_pos && validAlignType(star.t)) {
      target_pos.index = global_target_index;
      var found = false;
      for (var i = 0; i < global_targets_list.length; i++) {
        if (global_targets_list[i].index == target_pos.index) {
          found = true;
          break;
        }
      }
      if (!found) {
        global_targets_list.push(target_pos);
      }
    }
  } else if (global_use_gyro) {
    plotCross();
  }
  plotLines(camRays);
  plotAltAz(camRays[2]);
  var passed = Date.now() - start;
  if (passed > global_expected_frame_rate_ms / 2) {
    setTimeout(plotStars, global_expected_frame_rate_ms);
  } else {
    setTimeout(plotStars, global_expected_frame_rate_ms - passed);
  }
}

export function plotAltAz(fwd) {
  var alt = (Math.asin(fwd[2]) / Math.PI) * 180;
  var az = (Math.atan2(fwd[0], fwd[1]) / Math.PI) * 180;
  alt = "Alt:" + alt.toFixed(1);
  if (az < 0) az = 360 + az;
  az = "Az:" + az.toFixed(1);
  context.font = largeF("Sans", 5);
  context.textBaseline = "bottom";
  context.textAlign = "end";
  context.fillStyle = global_style.altaz;
  context.fillText(alt, canvas.width - 5, canvas.height - 5);
  context.textAlign = "start";
  context.fillText(az, 5, canvas.height - 5);
}

export function selectTarget(index) {
  findTargetByName();
  global_target_index = index;
  showHideInfoIcon();

  //global_expecting_select = null;
}

export function selectionEvent(e) {
  let x = e.clientX;
  let y = e.clientY;
  let min_dist = 1e100;
  let min_index = -1;
  for (var i = 0; i < global_targets_list.length; i++) {
    let dx = global_targets_list[i].x - x;
    let dy = global_targets_list[i].y - y;
    let dist = dx * dx + dy * dy;
    if (min_dist > dist) {
      min_dist = dist;
      min_index = global_targets_list[i].index;
    }
  }
  if (global_expecting_select) {
    global_expecting_select(min_index);
  }
}

export function isOpenWikiAllowed() {
  var has_obj = global_target_index >= 0 && allstars[global_target_index].name;
  if (!has_obj) return false;
  var enabled = document.getElementById("wiki_info_opt").value;
  if (enabled == "no") return false;
  var nm_enabled = enabled == "always";
  if (global_style == global_night_style && !nm_enabled) return false;
  return true;
}

export function showObjectInfo() {
  if (isOpenWikiAllowed()) {
    const regex = /^M(\d*)$/gm; // identify Messier objects and target them by their full name
    const ngc_regex = /^(NGC|IC)(\d*)$/gm; // identify NGC/IC objects and target them by their full name
    var src_name = allstars[global_target_index].name;
    var target_name = "";
    var match_target_messier = regex.exec(src_name);
    var match_target_ngc = ngc_regex.exec(src_name);
    if (match_target_messier) {
      target_name = "Messier " + match_target_messier[1];
    } else if (match_target_ngc) {
      target_name = match_target_ngc[1] + " " + match_target_ngc[2];
    } else {
      target_name = src_name;
    }
    showWiki(
      "https://en.wikipedia.org/w/index.php?search=" +
        encodeURIComponent(target_name),
    );
  }
}

export function wikiInfoConfig() {
  showHideInfoIcon();
}

export function showHideInfoIcon() {
  var el = document.getElementById("show_info");
  if (isOpenWikiAllowed()) el.style.display = "block";
  else el.style.display = "none";
}

export function hideWiki() {
  document.getElementById("wiki_info").style.display = "none";
  document.getElementById("wiki_iframe").src = "";
}

export function showWiki(url) {
  document.getElementById("wiki_iframe").src = url;
  document.getElementById("wiki_info").style.display = "inline";
}

export function formatLatLon(id, deg, pos, neg) {
  var direction = deg >= 0 ? pos : neg;
  deg = Math.abs(deg);
  var ideg = Math.floor(deg);
  var min = 60 * (deg - ideg);
  var imin = Math.floor(min);
  var sec = 60 * (min - imin);
  var msg = direction + ideg + "\u00b0" + imin + "'" + sec.toFixed(1) + "''";
  document.getElementById(id).innerHTML = msg;
}

export function showpos(position) {
  var latlon = position.coords.latitude + "," + position.coords.longitude;
  gdata.lat = position.coords.latitude;
  gdata.lon = position.coords.longitude;
  formatLatLon("lat", gdata.lat, "N", "S");
  formatLatLon("lon", gdata.lon, "E", "W");
  document.getElementById("gps").style.display = "none";
}

export function requestGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showpos);
  }
}

export function getLocation() {
  requestGeolocation();
  setTimeout(getLocation, 600 * 1000);
}

export function gyroListener(event) {
  if (!(event.alpha === null)) {
    gdata.alpha_gyro = event.alpha;
    gdata.beta = event.beta;
    gdata.gamma = event.gamma;
    document.getElementById("orient").innerHTML = "";
  } else {
    document.getElementById("orient").innerHTML = "No Gyro";
  }
  formatValue("ang_a", event.alpha);
  formatValue("ang_b", event.beta);
  formatValue("ang_g", event.gamma);
}

export function deviceOrientationListenerIOS(event) {
  if (!(event.webkitCompassHeading === null)) {
    var abs_alpha = 360 - event.webkitCompassHeading;
    if (global_use_compass) gdata.alpha = abs_alpha;
    gdata.compass_alpha = abs_alpha;
    formatValue("ang_c", abs_alpha);
  } else {
    noCompass();
    formatValue("ang_c", null);
  }
}

export function deviceOrientationListener(event) {
  if (!(event.alpha === null)) {
    if (global_use_compass) gdata.alpha = event.alpha;
    gdata.compass_alpha = event.alpha;
  } else {
    noCompass();
  }
  formatValue("ang_c", event.alpha);
}

export function noCompass() {
  global_use_compass = false;
  document.getElementById("nocompass_button").style.display = "inline";
  document.getElementById("compass_button").style.display = "none";
  document.getElementById("hand_button").style.display = "none";
}

export function manualMode() {
  global_use_compass = false;
  gdata.alpha_user_offset = gdata.alpha;
  gdata.alpha = 0;
  document.getElementById("compass_button").style.display = "inline";
  document.getElementById("hand_button").style.display = "none";
}

export function compassMode() {
  global_use_compass = true;
  gdata.alpha_user_offset = 0;
  gdata.alpha = gdata.compass_alpha;
  document.getElementById("compass_button").style.display = "none";
  document.getElementById("hand_button").style.display = "inline";
}

export function manualDown(e) {
  global_prev_xy = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  global_toch_start_time = Date.now();
  if (e.touches.length == 2 && global_allow_pinch_zoom) {
    let dx = e.touches[0].clientX - e.touches[1].clientX;
    let dy = e.touches[0].clientY - e.touches[1].clientY;
    global_start_zoom = global_fov;
    global_start_zoom_size = Math.sqrt(dx * dx + dy * dy);
  }
}

export function manualMove(e) {
  if (!global_prev_xy) return;

  var xy = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.touches.length == 2 && global_start_zoom && global_allow_pinch_zoom) {
    let dx = e.touches[0].clientX - e.touches[1].clientX;
    let dy = e.touches[0].clientY - e.touches[1].clientY;
    let new_size = Math.sqrt(dx * dx + dy * dy);
    let scale = new_size / Math.max(global_start_zoom_size, 0);
    let max_fov = global_fov_values[global_fov_values.length - 1];
    let min_fov = global_fov_values[0];
    let fov =
      (2 *
        180 *
        Math.atan(Math.tan(((global_fov / 180.0) * Math.PI) / 2) / scale)) /
      Math.PI;
    let new_global_fov = Math.max(min_fov, Math.min(max_fov, Math.round(fov)));
    if (new_global_fov != global_fov) {
      global_fov = new_global_fov;
      global_start_zoom_size = new_size;
      global_start_zoom = global_fov;
      updateFOV();
    }
  }

  moveSky(global_prev_xy, xy);
  global_prev_xy = xy;
  global_toch_start_time = null;
}
export function manualUp(e) {
  if (!global_prev_xy) return;

  global_start_zoom = null;
  global_start_zoom_size = null;

  var touch_end = Date.now();
  if (global_toch_start_time && touch_end - global_toch_start_time < 500) {
    // no move and there is less then 0.5s delay between toch and release
    selectionEvent({ clientX: global_prev_xy.x, clientY: global_prev_xy.y });
  }
  global_prev_xy = null;
  global_toch_start_time = null;
}
export function moveSky(prev, cur) {
  if (global_use_compass) return;
  if (!prev || !cur) return;
  var fov = getFOV().lr;
  var da = ((cur.x - prev.x) / canvas.width) * fov;
  gdata.alpha_user_offset += da;
}

export function dontPropMouseDown(lst, events_list) {
  for (var i = 0; i < lst.length; i++) {
    var elements = document.getElementsByClassName(lst[i]);
    for (var j = 0; j < elements.length; j++) {
      for (var k = 0; k < events_list.length; k++) {
        elements[j].addEventListener(events_list[k], function (e) {
          e.stopPropagation();
        });
      }
    }
  }
}

export function setupiOSOrientationEvents() {
  if (window.DeviceOrientationEvent) {
    if ("ondeviceorientation" in window) {
      window.addEventListener(
        "deviceorientation",
        deviceOrientationListenerIOS,
      );
      window.addEventListener("deviceorientation", gyroListener);
      compassMode();
    } else {
      unsupported();
    }
  } else {
    unsupported();
  }
  setUseGyro(false);
}

export function setupOrientationEvents() {
  if (window.DeviceOrientationEvent) {
    if ("ondeviceorientationabsolute" in window) {
      window.addEventListener(
        "deviceorientationabsolute",
        deviceOrientationListener,
      );
      window.addEventListener("deviceorientation", gyroListener);
      compassMode();
    } else if ("ondeviceorientation" in window) {
      window.addEventListener("deviceorientation", gyroListener);
      noCompass();
    } else {
      unsupported();
    }
  } else {
    unsupported();
  }
  setUseGyro(false);
}

export function formatValue(uid, v) {
  var msg = "";
  if (v === undefined || v == null) {
    msg = "No";
  } else {
    msg = v.toFixed(1);
  }
  document.getElementById(uid).innerHTML = msg;
}

export function parseCSV(v) {
  var res = new Array();
  var rows = v.split("\n");
  for (var r = 0; r < rows.length; r++) {
    var parsed_row = new Array();
    if (rows[r].trim() == "") continue;
    var cols = rows[r].split(",");
    for (var c = 0; c < cols.length; c++) {
      parsed_row.push(cols[c].trim());
    }
    res.push(parsed_row);
  }
  return res;
}

export function parseRA(svalue) {
  const re_float = /^(\d+\.\d+)$/;
  const re_colon = /^(\d+):(\d+)(?::(\d+(.\d+)?))?$/;
  const re_hms =
    /^(\d+)[hH \t]\s*(\d+)[mM'′]\s*(?:(\d+(.\d+)?)(?:s|S|′′|″|''|"))?$/;
  const re_space = /^(\d+)\s+(\d+)(?:\s+(\d+(.\d+)?))?$/;
  var res = svalue.match(re_float);
  var deg = null;
  if (res) {
    deg = parseFloat(res[1]);
    if (deg < 0 || deg > 360) return null;
    return deg;
  }
  res =
    svalue.match(re_colon) || svalue.match(re_hms) || svalue.match(re_space);
  if (!res) return null;
  var h = parseInt(res[1]);
  var m = parseInt(res[2]);
  var s = 0;
  if (res[3]) {
    s = parseFloat(res[3]);
  }
  if (h >= 24 || m >= 60 || s >= 60) {
    return null;
  }
  deg = 15 * (h + (60 * m + s) / 3600.0);
  return deg;
}

export function parseDEC(svalue) {
  const re_float = /^([+-−]?\d+.\d+?)$/;
  const re_colon = /^([-+−]?)(\d+):(\d+)(?::(\d+(.\d+)?))?$/;
  const re_dms =
    /^([-+−]?)(\d+)[dD° \t]\s*(\d+)[mM'′]\s*(?:(\d+(.\d+)?)(?:s|S|″|′′|''|"))?$/;
  const re_space = /^([-+−]?)(\d+)\s+(\d+)(?:\s+(\d+(.\d+)?))?$/;
  var res = svalue.match(re_float);
  if (res) {
    var deg = parseFloat(res[1]);
    if (deg < -90 || deg > 90) return null;
    return deg;
  }
  res =
    svalue.match(re_colon) || svalue.match(re_dms) || svalue.match(re_space);
  if (!res) return null;
  var sig = res[1] == "-" || res[1] == "−" ? -1.0 : 1.0;
  var d = parseInt(res[2]);
  var m = parseInt(res[3]);
  var s = 0;
  if (res[4]) {
    s = parseFloat(res[3]);
  }
  if (d > 90 || m >= 60 || s >= 60) return null;
  return sig * (d + (60 * m + s) / 3600.0);
}

export function toggleUI(link_id, ui_id) {
  var ui = document.getElementById(ui_id);
  if (ui.style.display == "none") {
    ui.style.display = "inline";
    document.getElementById(link_id).innerHTML = "[hide]";
  } else {
    ui.style.display = "none";
    document.getElementById(link_id).innerHTML = "[edit]";
  }
}

export function htmlEscape(v) {
  return v
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function discardUserDSO() {
  loadUserDSO();
  toggleEditDSO();
}

export function toggleEditDSO() {
  toggleUI("edit_user_dso", "dso_edit");
}

export function saveUserDSO() {
  resetUserDSOsAndMergeNewToAllStars();
  var text = document.getElementById("user_dso").value;
  var res = parseUserDSO(text);
  var dso_errors = document.getElementById("dso_errors");
  if (res[1].length > 0) {
    var msg = "<b>Errors:</b><ol>";
    for (var i = 0; i < res[1].length; i++) {
      msg = msg + "<li>" + htmlEscape(res[1][i]) + "</li>";
    }
    msg = msg + "</ol>";
    dso_errors.innerHTML = msg;
  } else {
    dso_errors.innerHTML = "";
    window.localStorage.setItem("user_dso", text);
    resetUserDSOsAndMergeNewToAllStars(res[0]);
    toggleEditDSO();
  }
}

export function parseUserDSO(value) {
  var errors = [];
  var dsos = new Array();
  var names = new Set(allstars_index_name.names);
  var new_names = new Set();
  var csv = parseCSV(value);
  for (var i = 0; i < csv.length; i++) {
    if (csv[i].length < 3) {
      errors.push("Too few colums in line " + (i + 1));
      continue;
    }
    var name = csv[i][0];
    if (name == "") {
      errors.push("Empty object name in line " + (i + 1));
      continue;
    }
    var sname = normalizeName(name);
    if (names.has(sname)) {
      errors.push("Object " + name + " exists in data base");
      continue;
    }
    if (new_names.has(sname)) {
      errors.push("Duplicate object " + name);
      continue;
    }
    var ra = parseRA(csv[i][1]);
    if (ra === null) {
      errors.push("Invalid RA value " + csv[i][1]);
      continue;
    }
    var de = parseDEC(csv[i][2]);
    if (de === null) {
      errors.push("Invalid DEC value " + csv[i][2]);
      continue;
    }
    new_names.add(sname);
    dsos.push({ name: name, RA: ra, DE: de, AM: -1, t: "U" });
  }
  return [dsos, errors];
}
export function shortenArray(a, l) {
  while (a.length > l) {
    a.pop();
  }
}

export function resetUserDSOsAndMergeNewToAllStars(dsos = []) {
  shortenArray(allstars, allstars_db_specs.items);
  shortenArray(allstars_index_name.names, allstars_db_specs.index_name_size);
  shortenArray(allstars_index_name.index, allstars_db_specs.index_name_size);
  for (var i = 0; i < dsos.length; i++) {
    var pos = allstars.length;
    allstars.push(dsos[i]);
    allstars_index_name.names.push(normalizeName(dsos[i].name));
    allstars_index_name.index.push(pos);
  }
  allstars_index["U"] = allstars.length;
  if (global_target_index >= allstars.length) {
    selectTarget(-1);
  }
}

export function setWatchList(wl) {
  selectWatchList(-1);
  global_watchlist = wl;
}

export function nextWatchList() {
  if (global_watchlist.current_list + 1 >= global_watchlist.lists.length) {
    selectWatchList(-1);
  } else {
    selectWatchList(global_watchlist.current_list + 1);
  }
}

export function prevWatchList() {
  if (global_watchlist.current_list <= -1) {
    selectWatchList(global_watchlist.lists.length - 1);
  } else {
    selectWatchList(global_watchlist.current_list - 1);
  }
}

export function watchListItemUpdate(offset) {
  if (
    global_watchlist.current_list < 0 ||
    global_watchlist.current_list >= global_watchlist.lists.length
  )
    return;
  var list = global_watchlist.lists[global_watchlist.current_list];

  // handle case you selected a different item and now by pressing '<' or '>' you select the target back
  if (global_watchlist.current_index != global_target_index) offset = 0;
  global_watchlist.current_item =
    (global_watchlist.current_item + offset + list.length) % list.length;
  findTargetByName(list[global_watchlist.current_item].name);
  global_watchlist.current_index = global_target_index;
  markTarget();
}

export function markTarget() {
  var msgEl = document.getElementById("wl_target_name");
  if (global_watchlist.current_list == -1) {
    msgEl.innerHTML = "";
  } else {
    var item =
      global_watchlist.lists[global_watchlist.current_list][
        global_watchlist.current_item
      ];
    var name = item.name;
    var comment = item.comment == "" ? "" : " (" + item.comment + ")";
    msgEl.innerHTML =
      global_target_index == -1 ? "?" + name + "?" : name + comment;
  }
}

export function selectWatchList(index) {
  if (index < 0 || index >= global_watchlist.lists.length) {
    findTargetByName();
    document.getElementById("wl_ctl").style.display = "none";
    document.getElementById("wl_sel").innerHTML = "None";
    global_watchlist.current_list = -1;
    global_watchlist.current_item = -1;
    global_watchlist.current_index = -1;
  } else {
    document.getElementById("wl_ctl").style.display = "inline";
    document.getElementById("wl_sel").innerHTML = global_watchlist.names[index];
    global_watchlist.current_list = index;
    global_watchlist.current_item = 0;
    findTargetByName(global_watchlist.lists[index][0].name);
    global_watchlist.current_index = global_target_index;
  }
  markTarget();
}

export function tokenizeWL(text) {
  const re = /(,|:|"[^"]*"|\s+|\(|\)|[^\s:,"\(\)]*)/;
  const ws = /^\s+$/;
  var items = text.split(re);
  return items.filter((x) => x.trim() != "" && x != ",");
}

export function parseWatchList(text) {
  var wl = {
    lists: [],
    names: [],
    current_list: -1,
    current_item: -1,
  };
  var not_found = [];
  var index = {};
  var items = tokenizeWL(text);
  var list_name = "default";
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    item = item.replace(/"/g, "");
    if (i + 1 < items.length && items[i + 1] == ":") {
      list_name = item;
      i += 1;
      continue;
    }
    if (item == "(") {
      i++;
      var start = i;
      while (i < items.length && items[i] != ")") i++;
      var end = i;
      if (end > start) {
        var comment = items[start];
        start++;
        while (start < end) {
          comment = comment + " " + items[start];
          start++;
        }
        if (list_name) {
          var arr = wl.lists[index[list_name]];
          if (arr.length >= 1) {
            arr[arr.length - 1].comment = comment;
          }
        }
      }
      continue;
    }
    var nitem = normalizeName(item);
    if (allstars_index_name.names.findIndex((x) => x == nitem) == -1) {
      not_found.push(item);
    }
    if (!(list_name in index)) {
      index[list_name] = wl.names.length;
      wl.names.push(list_name);
      wl.lists.push(new Array());
    }
    wl.lists[index[list_name]].push({ name: item, comment: "" });
  }
  return [wl, not_found];
}

export function loadWL() {
  var wl_text = window.localStorage.getItem("watch_list");
  if (!wl_text) wl_text = "";
  var wl = parseWatchList(wl_text);
  global_watchlist = wl[0];
  document.getElementById("user_wl").value = wl_text;
}

export function toggleEditWL() {
  toggleUI("list_edit_toggle", "wl_edit");
}

export function saveWL() {
  var text = document.getElementById("user_wl").value;
  var wl_all = parseWatchList(text);
  var wl = wl_all[0];
  var errors = wl_all[1];
  var emsg = document.getElementById("wl_errors");
  if (errors.length > 0) {
    var msg = "Not Found:";
    for (var i = 0; i < errors.length; i++) {
      if (i > 0) msg = msg + ", " + errors[i];
      else msg = msg + errors[i];
    }
    emsg.innerHTML = msg;
    return;
  }
  emsg.innerHTML = "";
  setWatchList(wl);
  window.localStorage.setItem("watch_list", text);
  toggleEditWL();
}

export function discardWL() {
  var wl_text = window.localStorage.getItem("watch_list");
  if (!wl_text) wl_text = "";
  document.getElementById("user_wl").value = wl_text;
  toggleEditWL();
}

export function iOSOrientation() {
  //Notification.requestPermission().then(response => {
  DeviceOrientationEvent.requestPermission()
    .then((response) => {
      if (response == "granted") {
        document.getElementById("allow_orientation").style.display = "none";
        setupiOSOrientationEvents();
      }
    })
    .catch(console.error);
}

export function setupGyros() {
  //if (typeof window.Notification.requestPermission === 'export function') {
  if (
    typeof window.DeviceOrientationEvent.requestPermission === "export function"
  ) {
    document.getElementById("allow_orientation").style.display = "inline";
  } else {
    setupOrientationEvents();
  }
}

export function switchNightMode(is_night) {
  global_style = is_night ? global_night_style : global_day_style;
  showHideInfoIcon();
}

export function incDecLF(dsize) {
  var storage = window.localStorage;
  var fs = storage.getItem("user_fs");
  var fs = fs ? parseInt(fs) : 0;
  fs += dsize;
  if (fs < 0) fs = 0;
  if (fs > 10) fs = 10;
  global_large_font = fs;
  storage.setItem("user_fs", global_large_font);
  document.getElementById("lf_val").innerHTML = "" + global_large_font;
}

export function getShowOnStartup(show) {
  var storage = window.localStorage;
  var qs_hide = storage.getItem("qs_hide_v2");
  var qs_hide = qs_hide ? parseInt(qs_hide) : 0;
  return !qs_hide;
}

export function showOnStartup(show, src) {
  window.localStorage.setItem("qs_hide_v2", show ? "0" : "1");
  if (src != 1) document.getElementById("qs_hide_1").checked = !show;
  if (src != 2) document.getElementById("qs_hide_2").checked = show;
}

export function dsoMagUpdate(offset) {
  global_dso_mag = global_dso_mag + offset;
  if (global_dso_mag < 3) global_dso_mag = 3;
  else if (global_dso_mag > 14) global_dso_mag = 14;
  document.getElementById("dso_level_val").innerHTML = "" + global_dso_mag;
  saveMagVal(global_dso_mag, "dso_level_val");
}

export function loadUserDSO() {
  var storage = window.localStorage;
  var user_dso = storage.getItem("user_dso");
  document.getElementById("user_dso").value = user_dso;
  var dso = user_dso ? parseUserDSO(user_dso)[0] : [];
  resetUserDSOsAndMergeNewToAllStars(dso);
}

export function configureValueOption(target, default_val, onchange) {
  var name = "opt_" + target;
  var element = document.getElementById(target);
  var value = window.localStorage.getItem(name);
  if (!value) {
    value = default_val;
  }

  element.value = value;
  onchange(value);
  element.addEventListener("change", function () {
    onchange(this.checked);
    window.localStorage.setItem(name, this.value);
  });
}

export function configureCheckboxOption(target, default_val, onchange) {
  var name = "opt_" + target;
  var element = document.getElementById(target);
  var svalue = window.localStorage.getItem(name);
  if (!svalue) {
    svalue = default_val ? "1" : "0";
  }

  var checked = !!parseInt(svalue);
  element.checked = checked;
  onchange(checked);
  element.addEventListener("change", function () {
    onchange(this.checked);
    window.localStorage.setItem(name, this.checked ? "1" : "0");
  });
}

export function saveMagVal(val, name) {
  window.localStorage.setItem("mag_" + name, "" + val);
}
export function configSaveMag() {
  var opts = [
    {
      name: "dso_level_val",
      setv: (x) => {
        global_dso_mag = x;
        dsoMagUpdate(0);
      },
    },
    {
      name: "mag_val",
      setv: (x) => {
        global_mag = x;
        starMagUpdate(0);
      },
    },
  ];
  for (var i = 0; i < opts.length; i++) {
    var c = opts[i];
    var sval = window.localStorage.getItem("mag_" + c.name);
    if (!sval) sval = document.getElementById(c.name).innerHTML;
    c.setv(parseInt(sval));
  }
}

export function setupConfigurableElements() {
  configureCheckboxOption("small_screen", false, smallScreen);
  configureCheckboxOption("NM_checked", false, switchNightMode);
  configureCheckboxOption("align_dso_checked", false, (v) => {
    global_align_on_dso = v;
  });
  configureCheckboxOption("show_star_names_checked", true, (v) => {
    global_show_star_names = v;
  });
  configureCheckboxOption("P_checked", true, (v) => {
    global_show_obj.P = v;
  });
  configureCheckboxOption("Oc_checked", true, (v) => {
    global_show_obj.Oc = v;
  });
  configureCheckboxOption("Gc_checked", true, (v) => {
    global_show_obj.Gc = v;
  });
  configureCheckboxOption("Ga_checked", true, (v) => {
    global_show_obj.Ga = v;
  });
  configureCheckboxOption("Ne_checked", true, (v) => {
    global_show_obj.Ne = v;
  });
  configureCheckboxOption("Ca_checked", true, (v) => {
    global_show_obj.Ca = v;
  });
  configureCheckboxOption("U_checked", true, (v) => {
    global_show_obj.U = v;
  });
  configureCheckboxOption("wiki_info_opt", "day", (v) => {});

  // turn off by default on iOS
  var agent = navigator.userAgent;
  var iOS = /iPad|iPhone|iPod/.test(agent);
  configureCheckboxOption("pinch_zoom", !iOS, (v) => {
    global_allow_pinch_zoom = v;
  });
}
