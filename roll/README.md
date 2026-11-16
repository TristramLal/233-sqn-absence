# 233 Squadron Wednesday Roll — open-interface demonstration

Cadet demo: /roll/
Staff demo: /roll/staff/

No login or access code is required for these demonstration pages. The sample roll contains **fictional people only**. Data is stored in the browser's localStorage, not Firebase, so changes do not sync across devices. Open both pages in the same browser profile to see changes.

Firebase project: sqn-attendance. Firestore was created by the project owner, but this demo deliberately does not connect to Firestore or deploy permissive database rules. Do not put the private 87-person nominal roll into the public repository or a publicly readable Firestore collection.

To deploy a real cross-device attendance system, obtain approval for handling cadet personal information and implement server-side access controls and safe public submission handling. A separate staff URL alone does not provide authorisation. GitHub Pages cannot keep server secrets.

The old roll/schema.sql is a legacy Supabase file and is not used by these pages. The separate Netlify absence notification website is unchanged.
