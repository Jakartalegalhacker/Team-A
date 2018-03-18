import Noty from "noty";

export default function notif(type, message, title, position) {
  let _position = position === undefined ? "bottomRight" : position;
  let theme = "default";
  let _title = title === undefined ? type : title;
  let _config = {
    theme: theme,
    layout: _position,
    closeWith: ["click", "button"],
    timeout: 3000,
    animation: {
      open: "animated fadeInUp", // Animate.css class names
      close: "animated fadeOutUp" // Animate.css class names
    }
  };
  switch (type) {
    case "success": {
      return new Noty({
        text: ` <i class="icon-check"></i><div class="notif-text"><p>${_title}</p><p>${message}</p></div>`,
        type: "success",
        ..._config
      }).show();
    }

    case "failed":
      return new Noty({
        text: ` <i class="icon-heatmap"></i><div class="notif-text"><p>${_title}</p><p>${message}</p></div>`,
        type: "failed",
        ..._config
      }).show();
    case "custom":
      break;
    default:
      break;
  }
  console.log(Noty);
}
