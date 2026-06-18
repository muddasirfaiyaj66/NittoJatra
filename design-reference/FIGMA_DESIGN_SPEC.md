# NittoJatra — Figma Design Specification

> **Source of truth:** Figma file `NittoJatra-APP`
> File key: `1V0UTpZoMtbeNN9UJKx5sN` · Page: `Page 1` (`0:1`)
> Extraction method: read-only via Figma MCP (`get_metadata`, `get_screenshot`, `get_design_context`, `get_variable_defs`). **No edits were made to the Figma file.**
>
> This document is the implementation reference for making the React Native (Expo) app faithfully match the design. All hex values, fonts, radii, and spacing below were read directly from the Figma node tree (raw values — the file does **not** use Figma Variables, so `get_variable_defs` returned `{}`).

---

## 0. Executive findings (read this first)

1. **This is NOT a generic light booking app.** The signature experience is a **dark, glassmorphic auth + home-header system** on a near-black slate base (`#020617`) with **ambient indigo/purple blur orbs**, frosted-glass cards (`backdrop-blur`, translucent white borders), and **multi-stop gradient CTA buttons**. The "generic booking app" look (flat white cards, single solid primary button) is only half the story.
2. **The design ships TWO apps in one file:** a **Rider app** (tab bar: Home · Find · My Rides · Safety · Profile) and a **Driver/"Captain" app** (tab bar: Dashboard · Post · Routes · Earnings · Profile). They share the design system but have different screens.
3. **The Figma font is `Inter` (Black / Bold / Medium), not Poppins.** Every text node uses Inter. Headings are almost always **`Inter Black` (900)** with negative letter-spacing; labels are **`Inter Bold/Medium` UPPERCASE with positive letter-spacing**. If the app currently renders Poppins, the type personality will not match.
4. **There is no real Bengali body text.** Place names and labels are English (Shahbag, Motijheel, etc.). The only non-Latin glyph is the **Bangladeshi Taka sign `৳` (U+09F3)** used in prices (`৳120`, `৳3240`, `৳2,540.5`). So a Bengali font is needed only to render `৳` reliably, not for paragraphs.
5. **No dedicated "seat map" screen exists.** Booking is **per-seat-count**, not per-seat-position: ride cards show "3 Left / 1 Left", ride detail shows seat count, and the driver sets "TOTAL SEAT 1–4". Booking confirmation is a **modal stack** (Payment Method → Security PIN / Verify OTP), and "success" is expressed as the registration **"You're In!"** screen and the **"Booking Confirmed!"** notification.

---

## 1. Design System

### 1.1 Color palette

Tokens marked **(verified)** were read from `get_design_context` output. The current app's claimed tokens are checked in §3.

#### Brand / accent
| Token | Hex | Usage |
|---|---|---|
| `primary` | `#4F46E5` | Primary brand (progress fills, active tab, links, light-theme primary button). **(verified)** |
| `primary.gradStart` | `#6366F1` | App-icon gradient start, "Secured by …Shield" accent. **(verified)** |
| `primary.gradEnd` | `#8B5CF6` | App-icon gradient end (violet). **(verified)** |
| `primary.deep` | `#7E22CE` | Dark "Sign In" gradient end (indigo→purple). **(verified)** |
| `primary.alt` | `#9333EA` | Ambient purple blur orb (`rgba(147,51,234,0.1)`). **(verified)** |
| `indigo.400` | `#818CF8` | Gradient text ("Back."), avatar gradient start, links on dark. **(verified)** |
| `purple.400` | `#C084FC` | Gradient text end ("Back."). **(verified)** |
| `purple.500` | `#A855F7` | Avatar gradient end (135°). **(verified)** |
| `accent.pink` | `#EC4899` | "WOMEN ONLY" badges, accent highlights (matches current token). |
| `accent.emerald` | `#10B981` | Success / "ONGOING" / "Taken" / verified, status dots, green CTA start. **(verified)** |
| `accent.teal` | `#14B8A6` | "ONGOING" badge gradient end; register CTA gradient end. **(verified)** |
| `success.glow` | `#A7F3D0` | Emerald badge shadow (`shadow-[…#a7f3d0]`). **(verified)** |
| `danger` | `#DC2626 / #EF4444` | Emergency SOS button & "Canceled" / Emergency text (red gradient header on Safety). |
| `gold` | `#F59E0B` | Star ratings (★) and "GOLD" tier badge. |

