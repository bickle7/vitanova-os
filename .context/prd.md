# VitaNovaOS — Product Requirements Document

## App Overview

**What is it?**
VitaNovaOS is a personal lifestyle app — a single hub that brings together all the things that matter day to day. Rather than juggling multiple apps, everything lives in one place: language learning, food, fitness, sport, travel, finances, entertainment and more.

**Who is it for?**
Built for Scott. Shareable with close friends and family down the line, each with their own account and personalised experience.

**Accounts & Authentication**
- Single user to start (Scott only)
- FOR LATER: Friends and family can be invited to create their own accounts
- Each user has completely private data — no sharing between accounts
- Users can log in and have their own unique view
- Account settings allow features to be turned on/off per user
- A default set of core features enabled on signup, more available to switch on over time
- FOR LATER: Decide which features are on by default for new users

**Feature Toggles**
- Each feature can be independently enabled or disabled per user
- Accessible via Account Settings
- Keeps the app uncluttered — you only see what you use

**Design Principles**
- Dark mode throughout — single consistent theme for all users
- Slick, classy, premium feel
- Clean typography, subtle gradients
- Smooth and satisfying interactions
- Feels professionally designed — not generic
- Inspired by the polish of apps like Spotify, Apple, and Notion
- Primary device: iPhone — must be fully optimised for mobile first

**Notifications**
- App should prompt and remind users about relevant things
- e.g. end of month budget update, Super League predictions, daily prompts
- FOR LATER: Define notification types per feature

**Dashboard / Navigation**
- FOR LATER: Decide between navigation menu, dashboard home screen, or both
- Likely a dashboard showing summary info from active features with nav to go deeper

**Language**
- Default language: English

**Vision**
A personal operating system for life. Everything connected, everything in one place, with a timeline/dashboard that ties it all together and prompts you when things need attention.

**Tech Approach**
- Web app (works on iPhone, Mac, iPad)
- Mobile first — primarily accessed on iPhone
- Built feature by feature, starting small
- Claude Code used for all development
- Stack: React (frontend), Node.js/Express (backend), Supabase (database and auth)
- FOR LATER: Native iOS app — planned future goal once web version is established

**Offline Support**
- FOR LATER: Offline functionality to be considered once core app is built

**Settings — About VitaNovaOS**
- Tech stack — what it's built with
- Version number and release date
- Update log — what was added or changed in each version
- Features currently live
- Features coming soon
- Clean, technical, minimal — something to show friends who ask "how did you build this?"

---

## Feature 1 — Spanish Vocabulary

**What is it?**
A personal Spanish reference tool and real-time phrase builder — designed for when you're actually in Spain and need something quickly. Sitting in a bar, ordering food, asking for directions — tap a few things and your phrase is ready. Equally useful as a reference tool to browse and learn.

**Two Equal Modes**
- Reference Mode — browse, learn, add words, study vocabulary
- Quick Tap Mode — build phrases fast in real-time situations

**Core Dictionary**
- Personal word list — words you've added yourself
- Browse English to Spanish or Spanish to English
- Alphabetical view
- Favourites — heart any word to save to favourites
- Categories: Greetings & Basics, Eating/Drinking Out, Travel & Directions — more added over time

**Adding Words**
- Manually add your own words
- App suggests words based on category
- Discovery word bank — browse broader library and pull words into your personal list

**Quick Tap Phrase Builder**
- Organised by situation/context:
  - Eating & Drinking Out
  - Shopping
  - Getting Around/Directions
  - Hotel & Accommodation
  - Emergencies
- Within each context, see common connecting phrases — Can I get, I would like, Where is, How much is, I need
- Tap connector + tap word(s) = instant full phrase
- e.g. "Can I get" + "some more bread" + "please" = "Me puede traer mas pan, por favor?"
- App learns which phrases YOU use most and surfaces them first
- App also suggests commonly needed phrases for each context — even ones not yet in your personal list

**Phrase Display**
- Built phrase shown clearly in Spanish + English translation
- Tap further to reveal pronunciation guide and additional info
- Show Mode — display phrase large on screen to show someone (e.g. hold up to waiter)
- Copy & Share — copy phrase or share via WhatsApp, email, Messenger etc.
- FOR LATER: Decide how prominent the share functionality should be

**Smart Learning**
- App learns from both general usage patterns and your specific habits
- Surfaces your most used phrases and words first
- Gets more personalised over time

