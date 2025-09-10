const API_BASE = (window.API_BASE || "http://localhost:8000").replace(/\/$/, "");

const elements = {
  form: document.getElementById("search-form"),
  input: document.getElementById("query"),
  results: document.getElementById("results"),
  status: document.getElementById("status"),
  template: document.getElementById("card-template"),
};

function setStatus(message) {
  if (!message) {
    elements.status.hidden = true;
    elements.status.textContent = "";
  } else {
    elements.status.hidden = false;
    elements.status.textContent = message;
  }
}

function clearResults() {
  elements.results.innerHTML = "";
}

function renderResults(items) {
  clearResults();
  if (!Array.isArray(items) || items.length === 0) {
    setStatus("No results");
    return;
  }
  setStatus("");

  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const meta = item.metadata || {};
    const firstImage = Array.isArray(meta.images) && meta.images.length > 0 ? meta.images[0] : undefined;

    const node = elements.template.content.firstElementChild.cloneNode(true);
    const img = node.querySelector("img");
    const title = node.querySelector(".title");
    const price = node.querySelector(".price");
    const brand = node.querySelector(".brand");
    const desc = node.querySelector(".desc");

    if (firstImage) {
      img.src = firstImage;
      img.alt = meta.title || "Product image";
    } else {
      img.remove();
    }

    title.textContent = meta.title || item.page_content?.slice(0, 80) || "Untitled";
    price.textContent = meta.actual_price ? `₹${meta.actual_price}` : "";
    brand.textContent = meta.brand || "";
    const fromMeta = typeof meta.description === "string" ? meta.description : "";
    const fromPage = typeof item.page_content === "string" ? item.page_content : "";
    desc.textContent = fromMeta || fromPage;

    fragment.appendChild(node);
  }
  elements.results.appendChild(fragment);
}

async function search(query) {
  if (!query || !query.trim()) {
    setStatus("Type to search products");
    clearResults();
    return;
  }
  setStatus("Searching...");
  try {
    const url = new URL("/products", API_BASE);
    url.searchParams.set("query", query.trim());
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    console.error(err);
    setStatus("Failed to fetch results");
  }
}

elements.form.addEventListener("submit", (e) => {
  e.preventDefault();
  search(elements.input.value);
});

// Trigger an initial example search for UX
window.addEventListener("DOMContentLoaded", () => {
  const initial = new URLSearchParams(window.location.search).get("q") || "men boxer";
  elements.input.value = initial;
  search(initial);
});