#### Dark theme (auth + headers + dark cards)
| Token | Hex / rgba | Usage |
|---|---|---|
| `dark.bg` | `#020617` | App background for Welcome / Login / Register. **(verified)** |
| `dark.bg.navy` | `#0B1220`–`#111A2E` | Header gradient bases (Home, Profile, Wallet, Subscription Tracker dark cards). |
| `glass.fill` | `rgba(0,0,0,0.4)` | Frosted card fill (login card). **(verified)** |
| `glass.fill.subtle` | `rgba(0,0,0,0.2)` | Segmented-control track on dark. **(verified)** |
| `glass.input` | `rgba(255,255,255,0.05)` | Input / secondary button fill on dark. **(verified)** |
| `glass.border` | `rgba(255,255,255,0.1)` | Card & input borders on dark. **(verified)** |
| `glass.border.subtle` | `rgba(255,255,255,0.05)` | Lighter dividers/borders on dark. **(verified)** |
| `glass.hairline` | `rgba(255,255,255,0.2)` | Top gradient hairline on cards/buttons. **(verified)** |
| `orb.indigo` | `rgba(79,70,229,0.2)` | Ambient blur orb (top-right, 500px, blur 60px). **(verified)** |

#### Neutrals / light theme (Home content, lists, most screens)
| Token | Hex | Usage |
|---|---|---|
| `bg` | `#F8FAFC` | Light screen background (slate-50). **(verified)** |
| `surface` | `#FFFFFF` | Cards, nav bar, sheets. **(verified)** |
| `surface.muted` | `#F1F5F9` | Segmented track, inner card borders, sub-fills. **(verified)** |
| `surface.muted.2` | `#F3F4F6` | Inner segmented track, nav top border. **(verified)** |
| `surface.indigo` | `#EEF2FF` | Icon-button background (indigo-50). **(verified)** |
| `track` | `#E2E8F0` | Progress-bar track. **(verified)** |
| `text` | `#0F172A` | Primary text (slate-900). **(verified)** |
| `text.heading2` | `#111827` | Active segmented label (gray-900). **(verified)** |
| `text.secondary` | `#64748B` | Secondary text / inactive labels. **(verified)** |
| `text.tertiary` | `#94A3B8` | Captions, placeholders, uppercase meta. **(verified)** |
| `text.muted` | `#6B7280` | Inactive tab labels. **(verified)** |
| `text.muted.2` | `#4B5563` | Inactive segmented label. **(verified)** |
| `text.faint` | `#475569` | "Secured by" footer text. **(verified)** |
| `border.light` | `#F1F5F9` | Card borders on light. **(verified)** |

### 1.2 Typography

**Family:** `Inter` everywhere in Figma. Weights used: **Black (900)**, **Bold (700)**, **Medium (500)**. (Implementation may substitute Poppins — see §3 mismatch note.) Bengali/`৳` glyph: keep **Noto Sans Bengali** loaded as a fallback so the Taka sign renders.

| Role | Font / weight | Size | Tracking | Line-height | Color | Notes |
|---|---|---|---|---|---|---|
| Display headline (auth) | Inter Black | 36 | −0.9px | 40 | white + gradient span | "Welcome **Back.**", "Commute / **Without Limits**" |
| Screen title H1 | Inter Black | 24 | −0.6px | 32 | `#0F172A` | "My Journey", "Wallet", "Messages" |
| Section/route H2 | Inter Black | 20 | −0.5px | 28 | `#0F172A` | "Shahbag ↔ Motijhee", "Define Your **Journey**" |
| Card numeric stat | Inter Black | 14–32 | −0.3px | — | `#0F172A` | Stats (45, ৳3240), balance ৳2,540.5 |
| Eyebrow / overline | Inter Bold | 12 | +1.2px | 16 | `#94A3B8` | "HISTORY & SCHEDULES" uppercase |
| Tiny label/caption | Inter Bold | 10 | +0.5–1px | 15 | `#94A3B8` | "MONTHLY PROGRESS", "NEXT TRIP" uppercase |
| Subtitle (auth) | Inter Medium | 12 | +2.4px | 16 | `#94A3B8` | "ENTER CREDENTIALS TO CONTINUE" |
| Body / meta | Inter Medium | 14 | −0.3px | 20 | `#64748B` | "Mon, Tue, … • 08:00 AM" |
| Input placeholder | Inter Bold | 14 | 0 | 20 | `#94A3B8` | "Email Address", "Password" |
| Button label (primary) | Inter Black | 12 | +2.4px | 16 | white | UPPERCASE ("SIGN IN", "CONTINUE") |
| Button label (secondary) | Inter Bold | 10 | +2px | 15 | `#CBD5E1` | UPPERCASE ("CREATE NEW ACCOUNT") |
| Tab label | Inter Medium | 10 | +0.25px | 15 | `#6B7280` / active `#4F46E5` | Home/Find/… |

