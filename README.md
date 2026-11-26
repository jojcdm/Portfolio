# Jack Johnston — Engineering Portfolio (GitHub Pages Ready)

Clean, static, multi-page engineering portfolio built in pure black-and-white Swiss architectural style with **IBM Plex Sans** and **IBM Plex Sans Condensed** typography, a persistent **Light / Dark** monochrome toggle, and zero build dependencies.

## File Structure

```text
.
├── index.html          # Splash Page (Portrait, About, 01–06 Disciplines, Featured Work)
├── experience.html     # Filterable Experience Timeline & Education
├── projects.html       # All Projects Index & Quick Specification Matrix
├── tilt-table.html     # Complete 10-Section AD5M 3+2-Axis Tilt Table Monograph
├── fixture.html        # Invented Testing Fixture (J&J MedTech · INV2508037)
├── bionic-arm.html     # Bionic Arm (500+ hrs, 60+ interlocking pieces)
├── exoskeleton.html    # Powered Exoskeleton (suit_v5 · Python build123d)
├── resume.html         # Printable Swiss Two-Column Resume
├── contact.html        # Direct Directory (Copy Email/Phone) & Message Composer
├── styles.css          # Shared monochrome stylesheet + @media print rules
├── app.js              # Shared navigation, theme persistence, filters & photo slots
└── images/
    ├── headshot.jpg            # Included from resume
    └── tilt-table/             # All 19 original CAD renders, cutaways & bench photos
```

## Publishing to GitHub Pages

1. Create a public GitHub repository named `jojcdm.github.io` (or `portfolio` for `https://jojcdm.github.io/portfolio/`).
2. Extract `jack_johnston_portfolio_github.zip` and upload all files and the `images/` folder to the root of the `main` branch.
3. In GitHub, open **Settings → Pages**, set **Source** to **Deploy from a branch** (`main` and `/ (root)`), and click **Save**.
4. Wait 1–2 minutes and open `https://jojcdm.github.io/`.

## Adding Your Real Prototype Photos (No HTML Editing Needed)

Simply drop your `.jpg` photos into the `images/` folder using these exact filenames and push to GitHub — the site automatically replaces the matching placeholder frames across every page:

| Filename inside `images/` | Where It Appears |
| --- | --- |
| `prototype-alone.jpg` | Home, Projects Index, AD5M Tilt Table (Hero Alone) |
| `prototype-alone-belt.jpg` | AD5M Tilt Table (Figure 2A: Belt Drive & V5 Collars) |
| `prototype-alone-sensors.jpg` | AD5M Tilt Table (Figure 2B: Optical Sensors & Cable Loop) |
| `prototype-printer.jpg` | Home, AD5M Tilt Table (Figure 16: Mounted on AD5M Hero) |
| `prototype-printer-tilted.jpg` | AD5M Tilt Table (Figure 16A: Tilted Gantry Clearance) |
| `prototype-printer-clamp.jpg` | AD5M Tilt Table (Figure 16B: Bed Clamping & USB Routing) |
| `fixture-hero.jpg` | Projects Index & Invented Testing Fixture (Non-confidential only) |
| `bionic-hero.jpg` | Projects Index & Bionic Arm Hero |
| `bionic-detail-1.jpg` | Bionic Arm Detail 1 |
| `bionic-detail-2.jpg` | Bionic Arm Detail 2 |
| `exo-hero.jpg` | Projects Index & Exoskeleton Hero |
| `exo-detail-1.jpg` | Exoskeleton Detail 1 |
| `exo-detail-2.jpg` | Exoskeleton Detail 2 |
