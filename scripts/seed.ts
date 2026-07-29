import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConfig";

import User from "@/models/user.model";
import { AdminModel } from "@/models/admin.model";
import { StudentModel } from "@/models/student.model";
import { MentorModel } from "@/models/mentor.model";
import SessionModel from "@/models/session.model";
import Payment from "@/models/payment.model";
import Question from "@/models/question.model";
import Answer from "@/models/answer.model";
import Comment from "@/models/comment.model";
import MentorStudentMatch from "@/models/connection.model";
import Feedback from "@/models/feedback.model";
import Notification from "@/models/notification.model";
import Vote from "@/models/vote.model";

const PASSWORD = "Password123!";

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    AdminModel.deleteMany({}),
    StudentModel.deleteMany({}),
    MentorModel.deleteMany({}),
    SessionModel.deleteMany({}),
    Payment.deleteMany({}),
    Question.deleteMany({}),
    Answer.deleteMany({}),
    Comment.deleteMany({}),
    MentorStudentMatch.deleteMany({}),
    Feedback.deleteMany({}),
    Notification.deleteMany({}),
    Vote.deleteMany({}),
  ]);
  console.log("Cleared existing collections");
}

async function seed() {
  await dbConnect();
  await clearCollections();

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);
  const verifyEmailCode = "123456";
  const verifyEmailCodeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // --- Users ---
  const [adminUser] = await User.create([
    {
      username: "admin_erbaz",
      email: "admin@mentorverse.dev",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 100,
      profileImg: "",
    },
  ]);

  const mentorUsers = await User.create([
    {
      username: "sarah_codes",
      email: "sarah.mentor@mentorverse.dev",
      password: hashedPassword,
      role: "mentor",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 250,
    },
    {
      username: "ali_backend",
      email: "ali.mentor@mentorverse.dev",
      password: hashedPassword,
      role: "mentor",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 180,
    },
    {
      username: "maria_devops",
      email: "maria.mentor@mentorverse.dev",
      password: hashedPassword,
      role: "mentor",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 320,
    },
  ]);

  const studentUsers = await User.create([
    {
      username: "hamza_dev",
      email: "hamza.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 10,
    },
    {
      username: "ayesha_learns",
      email: "ayesha.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 25,
    },
    {
      username: "usman_js",
      email: "usman.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: false,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 5,
    },
    {
      username: "fatima_py",
      email: "fatima.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 40,
    },
    {
      username: "bilal_react",
      email: "bilal.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 15,
    },
  ]);

  console.log(`Created ${1 + mentorUsers.length + studentUsers.length} users`);

  // --- Admin profile ---
  await AdminModel.create({
    user_id: adminUser._id,
    role: "superadmin",
  });

  // --- Student profiles ---
  const educationLevels = ["Undergraduate", "Graduate", "Bootcamp", "Undergraduate", "High School"];
  const interestSets = [
    ["Web Development", "React"],
    ["Machine Learning", "Python"],
    ["JavaScript", "Frontend"],
    ["Data Science", "Python"],
    ["React", "UI/UX"],
  ];
  await StudentModel.create(
    studentUsers.map((u, i) => ({
      user_id: u._id,
      education_level: educationLevels[i],
      interests: interestSets[i],
    }))
  );

  // --- Mentor profiles ---
  const mentorData = [
    {
      expertise: ["JavaScript", "React", "Node.js"],
      availability: "Weekdays 6pm-9pm",
      base_rate: 40,
      bio: "Full-stack developer with 8 years of experience mentoring junior devs.",
    },
    {
      expertise: ["Node.js", "MongoDB", "System Design"],
      availability: "Weekends 10am-2pm",
      base_rate: 55,
      bio: "Backend engineer specializing in scalable APIs and databases.",
    },
    {
      expertise: ["Docker", "Kubernetes", "CI/CD"],
      availability: "Weekdays 8am-11am",
      base_rate: 60,
      bio: "DevOps engineer helping developers level up their deployment skills.",
    },
  ];
  const mentorDocs = await MentorModel.create(
    mentorUsers.map((u, i) => ({
      user_id: u._id,
      ...mentorData[i],
      rating: 4.5,
      reviews: [
        {
          user_id: studentUsers[i % studentUsers.length]._id,
          review_text: "Really helpful session, explained concepts clearly!",
          rating: 5,
        },
        {
          user_id: studentUsers[(i + 1) % studentUsers.length]._id,
          review_text: "Good mentor, would recommend.",
          rating: 4,
        },
      ],
    }))
  );

  console.log("Created admin/student/mentor profiles");

  // --- Questions ---
  const questionDocs = await Question.create([
    {
      title: "How do I manage state in a large React app?",
      content: "I'm building a dashboard and prop drilling is getting out of hand. What are good patterns for global state?",
      authorId: studentUsers[0]._id,
      tags: ["react", "state-management"],
    },
    {
      title: "Best way to structure a Node.js REST API?",
      content: "Looking for advice on folder structure and separating business logic from routes.",
      authorId: studentUsers[1]._id,
      tags: ["nodejs", "api", "backend"],
    },
    {
      title: "What's the difference between SQL and NoSQL for a mentorship app?",
      content: "Trying to decide between MongoDB and Postgres for a project with users, sessions, and payments.",
      authorId: studentUsers[2]._id,
      tags: ["database", "mongodb", "sql"],
    },
    {
      title: "How to containerize a Next.js app with Docker?",
      content: "I have a working Next.js app locally but I'm stuck writing a production Dockerfile.",
      authorId: studentUsers[3]._id,
      tags: ["docker", "nextjs", "devops"],
    },
  ]);

  console.log(`Created ${questionDocs.length} questions`);

  // --- Answers ---
  const answerDocs = await Answer.create([
    {
      content: "Consider using React Context for simple cases, or Zustand/Redux for larger apps with complex state.",
      authorId: mentorUsers[0]._id,
      questionId: questionDocs[0]._id,
      isAccepted: true,
    },
    {
      content: "I'd also recommend colocating state close to where it's used before reaching for a global store.",
      authorId: studentUsers[4]._id,
      questionId: questionDocs[0]._id,
      isAccepted: false,
    },
    {
      content: "Separate your app into routes/, controllers/, services/, and models/ layers for clean separation of concerns.",
      authorId: mentorUsers[1]._id,
      questionId: questionDocs[1]._id,
      isAccepted: true,
    },
    {
      content: "MongoDB works well for flexible, evolving schemas; Postgres is better if you need strong relational guarantees like payments.",
      authorId: mentorUsers[1]._id,
      questionId: questionDocs[2]._id,
      isAccepted: true,
    },
    {
      content: "Use a multi-stage Dockerfile: build the app in one stage, then copy only the .next output into a slim runner image.",
      authorId: mentorUsers[2]._id,
      questionId: questionDocs[3]._id,
      isAccepted: true,
    },
  ]);

  console.log(`Created ${answerDocs.length} answers`);

  // --- Comments ---
  await Comment.create([
    {
      content: "Great question, I had the same issue last month.",
      authorId: studentUsers[1]._id,
      type: "question",
      typeId: questionDocs[0]._id,
    },
    {
      content: "Zustand was a game changer for me too.",
      authorId: studentUsers[2]._id,
      type: "answer",
      typeId: answerDocs[0]._id,
    },
    {
      content: "Could you share a sample folder structure?",
      authorId: studentUsers[0]._id,
      type: "answer",
      typeId: answerDocs[2]._id,
    },
  ]);

  // --- Votes ---
  await Vote.create([
    { type: "question", typeId: questionDocs[0]._id, votedById: studentUsers[1]._id, voteStatus: "upvoted" },
    { type: "question", typeId: questionDocs[0]._id, votedById: mentorUsers[0]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[0]._id, votedById: studentUsers[2]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[1]._id, votedById: studentUsers[3]._id, voteStatus: "downvoted" },
  ]);

  console.log("Created comments and votes");

  // --- Sessions ---
  const now = Date.now();
  const sessionDocs = await SessionModel.create([
    {
      mentorId: mentorUsers[0]._id,
      studentId: studentUsers[0]._id,
      date: new Date(now - 3 * 24 * 60 * 60 * 1000),
      time: "18:00",
      sessionLink: ["https://meet.mentorverse.dev/room/session-1"],
    },
    {
      mentorId: mentorUsers[1]._id,
      studentId: studentUsers[1]._id,
      date: new Date(now - 1 * 24 * 60 * 60 * 1000),
      time: "10:00",
      sessionLink: ["https://meet.mentorverse.dev/room/session-2"],
    },
    {
      mentorId: mentorUsers[2]._id,
      studentId: studentUsers[3]._id,
      date: new Date(now + 2 * 24 * 60 * 60 * 1000),
      time: "08:30",
      sessionLink: ["https://meet.mentorverse.dev/room/session-3"],
    },
    {
      mentorId: mentorUsers[0]._id,
      studentId: studentUsers[4]._id,
      date: new Date(now + 5 * 24 * 60 * 60 * 1000),
      time: "19:00",
      sessionLink: [],
    },
  ]);

  console.log(`Created ${sessionDocs.length} sessions`);

  // --- Payments ---
  const paymentDocs = await Payment.create([
    {
      studentId: studentUsers[0]._id,
      mentorId: mentorUsers[0]._id,
      amount: 40,
      status: "completed",
      transactionId: "txn_seed_0001",
    },
    {
      studentId: studentUsers[1]._id,
      mentorId: mentorUsers[1]._id,
      amount: 55,
      status: "completed",
      transactionId: "txn_seed_0002",
    },
    {
      studentId: studentUsers[3]._id,
      mentorId: mentorUsers[2]._id,
      amount: 60,
      status: "pending",
      transactionId: "txn_seed_0003",
    },
    {
      studentId: studentUsers[4]._id,
      mentorId: mentorUsers[0]._id,
      amount: 40,
      status: "failed",
      transactionId: "txn_seed_0004",
    },
  ]);

  console.log(`Created ${paymentDocs.length} payments`);

  // --- Mentor-Student Matches ---
  await MentorStudentMatch.create([
    {
      studentId: studentUsers[0]._id,
      mentorId: mentorUsers[0]._id,
      paymentId: paymentDocs[0]._id,
      agreedAmount: 40,
      isPaid: true,
    },
    {
      studentId: studentUsers[1]._id,
      mentorId: mentorUsers[1]._id,
      paymentId: paymentDocs[1]._id,
      agreedAmount: 55,
      isPaid: true,
    },
    {
      studentId: studentUsers[3]._id,
      mentorId: mentorUsers[2]._id,
      paymentId: paymentDocs[2]._id,
      agreedAmount: 60,
      isPaid: false,
    },
    {
      studentId: studentUsers[4]._id,
      mentorId: mentorUsers[0]._id,
      paymentId: paymentDocs[3]._id,
      agreedAmount: 40,
      isPaid: false,
    },
  ]);

  console.log("Created mentor-student matches");

  // --- Feedback (only for completed/past sessions) ---
  await Feedback.create([
    {
      sessionId: sessionDocs[0]._id,
      studentId: studentUsers[0]._id,
      mentorId: mentorUsers[0]._id,
      rating: 5,
      comments: "Sarah explained React state management so clearly. Highly recommend!",
    },
    {
      sessionId: sessionDocs[1]._id,
      studentId: studentUsers[1]._id,
      mentorId: mentorUsers[1]._id,
      rating: 4,
      comments: "Solid session on API structure, would book again.",
    },
  ]);

  console.log("Created feedback");

  // --- Notifications ---
  await Notification.create([
    {
      userId: studentUsers[0]._id,
      type: "answer",
      sourceId: answerDocs[0]._id,
      message: "sarah_codes answered your question about React state management.",
      isRead: true,
    },
    {
      userId: studentUsers[1]._id,
      type: "comment",
      sourceId: answerDocs[0]._id,
      message: "usman_js commented on an answer you're following.",
      isRead: false,
    },
    {
      userId: mentorUsers[0]._id,
      type: "vote",
      sourceId: questionDocs[0]._id,
      message: "Your question received a new upvote.",
      isRead: false,
    },
    {
      userId: studentUsers[3]._id,
      type: "message",
      message: "You have a new message from maria_devops about your upcoming session.",
      isRead: false,
    },
  ]);

  console.log("Created notifications");

  console.log("\nSeed complete!");
  console.log(`All seeded users share the password: ${PASSWORD}`);
}

seed()
  .then(() => mongoose.connection.close())
  .catch((err) => {
    console.error("Seeding failed:", err);
    return mongoose.connection.close();
  })
  .finally(() => process.exit());
