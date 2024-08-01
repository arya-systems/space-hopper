import fs from "fs";
import csv from "csv-parser";
import { parse } from "json2csv";

const global_dso_mag_limit = 14;
const global_mag_limit = 6;
const zeros = /^(.*)(([A-Z]+)[ 0]+)([^0].*)$/;

function normalize_name(name) {
  const m = zeros.exec(name);
  if (m) {
    const new_name = m[1] + m[3] + m[4];
    return normalize_name(new_name);
  }
  return name;
}

class DSODB {
  constructor() {
    this._db = {};
  }
  append(v) {
    const t = v["t"];
    if (!(t in this._db)) {
      this._db[t] = [];
    }
    this._db[t].push(v);
  }

  get json() {
    const index = {};
    const names = [];
    const poss = [];
    let result = [];
    for (const n in this._db) {
      this._db[n].sort((a, b) => a["AM"] - b["AM"]);
      if (!["Ca", "S"].includes(n)) {
        result = result.concat(this._db[n]);
        index[n] = result.length;
      }
    }
    result = result.concat(this._db["Ca"]);
    index["Ca"] = result.length;
    result = result.concat(this._db["S"]);
    index["S"] = result.length;
    index["U"] = result.length; // user points
    for (let i = 0; i < result.length; i++) {
      const v = result[i];
      if ("name" in v && v["t"] !== "Ca") {
        const obj_id = v["name"].toUpperCase();
        names.push(normalize_name(obj_id.toUpperCase()));
        poss.push(i);
        if ("n2" in v) {
          for (const alt_id of v["n2"]) {
            names.push(normalize_name(alt_id.toUpperCase()));
            poss.push(i);
          }
        }
      }
    }
    const nindex = { names: names, index: poss };
    return [result, index, nindex];
  }
}

function parse_ra(val) {
  const [h, m, s] = val.split(":");
  return 15 * (parseInt(h) + (60 * parseInt(m) + parseFloat(s)) / 3600);
}

function parse_de(val) {
  const [d, m, s] = val.split(":");
  const deg = parseInt(d);
  const sign = deg >= 0 ? 1 : -1;
  return sign * (Math.abs(deg) + (60 * parseInt(m) + parseFloat(s)) / 3600);
}

function get_OpenNGC_DSO(result) {
  // M45 is missing
  result.push({ DE: 24.11666, RA: 56.75, name: "M45", t: "Oc", AM: 1.6 });
  const ngc_mapping = {
    "*": null,
    "**": null,
    "*Ass": "Oc",
    OCl: "Oc",
    GCl: "Gc",
    "Cl+N": "Ne",
    G: "Ga",
    GPair: "Ga",
    GTrpl: "Ga",
    GGroup: "Ga",
    PN: "Ne",
    HII: "Ne",
    DrkN: "Ne",
    EmN: "Ne",
    Neb: "Ne",
    RfN: "Ne",
    SNR: "Ne",
    Nova: null,
    NonEx: null,
    Dup: null,
    Other: null,
  };
  const data = fs.readFileSync("OpenNGC/NGC.csv", "utf8").split("\n").slice(2);
  for (const row of data) {
    const columns = row.split(";");
    const object_id = columns[0];
    let object_type = ngc_mapping[columns[1]];
    if (object_type === null) continue;
    const ra = parse_ra(columns[2]);
    const de = parse_de(columns[3]);
    const size = columns[5] === "" ? 0 : parseFloat(columns[5]);
    let mag_str = columns[9];
    if (mag_str === "") {
      mag_str = columns[8];
      if (mag_str === "") continue;
    }
    const mag = parseFloat(mag_str);
    if (mag > global_dso_mag_limit) continue;
    let messier = columns[18] !== "" ? parseInt(columns[18]) : 0;
    // hack data
    if (object_id === "NGC5866") {
      messier = 102;
    }
    if (messier) {
      object_id = `M${messier}`;
    }
    let alt_names = null;
    if (columns[23] !== "") {
      alt_names = columns[23].split(",");
    }
    object_id = normalize_name(object_id);
    const entry = {
      RA: ra,
      DE: de,
      AM: mag,
      name: object_id,
      t: object_type,
      s: size,
    };
    if (alt_names) {
      entry["n2"] = alt_names;
    }
    result.push(entry);
  }
  return result;
}

function get_stars(allstars) {
  const starpos = {};
  const data = fs
    .readFileSync(
      "western_constellations_atlas_of_space/data/hygdata_v3/hygdata_v3.csv",
      "utf8",
    )
    .split("\n")
    .slice(1);
  for (const row of data) {
    const columns = row.split(",");
    const sid = columns[1];
    let name = columns[6] === "" ? null : columns[6];
    const ra = parseFloat(columns[7]) * 15.0;
    const de = parseFloat(columns[8]);
    if (sid !== "") {
      starpos[parseInt(sid)] = [ra, de, name];
    }
    const mag = parseFloat(columns[13]);
    if (mag <= global_mag_limit) {
      const star = { DE: de, RA: ra, AM: mag, t: "S" };
      if (name) {
        star["name"] = name;
      }
      allstars.push(star);
    }
  }
  return starpos;
}