**Rule of thumb:** Headlines = Inter Black + *negative* tracking (tight). Labels = Inter Bold/Medium + *positive* tracking + UPPERCASE.

### 1.3 Corner radii
| Token | Value | Usage |
|---|---|---|
| `radius.pill` | `9999px` | Badges, status dots, progress bars, segmented active dot |
| `radius.xl` | `40px` | Frosted auth card |
| `radius.card` | `32px` | Light content cards |
| `radius.lg` | `16px` | Inputs, primary buttons, icon buttons, inner cards |
| `radius.md` | `12px` | App icon, segmented active pill, chips |
| `radius.sm` | `8px` | Segmented inner button |

### 1.4 Shadows / effects
- **Frosted auth card:** `backdrop-blur 12px`, fill `rgba(0,0,0,0.4)`, border `rgba(255,255,255,0.1)`, `shadow 0 25px 50px -12px rgba(0,0,0,0.25)`, plus a top **gradient hairline** (`transparent → rgba(255,255,255,0.2) → transparent`, 4px).
- **Ambient orbs:** two `500×500` circles, `blur 60px` — indigo `rgba(79,70,229,0.2)` top-right, purple `rgba(147,51,234,0.1)` bottom-left.
- **Light card:** `shadow 0 20px 25px -5px rgba(226,232,240,0.5), 0 8px 10px -6px rgba(226,232,240,0.5)` (soft slate).
- **Primary gradient button:** `shadow 0 10px 15px -3px rgba(49,46,129,0.4)` (indigo glow) + top border `rgba(255,255,255,0.2) 0.8px`.
- **Emerald badge:** `shadow …#A7F3D0` (green glow).
- **Bottom nav:** `drop-shadow 0 -2px 5px rgba(0,0,0,0.05)`, top border `#F3F4F6 0.8px`.

### 1.5 Spacing scale
Observed spacing (px): `4, 8, 12, 16, 20, 24, 32, 40`. Screen horizontal padding = **24px**. Card inner padding = **~24.8px** (≈25). Section gap = **32px**. Status-bar top padding on headers = **~73px**.
Frames are designed at **440 × 956** (a few scrollable frames are taller).

### 1.6 Gradients (exact)
| Name | Definition |
|---|---|
| App icon | `linear 90°/→ #6366F1 → #8B5CF6`, rounded 12, slight `1.06°` rotation |
| Headline accent text | `→ #818CF8 → #C084FC` (clip to text) |
| Primary CTA (dark "Sign In") | `→ #4F46E5 → #7E22CE` |
| Register CTA ("Continue/Verify & Finish/Submit") | `→ #4F46E5/#6366F1 → #14B8A6/#10B981` (indigo→teal/green) |
| Avatar | `135° #818CF8 → #A855F7` |
| ONGOING / success badge | `→ #10B981 → #14B8A6` |
| Safety header | red→pink (`#EF4444`→`#EC4899`) |
| Emergency SOS button | red gradient (`#EF4444`→`#DC2626`) |

### 1.7 Bottom tab bar
- **Rider:** `Home · Find · My Rides · Safety · Profile`.
- **Driver/Captain:** `Dashboard · Post · Routes · Earnings · Profile`.
- Surface white, height **64px**, top border `#F3F4F6 0.8px`, `drop-shadow 0 -2px 5px rgba(0,0,0,0.05)`.
- Icon **24px**; label **Inter Medium 10px / +0.25px**.
- **Active** = `#4F46E5` (icon + label) **plus a 4px round dot** centered under the active icon. **Inactive** = `#6B7280`.
- The middle "Post" item in the driver bar is a **circled "+"** action.

---

## 2. Per-screen specifications

> Coordinates/IDs are Figma node IDs for traceability. Order is top→bottom for each screen.

### RIDER APP

#### 2.1 Welcome / Splash — `2:2`
- **Theme:** dark `#020617` with full-bleed indigo→navy radial gradient + ambient orbs.
- Centered column: **app icon** (gradient `#6366F1→#8B5CF6` rounded square w/ car/van glyph) → wordmark **"NittoJatra"** (indigo, Inter Black) → headline **"Commute"** (white) over **"Without Limits"** (gradient `#818CF8→#C084FC`), Inter Black 36 / −0.9px.
- Bottom: 3 small loading dots (indigo). Acts as splash/onboarding.

