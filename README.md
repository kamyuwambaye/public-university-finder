#  University Finder

University Finder is a small web application that helps students and parents quickly discover universities around the world and jump directly to their official websites.
It uses an external public API to fetch real university data and lets users search, filter, and sort results in an intuitive interface.

## Features

- Search universities by name or country (e.g. `University or Ghana`, `Ghana`, `Germany`).
- Filter by:
  - All universities
  - Public universities (based on country heuristic – see below)
  - Private universities (everything not classified as public by the heuristic)
- Sort results alphabetically (A→Z / Z→A).
- Quick access to official university websites via clickable links.
- Status and error handling:
  - Loading indicator while the API request is in progress.
  - Clear messages for no results, network/API errors, or invalid responses.
- Simple, accessible frontend with a consistent Montserrat font and a soft beige theme to keep the UI clean and readable.

## External API Used

This application uses the **Hipolabs Universities API** and a simple CORS proxy:

- Universities API base URL: `http://universities.hipolabs.com/search`
- Universities API documentation: https://universities.hipolabs.com/
- CORS proxy (for HTTPS GitHub Pages): `https://api.allorigins.win/raw?url=<encoded-target-url>`

The Universities API does **not** require authentication or API keys.

On local HTTP deployments or your course web servers (Web01/Web02), the app can call the Universities API
directly. On GitHub Pages (which is HTTPS), the app goes through the AllOrigins proxy because browsers block
HTTPS pages from calling HTTP APIs directly (mixed content).

### Public vs Private heuristic

The API does not provide a "public vs private" field.
To still offer a meaningful filter, the app uses a simple heuristic:

- Universities in the following countries are treated as **Public**:
  - United States, United Kingdom, Canada, Australia, Germany, France, Netherlands,
    Sweden, Norway, Denmark, Finland, Spain, Italy, Belgium
- All other universities are treated as **Private** for filtering purposes.

This is only an approximation for demo/educational purposes and is documented here to be transparent.

## Running the Application Locally

This is a pure frontend application (HTML, CSS, JavaScript). No backend is required.

### Prerequisites

- Any modern web browser (Chrome, Firefox, Edge, Safari).
- A simple HTTP server is recommended to avoid CORS / file URL issues.

### Option A: Using a simple static server (recommended)

From the project root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/ in your browser.

### Option B: Opening the file directly

You can also double‑click `index.html` or open it directly in your browser.
However, some browsers may restrict `file://` usage with `fetch`, so Option A is more reliable.

## Project Structure

```text
public-university-finder/
├── index.html       # Main HTML page and UI structure
├── style.css        # Styling and responsive layout
├── script.js        # Application logic and API integration
├── favicon.ico      # Optional favicon
├── .gitignore       # Git ignore rules (no API keys in this project)
└── README.md        # This file
```

## Deployment to Web Servers (Assignment Part Two)

This repository is also designed to be deployed on two web servers behind a load balancer.
See the assignment write‑up for the exact server names and addresses you were given.

High‑level steps:

1. Copy `index.html`, `style.css`, `script.js`, and `favicon.ico` to the web root on Web01 and Web02.
2. Configure your web server (Apache or Nginx) on Web01 and Web02 to serve that directory.
3. Configure the load balancer (Lb01) as a reverse proxy that forwards traffic to both Web01 and Web02.
4. Test that accessing the load balancer address loads the app and balances requests between the two servers.

## GitHub Pages Deployment

This repository is also deployed as a static site using GitHub Pages:

1. Push the latest code to the `main` branch on GitHub.
2. On GitHub, open the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main` and folder `/ (root)`
4. Save. After a short delay, GitHub Pages will build and host the site at:
   `https://kamyuwambaye.github.io/public-university-finder/`

You can use this URL in your demo video to show the application running online independently of the
course web servers.

## Handling API Keys and Sensitive Data

- The Universities API used here does **not** require keys, so there are **no secrets stored** in this repository.
- If an API key were required, it would **not** be committed to Git and would be stored in environment variables
  or non‑tracked config files instead.

## Challenges and Lessons Learned

- Public vs private classification required a heuristic because the API does not expose that information.
- Good UX requires showing loading indicators and clear error messages when talking to external APIs.
- Deployment and load balancing involve serving the same static assets from multiple servers and routing traffic
  through a single load balancer endpoint.