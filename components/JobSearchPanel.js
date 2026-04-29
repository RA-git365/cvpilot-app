"use client";

const jobSites = [
  {
    name: "Naukri",
    label: "India jobs",
    color: "#275df5",
    buildUrl: ({ query, location }) =>
      `https://www.naukri.com/${slug(query)}-jobs-in-${slug(location || "india")}`,
  },
  {
    name: "Indeed",
    label: "Global jobs",
    color: "#164081",
    buildUrl: ({ query, location }) =>
      `https://www.indeed.com/jobs?q=${encode(query)}&l=${encode(location)}`,
  },
  {
    name: "LinkedIn",
    label: "Network jobs",
    color: "#0a66c2",
    buildUrl: ({ query, location }) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encode(query)}&location=${encode(location)}`,
  },
  {
    name: "Glassdoor",
    label: "Company insights",
    color: "#0caa41",
    buildUrl: ({ query, location }) =>
      `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${encode(query)}&locT=C&locKeyword=${encode(location)}`,
  },
  {
    name: "Foundit",
    label: "Indian market",
    color: "#6d28d9",
    buildUrl: ({ query, location }) =>
      `https://www.foundit.in/srp/results?query=${encode(query)}&locations=${encode(location)}`,
  },
  {
    name: "Shine",
    label: "Recruiter jobs",
    color: "#f59e0b",
    buildUrl: ({ query, location }) =>
      `https://www.shine.com/job-search/${slug(query)}-jobs-in-${slug(location || "india")}`,
  },
  {
    name: "TimesJobs",
    label: "Enterprise roles",
    color: "#dc2626",
    buildUrl: ({ query, location }) =>
      `https://www.timesjobs.com/candidate/job-search.html?searchType=personalizedSearch&txtKeywords=${encode(query)}&txtLocation=${encode(location)}`,
  },
  {
    name: "Instahyre",
    label: "Tech hiring",
    color: "#0891b2",
    buildUrl: ({ query, location }) =>
      `https://www.instahyre.com/search-jobs/?q=${encode(query)}&l=${encode(location)}`,
  },
  {
    name: "Wellfound",
    label: "Startup jobs",
    color: "#111827",
    buildUrl: ({ query, location }) =>
      `https://wellfound.com/jobs?query=${encode(query)}&location=${encode(location)}`,
  },
  {
    name: "Google Jobs",
    label: "Broad search",
    color: "#16a34a",
    buildUrl: ({ query, location }) =>
      `https://www.google.com/search?q=${encode(`${query} jobs ${location}`)}&ibp=htl;jobs`,
  },
];

function encode(value = "") {
  return encodeURIComponent(String(value || "").trim());
}

function slug(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildQuery(form) {
  const role = form.role || "software developer";
  const skills = String(form.skills || "")
    .split(/,|\n/)
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");

  return `${role} ${skills}`.trim();
}

export default function JobSearchPanel({ form, user }) {
  const query = buildQuery(form);
  const location = form.location || "India";

  const openSite = (site) => {
    window.open(
      site.buildUrl({
        query,
        location,
      }),
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openAll = () => {
    jobSites.slice(0, 4).forEach((site, index) => {
      window.setTimeout(() => openSite(site), index * 180);
    });
  };

  return (
    <section className="cvp-job-panel">
      <div className="cvp-job-head">
        <div>
          <span>Job search hub</span>
          <h2>Find matching jobs from your CV</h2>
          <p>
            Searches use your target role, top skills, and preferred location.
            Free users can search jobs; logged-in users can save resumes and apply with paid templates.
          </p>
        </div>
        <button onClick={openAll}>Search Top Sites</button>
      </div>

      <div className="cvp-job-query">
        <div>
          <strong>Search keywords</strong>
          <p>{query}</p>
        </div>
        <div>
          <strong>Location</strong>
          <p>{location}</p>
        </div>
        <div>
          <strong>Account</strong>
          <p>{user?.email ? "Logged in" : "Guest job search"}</p>
        </div>
      </div>

      <div className="cvp-job-grid">
        {jobSites.map((site) => (
          <button
            key={site.name}
            onClick={() => openSite(site)}
            className="cvp-job-site"
            style={{ "--job-color": site.color }}
          >
            <span>{site.name}</span>
            <small>{site.label}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
