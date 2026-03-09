(function () {
  "use strict";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getPageKey() {
    return document.body.getAttribute("data-page") || "";
  }

  function linkTarget(link) {
    if (link && link.newTab === false) {
      return "";
    }
    return ' target="_blank" rel="noopener"';
  }

  function renderInlineLinks(links, separator) {
    if (!Array.isArray(links) || links.length === 0) {
      return "";
    }

    return links
      .map(function (link) {
        return (
          '<a href="' +
          escapeHtml(link.href) +
          '"' +
          linkTarget(link) +
          ">" +
          (link.label || "") +
          "</a>"
        );
      })
      .join(typeof separator === "string" ? separator : " / ");
  }

  function renderNav(data, pageKey) {
    var nav = document.querySelector('[data-component="nav"]');
    if (!nav || !data || !data.site || !Array.isArray(data.site.navLinks)) {
      return;
    }

    var navName = pageKey === "home" ? data.site.homeNavName : data.site.navName;
    var navLinksHtml = data.site.navLinks
      .map(function (link) {
        var current = link.key === pageKey ? ' aria-current="page"' : "";
        return (
          '<a href="' +
          escapeHtml(link.href) +
          '"' +
          current +
          ">" +
          (link.label || "") +
          "</a>"
        );
      })
      .join("");

    nav.innerHTML =
      '<div class="nav-inner">' +
      '<a href="index.html" class="nav-name" aria-label="' +
      escapeHtml(data.site.fullName) +
      '">' +
      (navName || "") +
      "</a>" +
      '<div class="nav-links">' +
      navLinksHtml +
      "</div>" +
      "</div>";
  }

  function renderFooter(data, pageKey) {
    var footers = document.querySelectorAll('footer[data-component="footer"]');
    if (!footers.length || !data || !data.site) {
      return;
    }

    var pageLastUpdated =
      pageKey === "home" && data.home ? data.home.lastUpdated || "" : "";

    footers.forEach(function (footer) {
      var lastUpdatedAttr = footer.getAttribute("data-last-updated");
      var lastUpdatedText = pageLastUpdated;
      if (lastUpdatedAttr !== null) {
        lastUpdatedText = lastUpdatedAttr;
      }

      footer.innerHTML =
        "<p>" +
        "&copy; <span data-year></span> " +
        escapeHtml(data.site.fullName) +
        (lastUpdatedText
          ? " &middot; Last updated " + escapeHtml(lastUpdatedText)
          : "") +
        "</p>";
    });
  }

  function setCurrentYear() {
    var yearElements = document.querySelectorAll("[data-year]");
    var year = new Date().getFullYear();

    yearElements.forEach(function (element) {
      element.textContent = String(year);
    });
  }

  function renderHome(data) {
    if (!data || !data.home) {
      return;
    }

    var publicationTarget = document.getElementById("home-publications-list");
    if (publicationTarget && Array.isArray(data.home.publications)) {
      publicationTarget.innerHTML = data.home.publications
        .map(function (publication) {
          return (
            '<div class="pub">' +
            '<div class="pub-image">' +
            '<img src="' +
            escapeHtml(publication.image) +
            '" alt="' +
            escapeHtml(publication.alt) +
            '">' +
            "</div>" +
            '<div class="pub-text">' +
            '<span class="pub-title">' +
            (publication.title || "") +
            "</span><br>" +
            (publication.authorsHtml || "") +
            "<br>" +
            "<em>" +
            escapeHtml(publication.venue) +
            "</em><br>" +
            '<p class="pub-desc">' +
            escapeHtml(publication.description) +
            "</p>" +
            renderInlineLinks(publication.links, " / ") +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }

    var educationTarget = document.getElementById("home-education-list");
    if (educationTarget && Array.isArray(data.home.education)) {
      educationTarget.innerHTML = data.home.education
        .map(function (entry) {
          return (
            '<div class="entry">' +
            '<div class="entry-header">' +
            '<span class="entry-title">' +
            (entry.title || "") +
            "</span>" +
            '<span class="entry-date">' +
            (entry.dateHtml || "") +
            "</span>" +
            "</div>" +
            '<div class="entry-org">' +
            (entry.organization || "") +
            "</div>" +
            "</div>"
          );
        })
        .join("");
    }

    var selectedProjectsTarget = document.getElementById(
      "home-selected-projects-list"
    );
    if (selectedProjectsTarget && Array.isArray(data.home.selectedProjects)) {
      selectedProjectsTarget.innerHTML = data.home.selectedProjects
        .map(function (project) {
          return (
            '<div class="entry">' +
            '<div class="entry-header">' +
            '<span class="entry-title">' +
            (project.title || "") +
            "</span>" +
            "</div>" +
            "<p>" +
            escapeHtml(project.summary) +
            "</p>" +
            '<p class="entry-link">' +
            renderInlineLinks(project.links, " / ") +
            "</p>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  function renderProject(project) {
    var tags = Array.isArray(project.tags) ? project.tags : [];
    var tagHtml = tags
      .map(function (tag) {
        return '<span class="tag">' + tag + "</span>";
      })
      .join("");

    var imageHtml = "";
    if (project.image) {
      imageHtml =
        '<div class="project-img">' +
        '<img src="' +
        escapeHtml(project.image) +
        '" alt="' +
        escapeHtml(project.imageAlt || project.title || "Project image") +
        '">' +
        "</div>";
    }

    var paragraphs = Array.isArray(project.paragraphsHtml)
      ? project.paragraphsHtml
      : [];
    var paragraphHtml = paragraphs
      .map(function (paragraph) {
        return "<p>" + paragraph + "</p>";
      })
      .join("");

    var tech = Array.isArray(project.tech) ? project.tech : [];
    var techHtml = "";
    if (tech.length) {
      techHtml =
        '<ul class="project-tech">' +
        tech
          .map(function (item) {
            return "<li>" + item + "</li>";
          })
          .join("") +
        "</ul>";
    }

    var linkHtml = "";
    if (Array.isArray(project.links) && project.links.length) {
      var prefix = project.linkPrefix ? project.linkPrefix + " " : "";
      var separator =
        typeof project.linkSeparator === "string"
          ? project.linkSeparator
          : " / ";
      linkHtml =
        '<p class="project-link-row">' +
        prefix +
        renderInlineLinks(project.links, separator) +
        "</p>";
    }

    return (
      '<div class="project">' +
      '<div class="project-header">' +
      "<h3>" +
      (project.title || "") +
      "</h3>" +
      (tagHtml ? '<span class="project-tags">' + tagHtml + "</span>" : "") +
      "</div>" +
      '<div class="project-body">' +
      imageHtml +
      '<div class="project-details">' +
      paragraphHtml +
      techHtml +
      linkHtml +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function renderProjectsPage(data) {
    if (!data || !data.projectsPage || !Array.isArray(data.projectsPage.sections)) {
      return;
    }

    var target = document.getElementById("projects-sections");
    if (!target) {
      return;
    }

    target.innerHTML = data.projectsPage.sections
      .map(function (section) {
        var projects = Array.isArray(section.projects) ? section.projects : [];
        return (
          '<div class="section">' +
          "<h2>" +
          (section.title || "") +
          "</h2>" +
          projects.map(renderProject).join("") +
          "</div>"
        );
      })
      .join("");
  }

  function renderPublication(publication) {
    return (
      '<div class="pub">' +
      '<div class="pub-image">' +
      '<img src="' +
      escapeHtml(publication.image) +
      '" alt="' +
      escapeHtml(publication.alt) +
      '">' +
      "</div>" +
      '<div class="pub-text">' +
      '<span class="pub-title">' +
      (publication.title || "") +
      "</span><br>" +
      (publication.authorsHtml || "") +
      "<br>" +
      "<em>" +
      escapeHtml(publication.venue) +
      "</em>" +
      '<p class="pub-desc">' +
      escapeHtml(publication.description) +
      "</p>" +
      '<p class="pub-link-row">' +
      renderInlineLinks(publication.links, " / ") +
      "</p>" +
      "</div>" +
      "</div>"
    );
  }

  function renderPublicationsPage(data) {
    if (
      !data ||
      !data.publicationsPage ||
      !Array.isArray(data.publicationsPage.sections)
    ) {
      return;
    }

    var target = document.getElementById("publications-sections");
    if (!target) {
      return;
    }

    target.innerHTML = data.publicationsPage.sections
      .map(function (section) {
        var publications = Array.isArray(section.publications)
          ? section.publications
          : [];
        return (
          '<div class="section">' +
          "<h2>" +
          (section.title || "") +
          "</h2>" +
          publications.map(renderPublication).join("") +
          "</div>"
        );
      })
      .join("");
  }

  function renderCvPage(data) {
    if (!data || !data.cvPage) {
      return;
    }

    var cvData = data.cvPage;

    var educationTarget = document.getElementById("cv-education-list");
    if (educationTarget && Array.isArray(cvData.education)) {
      educationTarget.innerHTML = cvData.education
        .map(function (entry) {
          return (
            '<div class="entry">' +
            '<div class="entry-header">' +
            '<span class="entry-title">' +
            (entry.title || "") +
            "</span>" +
            '<span class="entry-date">' +
            (entry.dateHtml || "") +
            "</span>" +
            "</div>" +
            '<div class="entry-org">' +
            (entry.organizationHtml || entry.organization || "") +
            "</div>" +
            "<p>" +
            (entry.descriptionHtml || "") +
            "</p>" +
            "</div>"
          );
        })
        .join("");
    }

    var experienceTarget = document.getElementById("cv-experience-list");
    if (experienceTarget && Array.isArray(cvData.experience)) {
      experienceTarget.innerHTML = cvData.experience
        .map(function (entry) {
          var bullets = Array.isArray(entry.bullets) ? entry.bullets : [];
          return (
            '<div class="entry">' +
            '<div class="entry-header">' +
            '<span class="entry-title">' +
            (entry.title || "") +
            "</span>" +
            '<span class="entry-date">' +
            (entry.dateHtml || "") +
            "</span>" +
            "</div>" +
            '<div class="entry-org">' +
            (entry.organizationHtml || entry.organization || "") +
            "</div>" +
            "<ul>" +
            bullets
              .map(function (bullet) {
                return "<li>" + escapeHtml(bullet) + "</li>";
              })
              .join("") +
            "</ul>" +
            "</div>"
          );
        })
        .join("");
    }

    var skillsTarget = document.getElementById("cv-skills-table");
    if (skillsTarget && Array.isArray(cvData.skills)) {
      skillsTarget.innerHTML = cvData.skills
        .map(function (skill) {
          return (
            "<tr>" +
            '<td class="skills-label">' +
            (skill.label || "") +
            "</td>" +
            "<td>" +
            (skill.value || "") +
            "</td>" +
            "</tr>"
          );
        })
        .join("");
    }

    var awardsTarget = document.getElementById("cv-awards-list");
    if (awardsTarget && Array.isArray(cvData.awards)) {
      awardsTarget.innerHTML = cvData.awards
        .map(function (award) {
          return "<li>" + award + "</li>";
        })
        .join("");
    }

    var certsTarget = document.getElementById("cv-certifications-list");
    if (certsTarget && Array.isArray(cvData.certifications)) {
      certsTarget.innerHTML = cvData.certifications
        .map(function (certification) {
          return "<li>" + certification + "</li>";
        })
        .join("");
    }

    var contactTarget = document.getElementById("cv-contact");
    if (contactTarget && cvData.contactHtml) {
      contactTarget.innerHTML = cvData.contactHtml;
    }
  }

  function syncCanonicalUrl() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      return;
    }

    var canonicalUrl = window.location.origin + window.location.pathname;
    canonical.setAttribute("href", canonicalUrl);

    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute("content", canonicalUrl);
    }
  }

  function renderPageSections(data, pageKey) {
    if (pageKey === "home") {
      renderHome(data);
      return;
    }

    if (pageKey === "projects") {
      renderProjectsPage(data);
      return;
    }

    if (pageKey === "publications") {
      renderPublicationsPage(data);
      return;
    }

    if (pageKey === "cv") {
      renderCvPage(data);
    }
  }

  function init() {
    var pageKey = getPageKey();
    syncCanonicalUrl();

    fetch("assets/data/content.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Failed to load portfolio content data.");
        }
        return response.json();
      })
      .then(function (data) {
        renderNav(data, pageKey);
        renderFooter(data, pageKey);
        renderPageSections(data, pageKey);
        setCurrentYear();
      })
      .catch(function (error) {
        setCurrentYear();
        console.error(error);
      });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