function get_constellation_names() {
  const src_path =
    "western_constellations_atlas_of_space/data/processed/centered_constellations.csv";
  const names = {};
  const data = fs.readFileSync(src_path, "latin1").split("\n").slice(1);
  for (const row of data) {
    const columns = row.split(",");
    const name = columns[0];
    const code = columns[3];
    names[code] = name;
  }
  return names;
}

function get_center_ra_de(starset) {
  let sx = 0.0;
  let sy = 0.0;
  let sz = 0.0;
  for (const [ra, de] of starset) {
    const z = Math.sin((de * Math.PI) / 180);
    const xy = Math.cos((de * Math.PI) / 180);
    const x = Math.sin((ra * Math.PI) / 180) * xy;
    const y = Math.cos((ra * Math.PI) / 180) * xy;
    sx += x;
    sy += y;
    sz += z;
  }
  const norm = Math.sqrt(sx * sx + sy * sy + sz * sz);
  const x = sx / norm;
  const y = sy / norm;
  const z = sz / norm;
  let ra = (Math.atan2(x, y) * 180) / Math.PI;
  const de = (Math.asin(z) * 180) / Math.PI;
  if (ra < 0) {
    ra += 360;
  }
  return [ra, de];
}

function get_constellation_lines(starpos, names, cons) {
  const lines = [];
  const data = fs
    .readFileSync(
      "western_constellations_atlas_of_space/data/stellarium_western_asterisms/constellationship.fab",
      "utf8",
    )
    .split("\n");
  for (const line of data) {
    const row = line.split(" ");
    const name = names[row[0]];
    const starset = new Set();
    const filteredRow = row.filter((v) => v !== "");
    const N = parseInt(filteredRow[1]);
    const pairs = filteredRow.slice(2).map((v) => parseInt(v));
    for (let k = 0; k < N; k++) {
      const p0 = pairs[k * 2];
      const p1 = pairs[k * 2 + 1];
      const [r0, d0] = starpos[p0];
      const [r1, d1] = starpos[p1];
      starset.add([r0, d0]);
      starset.add([r1, d1]);
      const line = { r0, d0, r1, d1 };
      lines.push(line);
    }
    const [ra, de] = get_center_ra_de(starset);
    cons.push({ DE: de, RA: ra, AM: -1, name: name, t: "Ca" });
  }
  return lines;
}

function get_planets(dso) {
  for (const name of [
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
    "Neptune",
    "Uranus",
  ]) {
    dso.push({ DE: -1, RA: -1, AM: -1, name: name, t: "P" });
  }
}

function dumpjs(j, f) {
  if (Array.isArray(j)) {
    f.write("[");
    for (let i = 0; i < j.length; i++) {
      if (i > 0) {
        f.write(",");
      }
      dumpjs(j[i], f);
    }
    f.write("]");
  } else if (typeof j === "object") {
    f.write("{");
    const keys = Object.keys(j);
    for (let i = 0; i < keys.length; i++) {
      if (i > 0) {
        f.write(",");
      }
      const n = keys[i];
      f.write(JSON.stringify(n));
      f.write(":");
      dumpjs(j[n], f);
    }
    f.write("}");
  } else if (typeof j === "number") {
    const fv = j.toFixed(4);
    const stripped = fv.replace(/0+$/, "").replace(/\.$/, "");
    f.write(stripped);
  } else {
    f.write(JSON.stringify(j));
  }
}

function make_jsbd(dso, lines) {
  const f = fs.createWriteStream("jsdb.js");
  f.write(
    "//Generated from https://github.com/eleanorlutz/western_constellations_atlas_of_space\n",
  );
  f.write(
    "// License: https://github.com/eleanorlutz/western_constellations_atlas_of_space/blob/main/LICENSE (GPL)\n",
  );
  f.write(
    "// DSO data from https://github.com/mattiaverga/OpenNGC by CC-BY-SA-v4.0\n",
  );
  f.write(
    "// types: 'S' - star,'Ca' - constellation,  'Oc' - open cluster, 'Gc' = globular cluster, 'Ga' - galaxy, 'Ne' - nebula, 'P' - Planet\n",
  );
  const [db, index, nindex] = dso.json;
  f.write("var allstars_index = " + JSON.stringify(index) + ";\n");
  f.write("var allstars = ");
  dumpjs(db, f);
  f.write(";\n");
  f.write("var constellation_lines = ");
  dumpjs(lines, f);
  f.write(";\n");
  f.write("var allstars_index_name = " + JSON.stringify(nindex) + ";\n");
  f.write(
    `var allstars_db_specs={"items":${db.length},"index_size":${Object.keys(index).length},"index_name_size":${nindex["names"].length}};\n`,
  );
  f.end();
}

function create_db() {
  const objects = new DSODB();
  get_OpenNGC_DSO(objects);
  get_planets(objects);
  const mapping = get_stars(objects);
  const cnames = get_constellation_names();
  const lines = get_constellation_lines(mapping, cnames, objects);
  make_jsbd(objects, lines);
}

create_db();