**Quiz Mode (optional)**
- Optional flashcard/quiz mode to test yourself on vocabulary
- FOR LATER: Track quiz scores and progress over time

**Pronunciation**
- Available as a secondary tap — not in your face
- FOR LATER: Audio pronunciation

---

## Feature 2 — Food Planning & Calorie Tracking

**What is it?**
A combined food planning and calorie tracking feature. AI-powered evening meal suggestions that learn your taste, plus a simple daily food log for tracking calorie intake across all meals. Everything in one place — plan your evenings, log your day, see your patterns over time.

**Recipe Storage**
- Add your own recipes manually — full details including ingredients and method
- Import recipes from the internet — search and pull in from web
- Each recipe stored with full details: ingredients, method, estimated calories
- Browse and search your recipe library

**AI Meal Suggestions**
- Tell the app your food preferences upfront — favourite cuisines, dishes, things you dislike
- AI suggests evening meals each week based on your preferences
- Learns from what you rate and eat over time — gets smarter the more you use it
- Avoids repeating the same style of meal week after week — mixes it up
- Suggestions pulled from your recipe library and new ideas from AI

**Household Profiles**
- Set up a partner profile within Food Planning
- Each person sets their own preferences and dietary requirements:
  - Scott — eats meat, fish, everything
  - Partner — fish only, no meat, vegetarian options
- AI factors in both profiles when suggesting meals
- Suggests meals that work for the household — e.g. burger night, steak night with alternatives
- Meals flagged as "his & hers" where needed

**Meal Ratings**
- After each evening meal, rate it:
  - Banker — love it, use regularly
  - OK — fine, put in rotation
  - Avoid — didn't enjoy, drop it
- Ratings feed back into AI suggestions

**Weekly Meal Planner**
- Evening meals only for planning/suggestions
- App suggests a weekly plan, you can adjust or randomise
- Ability to skip nights — takeaway, eating out, not home
- Lock in the week when happy

**Shopping List**
- Auto-generated from the weekly meal plan
- Ingredients consolidated into a flat, clean list — quantities combined, no duplicates
- Organised by category — Meat, Fish, Veg, Dairy, Cupboard etc.
- Export options:
  - Copy as plain text — paste straight into AnyList or any other app
  - FOR LATER: Direct AnyList integration
  - FOR LATER: Other sharing options

**Daily Food Logging**
- Evening meal — planned via meal planner
- Breakfast, lunch, snacks — quick manual entry as you go
- Simple and fast — just type what you had, app estimates calories
- All feeds into daily calorie total

**Daily Calorie Dashboard**
- Calories consumed today
- Calories you should have (your daily target)
- Naturally burned (BMR — just being alive)
- Exercise burned (from Strava/Apple Watch)
- Net position — e.g. "200 calories under today" or "300 calories over"
- Clean, visual, at a glance

**Views — Daily / Weekly / Monthly**
- Daily — full breakdown for today
- Weekly — total calories in vs out, deficit or surplus for the week, each day visible
- Monthly — monthly overview, week by week breakdown
- Scroll back through previous weeks and months
- Trends visible over time

**AI Health Intelligence**
- Weekly and monthly summaries generated by AI:
  - "Last week you were 1,200 calories under overall — good progress"
  - "After your run on Wednesday you probably didn't recover well — protein was low that day"
- Spots patterns across food and exercise
- Suggests specific foods to help recovery and goals
- New meal ideas surfaced based on nutritional gaps
- FOR LATER: Full macro tracking — protein, carbs, fats

**Look Back & Insights**
- Timeline/calendar view — scroll back through previous meals visually
- Stats and charts — what you eat most, variety, calorie trends
- Slick, visual presentation

**Notifications**
- End of day nudge if significantly over or under calories
- Weekly summary notification

**Connection to Fitness Feature**
- Calorie data available to the Fitness feature
- FOR LATER: Combined view of calories in vs calories burned

---

## Feature 3 — Fitness

**What is it?**
A fitness tracking hub that pulls in all activity data from Strava and Apple Health, tracks your weight, and connects to your food/calorie data to give you a complete picture of your health — actively helping you lose weight, get stronger and get fitter.

**Primary Goals**
- Lose weight
- Get stronger
- Get fitter

Everything in the fitness and food features should be optimised around these three goals. The AI should always be working toward them when making suggestions.