#### 2.2 Login / "Welcome Back" — `5:5`
- **Theme:** dark, orbs (indigo top-right, purple bottom-left).
- Top: app icon (75px, rounded 12, rotated 1.06°) → headline **"Welcome Back."** (white + gradient "Back.") → subtitle **"ENTER CREDENTIALS TO CONTINUE"** (Inter Medium 12 / +2.4 / `#94A3B8`).
- **Frosted card** (rounded 40, `rgba(0,0,0,0.4)`, blur 12, top hairline):
  - **Segmented toggle** `RIDER | DRIVER` (active pill `rgba(255,255,255,0.1)`, label Inter Black 10 uppercase white; inactive `#64748B`).
  - **Email Address** input (mail icon, 64px tall, rounded 16, fill `rgba(255,255,255,0.05)`, border `rgba(255,255,255,0.1)`).
  - **Password** input (lock icon + eye toggle).
  - **"FORGOT PASSWORD?"** right-aligned (Inter Bold 10 / `#818CF8` / uppercase).
  - **"SIGN IN →"** gradient button `#4F46E5→#7E22CE` (56px, rounded 16, indigo glow shadow).
  - **"CREATE NEW ACCOUNT"** secondary button (person icon, `rgba(255,255,255,0.05)`, `#CBD5E1` label).
- Footer: **"SECURED BY NITTO·SHIELD"** (Inter Bold 10 / `#475569`, "Shield" in `#6366F1`).

#### 2.3 Register — multi-step (dark) `7:67 → 7:136 → (7:256 driver) → 7:202`
Shared chrome: back button (rounded square, dark), title **"Create Account"** (white + "Account" gradient blue), **segmented progress bar** (3–4 segments; completed segments use indigo→teal gradient, remaining are `rgba(255,255,255,0.1)`).
- **Step 1 — Credentials `7:67`** (dup `170:51`): "I AM A" `RIDER|DRIVER` toggle; inputs **Full Legal Name**, **Email Address**, **Create Password**, **Confirm Password** (icons + eye toggles); **"CONTINUE"** gradient (indigo→green).
- **Step 2 — Identity Check `7:136`** (dup `170:118`): H2 "Identity Check", sub "Verify your NID for a trusted community."; **NID Number** input; two upload cards **NID (Front)** / **NID (Back)** ("REQUIRED PHOTO", upload icon, chevron); **"VERIFY & FINISH"** gradient.
- **Step (driver only) — Vehicle Info `7:256`:** "PREFERRED VEHICLE" chips `CAR | BIKE | MICRO | BUS` (CAR active indigo); **Registration Number** input; note card "Verification takes ~24h…"; **"SUBMIT REGISTRATION"** green gradient.
- **Final — "You're In!" `7:202`:** gradient check icon (teal/green) → **"You're In!"** (Inter Black) → "Your profile is ready for takeoff" → cards **AUTHENTICATED AS** (name) + **EMAIL IDENTIFIER** (email) → **"SUBMIT REGISTRATION"** green button (with green glow).

#### 2.4 Home / Dashboard — `7:501`
- **Header (dark gradient, navy):** "GOOD EVENING" pill (top-left) + chat & bell icon buttons (top-right, dark rounded). Headline **"Where to today?"** (white + "today?" gradient).
- **Search bar (white pill):** location pin, "CURRENT LOCATION" overline + **"Shahbag, Dhaka"**, and a **"Find Ride"** button on the right.
- **Stats grid 2×2** (white rounded cards, pastel icon tiles): **45 Total Rides**, **৳3240 Savings**, **125.5kg CO₂ Saved**, **2 Active Plans** (big number Inter Black, small uppercase caption `#94A3B8`).
- **Premium plan card** (violet `#4F46E5`): "Monthly Premium" pill, **"Office Route"**, "Shahbag → Motijheel", "USAGE" progress + "8 / 20 RIDES", **40%** ring on the right.
- **"On Schedule"** section header + **"VIEW ALL"** link (indigo). Ride cards: driver avatar, name, ★rating, car model, route stops (colored dots), **"Arriving in 2h 30m"** (emerald) + **"TRACK LIVE"** (indigo).
- Bottom rider tab bar (Home active).

#### 2.5 Find / "Where to" — `94:2116` (alt `48:1969`)
- Map header (dark, route lines, place pins) with back button.
- **Bottom sheet** (white, drag handle): **"Where do you want to go?"**; **FROM** (hollow circle) and **TO** (filled purple dot) rows in a grouped field; **"RECENT PLACES"** list — *Motijheel Dilkusha — Work*, *Bashundhara City — Mall*, *Dhanmondi 27 — Home* (clock icons); a primary **"SEARCH AVAILABLE RIDE"** button (violet) pinned above the tab bar.

