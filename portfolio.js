function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function mediaItem(item) {
  if (item.type === "video") {
    const video = element("video");
    video.src = item.src;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("aria-label", item.alt || item.caption || "Project demo");
    if (item.poster) video.poster = item.poster;
    if (item.captions) {
      const track = element("track");
      track.kind = "captions";
      track.src = item.captions;
      track.srclang = "en";
      track.label = "English";
      video.append(track);
    }
    return video;
  }

  const image = element("img");
  image.src = item.src;
  image.alt = item.alt || "";
  image.loading = "lazy";
  image.decoding = "async";
  return image;
}

function gallery(items, title) {
  const figure = element("figure", "gallery");
  const frame = element("div", "media-frame");
  const viewport = element("div", "media-content");
  const legend = element("figcaption", "media-legend");
  const caption = element("span", "media-caption");
  legend.append(caption);
  frame.append(viewport);
  figure.append(frame, legend);

  let active = 0;
  const dots = [];

  function show(index) {
    active = (index + items.length) % items.length;
    const item = items[active];
    viewport.replaceChildren(mediaItem(item));
    caption.textContent = items.length === 1
      ? item.caption || ""
      : [`${active + 1} / ${items.length}`, item.caption].filter(Boolean).join(" · ");
    legend.hidden = !caption.textContent;
    dots.forEach((dot, position) => {
      if (position === active) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
  }

  if (items.length > 1) {
    figure.setAttribute("aria-label", `${title} media`);
    caption.setAttribute("aria-live", "polite");
    for (const [offset, label] of [[-1, "Previous"], [1, "Next"]]) {
      const button = element("button", `gallery-arrow ${label.toLowerCase()}`);
      button.type = "button";
      button.setAttribute("aria-label", `${label} slide for ${title}`);
      button.addEventListener("click", () => show(active + offset));
      frame.append(button);
    }

    const pagination = element("div", "gallery-dots");
    items.forEach((_, index) => {
      const dot = element("button", "gallery-dot");
      dot.type = "button";
      dot.setAttribute("aria-label", `Slide ${index + 1} for ${title}`);
      dot.addEventListener("click", () => show(index));
      dots.push(dot);
      pagination.append(dot);
    });
    legend.prepend(pagination);
  }

  show(0);
  return figure;
}

function projectRow(project) {
  const row = element("article", "project");
  row.id = project.id;
  const info = element("div", "project-info");
  const heading = element("h3", "", project.title);
  if (project.media?.length) row.append(gallery(project.media, project.title));
  else row.classList.add("project-text-only");

  if (project.status) info.append(element("p", "project-status", project.status));
  info.append(heading, element("p", "description", project.description));

  if (project.stack?.length) {
    info.append(element("p", "stack", project.stack.join(" · ")));
  }

  if (project.links?.length) {
    const links = element("ul", "project-links");
    for (const link of project.links) {
      const item = element("li");
      const anchor = element("a", "", link.label);
      anchor.href = link.url;
      item.append(anchor);
      links.append(item);
    }
    info.append(links);
  }

  row.append(info);
  return row;
}

async function renderProjects() {
  const status = document.querySelector("#load-status");

  try {
    const response = await fetch("projects.json");
    if (!response.ok) throw new Error(`Project list returned ${response.status}`);
    const projects = await response.json();

    for (const [id, featured] of [["featured", true], ["projects", false]]) {
      const target = document.getElementById(id);
      const rows = projects.filter(project => Boolean(project.featured) === featured);
      target.replaceChildren(...rows.map(projectRow));
      target.closest("section").hidden = rows.length === 0;
    }

    status.hidden = true;
  } catch (error) {
    status.textContent = "Projects couldn’t load. You can still find my work on GitHub.";
    console.error(error);
  }
}

const portrait = document.querySelector(".portrait img");
if (portrait.dataset.src) {
  portrait.addEventListener("load", () => {
    portrait.hidden = false;
    portrait.nextElementSibling.hidden = true;
  }, { once: true });
  portrait.src = portrait.dataset.src;
}

renderProjects();
