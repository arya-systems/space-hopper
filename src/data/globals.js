export var global_day_style = {
  cross: "blue",
  constelations: "yellow",
  bearing: "green",
  star: "white",
  altaz: "red",
  target: "cyan",
  align: "magenta",
};

export var global_show_obj = {
  S: true,
  Oc: true,
  Gc: true,
  Ca: true,
  Ga: true,
  Ne: true,
  P: true,
  U: true,
};

export var global_night_style = {
  cross: "red",
  constelations: "#880000",
  bearing: "red",
  star: "red",
  altaz: "red",
  target: "red",
  align: "#AA0000",
};

export var global_style = global_day_style;

export var global_align_on_dso = false;
export var global_show_star_names = true;
export var global_targets_list = [];
export var global_prev_xy = null;
export var global_start_zoom_size = null;
export var global_start_zoom = null;
export var global_allow_pinch_zoom = true;
export var global_toch_start_time = null;
export var global_target_index = -1;
export var global_align_index = -1;
export var global_expecting_select = null;
export var global_camera_projection = true;
export var global_expected_frame_rate_ms = 66;
export var global_use_compass = false;
export var global_dso_mag = parseInt(
  document.getElementById("dso_level_val").innerHTML,
);
export var global_large_font = 0;

export var global_fov_values = [7, 15, 30, 60, 90, 120, 150];
export var global_fov = 60;
export var global_mag = 4;
export var gdata = {
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
};

export var global_align_matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
export var global_use_gyro = false;
export var global_full_screen = false;

export var global_status = "";

export var global_watchlist = null;
