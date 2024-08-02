vsop87a_full = vsop87a_xsmall;
vsop87a_full_velocities = vsop87a_milli_velocities;

setupGyros();
setupConfigurableElements();
configSaveMag();
// global drawing stuff
var canvas = document.getElementById("myCanvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
var context = canvas.getContext("2d");
setTimeout(getLocation, 500);
setTimeout(plotStars, 1000);
loadUserDSO();
loadWL();
incDecLF(0);
{
  let qs = getShowOnStartup();
  document.getElementById("quick_start").style.display = qs ? "inline" : "none";
  showOnStartup(qs, -1);
}
document.body.addEventListener("click", selectionEvent);
document.body.addEventListener("touchstart", manualDown);
document.body.addEventListener("touchend", manualUp);
document.body.addEventListener("touchcancel", manualUp);
document.body.addEventListener("touchmove", manualMove);
dontPropMouseDown(
  ["ui_but", "incdec_but", "config_div", "comp_but", "search_field"],
  ["click", "touchstart", "touchend", "touchmove", "touchcancel"],
);
global_expecting_select = selectTarget;

window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js?" + Date.now());
  }
});
