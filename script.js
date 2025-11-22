const API = "http://universities.hipolabs.com/search";
const PROXY = "https://api.allorigins.win/raw?url=";

let currentData = [];
let sortAscending = true;
let lastQuery = "";

async function searchUniversities() {
  const queryInput = document.getElementById("query");
  const query = queryInput.value.trim();
  const filter = document.getElementById("filter").value;
  const errorDiv = document.getElementById("error");
  const resultsDiv = document.getElementById("results");
  const statusDiv = document.getElementById("status");
  
  lastQuery = query;
  queryInput.classList.remove("input-error");
  errorDiv.textContent = "";
  resultsDiv.innerHTML = "";
  statusDiv.textContent = "";

  // Show loading indicator
  statusDiv.textContent = "Loading universities...";
  statusDiv.className = "status loading";

  try {
    // Build proxied API URL (GitHub Pages is HTTPS but the Universities API is HTTP-only)
    const targetUrl = `${API}?name=${encodeURIComponent(query)}`;
    const proxiedUrl = PROXY + encodeURIComponent(targetUrl);
    
    const res = await fetch(proxiedUrl);
    
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}. Please try again later.`);
    }
    
    let data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid response from API");
    }

    // Filter: Assume public if country is USA/UK/CA/AU/DE/FR/etc.
    // Note: This is a heuristic approximation since the API doesn't provide public/private info
    const publicCountries = [
      "United States", "United Kingdom", "Canada", "Australia", 
      "Germany", "France", "Netherlands", "Sweden", "Norway", 
      "Denmark", "Finland", "Spain", "Italy", "Belgium"
    ];
    
    data = data.filter(u => {
      if (filter === "all") return true;
      const isPublic = publicCountries.includes(u.country);
      return filter === "public" ? isPublic : !isPublic;
    });

    currentData = data;
    sortAndDisplay();
    
  } catch (err) {
    statusDiv.textContent = "";
    statusDiv.className = "";
    document.getElementById("query").classList.add("input-error");
    
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      errorDiv.textContent = "Network error: Unable to reach the API. Please check your internet connection.";
    } else {
      errorDiv.textContent = err.message || "An unexpected error occurred. Please try again.";
    }
  }
}

function sortAndDisplay() {
  const resultsDiv = document.getElementById("results");
  const statusDiv = document.getElementById("status");
  const errorDiv = document.getElementById("error");
  const queryInput = document.getElementById("query");
  
  if (currentData.length === 0) {
    statusDiv.textContent = "";
    queryInput.classList.add("input-error");

    if (lastQuery) {
      errorDiv.textContent = `No universities found for "${lastQuery}". If you searched by country, try using the full country name (e.g., "United States", "Rwanda").`;
    } else {
      errorDiv.textContent = "No universities found. Try entering a university name or full country name.";
    }
    return;
  }

  // Sort by name
  const sorted = [...currentData].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortAscending ? comparison : -comparison;
  });

  // Update status
  const displayCount = Math.min(sorted.length, 50);
  statusDiv.textContent = `Showing ${displayCount} of ${sorted.length} universities`;
  statusDiv.className = "status success";

  // Display results (limit to 50 for performance)
  resultsDiv.innerHTML = sorted.slice(0, 50).map(u => `
    <div class="card">
      <div class="name">${escapeHtml(u.name)}</div>
      <div class="country">${escapeHtml(u.country)}</div>
      <div class="domain">📧 ${escapeHtml(u.domains?.[0] || 'N/A')}</div>
      ${u.web_pages?.[0] ? 
        `<a class="website" href="${escapeHtml(u.web_pages[0])}" target="_blank" rel="noopener noreferrer">🌐 Visit Website</a>` : 
        '<span class="no-website">No website available</span>'
      }
    </div>
  `).join('');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function toggleSort() {
  sortAscending = !sortAscending;
  const btn = document.getElementById("sort-btn");
  btn.textContent = sortAscending ? "Sort A→Z" : "Sort Z→A";
  sortAndDisplay();
}

// Event listeners
document.getElementById("search").onclick = searchUniversities;
document.getElementById("query").addEventListener("keypress", e => {
  if (e.key === "Enter") searchUniversities();
});
document.getElementById("filter").onchange = searchUniversities;
document.getElementById("sort-btn").onclick = toggleSort;

// Default load with empty query to show sample results
searchUniversities();