#### 2.6 Search Results / "Available Rides" — `48:1504` (card component `37:1004`)
- Map header (Dhaka map, pins) + back.
- **Bottom sheet:** title **"Available Rides"**, "2 rides found fo…", filter + back icons.
- **Ride result cards** (white, rounded): avatar, **driver name** + optional **"WOMEN ONLY"** pink badge, car model + **★ rating**, **price `৳150` / "PER SEAT"** (indigo), and a 3-column stat strip **TIME · DURATION · SEATS** (e.g. `08:30 AM · 45m · 3 Left`). Tab bar (Find active).

#### 2.7 Ride Detail — `109:46`  *(this is the "Ride Detail + Seat Map" item — note: seat selection is count-based, no positional seat map)*
- Map top, back + heart + share icon buttons.
- Floating badges: **"Regular Commute"** (indigo), **"MORNING SLOT"** (dark), **"WOMEN ONLY"** (pink).
- **Detail card** (white): **"Office Route"** + **`৳120` / "PER TRIP"**; clock "08:00 AM – 08:45 AM • 45 mins"; stat chips **3 Left · 8.5 km · Verified** (emerald check); **route timeline** with vertical divider and stops: *Shahbag — Pickup Point — 08:00 AM* / *Kakrail — Midway Stop — 08:15 AM* / *Motijheel — Destination — 08:45 AM*.
- **"Ride Facilities"** card: chips **AC · Music · Phone Charging · Spacious · Wifi** (emerald check icons).
- **"BOOK THIS RIDE"** primary gradient button → opens booking modal stack (§2.19).
- **Chat / Call** dark buttons (paired).
- **"Rider Review"** (+"View All"): review rows (avatar initial, name, time-ago, ★ stars, quote).
- **"Subscription Plans"**: 3 cards **Weekly ৳600 (−17%)**, **Monthly ৳2400 (−33%, selected/violet border)**, **Quarterly ৳6800 (−40%)**.

#### 2.8 Live Tracking — `7:772`
- Full map; **"● LIVE TRACKING"** pill (emerald dot) top-right; back button; destination pin + blue heading arrow (user).
- **Bottom sheet:** "ESTIMATED ARRIVAL" → **"5 mins"** (Inter Black), nav-arrow chip + **"1.2 km away"**; **progress bar** (indigo); **driver card** (avatar, ★4.9 badge, **Karim Uddin**, "Toyota Corolla • Dhaka", plate "Metro-11-1234", chat + call buttons); **"Share Trip"** (neutral) + **"Emergency"** (red) buttons. Tab bar.

#### 2.9 Subscription Tracker — `114:833`
- Back + title **"Subscription Tracker"** / "Shahbag ↔ Motijheel".
- **Dark status card:** pin glyph, "Karim is waiting at your pickup point", **"I'm Here (Start)"** white button, **"MISSED" / "ABSENT"** dark buttons.
- **"Current Progress"** card: "Monthly Pass", **12/22** "RIDES TAKEN" (indigo), progress bar, "STARTED: JAN 1, 2026 — ENDS: JAN 31, 2026".
- **"Ride Calendar"** card: legend **● Taken (green) ● Missed (red)**, weekday header, day grid with colored status circles.
- **"Report Issue"** (red-tint) + **"Rate Driver"** (indigo-tint) action cards.
- Driver mini-card (Karim Uddin, Toyota Corolla 2020, call + chat).

#### 2.10 My Journey — Active Plans — `114:555`
- **Header (light, frosted, sticky):** **"My Journey"** (Inter Black 24) + "HISTORY & SCHEDULES" overline; calendar icon button (`#EEF2FF`, rounded 16, 48px).
- **Segmented** `Active Plans | History` (track `#F1F5F9`/`#F3F4F6`, active = white pill + shadow).
- **Plan card** (white, rounded 32, soft shadow): emerald dot + **"ACTIVE PLAN"** label + **"ONGOING"** gradient badge; **"Shahbag ↔ Motijhee"** (H2); "Mon, Tue, Wed, Thu, Fri • 08:00 AM"; inner **"MONTHLY PROGRESS"** card with **8 / 20 Rides** and progress bar (`#4F46E5` fill at 40%, track `#E2E8F0`); footer row: gradient avatar + **"Assigned Driver / KARIM UDDIN"** and **"NEXT TRIP / Tomorrow at 8:00 AM"** (indigo). Tab bar (My Rides active, with dot indicator).

