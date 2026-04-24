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

## 4. Our Own "P2P" Swapping AI (4 Minutes)
**[Slide: The Swapping AI / Match Logic]**
"Now, let's talk about our proprietary technology: **The Swapping AI.** 

Unlike LLMs which handle text, we built our own **Heuristic Matching Engine** in Java. We don't use simple keyword searches. We use a **Weighted Sum Model (WSM)** to find **Mutual Compatibility**.

### How the P2P Logic Works:
1. **Bidirectional Search:** The AI looks for someone who has what you **Learn** AND wants what you **Teach**. It only ranks 'Mutual Matches'.
2. **The Peer Philosophy:** We eliminated the 'Expert Penalty'. Our AI treats anyone who passed the test as an equal peer, ensuring that learning flows freely across all skill levels.
3. **The Discovery Queue:** If a match isn't immediate, our AI places you in a 'Persistent Discovery' state, continuously scanning for new partners."

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
- **The 'Email' Question:** "We use Spring Boot Starter Mail with a dedicated SMTP relay to ensure deliverability. We send emails both when a match is found and as a 'Still Searching' confirmation to keep users engaged."
- **The 'Own AI' Question:** "The LLM generates questions, but the **Matching Logic**—the 'Who matches with Whom'—is our own custom Java algorithm using normalized heuristic weights."
- **The 'Teacher Board' Question:** "It's a dynamic React component that fetches real-time scores from our Spring Boot matching service, ranking peers based on their P2P compatibility."
