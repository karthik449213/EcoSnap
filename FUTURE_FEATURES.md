# Features & Roadmap

This document lists current capabilities of the EcoSnap app and outlines planned enhancements.

## Current Features

- **User Authentication**: Secure login using Supabase, with demo credentials for evaluation.
- **Photo Capture**: Users take snaps using device camera (via Expo Camera) and save them.
- **Geo-tagging & Map Visualization**: Snaps include location data; the map displays markers for community activity.
- **Achievements & Streaks**: Gamification through badges, points, and streak tracking.
- **Snap History**: View past snaps, filter, and review details including date, location, and description.
- **Leaderboard**: Compare progress against other users (likely by points or snaps count).
- **State Synchronization**: Real-time updates using Supabase subscriptions or periodic fetches in `snapsStore`.
- **Responsive UI**: Components designed to work across mobile and web using Expo's unified codebase.

## Upcoming Features (Planned)

1. **Push Notifications**
   - Reminders for users to take daily snaps or to notify them of new achievements and leaderboard status.
2. **Social Sharing**
   - Allow users to share snaps or achievements to social platforms (Facebook, Twitter, Instagram) to encourage engagement.
3. **Offline Support**
   - Queue snaps taken offline and synchronize when connectivity resumes.
4. **Advanced Filtering & Search**
   - Filter snaps by category (recycling, planting, etc.), date range, or geographic area.
5. **Improved Map Analytics**
   - Heatmaps showing density of eco-actions, clustering of snaps, and user-specific funnels.
6. **Multimedia Support**
   - Add short videos or voice notes to snaps for richer storytelling.
7. **Backend Admin Dashboard**
   - Internal web panel for moderators to review snaps, manage users, and handle reports.
8. **Localization & Accessibility**
   - Support multiple languages and adhere to accessibility guidelines (screen readers, large text, high contrast).
9. **Reward System Integration**
   - Partner with sponsors to provide real-world rewards or discounts for users reaching milestones.
10. **User-Generated Challenges**
    - Allow users to create and join challenges (e.g., "30-day recycle streak") and invite friends.

## Logical Justification

- **Engagement**: Push notifications and social sharing will increase retention and viral growth.
- **Reliability**: Offline support ensures the app remains useful in remote areas.
- **Scalability**: A backend dashboard enables moderation as the community grows.
- **Inclusivity**: Localization and accessibility broaden the user base and comply with best practices.

Future enhancements should be prioritized based on user feedback, analytics, and resource availability.

---
Keep this roadmap synchronized with issue tracking and project management tools.