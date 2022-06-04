const themes = {
  dark: [
    ["--bg-primary", "#000000"],
    ["--bg-secondary", "#EFF3F4"],
    ["--bg-muted", "#15181C"],
    ["--text-primary", "#D9D9D9"],
    ["--text-secondary", "#0F1419"],
    ["--text-muted", "#6E767D"],
    ["--border", "#2F3336"],
    ["--hover", "rgba(255,255,255,0.05)"],
  ],
  dim: [
    ["--bg-primary", "#15202B"],
    ["--bg-secondary", "#EFF3F4"],
    ["--bg-muted", "#192734"],
    ["--text-primary", "#FFFFFF"],
    ["--text-secondary", "#0F1419"],
    ["--text-muted", "#8899A6"],
    ["--border", "#38444D"],
    ["--hover", "rgba(255,255,255,0.1)"],
  ],
  light: [
    ["--bg-primary", "#FFFFFF"],
    ["--bg-secondary", "#0F1419"],
    ["--bg-muted", "#F7F9F9"],
    ["--text-primary", "#0F1419"],
    ["--text-secondary", "#FFFFFF"],
    ["--text-muted", "#536471"],
    ["--border", "#CFD9DE"],
    ["--hover", "rgba(15,20,25,0.1)"],
  ],
};
const fonts = {
  0: [
    ["--fs-1", "28px"],
    ["--fs-2", "21px"],
    ["--fs-3", "18px"],
    ["--fs-4", "15px"],
    ["--fs-5", "14px"],
    ["--fs-6", "13px"],
    ["--fs-7", "12px"],
  ],
  1: [
    ["--fs-1", "29px"],
    ["--fs-2", "22px"],
    ["--fs-3", "19px"],
    ["--fs-4", "16px"],
    ["--fs-5", "14px"],
    ["--fs-6", "13px"],
    ["--fs-7", "12px"],
  ],
  2: [
    ["--fs-1", "31px"],
    ["--fs-2", "23px"],
    ["--fs-3", "20px"],
    ["--fs-4", "17px"],
    ["--fs-5", "15px"],
    ["--fs-6", "14px"],
    ["--fs-7", "13px"],
  ],
  3: [
    ["--fs-1", "34px"],
    ["--fs-2", "25px"],
    ["--fs-3", "22px"],
    ["--fs-4", "19px"],
    ["--fs-5", "17px"],
    ["--fs-6", "15px"],
    ["--fs-7", "14px"],
  ],
  4: [
    ["--fs-1", "37px"],
    ["--fs-2", "27px"],
    ["--fs-3", "24px"],
    ["--fs-4", "20px"],
    ["--fs-5", "18px"],
    ["--fs-6", "17px"],
    ["--fs-7", "16px"],
  ],
};
const colors = {
  blue: [["--app-color", "#1D9BF0"]],
  yellow: [["--app-color", "#FFD400"]],
  pink: [["--app-color", "#F91880"]],
  purple: [["--app-color", "#7856FF"]],
  orange: [["--app-color", "#FF7A00"]],
  green: [["--app-color", "#00BA7C"]],
};

export function setCSSVariables(theme, color, font) {
  const root = document.documentElement;

  window.localStorage.setItem("theme", theme ? theme : "light");
  window.localStorage.setItem("color", color ? color : "blue");
  window.localStorage.setItem("font", font ? font : "2");

  root.style.setProperty("--theme", theme ? theme : "light");
  root.style.setProperty("--color", color ? color : "blue");
  root.style.setProperty("--font", font ? font : "2");

  themes[theme].forEach((property) =>
    root.style.setProperty(property[0], property[1])
  );

  colors[color].forEach((property) =>
    root.style.setProperty(property[0], property[1])
  );

  fonts[font].forEach((property) =>
    root.style.setProperty(property[0], property[1])
  );
}

export function parseTweet(tweet, link = false) {
  return tweet
    .replace(/[@]+[A-Za-z0-9-_]+/g, function (a) {
      return link
        ? `<a class="text-app" href="/${a.replace("@", "")}">${a}</a>`
        : `<span class="text-app" onclick="alert('hi')">${a}</span>`;
    })
    .replace(/[#]+[A-Za-z0-9-_]+/g, function (t) {
      return link
        ? `<a class="text-app" href="/hashtag/${t.replace("#", "")}">${t}</a>`
        : `<span class="text-app" onclick="window.history.pushState({}, null, '/hashtag/${t.replace(
            "#",
            ""
          )}')">${t}</span>`;
    });
}

export function extractEntities(tweet) {
  const hashtags = [];
  const mentions = [];

  const chars = Array.from(tweet);

  chars.forEach((char, i) => {
    if (char === "@" || char === "#") {
      var end = tweet.indexOf(" ", i + 1);

      if (end < 0) end = tweet.length + end + 1;

      if (char === "@") {
        mentions.push({
          start: i,
          end,
          account_name: tweet.slice(i + 1, end),
        });
      } else {
        hashtags.push({
          start: i,
          end,
          tag: tweet.slice(i + 1, end),
        });
      }
    }
  });

  return { hashtags, mentions, urls: [] };
}

export const timeFormatter = (
  timestamp,
  includeTime = false,
  fullDate = false,
  lastTime = null
) => {
  const then = new Date(timestamp);
  const now = new Date();

  if (lastTime) {
    const prev = new Date(lastTime.seconds * 1000);
    if (prev.getTime() - then.getTime() < 60000) {
      return null;
    }
  }

  var ans = then.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!fullDate) {
    if (now.getFullYear() === then.getFullYear()) {
      if (
        now.getMonth() === then.getMonth() &&
        now.getDate() === then.getDate()
      ) {
        if (now.getHours() === then.getHours()) {
          if (now.getMinutes() === then.getMinutes()) {
            return "now";
          } else {
            return `${now.getMinutes() - then.getMinutes()}m`;
          }
        } else {
          return `${now.getHours() - then.getHours()}h`;
        }
      } else {
        ans = ans.slice(0, ans.indexOf(","));
      }
    }
  }

  if (includeTime) {
    ans =
      (ans ? ans + " · " : "") +
      then.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
  }

  return ans;
};
