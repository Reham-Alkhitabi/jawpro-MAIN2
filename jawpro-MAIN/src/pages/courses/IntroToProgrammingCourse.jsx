import React, { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { useNavigate, Link } from "react-router-dom";
import { useWindowSize } from "@react-hook/window-size";
import ReactMarkdown from "react-markdown";

import {
  getUserProgress,
  setUserProgress,
  addReview,
  getReviews,
  reportReview,
  listenForAuthStateChange,
  deleteReview,
  toggleReviewLike,
  getReviewLikes,
  getAverageRating,
} from "../../utils/firebase.utils.js";
import "./introToProgramming.css";
import { getAuth } from "firebase/auth";

const courseCurriculum = [
  {
    title: "Week 1: Introduction to Python",
    content: `
Welcome to Week 1! 🎉

This week, we’ll introduce you to the world of Python programming. Python is a beginner-friendly, versatile language used for web development, data science, automation, and more.

🔧 Setting Up
- Download and install Python from [python.org](https://www.python.org/)
- Use an IDE like VS Code or an online editor like Replit or Jupyter Notebooks

📝 Writing Your First Code
Open a Python file and write:
    print("Hello, world!")

This command prints a message to the screen. Congrats on writing your first Python program! 🎉

📚 Topics Covered:
- Python syntax and indentation
- Printing output to the console
- Comments in code using 
- Basic arithmetic operations:
    print(3 + 4)     # 7
    print(10 / 2)    # 5.0

🧠 Why Python?
- Easy-to-read syntax
- Huge community and library support
- Great for beginners and pros alike

🧩 Mini Challenge:
Write a program that prints your name, favorite color, and age using three separate  statements.

✨ Tip: Practice every day, even if it’s just 10 minutes!`,  },
  {
    title: "Week 2: Variables and Data Types",
content: `
Welcome to Week 2 of your Python journey! Now that you've dipped your toes into the world of programming, it's time to start building the core foundation of your skills—understanding variables and data types.

🧠 What Are Variables?
Think of a variable as a box in your brain labeled with a name and filled with a piece of information. In programming, we use variables to store data that we want to reuse or manipulate.

In Python, creating a variable is simple:
    name = "Alice"
    age = 25
📦 Why Do Variables Matter?
Variables are essential because they let us:
- Store user input
- Perform calculations
- Build logic
- Reuse values in complex programs

🧊 Data Types in Python
Every variable has a data type—this tells Python what kind of data you're working with. Here are the most common ones:

    int     - 42              (Whole number)
    float   - 3.14            (Decimal number)
    str     - "Hello"         (Text)
    bool    - True / False    (Truth value)
    list    - [1, 2, 3]       (Collection of items)
    dict    - {"key": "value"}(Key-value pairs)

Example:
    price = 19.99       # float
    in_stock = True     # boolean
    product = "Book"    # string

🔁 Dynamic Typing
Python allows dynamic typing—you don’t need to declare variable types:
    x = 10       # int
    x = "Hello"  # now it's a string

🔍 Type Checking and Conversion
    print(type(x))           # to check type
    int("42") → 42           # to convert string to integer

🧩 Mini Challenge
What does this output?
    a = "5"
    b = 10
    print(a * b)

Answer: "5555555555" (the string "5" repeated 10 times)

🎯 Key Takeaways
- Variables store data
- Python supports multiple data types
- Dynamic typing means flexibility
- Convert between types when needed

✨ Tip: Practice by writing a program that asks for your name and age, and prints a greeting!
    `,  },
{
  title: "Week 3: Control Structures",
  content: `
Welcome to Week 3! 🎯

This week, you'll learn how to control the flow of your programs using conditional statements and loops.

🔀 Conditional Statements:
Use \`if\`, \`elif\`, and \`else\` to make decisions in your code.

Example:
\`\`\`python
age = 18
if age >= 18:
    print("You're an adult.")
else:
    print("You're a minor.")
\`\`\`

🔁 Loops:
- \`for\` loops repeat actions a specific number of times.
- \`while\` loops repeat while a condition is true.

Examples:
\`\`\`python
for i in range(5):
    print(i)  # Prints 0 to 4

count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

🧩 Mini Challenge:
Write a program that checks if a number is positive, negative, or zero.

✨ Tip: Break problems into small steps—write pseudocode first!
  `
}
,{
  title: "Week 4: Functions and Scope",
  content: `
Welcome to Week 4! 🧩

This week, you'll dive into **functions**, one of the most important building blocks in Python. Functions let you organize your code into reusable pieces.

🔧 What Is a Function?
A function is a block of code that only runs when it's called. You can pass data into a function, and it can return data as well.

🛠 Defining and Calling a Function
\`\`\`python
def greet():
    print("Hello there!")

greet()  # Call the function
\`\`\`

🗣️ Function Parameters and Arguments
Functions can take inputs called parameters:
\`\`\`python
def greet(name):
    print("Hello, " + name + "!")

greet("Alice")
greet("Bob")
\`\`\`

🔙 Returning Values
Functions can return a result using the \`return\` keyword:
\`\`\`python
def add(a, b):
    return a + b

result = add(5, 3)
print(result)  # 8
\`\`\`

🎯 Why Use Functions?
- Keep your code DRY (Don’t Repeat Yourself)
- Make your code easier to test and debug
- Organize logic into meaningful units

🌍 Variable Scope
Scope determines where a variable can be accessed.

- **Local variables** exist only inside a function.
- **Global variables** exist outside all functions.

Example:
\`\`\`python
x = "global"

def show_scope():
    x = "local"
    print(x)

show_scope()   # local
print(x)       # global
\`\`\`

🧩 Mini Challenge:
Write a function \`multiply_by_two(n)\` that takes a number and returns that number multiplied by 2.

✨ Tip: Use functions to break big problems into smaller pieces!
  `
}
,{
  title: "Week 5: Lists and Loops",
  content: `
Welcome to Week 5! 🌀

This week, you're going to learn how to work with **lists**, one of the most commonly used data structures in Python, and how to use loops to process them efficiently.

📚 What Is a List?
A list is a collection of items stored in a single variable. Lists can hold numbers, strings, or even other lists.

Example:
\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])  # apple
\`\`\`

📥 Common List Operations
\`\`\`python
fruits.append("orange")      # Add to end
fruits.remove("banana")      # Remove by value
print(len(fruits))           # List length
\`\`\`

🎢 Accessing List Items
Use **indexing** to access items:
\`\`\`python
colors = ["red", "green", "blue"]
print(colors[1])  # green
\`\`\`

📤 Looping Through a List
You can loop through each item in a list using a \`for\` loop:
\`\`\`python
for fruit in fruits:
    print(fruit)
\`\`\`

🔁 \`range()\` with Loops
\`range()\` is useful when you want to loop a specific number of times:
\`\`\`python
for i in range(5):
    print(i)
\`\`\`

🔄 Nested Loops
Loops inside loops can help when working with multi-dimensional lists:
\`\`\`python
matrix = [[1, 2], [3, 4]]
for row in matrix:
    for num in row:
        print(num)
\`\`\`

🧩 Mini Challenge:
Write a program that:
1. Creates a list of your five favorite movies.
2. Loops through the list and prints each movie with a message like:
\`"I love The Matrix!"\`

✨ Tip: Lists are perfect for storing data you want to loop through or modify. Try combining what you’ve learned with functions!
  `
}
,
{
  title: "Week 6: Dictionaries and Sets",
  content: `
Welcome to Week 6! 🗂️

This week, you'll explore **dictionaries** and **sets**, two powerful data structures in Python that help you store and manage data efficiently.

🔑 What Is a Dictionary?
A **dictionary** stores data in **key-value pairs**—like a real dictionary where a word (key) maps to a definition (value).

Example:
\`\`\`python
person = {
    "name": "Alice",
    "age": 30,
    "city": "New York"
}
print(person["name"])  # Alice
\`\`\`

🔁 Common Dictionary Operations
\`\`\`python
person["age"] = 31          # Update value
person["job"] = "Engineer"  # Add new key-value pair
del person["city"]          # Delete key-value pair

print(person.keys())        # dict_keys(['name', 'age', 'job'])
print(person.values())      # dict_values(['Alice', 31, 'Engineer'])
\`\`\`

📋 Looping Through a Dictionary
\`\`\`python
for key, value in person.items():
    print(key, "->", value)
\`\`\`

🧺 What Is a Set?
A **set** is an unordered collection of unique items.

Example:
\`\`\`python
numbers = {1, 2, 3, 3, 4}
print(numbers)  # {1, 2, 3, 4}
\`\`\`

💡 Why Use Sets?
- They **automatically remove duplicates**
- They're great for **checking membership**
- Useful for **set operations** like union and intersection

Set Example:
\`\`\`python
a = {1, 2, 3}
b = {3, 4, 5}
print(a | b)  # Union: {1, 2, 3, 4, 5}
print(a & b)  # Intersection: {3}
\`\`\`

🧩 Mini Challenge:
1. Create a dictionary to store your favorite book's title, author, and publication year.
2. Print each key and value in a readable format.
3. Then, create two sets of numbers and print their union and intersection.

✨ Tip: Dictionaries are great for structured data, while sets help manage uniqueness. Use the right tool for the job!
  `
}
,{
  title: "Week 7: File Input/Output",
  content: `
Welcome to Week 7! 📁

This week, you're going to learn how to **read from** and **write to** files using Python. This is super useful for saving data, processing logs, or even working with real-world data.

📄 Why File I/O?
Files let you:
- Store information long-term
- Load data for analysis or processing
- Read or write user-generated content

📥 Reading a File
Use \`open()\` with the mode \`"r"\` (read):
\`\`\`python
with open("example.txt", "r") as file:
    contents = file.read()
    print(contents)
\`\`\`
> ✅ The \`with\` statement automatically closes the file for you!

📤 Writing to a File
Use mode \`"w"\` (write) or \`"a"\` (append):
\`\`\`python
with open("example.txt", "w") as file:
    file.write("Hello, world!")
\`\`\`
> ⚠️ \`"w"\` will overwrite the file. Use \`"a"\` to add to the end of the file.

📖 Reading Line by Line
\`\`\`python
with open("example.txt", "r") as file:
    for line in file:
        print(line.strip())  # .strip() removes newlines
\`\`\`

🔄 Common File Modes
| Mode | Description           |
|------|-----------------------|
| "r"  | Read (default)        |
| "w"  | Write (overwrite)     |
| "a"  | Append (add to file)  |
| "x"  | Create new file       |
| "b"  | Binary mode (e.g. images) |

🧩 Mini Challenge:
1. Create a text file called \`favorites.txt\`
2. Write 3 of your favorite foods to it (one per line)
3. Then read the file and print each food with the message: \`"I love ___!"\`

✨ Tip: Always use the \`with\` statement when working with files—it keeps your code clean and safe!
  `
}
,{
  title: "Week 8: Error Handling (try/except)",
  content: `
Welcome to Week 8! 🚨

This week, you'll learn how to **handle errors gracefully** using Python’s \`try\` and \`except\` blocks. Mistakes happen in programming—your job is to make sure they don’t crash your whole program! 💪

🧨 What Are Errors?
Errors in Python come in two main types:
- **Syntax Errors** – mistakes in your code structure
- **Runtime Errors** – happen while the code is running (e.g., dividing by zero)

📦 Example Runtime Error:
\`\`\`python
x = 10 / 0  # ZeroDivisionError!
\`\`\`

🛡️ Handling Errors with try/except
Use \`try\` to wrap code that might break. Use \`except\` to handle what happens if it does.

\`\`\`python
try:
    x = int(input("Enter a number: "))
    print(10 / x)
except ZeroDivisionError:
    print("You can't divide by zero!")
except ValueError:
    print("That wasn't a number!")
\`\`\`

🎯 Multiple except Blocks
You can catch different types of errors separately to give more helpful feedback.

🌍 The finally Block
The \`finally\` block always runs—use it to clean up resources.

\`\`\`python
try:
    file = open("data.txt")
    # Read or process file here
except FileNotFoundError:
    print("File not found.")
finally:
    print("Finished trying to open the file.")
\`\`\`

🚧 Custom Error Example:
\`\`\`python
try:
    age = int(input("Your age: "))
    if age < 0:
        raise ValueError("Age can't be negative.")
except ValueError as e:
    print("Invalid input:", e)
\`\`\`

🧩 Mini Challenge:
Write a program that:
1. Asks the user to enter two numbers
2. Divides the first by the second
3. Catches both \`ZeroDivisionError\` and \`ValueError\` and prints friendly messages

✨ Tip: Don’t just hide errors—handle them smartly! Give users useful feedback and keep your code running smoothly.
  `
}

];

const IntroToProgrammingCourse = () => {
  const [completedWeeks, setCompletedWeeks] = useState(0);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [userId, setUserId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [reportingId, setReportingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNextWeekModal, setShowNextWeekModal] = useState(false);
  const auth = getAuth();
  const [width, height] = useWindowSize();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const courseName = "Intro to Programming";
  const validWeekIndex = Math.min(activeWeekIndex, courseCurriculum.length - 1);
  const [reviewRating, setReviewRating] = useState(0);
  const [likes, setLikes] = useState({});
  const [average, setAverage] = useState(null);

  useEffect(() => {
    const fetchAverage = async () => {
      const avg = await getAverageRating(courseName);
      setAverage(avg.toFixed(1));
    };

    fetchAverage();
  }, [courseName]);

  useEffect(() => {
    const unsubAuth = listenForAuthStateChange((user) => {
      setUserId(user);
    });

    const unsubReviews = getReviews(courseName, (data) => {
      setReviews(data);
      setLoadingReviews(false);
    });

    return () => {
      unsubAuth();
      unsubReviews();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const savedWeek = await getUserProgress(userId, courseName); // pass courseName
        setCurrentWeek(savedWeek);
        setProgress(savedWeek);
        setCompletedWeeks(savedWeek);
        setActiveWeekIndex(savedWeek);
      }
    };
    fetchData();
  }, [userId]);

  const handleVideoComplete = () => {
    if (
      completedWeeks === activeWeekIndex &&
      completedWeeks < courseCurriculum.length - 1
    ) {
      setShowNextWeekModal(true); 
    }

    // Show congratulatory message when the last week is completed
    if (activeWeekIndex === courseCurriculum.length - 1) {
      setShowCongratsModal(true); 
    }
  };

  const [lastReviewTime, setLastReviewTime] = useState(null);
  const toggleLike = async (reviewId, userId) => {
    if (!userId) return;

    setLikes((prevLikes) => {
      const current = prevLikes[reviewId] || {
        totalLikes: 0,
        likedByUser: false,
      };

      const updated = current.likedByUser
        ? {
            totalLikes: current.totalLikes - 1,
            likedByUser: false,
          }
        : {
            totalLikes: current.totalLikes + 1,
            likedByUser: true,
          };

      return {
        ...prevLikes,
        [reviewId]: updated,
      };
    });
    await toggleReviewLike(courseName, reviewId, userId);
  };
  useEffect(() => {
    const loadLikes = async () => {
      const likesData = {};
      for (const review of reviews) {
        const { totalLikes, likedByUser } = await getReviewLikes(
          courseName,
          review.id,
          auth.currentUser?.uid
        );
        likesData[review.id] = { totalLikes, likedByUser };
      }
      setLikes(likesData);
    };

    if (auth.currentUser && reviews.length > 0) {
      loadLikes();
    }
  }, [reviews, courseName]);

  const handleSubmitReview = async () => {
    if (!userId) return alert("You must be logged in to review.");
    if (reviewText.trim()) {
      const now = Date.now();
      if (lastReviewTime && now - lastReviewTime < 60000) {
        return setSuccessMessage(
          "Please wait a minute before submitting again."
        );
      }
      try {
        await addReview(courseName, userId, reviewText, reviewRating);
        setSuccessMessage("Review submitted successfully!");
        setReviewText("");
        setLastReviewTime(now);
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

  const handleReport = async (id) => {
    setReportingId(id);
  };

  const progressPercent = Math.floor(
    ((completedWeeks + 1) / courseCurriculum.length) * 100
  );

  return (
    <div className="intro-course-container">
      <h1 className="intro-course-title">Intro to Programming</h1>

      <div className="intro-course-progress-bar">
        <div
          className="intro-course-progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        >
          {progressPercent}%
        </div>
      </div>

      <div className="intro-course-layout">
        <div className="intro-course-left-display">
          {/* Congratulatory Modal */}
          {showCongratsModal && (
            <div className="intro-course-congrats-modal-overlay">
              <div className="intro-course-congrats-modal">
                {/* 🎉 Confetti */}
                <ReactConfetti width={width} height={height} />
                <h2>Congratulations!</h2>
                <p>You have completed the course! 🎉</p>
                <button className="intro-course-congrats-close-btn">
                  <Link to="/course-test/intro-to-programming">
                    Take Intro to Programming Test
                  </Link>
                </button>
                <h3 className="intro-course-congrats-h3">or</h3>
                <button
                  className="intro-course-congrats-close-btn"
                  onClick={() => setShowCongratsModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {showNextWeekModal && (
            <div className="intro-course-modal-overlay">
              <div className="intro-course-modal">
                <h2>Ready to Continue?</h2>
                <p>
                  Do you want to move on to the next week or stop for today?
                </p>
                <div className="intro-course-modal-buttons">
                  <button
                    className="intro-course-continue-button"
                    onClick={async () => {
                      const newWeek = currentWeek + 1;
                      setCompletedWeeks(newWeek);
                      setActiveWeekIndex(newWeek);
                      setCurrentWeek(newWeek);
                      setProgress(newWeek);
                      if (userId) {
                        await setUserProgress(
                          userId,
                          courseName,
                          newWeek,
                          courseCurriculum.length
                        );
                      }
                      setShowNextWeekModal(false);
                    }}
                  >
                    Continue to Next Week
                  </button>
                  <button
                    className="intro-course-cancel-button"
                    onClick={() => setShowNextWeekModal(false)}
                  >
                    Stop for Today
                  </button>
                </div>
              </div>
            </div>
          )}

          <h2>{courseCurriculum[validWeekIndex]?.title || "Loading..."}</h2>

{courseCurriculum[validWeekIndex]?.content ? (
  <div className="intro-course-text-content bordered-highlight">
    <p>
      <strong className="highlighted-strong">
        Week {validWeekIndex + 1}:
      </strong>
    </p>

    <pre style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
      {courseCurriculum[validWeekIndex].content}
    </pre>

    {!completedWeeks?.completed && (
      <button
        className="intro-course-mark-complete-btn"
        onClick={handleVideoComplete}
      >
        ✅ Mark as Complete
      </button>
    )}
  </div>
) : (
  <div className="intro-course-no-content">
    <p>🚫 Content not available for this week.</p>
  </div>
)}



          <button className="intro-course-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>

        <div className="intro-course-right-sidebar">
          <h3>Course Stages</h3>
          <ul className="intro-course-week-list">
            {courseCurriculum.map((week, index) => (
              <li
                key={index}
                title={
                  index <= completedWeeks
                    ? "Click to view"
                    : "Complete previous weeks to unlock"
                }
                className={`week-item ${
                  index <= completedWeeks ? "unlocked" : "locked"
                } ${index === activeWeekIndex ? "active" : ""}`}
                onClick={() =>
                  index <= completedWeeks && setActiveWeekIndex(index)
                }
              >
                {index <= completedWeeks ? "✅" : "🔒"} {week.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="intro-course-review-section">
        <h3 className="course-Average-Rating">
          Average Rating: {average ? `⭐ ${average} / 5` : "No ratings yet"}
        </h3>

        <h3>Write a Review:</h3>

        <div className="intro-course-star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={reviewRating >= star ? "active" : ""}
              onClick={() => setReviewRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder={
            userId ? "Write your review..." : "Login to leave a review"
          }
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="intro-course-review-input"
          rows={3}
          disabled={!userId}
        />
        <button
          onClick={handleSubmitReview}
          className="intro-course-submit-review-btn"
          disabled={!userId || !reviewText.trim()}
        >
          Submit
        </button>
        {successMessage && (
          <p className="intro-course-success-msg">{successMessage}</p>
        )}

        <div className="intro-course-user-reviews">
          <h4>User Reviews:</h4>
          {loadingReviews ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="intro-course-no-reviews">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="intro-course-review-item">
                <div className="review-username-container">
                  <strong>
                    {review.username || "Anonymous"}
                    {review.rating && (
                      <span
                        className="star-rating-display"
                        style={{ marginLeft: "8px" }}
                      >
                        {Array.from({ length: 5 }, (_, i) => (
                          <span
                            key={i}
                            style={{
                              color: i < review.rating ? "#FFD700" : "#ccc",
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </span>
                    )}
                    :
                  </strong>
                  <button onClick={() => toggleLike(review.id, userId)}>
                    {likes[review.id]?.likedByUser ? "❤️" : "🤍"}{" "}
                    {likes[review.id]?.totalLikes || 0}
                  </button>
                </div>
                <p>{review.text}</p>
                {review.uid === userId && (
                  <button
                    className="intro-course-delete-btn"
                    onClick={() => {
                      setDeletingId(review.id); 
                      setShowDeleteModal(true); 
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
                <button
                  onClick={() => handleReport(review.id)}
                  className="intro-course-report-btn"
                >
                  Report
                </button>
              </div>
            ))
          )}
          {reportingId && (
            <div className="intro-course-report-modal">
              <div className="intro-course-modal-content">
                <p>Are you sure you want to report this review?</p>
                <button
                  onClick={async () => {
                    await reportReview(courseName, reportingId);
                    setReportingId(null);
                  }}
                >
                  Yes, Report
                </button>
                <button onClick={() => setReportingId(null)}>Cancel</button>
              </div>
            </div>
          )}
          {showDeleteModal && deletingId && (
            <div className="intro-course-report-modal">
              <div className="intro-course-modal-content">
                <p>Are you sure you want to delete this review?</p>
                <button
                  onClick={async () => {
                    await deleteReview(courseName, deletingId); 
                    setShowDeleteModal(false);
                    setDeletingId(null);
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingId(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IntroToProgrammingCourse;