#### 2.11 My Journey — History — `114:682`
- Same header; **History** tab active. List of past-ride cards: route (e.g. **"Dhanmondi → Gulshan"**), date, status badge **Completed** (emerald) / **Canceled** (red), passenger row (avatar/color, name, **৳ amount**, chevron).

#### 2.12 Safety Center — `114:1338`
- **Header:** red→pink gradient, centered shield, **"Safety Center"** + "We're here to protect you 24/7".
- **Emergency SOS card:** red triangle icon, **"Emergency SOS"** + "Priority Response" pink pill, description, **"📞 Call Emergency SOS"** red-gradient button.
- **"Trusted Contact"** card: **"+ Add"**; rows (avatar initial, name, phone, delete icon) — *Mom 01700000000*, *Dad 01800000000*.
- **"Safety Tips"** list: shield-icon cards — "Check Ride Details", "Wear Seatbelt", etc. Tab bar (Safety active).

#### 2.13 Profile (Rider) — `114:1514`
- **Header:** dark navy gradient, back + logout (red) icons; **avatar** in white rounded-square frame with **"GOLD"** tier pill.
- Name **"Ahmed Rahman"**, "rider@example.com"; **stats row** ★4.8 RATING · 42 RIDES · 1250 POINTS (each in a subtle card).
- **"Go Premium"** card (blue→violet gradient, crown icon): "Get 10% off every ride + priority", chevron.
- **"ACCOUNT"** list (icon + title + sub + chevron): *Personal Details*, *Saved Places*, *Verification Info*, *Account Security*, *Refer & Earn*. Tab bar (Profile active).

#### 2.14 Wallet — `135:132`
- Back + **"Wallet"** + history icon.
- **Balance card** (dark navy gradient): "AVAILABLE BALANCE" → **"৳2,540.5"**; 3 action tiles **Add Money (+) · To bKash · Bank Transfer** (circular icons).
- **"PAYMENT METHODS"**: cards **bKash …8392**, **VISA …4242**, and a dashed **"+"** add tile.
- **"Recent Activity"** (+"See All"): rows with directional arrow icon, title, sub, amount (`৳350`, `+৳1000` green), timestamp.

#### 2.15 Messages — `163:49` (driver variant `193:90`)
- Back + **"Messages"** + compose icon (dark rounded). Search bar. Conversation rows: avatar (+ presence dot), name, last message, time, unread count badge (indigo). Tab bar.

#### 2.16 Notifications — `163:180` (driver variant `193:204`)
- Back + **"Notifications"** + **"MARK ALL READ"** pill. Cards with colored icon tiles: **Booking Confirmed!** (emerald check), **20% Off Your Next Ride** (purple tag), **Schedule Change** (amber warning), **Welcome to NittoJatra** (blue info) — each with body + time-ago + unread dot. "START OF TIMELINE" footer. Tab bar.

#### 2.17 Booking / Payment modals (bottom sheets) — the "Booking Confirmation" flow
Triggered from "BOOK THIS RIDE". White rounded-top sheets with a drag handle and an `×` close:
- **Payment Method `114:410`:** "Payment Method" + **"Total: ৳2400"** pill; options **NittoJatra Wallet** (Balance ৳2,540), **Bank Transfer**, **bKash** (icon tile + chevron).
- **Payment Details `114:51`:** Phone Number + Account Number inputs → **"Verify Account"** (indigo).
- **Security PIN `114:477`:** shield icon, "Enter your secret PIN to authorize", 6-dot PIN field, **"Continue"** (deep purple).
- **Verify OTP `114:530`:** "We sent a 6-digit code to 011****…", 6 OTP boxes, "Resend OTP" link, **"Confirm Payment"** (dark navy).
- **Mobile Transfer `173:363`:** "AVAILABLE ৳2,540.5", Mobile Number / Amount / Reference → **"Confirm Transfer"** (deep purple).
> **Success** is then surfaced as the **"Booking Confirmed!"** notification (§2.16) and mirrors the **"You're In!"** success pattern (§2.3).

#### 2.18 Other rider modals
- **Verification Info `171:288` / `197:504`:** "Verified" badge, NATIONAL ID NUMBER (e.g. `199526182739405`), NID Front / NID Back tiles, "VERIFIED ACCOUNT" note.
- **Saved Places `197:478`:** Home / Office rows (pin icon, address, "Edit"), **"Add New"**.
- **Add Trusted Contact `135:403`:** Name + Phone Number → **"Save Contact"** (deep purple).

---

