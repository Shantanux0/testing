# SkillSwap: Presentation Script 🎙️

This script is designed for a **10-15 minute presentation**. Use the cues in brackets `[Slide: Name]` to know when to move your slides.

---

## 1. Introduction (1 Minute)
**[Slide: Title Page / Hero Image]**
"Good morning/afternoon everyone. Today, I am excited to present **SkillSwap**—a premium, AI-powered ecosystem designed for peer-to-peer learning. 

In today’s world, we have plenty of content, but we lack **verified connection**. Most platforms allow anyone to claim they are an 'Expert'. SkillSwap changes that. We’ve built a platform where **Trust is Code** and **Quality is Guaranteed** through AI-driven verification."

---

## 2. The Technical Engine (2 Minutes)
**[Slide: Tech Stack]**
"Before we dive into the features, let’s talk about the engine under the hood. 

We’ve used a modern, high-performance stack:
- On the **Frontend**, we have **React with Vite** and **TypeScript**, styled using **Tailwind CSS** and **Shadcn/UI** for a premium, glassmorphism aesthetic.
- The **Backend** is built on **Spring Boot 3.x**, following a modular monolith architecture.
- For **Security**, we implemented **JWT stateless authentication** with a robust single-device login policy to ensure user data integrity."

---

## 3. Skill Verification: The Test Portal (3 Minutes)
**[Slide: Test Portal / Verification]**
"This is where SkillSwap stands apart. You cannot teach a skill on our platform unless you **prove it**.

When a user wants to list a skill, our **AI-powered Test Portal** generates a unique, 15-question exam on the fly. 
- We use **Groq** as our 'Text Brain' to generate hard-level technical questions using the Mixtral model for high-speed inference.
- A user must score at least **10 out of 15** to pass.
- If the AI is ever offline, we have a **Static Question Bank** fallback, ensuring the system is always reliable."

---

## 4. The "Swapping AI": Our Own Custom Engine (4 Minutes)
**[Slide: The Swapping AI / Match Logic]**
"Now, I want to highlight the most innovative part of our project: **Our own Swapping AI.** 

While we use LLMs for text, we engineered the **matching intelligence** ourselves. This isn't just a search; it's a **Custom Heuristic Engine** that uses a **Weighted Sum Model** to calculate the 'Perfect Swap'.

### The Math & Logic (Simple Explanation):
Our AI takes 8 different pieces of data and calculates a score from 0 to 1. Here is our priority:
1. **Verified Expertise (30%)**: This comes from our Test Portal. If you don't have the score, the AI won't even consider you.
2. **Proficiency Gap (20%)**: This is our **'True P2P' Logic**. We prioritize any match where the teacher is at the same level or higher than the learner.
3. **Smart Match Queue**: If a perfect swap isn't immediately available, our system doesn't show an empty screen. It automatically places the user in a persistent queue, notifying them the second a compatible partner joins the platform.
4. **Availability Overlap (10%)**: We analyze your 3-hour time slots to find the maximum intersection of free time.

By adding all these weights up, our AI ensures that a 'Perfect Swap' isn't just a wish—it's a mathematically guaranteed compatibility."

---

## 5. AI Strategy: Tier 1 vs. Tier 2 (2 Minutes)
**[Slide: AI Implementation / Strategy]**
"To keep the architecture clean, we use a two-tier AI strategy:
- **Tier 1 (External AI - Groq)**: This is our high-speed 'Intelligence Layer'. We use **Groq with the Llama 3.3 model** to generate unique exams and analyze feedback with sub-second latency.
- **Tier 2 (Our Internal AI - Swapping Engine)**: This is our proprietary 'Matchmaker' built in Java. It uses the **Weighted Sum Model** to calculate compatibility. It includes a **Learning Loop** that tracks your interactions. If you keep completing sessions with a specific type of teacher, our AI 'learns' your preference and updates your future recommendations."

---

## 6. Real-Time Collaboration (1 Minute)
**[Slide: Sessions / Teaching Room]**
"When a match happens, the learning starts. We’ve integrated:
- **Real-time Messaging** via WebSockets.
- **Session Agendas** to keep learning structured.
- **Presence Tracking** to see when your partner is online for a session."

---

## 7. Conclusion & Future Scope (1 Minute)
**[Slide: Conclusion / Q&A]**
"In conclusion, SkillSwap isn't just a matching app; it’s a verified learning network. By combining **Spring Boot's robustness** with **Our Own Swapping AI**, we’ve created a platform that is secure, scalable, and most importantly, trustworthy.

I am now open to any questions. Thank you!"

---

## 💡 Pro-Tips for Q&A:
- **The 'Math' Question:** "We use a Weighted Sum Model. We normalize all raw data (like scores and time slots) into a 0-1 scale and apply a priority matrix to find the best partner."
- **The 'Own AI' Question:** "The LLM only handles the text. The actual decision-making—the logic of WHO matches with WHOM—is our own custom-coded algorithm."
- **The 'Training' Question:** "We don't train the LLM, but our 'Swapping AI' has a 'Learn' loop where it stores your interaction history to personalize your matches."
