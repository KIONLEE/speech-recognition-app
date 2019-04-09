export default function getSource(imageName) {
  if (imageName === "ear") return require("./ear.png");
  if (imageName === "speaker") return require("./speaker.png");
  if (imageName === "playing_0") return require("./playing_0.gif");
  if (imageName === "playing_1") return require("./playing_1.gif");
  if (imageName === "playing_2") return require("./playing_2.gif");
  if (imageName === "listening_0") return require("./listening_0.gif");
  if (imageName === "listening_1") return require("./listening_1.gif");
}
