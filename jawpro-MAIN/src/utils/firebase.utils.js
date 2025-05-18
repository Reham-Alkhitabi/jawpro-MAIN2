import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updatePassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  arrayUnion,
  arrayRemove,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,  orderBy,
  limit,
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB6XTTqTFpP4qUUAriprxby9a_QGBD9YC4",
  authDomain: "tech-book-db.firebaseapp.com",
  projectId: "tech-book-db",
  storageBucket: "tech-book-db.firebasestorage.app",
  messagingSenderId: "875593920201",
  appId: "1:875593920201:web:bc80c88420251d922fa718",
};

const firebaseApp = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const auth = getAuth();
export const db = getFirestore();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalData = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, "users", userAuth.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log("Error creating the user", error.message);
      throw new Error("Could not create user in Firestore");
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Firebase Error:", error.message);
    throw new Error(error.message);
  }
};

export const checkIfUsernameExists = async (username) => {
  const db = getFirestore();
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("displayName", "==", username));

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
};

/**
 * Get the current user's profile from Firestore
 */
export const getUserProfile = async () => {
  if (!auth.currentUser) return null;

  const userDocRef = doc(db, "users", auth.currentUser.uid);
  const userSnapshot = await getDoc(userDocRef);

  if (userSnapshot.exists()) {
    return { uid: auth.currentUser.uid, ...userSnapshot.data() };
  } else {
    return null;
  }
};

/**
 * Update the username (displayName) of the authenticated user
 */
export const updateUsername = async (newUsername) => {
  if (!auth.currentUser) return;

  // Update Firebase Authentication Profile
  await updateProfile(auth.currentUser, { displayName: newUsername });

  // Update Firestore Database
  const userDocRef = doc(db, "users", auth.currentUser.uid);
  await updateDoc(userDocRef, { displayName: newUsername });
};

/**
 * Update the user's password
 */
export const updateUserPassword = async (newPassword) => {
  if (!auth.currentUser) return;

  try {
    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    console.error("Error updating password:", error.message);
    throw new Error(error.message);
  }
};

/**
 * Add a course to the user's bookmarked list
 */
export const bookmarkCourse = async (course) => {
  if (!auth.currentUser) return;

  const userDocRef = doc(db, "users", auth.currentUser.uid);

  try {
    await updateDoc(userDocRef, {
      bookmarkedCourses: arrayUnion({
        ...course,
        type: course.type || "course", // default to "course" if missing
      }),
    });
  } catch (error) {
    console.error("Error bookmarking course:", error.message);
  }
};

/**
 * Remove a course from the user's bookmarked list
 */
export const removeBookmark = async (course) => {
  if (!auth.currentUser) return;

  const userDocRef = doc(db, "users", auth.currentUser.uid);

  try {
    await updateDoc(userDocRef, {
      bookmarkedCourses: arrayRemove(course),
    });
  } catch (error) {
    console.error("Error removing bookmark:", error.message);
  }
};

/**
 * Save or update a user's to-dos in a subcollection called 'todos'
 */
export const saveUserTodos = async (tasks) => {
  if (!auth.currentUser) return;

  const userTodosRef = collection(db, "users", auth.currentUser.uid, "todos");


  const existingTodos = await getDocs(userTodosRef);
  const deletePromises = existingTodos.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);


  const addPromises = tasks.map((task) => addDoc(userTodosRef, task));
  await Promise.all(addPromises);
};

/**
 * Retrieve todos from the user's subcollection
 */
export const getUserTodos = async () => {
  if (!auth.currentUser) return [];

  const userTodosRef = collection(db, "users", auth.currentUser.uid, "todos");
  const querySnapshot = await getDocs(userTodosRef);

  const todos = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return todos;
};

/**
 * Add a course to the user's purchasedCourses list
 */
export const markCourseAsPaid = async (courseId, courseTitle) => {
  if (!auth.currentUser || !courseId || !courseTitle) {
    console.error("Missing user, courseId, or courseTitle in markCourseAsPaid");
    return;
  }

  const userDocRef = doc(db, "users", auth.currentUser.uid);

  try {
    await updateDoc(userDocRef, {
      purchasedCourses: arrayUnion({
        courseId,
        courseTitle,
        type: "course",
      }),
    });
  } catch (error) {
    console.error("Error saving purchased course:", error.message);
    throw new Error("Failed to update purchase");
  }
};

export const isCoursePaid = async (courseId) => {
  if (!auth.currentUser || !courseId) return false;

  const userDocRef = doc(db, "users", auth.currentUser.uid);
  const userSnapshot = await getDoc(userDocRef);

  const purchased = userSnapshot.data()?.purchasedCourses || [];
  return purchased.some((course) => course.courseId === courseId);
};


export const setUserProgress = async (
  userId,
  courseName,
  progress,
  totalWeeks
) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  const courseProgress = {
    currentWeek: progress,
    totalWeeks: totalWeeks,
  };

  if (!userSnap.exists()) {
    await setDoc(userRef, { progress: { [courseName]: courseProgress } });
  } else {
    await updateDoc(userRef, {
     [`progress.${courseName}`]: courseProgress,});
     
  }
};

