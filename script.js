const API = "http://universities.hipolabs.com/search";

async function searchUniversities() {
  const query = document.getElementById("query").value.trim();
  const filter = document.getElementById("filter").value;
  document.getElementById("error").textContent = "";
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  try {
    let url = `${API}?name=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    let data = await res.json();

    // Filter: Assume public if country is USA/UK/CA/AU/DE/FR/etc. (simplified; enhance with real data)
    data = data.filter(u => {
      if (filter === "all") return true;
      const publicCountries = ["United States", "United Kingdom", "Canada", "Australia", "Germany", "France"];
      const isPublic = publicCountries.includes(u.country);
      return filter === "public" ? isPublic : !isPublic;
    });

    // Sort by name
    data.sort((a, b) => a.name.localeCompare(b.name));

    if (data.length === 0) throw new Error("No universities found");

    resultsDiv.innerHTML = data.slice(0, 20).map(u => `
      <div class="card">
        <div class="name">${u.name}</div>
        <div class="country">${u.country}</div>
        <div class="domain">${u.domains?.[0] || 'N/A'}</div>
        <a class="website" href="${u.web_pages?.[0] || '#'}" target="_blank">Website</a>
      </div>
    `).join('');
  } catch (err) {
    document.getElementById("error").textContent = err.message;
  }
}

document.getElementById("search").onclick = searchUniversities;
document.getElementById("query").addEventListener("keypress", e => e.key === "Enter" && searchUniversities());
document.getElementById("filter").onchange = searchUniversities;
document.getElementById("sort-date").onclick = () => { /* Toggle sort if needed */ searchUniversities(); };

// Default load
searchUniversities();