### DRIVER / CAPTAIN APP

#### 2.19 Driver Dashboard — `171:49`
- **Header (dark):** avatar w/ presence dot, "CAPTAIN ★4.9" + **"Hello, Karim"**; chat + bell dark buttons.
- **Balance card** (violet `#4F46E5` gradient): "TOTAL BALANCE" → **"৳15,24…"**; inner pill "This Month +12% Growth" + arrow; wallet icon.
- **Stats:** **18 Active Rider**, **4.9 Rating** (white cards).
- **"Post New Route"** card (dark circular "+", "CREATE SCHEDULE").
- **"Active Commitments"** (+"VIEW ALL"): schedule cards — "SCHEDULE" badge (emerald), **"Morning Commute"**, time + "MON-FRI", route (Origin → Destination), seat avatars `1 2 3 +`, **"3/4 SEATS FILLED"**.
- Driver tab bar (Dashboard active).

#### 2.20 Schedule Hub — `176:47`
- Back + centered **"Schedule Hub"** + **"+"** button. Segmented `ACTIVE PLANS | ARCHIVED`.
- Schedule cards: "SCHEDULE" badge + time, **route name**, **START POINT** / **END POINT** timeline (indigo dot → muted dot), rider avatar stack `+N`, **"MANAGE"** dark button. Routes tab active.

#### 2.21 Financial Hub (Earnings) — `176:161`
- Back + **"Financial Hub"** + chart icon.
- **Payout card** (dark navy): "AVAILABLE FOR PAYOUT" → **"৳42,85…"**; **"↗ CASH OUT"** white button + **"PENDING ৳2,400"** chip.
- **"On Track for Bonus"** info card (indigo tint).
- **"Recent Activity"** (+"VIEW HISTORY"): rows with direction-arrow tile, title, sub, **green amounts** + status (Completed / Pending). Earnings tab active.

#### 2.22 Driver Profile — `176:279`
- **Header (dark):** back + logout; avatar w/ shield badge; **"Karim Uddin"**, "CAPTAIN • Toyota Axio 2018"; stats ★4.9 RATING · 1450 TRIPS · 2.5 Yrs EXP.
- **"Level 5 Captain"** card (violet gradient, medal icon): "You are in the top 5% of drivers!".
- **"PREFERENCES"** list: *Personal Information*, *Vehicle Management*, *Saved Zones*, *Safety & Verification*, *App Settings*. Profile tab active.

#### 2.23 Post Route — 4 steps (light) `175:46 → 175:90 → 175:133 → 175:172`
Shared: back button + slim **4-segment progress bar** (filled = `#4F46E5`); H2 = black line + **violet line** (e.g. "Define Your **Journey**"); sub-caption; full-width violet **"CONTINUE ›"** / final **"PUBLISH ROUTE ›"** pinned bottom.
- **Step 1 — Define Your Journey `175:46`:** **STARTING POINT** input, **"+ Add Stop"**, **DESTINATION** input, with a vertical timeline (indigo dot → magenta pin).
- **Step 2 — Set Your Schedule `175:90`:** "ACTIVE DAY" day pills `S M T W T F S` (weekdays selected, violet circles); **DEPARTURE TIME** field.
- **Step 3 — Fair Pricing `175:133`:** green **"PRICE PER SEAT"** card (৳ input, "Recommended: ৳120 – ৳150"); **"TOTAL SEAT"** selector `1 2 3 4` (4 selected, indigo border).
- **Step 4 — Final Details `175:172`:** amenity toggles **AC (on) · FREE WIFI · MUSIC · OTHER**; **"Women Only / RESTRICTED VISIBILITY"** switch; **"PUBLISH ROUTE"**.

#### 2.24 Driver modals
- **Management Console `187:339`:** route summary (DEPARTURE / SUBSCRIBERS 3/4), **"CONNECTED RIDERS"** (+"3 Booked") rows (avatar, name, **VERIFIED** tag, plan + ৳, call + chat), **"INITIATE JOURNEY"** violet button.
- **Withdraw Funds `187:375`:** "AMOUNT TO WITHDRAW ৳0", **BANK / BKASH** toggle, **"CONFIRM WITHDRAWAL"**.
- **Vehicle Management `193:82`:** VEHICLE MODEL (Toyota Axio 2018), LICENSE PLATE (Dhaka Metro-GA-11-2233), LICENSE PHOTO upload, **"SAVE VEHICLE INFO"**.

---

## 3. Differences / things to verify against current code

