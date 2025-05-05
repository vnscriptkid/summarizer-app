# summarizer-app

Product Requirements Document (PRD)
YouTube Summariser App — MVP
Version: 1.0  Date: 30 April 2025

1. Problem & Opportunity
Pain point

Viewers must keep checking their Subscriptions feed or trust YouTube’s algorithm to know when favourite channels publish.

Long-form videos (podcasts, livestreams, deep-dives) are time-intensive; many people never finish them.

Insight

Roughly 20 % of any video contains 80 % of the actionable value (Pareto principle).

Professionals pay for tools that reclaim even minutes of daily attention.

Opportunity
Automatically detect new videos, then deliver concise, multi-format digests (text, audio, mind-map) by email so users stay informed without watching the entire video.

2. Objectives (MVP – Q3 2025)
Speed: Summary email reaches the user within 5 minutes of a video being published.

Ease: New users complete sign-in and add their first channel in ≤ 2 minutes.

Engagement: Email open rate ≥ 40 %; click-through to audio/mind-map ≥ 25 %.

Unit cost: Total processing cost per video ≤ US $0.10.

3. Scope
Included in MVP	Excluded (post-MVP)
Add channel by URL or channel ID	Web/mobile push, Slack, SMS notifications
Google OAuth sign-in + email delivery	Full dashboard/history UI
3 text summaries: TL;DR (≈ 200 words), Key Take-aways (bullets), Action Items	Multilingual summaries
90-second voice summary (MP3, TTS)	Team workspaces & sharing
Mind-map image (Mermaid → PNG)	Advanced analytics, A/B testing

4. Target Users
Busy professionals following educational / industry channels.

University students who need quick lecture recaps.

Content curators & newsletter authors who regularly distil video content.

5. Key Features & User Flow
5.1 On-boarding

Landing page → “Sign in with Google”.

Paste channel link → backend validates & stores subscription.

Success banner: “We’ll email you the next time this channel uploads.”

5.2 Background Pipeline

Poll YouTube Data API (or Pub/Sub webhook) every 2 minutes per channel.

Detect new videoId; enqueue ProcessVideo job.

Retrieve captions (preferred) or run Speech-to-Text (Whisper).

Pass transcript to LLM with prompt template → return TL;DR, take-aways, action items (JSON).

Feed condensed script to TTS (Amazon Polly / ElevenLabs) → MP3.

Convert take-aways to Mermaid syntax → render PNG (server-side).

Store MP3 & PNG in S3; save metadata in videos table.

Trigger email worker → compile MJML template and send via SendGrid.

5.3 Email Skeleton

pgsql
Copy
Edit
Subject: 🔔  {ChannelName} — {VideoTitle}  (3-minute digest)

Hi {FirstName},

TL;DR  
{≈200-word paragraph}

Key Take-aways  
• …  
• …

Action Items  
1. …  
2. …

▶️  Listen to 90-second audio  |  🗺  View mind-map

Saved you some time — enjoy!
6. Non-Functional Requirements
Latency: < 5 min publish → email.

Scalability: 10 000 subscribed channels, 100 new videos per day peak.

Reliability: ≥ 99 % jobs succeed on first attempt; retries with exponential back-off.

Security & Privacy: Least-privilege OAuth scopes; SOC 2 ready; transcripts auto-deleted after 30 days (GDPR).

Accessibility: Audio summary for visually impaired users.

7. High-Level Architecture
pgsql
Copy
Edit
User → FastAPI (Auth & REST) → PostgreSQL
                         ↓
               YouTube Poller Worker
                         ↓
            ┌── Speech-to-Text (if needed)
            ├── LLM Summariser
            ├── TTS Service
            └── Mermaid Renderer
                         ↓
                     S3 Bucket
                         ↓
                 Email Worker → SendGrid → User
All asynchronous workloads run in separate containerised workers on a queue (e.g. RabbitMQ or AWS SQS).

8. Core Data Schema (simplified)
bash
Copy
Edit
users      (id, email, oauth_refresh_token, created_at)
channels   (id, yt_channel_id, user_id, last_published_at)
videos     (id, video_id, channel_id, title,
            summary_json, mp3_url, mindmap_url, sent_at)
9. Success Metrics
Activation: ≥ 70 % of new accounts add at least one channel within 24 h.

Engagement: Target open ≥ 40 %, click ≥ 25 %.

Retention: Day-7 return rate ≥ 40 %.

Unit economics: Processing cost ≤ 50 % of ARPU.

10. Monetisation Strategy
Tier	Price	Limits & Perks
Free	US $0	Up to 3 channels, text summaries only, 7-day asset hosting
Pro	US $5/mo	10 channels, audio + mind-map, 30-day hosting
Power	US $15/mo	50 channels, Slack/Webhook push, REST API access
Add-ons	Pay-as-you-go credits	Ad-hoc “summarise this video” requests
B2B API	Usage-based (≈ US $0.03/min processed)	White-label integration for newsletters / LMS

11. Roadmap (8-week MVP)
Week 1–2 — Project scaffolding, OAuth flow, database schema

Week 3 — YouTube poller + plain-text email POC

Week 4 — ASR + LLM summarisation pipeline

Week 5 — TTS generation & mind-map rendering

Week 6 — Subscription billing (Stripe) + quota enforcement

Week 7 — Closed beta (≈ 50 users), load testing, bug-fixes

Week 8 — Public launch (Product Hunt, IndieHackers)

12. Acceptance Criteria
A test video published on a subscribed channel triggers an email to the QA inbox within 5 min, containing TL;DR text and a playable MP3.

Deleting a channel stops further notifications.

If captions are absent and Whisper’s word-error-rate > 10 %, job retries with higher-quality model.

Load test with 1 000 simultaneous jobs maintains < 10 min end-to-end latency.

13. Risks & Mitigations
Risk	Impact	Mitigation
YouTube API quota changes	Pipeline stalls	E-tag caching, incremental back-off, migrate to Pub/Sub if re-enabled
Rising LLM costs	Margin squeeze	Batch transcripts, use smaller fine-tuned models, cache summaries
Emails flagged as spam	Low open rate	Dedicated transactional domain, SPF/DKIM, gradual warm-up

14. Open Questions
Should podcasts/RSS feeds be supported alongside YouTube channels?

How will we handle copyright if full transcripts are requested by users?

Which non-English languages should receive priority in Phase 2?