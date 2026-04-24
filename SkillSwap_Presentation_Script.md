# SkillSwap: Presentation Script 🎙️

This script is designed for a **10-15 minute presentation**. Use the cues in brackets `[Slide: Name]` to know when to move your slides.

---

## 1. Introduction (1 Minute)
**[Slide: Title Page / Hero Image]**
"Good morning/afternoon everyone. Today, I am excited to present **SkillSwap**—a premium, AI-powered ecosystem designed for true **Peer-to-Peer** learning. 

In today’s world, we have plenty of content, but we lack **verified connection**. Most platforms are 'Top-Down', where you pay an expert. SkillSwap is 'Side-by-Side', where we swap skills. We’ve built a platform where **Trust is Code** and **Quality is Guaranteed** through AI-driven verification."

---

## 2. The Technical Engine (2 Minutes)
**[Slide: Tech Stack]**
"Our engine is built for high-performance and security:
- **Backend:** Spring Boot 3.x with a Modular Monolith architecture.
- **Security:** JWT Stateless Authentication with single-device session management.
- **Communication:** Real-time **Email Engine** using Spring Mail and SMTP relays for instant match notifications."

---

## 3. Verification: The AI Test Portal (2 Minutes)
**[Slide: Test Portal / Verification]**
"Before you can join the P2P network as a teacher, you must prove your skill. 
- We use **Groq with Llama 3.3** to generate dynamic, unique technical exams. 
- Once you pass, our system auto-verifies your profile, moving you from a 'Learner' to a 'Peer Teacher' instantly."

---

## 4. Our Own "P2P" Swapping AI (5 Minutes)
**[Slide: The Swapping AI / Priority Matrix]**
"Now, let's talk about our proprietary technology: **The Swapping AI.** 

Unlike LLMs which handle text, we built our own **Heuristic Matching Engine** in Java. We don't use simple keyword searches. We use a **Weighted Sum Model (WSM)** to find **Mutual Compatibility**.

### The P2P Priority Matrix:
We analyze 8 distinct data points to ensure a 'Perfect Swap':
1. **Verified Expertise (30%):** This is our anchor. You must pass the AI test to even enter the pool.
2. **Proficiency Gap (20%):** We prioritize peers at or above your level, ensuring the learning is impactful.
3. **Temporal Synergy (10%):** Our algorithm compares availability strings to find overlapping windows where both users are free to learn.
4. **Mutual Intent (10%):** We prioritize 'Perfect Swaps' where both users have exactly what the other needs.
5. **Resume Credibility (10%):** Our Resume AI extracts external certifications to give users a credibility boost.

By normalizing these 8 weights into a single score, our AI guarantees that the person you see on your board is your **perfect learning partner**, not just a random user."

---

## 5. The Peer Board & Email Engine (2 Minutes)
**[Slide: Dashboard / Teacher Board]**
"Once the AI finds matches, it populates our **Peer Discovery Board**. 
- Users can see their **Compatibility Score** with every potential partner.
- The board displays verified tags, bio-synergy, and availability.

**Instant Notifications:**
The moment a match is found, our **Email Engine** triggers:
- Both parties receive an automated email detailing the match.
- This ensures that users don't have to stay on the app to find a partner; the platform works for them in the background."

---

## 6. Conclusion & Future Scope (1 Minute)
**[Slide: Conclusion / Q&A]**
"SkillSwap isn't just an app; it’s a verified learning network. By combining **Llama 3.3 for Intelligence** with **Our Own P2P Matching Engine**, we’ve created a platform that is secure, scalable, and truly bidirectional.

I am now open to any questions. Thank you!"

---

## 💡 Pro-Tips for Q&A:
- **The 'Math' Question:** "We use a Normalized Weighted Sum Model. Each metric is converted to a 0-1 scale before being multiplied by its heuristic weight."
- **The 'Temporal' Question:** "We store availability as JSON strings and perform an intersection analysis to find overlapping time slots between the two users."
- **The 'Own AI' Question:** "The LLM handles the questions, but the **Matching Logic**—the 'Who matches with Whom'—is our own custom Java algorithm."