Current claimed tokens: `primary #4F46E5`, `accent #EC4899`, `background #F8FAFC`, `surface #FFFFFF`, `text #0F172A`; fonts Poppins + Noto Sans Bengali.

| # | Area | Figma (verified) | Current claim | Action |
|---|---|---|---|---|
| 1 | **Font family** | **Inter** (Black/Bold/Medium) everywhere | Poppins | **Mismatch.** Either switch UI font to **Inter**, or accept Poppins but replicate the *weights & tracking* exactly (Black 900 headings w/ negative tracking; Bold/Medium uppercase labels w/ positive tracking). Keep Noto Sans Bengali only as a `৳`/Bengali fallback. |
| 2 | `primary` | `#4F46E5` ✅ (with gradients `#6366F1→#8B5CF6` and `#4F46E5→#7E22CE`) | `#4F46E5` | **Match.** But add the **gradient pair tokens** — flat `#4F46E5` alone won't reproduce the CTAs/app-icon. |
| 3 | `accent` (pink) | `#EC4899` ✅ (used for "WOMEN ONLY" + Safety header) | `#EC4899` | **Match**, but note pink is *secondary*; the more pervasive accent is **emerald `#10B981`** (success/ongoing/verified) — add it as a token. |
| 4 | `background` | `#F8FAFC` ✅ | `#F8FAFC` | Match. |
| 5 | `surface` | `#FFFFFF` ✅ | `#FFFFFF` | Match. |
| 6 | `text` | `#0F172A` ✅ | `#0F172A` | Match. Add the full slate text ramp (`#64748B`, `#94A3B8`, `#6B7280`, `#475569`). |
| 7 | **Dark surface system** | `#020617` base + glass (`rgba(0,0,0,0.4)`, `backdrop-blur 12`, `rgba(255,255,255,0.1)` borders) + ambient orbs | (not listed) | **Likely missing.** This is the signature look for Welcome/Login/Register and all dark headers. Implement a `dark`/`glass` token group + reusable BlurView card + ambient-orb background. |
| 8 | **Gradient CTAs & hairlines** | multi-stop gradients + top white hairline + colored glow shadows | flat buttons likely | Add a `GradientButton` with the indigo→purple / indigo→teal variants, top hairline, and glow shadow. |
| 9 | **Tab bar** | 5 items, **active = `#4F46E5` + 4px dot indicator**, inactive `#6B7280`, white bar w/ top hairline + upward shadow; **two variants** (rider vs driver) | verify | Confirm the dot indicator and the **driver tab set** exist. |
| 10 | **Two-app scope** | Rider **and** Driver/Captain apps | verify | Confirm the app implements (or stubs) the driver flow (Dashboard, Schedule Hub, Financial Hub, Post Route 4-step, driver Profile/modals). |
| 11 | **Radii** | auth card **40**, content cards **32**, inputs/buttons **16** | verify | Ensure large radii (32/40) are used — generic apps default to 8–12 and will look wrong. |
| 12 | **Currency** | Taka `৳` with thousands formatting (`৳3240`, `৳2,540.5`) | verify | Ensure `৳` renders (font fallback) and number formatting matches. |
| 13 | **Seat model** | per-seat-**count** ("3 Left", TOTAL SEAT 1–4), **no positional seat map** | verify | If the app built a positional seat grid, it diverges from Figma — switch to count-based selection. |

---

## Appendix — Canonical frame index

**Rider screens:** Welcome `2:2` · Login `5:5` · Register: Credentials `7:67`/`170:51`, Identity `7:136`/`170:118`, Vehicle(driver) `7:256`, Success "You're In!" `7:202` · Home `7:501` · Find `94:2116`/`48:1969` · Results `48:1504` (card `37:1004`) · Ride Detail `109:46` · Live Tracking `7:772` · Subscription Tracker `114:833` · My Journey Active `114:555` / History `114:682` · Safety `114:1338` · Profile `114:1514` · Wallet `135:132` · Messages `163:49` · Notifications `163:180`.
**Rider modals:** Payment Method `114:410` · Payment Details `114:51` · Security PIN `114:477` · Verify OTP `114:530` · Mobile Transfer `173:363` · Verification Info `171:288`/`197:504` · Saved Places `197:478` · Add Trusted Contact `135:403`.
**Driver screens:** Dashboard `171:49` · Schedule Hub `176:47` · Financial Hub `176:161` · Profile `176:279` · Post Route `175:46`/`175:90`/`175:133`/`175:172` · Messages `193:90` · Notifications `193:204`.
**Driver modals:** Management Console `187:339` · Withdraw Funds `187:375` · Vehicle Management `193:82`.
