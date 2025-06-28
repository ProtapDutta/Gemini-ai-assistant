

## **Project Overview**

This is a **React-based frontend** for a Tata Motors-themed website. It features:
- A responsive header/navigation bar
- A video/image carousel
- An AI-powered chatbot assistant
- Modular, reusable components
- Custom CSS for styling

---

## **Component Breakdown**

### 1. **Header (Header.jsx)**
- **Purpose:** Displays the Tata Motors logo and navigation links.
- **Features:**
  - Responsive design: On small screens, navigation links collapse into a hamburger menu.
  - Hamburger menu toggles navigation visibility using React state (`menuOpen`).
  - Uses a Tata Motors SVG logo.
- **Styling:** Controlled by header.css, which includes flexbox layout, sticky positioning, and responsive breakpoints.

---

### 2. **Video Carousel (VideoCarousel.jsx)**
- **Purpose:** Showcases Tata Motors vehicles using a carousel with images and a video.
- **Features:**
  - Uses [Swiper.js](https://swiperjs.com/) for the carousel functionality.
  - Three slides: 
    1. Cars image
    2. Altroz car video (auto-plays, disables carousel autoplay while playing)
    3. Trucks image
  - When the video slide is active, carousel autoplay pauses until the video ends, then resumes.
- **Media:** Loads images and video from the `media` folder.

---

### 3. **Chatbot (Chatbot.jsx, ChatMessage.jsx, Context.jsx)**
- **Purpose:** Provides an AI assistant for Tata Motors-related queries.
- **Features:**
  - Uses Google Generative AI (Gemini API) for responses.
  - Maintains chat history in React state (`messages`).
  - Shows a loading indicator ("Thinking...") while waiting for a response.
  - Can be minimized/maximized for user convenience.
  - Sends a detailed Tata Motors context (Context.jsx) with every user query to ensure relevant answers.
  - Each message is rendered by the `ChatMessage` component, styled differently for user and bot.
- **Styling:** Controlled by chatbot.css, with support for minimized state and responsive design.

---

### 4. **Styling**
- **header.css:** Handles the header’s layout, colors, hamburger menu, and responsive behavior.
- **chatbot.css:** Styles the chatbot window, messages, input area, and minimized state.

---

## **Key Technical Concepts**

- **React Functional Components & Hooks:** All components use functional syntax with hooks (`useState`, `useRef`, `useEffect`).
- **State Management:** Local state is used for UI toggles (menu, chatbot minimized), chat messages, and loading indicators.
- **Third-party Libraries:** 
  - **Swiper.js** for the carousel.
  - **Google Generative AI SDK** for chatbot responses.
- **Responsive Design:** CSS media queries and conditional rendering ensure usability on all devices.
- **Separation of Concerns:** Each component has a clear, single responsibility.

---

## **How the Pieces Fit Together**

- The **Header** provides navigation and branding.
- The **VideoCarousel** visually showcases Tata Motors products.
- The **Chatbot** offers interactive, AI-powered support and information, leveraging a detailed context about Tata Motors.
- **Styling** ensures a modern, branded, and responsive user experience.

---

## **Summary**

> “This project is a React-based frontend for Tata Motors, featuring a responsive navigation header, a Swiper-powered carousel for showcasing vehicles, and an AI chatbot assistant. The chatbot uses Google’s Gemini API and is always contextually aware of Tata Motors’ business, products, and support details, thanks to a detailed context prompt. The UI is fully responsive, with custom CSS for both the header and chatbot. Each component is modular and uses React hooks for state and lifecycle management. The carousel intelligently pauses autoplay for video slides, and the chatbot can be minimized for convenience. Overall, the code demonstrates best practices in React, third-party integration, and responsive design.”

---

Let me know if you want a more technical deep-dive or a higher-level summary!
