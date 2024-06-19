import { randomColor } from "./randomColor.js";

// randomly setting website color
document.querySelector(":root").style.setProperty("--randomColor", randomColor());
