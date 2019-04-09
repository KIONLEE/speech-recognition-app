export default function getSource(imageName) {
  if (imageName === "ear") return require("./ear.png");
  if (imageName === "listening_0") return require("./listening_0.gif");
  if (imageName === "listening_1") return require("./listening_1.gif");
}
