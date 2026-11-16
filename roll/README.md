# 233 Squadron live Firebase demo (fictional records only)

The cadet and staff pages now use Firebase Web SDK / Cloud Firestore. The four fixed fictional demonstration identities are the only allowed records. The actual 87-person nominal roll remains private and must not be published here.

Setup:
1. Copy the Firebase Web API Key from Firebase Console > Project settings > General > Your apps > 233 Squadron Roll into the apiKey field in roll/config.js. This is a public client identifier, not a secret. Do NOT use service account credentials.
2. In Firebase Console > Firestore Database > Rules, paste the contents of roll/firestore-demo.rules and publish. These rules deny access to all other collections and allow public reads/updates only for four fixed fictional demo identities. Review existing rules before replacing them, because replacement affects other apps using this database.
3. Test on two devices: /roll/ sign-in and /roll/staff/ dashboard. Statuses update in real time.

IMPORTANT: The dashboard has no login and any visitor can change the four demo records. The rules are intentionally unsuitable for actual cadet data. For a live operational roll, approved server-side access control and privacy review are required. Never upload the private roster or real attendance data into publicDemoDays.

The separate Netlify absence website is unchanged. roll/schema.sql is legacy Supabase material and is not used.