export const getAllUserProgress = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    const data = snapshot.data();
    const progress = data.progress || {};

    const progressWithPercent = {};

    Object.entries(progress).forEach(
      ([courseName, { currentWeek, totalWeeks }]) => {
        const percent = Math.round(((currentWeek + 1) / totalWeeks) * 100);
        progressWithPercent[courseName] = percent;
      }
    );

    return progressWithPercent;
  }
  return {};
};

export const getUserProgress = async (userId, courseName) => {
  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.progress?.[courseName]?.currentWeek || 0;
  }
  return 0;
};


export const listenForAuthStateChange = (setUserId) => {
  const auth = getAuth();
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUserId(user.uid);
    }
  });
};


const getUserName = async (userId) => {
  const db = getFirestore();
  const userDocRef = doc(db, "users", userId);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data().displayName || "Anonymous"; // Default to 'Anonymous' if no displayName is found
  }
  return "Anonymous"; // Default if user document doesn't exist
};

export const addReview = async (courseName, userId, reviewText, rating) => {
  if (!userId || !reviewText.trim()) return;

  try {
    const username = await getUserName(userId);

    const courseReviewsRef = collection(
      db,
      "reviews_courses",
      courseName,
      "reviews"
    );

    await addDoc(courseReviewsRef, {
      uid: userId,
      username,
      text: reviewText.trim(),
      rating: rating || 0,
      createdAt: new Date(),
      likes: [],
    });
  } catch (error) {
    console.error("Error adding review:", error);
  }
};

export const toggleReviewLike = async (courseName, reviewId, userId) => {
  const reviewRef = doc(db, "reviews_courses", courseName, "reviews", reviewId);
  const reviewSnap = await getDoc(reviewRef);

  if (!reviewSnap.exists()) {
    console.error("Review not found.");
    return;
  }

  const reviewData = reviewSnap.data();
  const alreadyLiked = reviewData.likes?.includes(userId);

  try {
    await updateDoc(reviewRef, {
      likes: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId),
    });
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};

export const getReviewLikes = async (courseName, reviewId, userId) => {
  const reviewRef = doc(db, "reviews_courses", courseName, "reviews", reviewId);
  const reviewSnap = await getDoc(reviewRef);

  if (!reviewSnap.exists()) return { totalLikes: 0, likedByUser: false };

  const data = reviewSnap.data();
  const likes = data.likes || [];

  return {
    totalLikes: likes.length,
    likedByUser: likes.includes(userId),
  };
};

export const getReviews = (courseName, setReviews) => {
  const courseReviewsRef = collection(
    db,
    "reviews_courses",
    courseName,
    "reviews"
  );

  return onSnapshot(courseReviewsRef, (snapshot) => {
    const filtered = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((review) => !review.reported);
    setReviews(filtered);
  });
};

//  Report a review
export const reportReview = async (courseName, reviewId) => {
  const reviewRef = doc(db, "reviews_courses", courseName, "reviews", reviewId);
  try {
    await updateDoc(reviewRef, { reported: true });
  } catch (error) {
    console.error("Failed to report review:", error);
  }
};

//  Delete a review if the user owns it
export const deleteReview = async (courseName, reviewId) => {
  const reviewRef = doc(db, "reviews_courses", courseName, "reviews", reviewId);
  const reviewSnap = await getDoc(reviewRef);

  if (!reviewSnap.exists()) return;

  const reviewData = reviewSnap.data();
  const currentUserId = auth.currentUser?.uid;

  if (reviewData.uid === currentUserId) {
    await deleteDoc(reviewRef);
  } else {
    console.warn("User is not authorized to delete this review.");
  }
};

export const getAverageRating = async (courseName) => {
  try {
    const courseReviewsRef = collection(
      db,
      "reviews_courses",
      courseName,
      "reviews"
    );

    const snapshot = await getDocs(courseReviewsRef);

    let totalRating = 0;
    let count = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.rating && !data.reported) {
        totalRating += data.rating;
        count++;
      }
    });

    const average = count > 0 ? totalRating / count : 0;
    return average;
  } catch (error) {
    console.error("Error calculating average rating:", error);
    return 0;
  }
};

const mapRiasecScores = (scores) => {
  const keys = ['R', 'I', 'A', 'S', 'E', 'C'];
  const mappedScores = {};

  keys.forEach((key, index) => {
    // Use scores[index] if scores is an array or scores[index.toString()] if object keys are strings
    mappedScores[key] = scores[index] ?? 0;
  });

  return mappedScores;
};

export const saveRiasecResultsToFirestore = async (user, scores) => {
  if (!user || !scores) return;

  const mappedScores = mapRiasecScores(scores);

  const userDocRef = doc(db, 'users', user.uid); 
  try {
    await setDoc(
      userDocRef,
      { riasecScores: mappedScores, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (error) {
    console.error("Error saving RIASEC scores:", error);
  }
};



export const saveRecommendationsToFirestore = async (user, scores, recommendations) => {
  if (!user || !scores || !recommendations) return;

  const mappedScores = mapRiasecScores(scores);

  try {
    const userRecCollection = collection(db, 'users', user.uid, 'recommendations');
    await addDoc(userRecCollection, {
      scores: mappedScores,
      recommendations,
      savedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving recommendations:", error);
  }
};


export const getLatestRecommendationsFromFirestore = async (uid) => {
  if (!uid) return null;

  const recsRef = collection(db, 'users', uid, 'recommendations');
  const q = query(recsRef, orderBy('savedAt', 'desc'), limit(1));

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data(); 
  }
  return null;
};