**Integrations**
- Strava — pulls in all activity types automatically (runs, cycles, gym, walking etc.) with distance, pace, time, calories burned, heart rate
- Apple Health — pulls in all available health data automatically
- Both sync automatically — no manual data entry needed

**Apple Watch / Apple Health Data**
Pull in everything available and use it for recommendations, trends and insights:
- Sleep — hours, quality, deep sleep, REM
- Heart rate — resting, active, recovery
- Body temperature — trends and anomalies
- Breathing rate — respiratory trends
- Blood oxygen (SpO2)
- Steps and daily movement
- HRV (Heart Rate Variability) — key indicator of recovery and stress
- Recovery score

**AI uses all of this to:**
- Spot patterns — e.g. "Your HRV has been low all week — your body needs rest"
- Give smarter recommendations — e.g. "Your temperature and breathing rate suggest you might be fighting something — take it easy today"
- Build a complete picture of your health — not just exercise and food, but how your body is actually doing day to day
- Trends over time — are you generally improving across all metrics?

**Companion Apps**
- Fitbod or Apple Fitness+ recommended for workout planning
- VitaNovaOS focuses on tracking, analysis and the bigger picture — not workout planning

**Workout Logging**
- Apple Watch/Strava provides: duration, calories burned, heart rate
- You add manually in app: specific exercises done — sets, reps, duration
- e.g. 50 sit-ups, 2 mins plank, 3x10 kettlebell swings
- Builds workout history for analysis alongside calorie data

**Weight Tracking**
- Manually log your weight regularly in the app
- Weight also pulled from Apple Health/Renpho automatically
- Set a target goal weight
- Track progress toward it over time

**Calories In vs Out**
- Pulls calorie intake data from Food Planning feature
- Combines with calories burned from Strava activities
- Daily and weekly net calorie view
- Helps understand what's needed to hit weight loss goal

**AI Coaching**
- Proactively spots where you could do better — not just reporting data, but advising on it
- e.g. "You've been over calories 4 out of 7 days this week — here's what's pushing it up"
- e.g. "Your run pace has improved but you're not doing enough strength work to hit your goals"
- e.g. "You only got 5hrs sleep before your run — consider a lighter session today"
- e.g. "Your recovery is being affected by poor sleep this week — prioritise rest"
- Suggestions always tied back to the three goals — lose weight, get stronger, get fitter
- Feels like a personal coach, not just a tracker

**Age Benchmarking & Motivation**
- Compare your stats against averages for your age group:
  - Running pace, distance, frequency
  - Resting heart rate
  - Calories burned
  - Weight/BMI
- Motivating callouts:
  - "Your resting heart rate is better than 75% of men your age"
  - "Your 5k pace puts you in the top 20% for your age group"
  - "Your fitness stats are equivalent to someone 5 years younger"
- Progress celebrated — not just tracked
- Small wins called out
- Honest but encouraging when things slip

**Goals & Guidance**
- Set a target weight
- FOR LATER: Daily/weekly activity and calorie targets to hit goal
- FOR LATER: App guidance — e.g. "you need to run 3x this week to stay on track"

**Look Back & Insights**
- Timeline/calendar view — scroll back through activities
- Stats and charts — distance over time, weight trend, calories burned, pace improvements
- Slick visual presentation

---

## Feature 4 — Calendar & Events

**What is it?**
Not a day-to-day calendar — Apple Calendar handles that with your partner. This is for big life events — holidays, trips, camping, family visits, concerts — anything that has planning, bookings and logistics around it.

**Examples of what goes in here**
- Holiday to Spain
- Camping trip
- Mum coming to visit
- Concert or big night out
- Away match trip

**Events**
- Add holidays and big events
- Start simple — just a name and date when first planned
- Add more detail as things get confirmed:
  - Flights — times, booking references
  - Hotels — name, check in/out dates
  - Activities & itinerary
- Events have a pencilled and confirmed status

**Countdown**
- Prominent countdown to your next upcoming event
- e.g. "23 days until Tenerife"
- Shows on dashboard

**Birthdays**
- Add birthdays for family and friends
- Shows upcoming birthdays in the calendar view
- Links to Wants & Gifts feature — gift ideas per person

**Leeds Rhinos & Leeds Utd Fixtures**
- Pull in fixture lists via API where possible — manual fallback if needed
- Shows date and opponent only
- Updated automatically when new fixtures published

**iOS Calendar**
- FOR LATER: Two-way sync with iOS Calendar

**History**
- Future events only — no history kept once events pass

---

## Feature 5 — Sport

