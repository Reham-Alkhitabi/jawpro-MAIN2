
🌠 JAWALAN – Academic & Career Discovery Platform

JAWALAN is a modern web-based educational platform designed to help high school students in Saudi Arabia discover suitable academic majors, track learning progress, simulate Qudurat-style tests, and explore career paths. It blends usability, real-time performance, and visual engagement to support students' personal development journeys.

---

🚀 Features

- 🔐 **User Authentication**
  - Register/Login using Email or Google
  - Firebase Authentication + Firestore user profiles

- 🎓 **Course and Specialization Discovery**
  - Browse and bookmark majors and courses
  - Real-time filtering and routing

- 📝 **Qudurat Mock Test Engine**
  - Timed practice exams
  - Auto-scoring with progress-based course suggestions

- ⭐ **Review and Rating System**
  - Post and like course reviews
  - Filter out reported content

- ✅ **To-Do Task Manager**
  - Track study tasks with due dates
  - Stored in Firestore subcollections

- 📊 **Progress Dashboard**
  - Monitor weekly course completion
  - Visual progress bars and dynamic UI

- 🧠 **AI-driven course recommendations**

---

## 🛠️ Tech Stack

| Layer            | Technology                                      |
|------------------|--------------------------------------------------|
| Frontend         | React.js, Vite, React Router                    |
| Backend          | Firebase Authentication, Firestore (NoSQL DB)  |
| UI Enhancements  | CSS3, Framer Motion, React Icons                |
| Realtime Support | Firestore onSnapshot listeners                  |

---

## ⚙️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/jawalan.git
   cd jawalan

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   * Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   * Enable **Authentication**, **Firestore**, and **Hosting**
   * Replace the Firebase config in `firebase.js` with your project settings

4. **Start Local Development**

   ```bash
   npm run dev
   ```

---

## 📁 Directory Structure

```
src/
├── components/
│   ├── about us/
│   ├── header/
│   ├── Contact us/
├── pages/
├── utils/
│   └── firebase.utils.js
│   ├── Auth/
│   ├── Dashboard/
│   └── Courses/
├── App.jsx
└── main.jsx
```

---

## 🧪 Testing & Validation

* ✅ All core features manually tested on:

  * Chrome, Edge, Safari
  * Windows, iPad, Android

* 🔍 Features tested include:

  * Authentication, Bookmarking, Reviews, Progress Tracking, To-Do Management

Refer to `docs/test-plan.md` for detailed validation steps.

---

## 🧭 Future Enhancements

* [ ] 💬 Review reply threads (nested commenting)
* [ ] 📧 Deadline reminders via email or push notifications
* [ ] 🌐 Arabic language support
* [ ] 📊 Admin dashboard for monitoring and moderation
* [ ] 💳 Secure payment system for paid content

---

## 👥 Authors

* Developed by: Reham Abdullah Al-khitabi (reham.alkhitabi@gmail.com) & Haifa Mohammed Alsulami
* University: umm al qura university
* Project: Graduation Project (Computer Science Department)

---


---

🪐 *"Guiding students to the right path—one constellation at a time."*

