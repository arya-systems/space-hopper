export default class JulianDate {
  //Special "Math.floor()" function used by gregorianDateToJulianDate()
  static INT(d) {
    if (d > 0) {
      return Math.floor(d);
    }
    if (d == Math.floor(d)) return d;
    return Math.floor(d) - 1;
  }

  static gregorianDateToJulianDate(year, month, day, hour, min, sec) {
    let isGregorian = true;
    if (
      year < 1582 ||
      (year == 1582 && (month < 10 || (month == 10 && day < 5)))
    ) {
      isGregorian = false;
    }

    if (month < 3) {
      year = year - 1;
      month = month + 12;
    }

    let b = 0;
    if (isGregorian) {
      let a = this.INT(year / 100.0);
      b = 2 - a + this.INT(a / 4.0);
    }

    let jd =
      this.INT(365.25 * (year + 4716)) +
      this.INT(30.6001 * (month + 1)) +
      day +
      b -
      1524.5;
    jd += hour / 24.0;
    jd += min / 24.0 / 60.0;
    jd += sec / 24.0 / 60.0 / 60.0;
    return jd;
  }
}