**What is it?**
Two sporting features in one — a Super League score prediction and handicap tracker, and an NFL Fantasy dashboard with AI-powered advice.

**Super League Predictions**

**Fixtures & Predictions**
- Super League fixtures pulled in via API where possible
- Before each round — enter your predicted score for each match
- After matches — results pulled in and compared against your predictions

**Handicap Tracker**
- Before each round — enter YOUR predicted handicap per match
  - e.g. Leeds Rhinos -6 vs Leigh Leopards
- When bookies odds release — enter or auto-pull the market handicap
- App shows the difference — e.g. "You're 6pts off the market"
- Flags potential betting angles — where you differ significantly from the market
- After results — compares: your prediction vs market vs actual result
- Season tracker:
  - How often you beat the market
  - Your average points difference vs bookies
  - Win rate of flagged betting angles
- FOR LATER: Auto-pull handicap odds via BetsAPI

**Stats & Tracking**
- Per game — how close your prediction was
- Season overview:
  - Total predictions made
  - Average points difference
  - Best and worst predictions
  - Win/loss prediction accuracy %

**Notifications**
- Thursday reminder — "Enter your handicap predictions before the odds drop!"
- Odds release reminder — "Bookies handicaps are out — go check your predictions!"
- Results reminder — prompt after match day to pull in results

**NFL Fantasy — Sleeper**

**Weekly View**
- Current roster — pulled from Sleeper API
- Weekly waiver wire planner:
  - Organised by week
  - Add target players by position — QB, RB, WR, TE
  - Notes on why you want them
  - Track who you actually picked up vs who you targeted
- Trending players on the waiver wire — pulled from Sleeper API

**AI Fantasy Assistant**
- Weekly AI-powered roster advice — based on your current team, matchups and waiver availability
- Waiver wire recommendations — AI suggests best pickups for your specific roster needs
- Trade analyser — submit a trade offer and get AI advice on whether to accept, decline or counter
- Powered by Claude AI + Sleeper data combined

**Integrations**
- Sleeper API — free, public, no authentication needed
- FOR LATER: Deeper Sleeper integration — matchups, scoring, trade analysis

---

## Feature 6 — Budgeting

**What is it?**
A simple monthly spending tracker. Upload your bank statements, let the app categorise and analyse your spending, and get a clear picture of where your money goes each month. No bank connections, no sensitive data stored — just clean monthly insights.

**Statement Upload**
- Upload bank statements in CSV/Excel or PDF format
- App reads and processes transactions automatically
- Sensitive data handled carefully — no account numbers or personal details stored, transactions only
- Supports multiple accounts/statements per month

**Income Tracking**
- Log income coming into the account each month
- Track by source:
  - Scott — salary, freelance, self employed income
  - Partner — her income
  - Which bank account it lands in
- Multiple income sources supported
- Income vs expenditure shown clearly in monthly overview

**Smart Categorisation**
- App automatically suggests categories for each transaction:
  - Food & Groceries
  - Eating Out
  - Entertainment
  - Travel
  - Bills & Subscriptions
  - Shopping
  - Home
  - Health
  - Other
- Review and correct miscategorised transactions
- App learns corrections over time

**Monthly Overview**
- Total income vs total expenditure
- Breakdown by category
- Biggest spends of the month
- Month on month comparison
- Slick visual charts

**Notifications**
- End of month prompt — "Time to upload your statement for [month]!"

**Future**
- FOR LATER: Set monthly budgets per category
- FOR LATER: Savings goals tracking

---

## Feature 7 — Personal Library

**What is it?**
A personal cultural diary — everything you've watched, read, listened to and where you've been, all in one place.

**Movies**
- Search TMDB database to import film details automatically — title, poster, genre, cast, release date, streaming platform
- Or add manually
- Status flags:
  - Favourite
  - Watch Next
  - Watchlist
  - Watched
- Filter/search by: actor, genre, release date, streaming platform

**Movies & TV — Recommendations**
- AI looks at your watched list, favourites and ratings
- Suggests movies and TV shows you might enjoy — similar to Spotify's recommendation engine
- Each recommendation shows:
  - Title, poster, genre, year
  - Info button — tap for full details, cast, trailer link, where to watch
  - Add button — add straight to Watchlist, Watch Next or Favourites
- Refreshes regularly — new suggestions as your taste data grows
- Feels curated, not random

**TV Series**
- Same as Movies — search TMDB or add manually
- Same status flags and search/filter options

