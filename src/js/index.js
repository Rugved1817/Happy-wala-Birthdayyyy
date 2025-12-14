//jshint esversion:8

import { isBDay } from "./ext/openDate.js";
import setPage from "./ext/setPage.js";
import { late, soon } from "./pages.js";
import { animate } from "./animation.js";
import { initCursorTrail } from "./cursorTrail.js";

/******************************************************* SETUP ************************************************************/

// Initialize cursor trail animation
initCursorTrail();

// Photo gallery will be shown when the card appears (handled in animation.js)

if (process.env.OPEN_DATE) {
  const status = isBDay();
  if (status === "IS_EARLY") setPage(soon);
  if (status === "IS_LATE") setPage(late);
  if (status === "ON_TIME") animate();
} else {
  animate();
}
