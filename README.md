## 🧩 Frontend — Built with React & Tailwind

The frontend of **Temvi** is a minimalist social media web app focused on essential features and clean UX. It was built using **React**, **Tailwind CSS**, **Context API**, **Socket.io**, and **Headless UI**.

### ⚙️ Core Functionality

- 🔐 Authentication & 2FA login
- 📝 Create, update, delete posts
- 💬 Commenting on posts
- 👥 Mentioning followers using `@followers`
- 🔔 Real-time notifications via Socket.io
- 🔒 Protected post visibility: Public / Followers / Private
- 🧑‍💼 Profile customization

### 🧠 Lessons Learned

As my **first major project after completing MERN full-stack**, the frontend taught me several hard-earned lessons:

#### 🧵 The Importance of Axios

> “I used to think `fetch()` was all I needed — until I had to write the domain over and over again.”

Initially, I ignored `axios`, thinking `fetch()` was enough. But once the app grew, having to manually repeat API domains across pages became messy. Switching to `axios` simplified the entire data fetching process by centralizing the base URL.

#### 🌍 Global State Matters

> “Why use Context or Redux when `useState` works? Then came prop drilling hell.”

I underestimated the importance of **global state**. At first, I avoided Context API thinking it was unnecessary boilerplate. But managing shared state like **user data** or **modal visibility** across components quickly became a nightmare.

While I haven’t learned Redux or Zustand yet, I used **Context API** to manage:
- Global user state
- Notification state
- Modal toggles (although some modals were still duplicated/hardcoded)

I realized later I could’ve improved this by rendering global modals once and toggling them via context instead of managing modal state in multiple components.

#### 📜 Infinite Scroll & TanStack Query

> “Pagination buttons felt outdated — so I built an infinite scrolling feed.”

Inspired by Facebook’s feed, I learned about **TanStack React Query** for efficient data caching and fetching. Implementing infinite scroll made the feed more modern and user-friendly.

#### 🧼 Clean Code & Avoiding Hardcoding

While earlier projects taught me not to hardcode values, this project showed how **hardcoding creeps back in** as features grow. I worked hard to reduce duplication and keep components modular — though there’s still room to improve.

### 🎨 Design Approach

> “No UI/UX experience, no designer — just inspiration and iteration.”

I had no formal UI/UX background, so I took inspiration from **Facebook** and **Dribbble** to create a clean and usable interface. Despite limitations, the design of **Temvi** is fully responsive and functional.

### 🕒 Timeframe

It took **6–7 days** to build the frontend — while actively learning best practices, writing scalable code, and simplifying complex ideas into production-friendly solutions.