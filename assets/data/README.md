# Content Data Guide

Update portfolio entries in `content.json`.

## Main blocks

- `site.navLinks`: top navigation links for all pages.
- `home`: featured publications, education, selected projects, and home footer date.
- `projectsPage.sections`: all project groups and project cards.
- `publicationsPage.sections`: publication groups and entries.
- `cvPage`: education, experience, skills, awards, certifications, and contact.

## Notes

- Fields ending with `Html` are rendered as HTML.
- Other text fields are rendered as plain text.
- Most links open in a new tab by default. Set `"newTab": false` on a link to keep same-tab navigation.