**Music**
- Log artists and albums you love
- Simple and personal — just a record of what you're into
- FOR LATER: Spotify integration potential

**Books**
- FOR LATER: Full book tracking to be decided — currently using Amazon books list, don't want to duplicate
- May add a simple personal notes field for now

**Books — Recommendations**
- AI looks at any books you've logged and notes
- Suggests books you might enjoy
- Each recommendation shows:
  - Title, cover, author, genre
  - Info button — tap for full details and synopsis
  - Add button — add to your reading list
- FOR LATER: Links to Amazon to purchase recommended books

**Places**
- Log places you've visited — name and personal notes
- Bucket list — places you want to visit
- Simple and clean

---

## Feature 8 — Wants & Gifts

**What is it?**
Three connected tools — a personal wants list to replace your Notes app, a birthday gift tracker with smart reminders, and a Christmas gift planner.

**Personal Wants List**
- A running list of things you want — replaces scribbling in Notes
- Organised by categories (details TBC when building)
- Shopping Trip mode — create a specific shopping trip and flag items from your main list to target that day
- Focused smaller list per shopping occasion without losing the main list

**Birthday Gifts**
- Linked to birthdays in the Calendar & Events feature
- Add gift ideas for each family member as they come to you
- Smart reminders:
  - 3 months before — "Tas's birthday is coming up, any ideas yet?"
  - 1 month before — "Have you sorted Tas's present?"
  - 2 weeks before — "Time is running out for Tas's birthday!"
- Organised by person, sorted by upcoming date

**Christmas Gifts**
- Separate Christmas planner — different format to birthdays
- Top level: Christmas
- Under that: list of family members to buy for
- Under each person: gift ideas and suggestions
- Track bought/not bought per person
- Reminders as Christmas approaches
- FOR LATER: Shareable Christmas list

---

## Feature 9 — To Do List

**What is it?**
Two distinct list types — a long term task manager for important ongoing things, and a rapid daily brain dump for things that pop into your head. Built for someone who thinks of things on the go and needs to capture them fast.

**Long Term Lists**
- Multiple lists organised by category:
  - Work
  - Personal
  - Home
  - More categories added as needed
- Each task has:
  - Priority flag — High, Medium, Low
  - Optional due date
- App automatically sorts — overdue first, then by priority
- Tick off when done
- Reminders for upcoming and overdue tasks

**Daily Brain Dump**
- A separate rapid-entry list for the day ahead
- Quick to add — designed for speed:
  - Voice input — speak tasks in, perfect for when driving
  - Quick tap entry — minimal typing required
- Tasks are just for today — no priority, no dates
- End of day prompt:
  - "You have 3 unfinished tasks — clear them or move to your long term list?"
  - Move important ones across to the right long term list with one tap
  - Clear the rest

**Voice Input**
- FOR LATER: Full voice input if technically complex
- Simple version first — big tap button, quick text entry

---

## Feature 10 — Timeline / Dashboard

**What is it?**
The home of VitaNovaOS — the first thing you see when you open the app. A smart, personalised view of your day, your week ahead, and what needs your attention. Connects everything together and makes the app feel like one cohesive product.

**Home Screen / Dashboard**
- Mix of today + the week ahead
- Summary cards from selected features — decided when building which features surface here
- Examples of what might appear:
  - Tonight's meal
  - Next event countdown
  - Top priority tasks for today
  - Next Super League fixture
  - Last run stats
  - Upcoming birthdays
- Clean, dark, premium feel — not cluttered
- FOR LATER: Fully customisable — choose which cards appear

**Timeline / Feed**
- A personal life feed — scrollable history of activity across the app
- Shows both:
  - History — meals eaten, runs completed, films watched, books read, predictions made
  - Prompts & actions needed — things requiring your attention
- Feels like a personal news feed of your own life
- Slick visual presentation

**Notifications & Reminders Hub**
- Central place to see all reminders across every feature
- Individual feature notifications also sent directly
- Examples:
  - "Time to upload your monthly statement"
  - "Enter your Super League predictions before odds drop"
  - "Tas's birthday is in 3 months — any gift ideas?"
  - "Christmas is 8 weeks away — have you sorted everyone?"
  - "You have 3 overdue tasks"
  - "End of day — clear your daily list or move tasks across?"

**Navigation**
- FOR LATER: Decide final navigation structure — bottom nav bar, side menu, or dashboard only