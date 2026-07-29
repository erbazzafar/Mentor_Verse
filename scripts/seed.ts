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
      username: "adminErbaz",
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
      username: "sarahCodes",
      email: "sarah.mentor@mentorverse.dev",
      password: hashedPassword,
      role: "mentor",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 250,
    },
    {
      username: "aliBackend",
      email: "ali.mentor@mentorverse.dev",
      password: hashedPassword,
      role: "mentor",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 180,
    },
    {
      username: "mariaDevops",
      email: "maria.mentor@mentorverse.dev",
      password: hashedPassword,
      role: "mentor",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 320,
    },
    {
      username: "johnPython",
      email: "john.mentor@mentorverse.dev",
      password: hashedPassword,
      role: "mentor",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 210,
    },
    {
      username: "leilaData",
      email: "leila.mentor@mentorverse.dev",
      password: hashedPassword,
      role: "mentor",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 290,
    },
    {
      username: "omarMobile",
      email: "omar.mentor@mentorverse.dev",
      password: hashedPassword,
      role: "mentor",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 150,
    },
  ]);

  const studentUsers = await User.create([
    {
      username: "hamzaDev",
      email: "hamza.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 10,
    },
    {
      username: "ayeshaLearns",
      email: "ayesha.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 25,
    },
    {
      username: "usmanJs",
      email: "usman.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: false,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 5,
    },
    {
      username: "fatimaPy",
      email: "fatima.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 40,
    },
    {
      username: "bilalReact",
      email: "bilal.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 15,
    },
    {
      username: "zainAi",
      email: "zain.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 30,
    },
    {
      username: "noorFrontend",
      email: "noor.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 20,
    },
    {
      username: "talhaCloud",
      email: "talha.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: false,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 8,
    },
    {
      username: "sanaDesign",
      email: "sana.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 18,
    },
    {
      username: "haiderQa",
      email: "haider.student@mentorverse.dev",
      password: hashedPassword,
      role: "student",
      isVerified: true,
      verifyEmailCode,
      verifyEmailCodeExpiry,
      reputation: 12,
    },
  ]);

  console.log(`Created ${1 + mentorUsers.length + studentUsers.length} users`);

  // --- Admin profile ---
  await AdminModel.create({
    user_id: adminUser._id,
    role: "superadmin",
  });

  // --- Student profiles ---
  const educationLevels = [
    "Undergraduate",
    "Graduate",
    "Bootcamp",
    "Undergraduate",
    "High School",
    "Graduate",
    "Undergraduate",
    "Bootcamp",
    "Undergraduate",
    "Graduate",
  ];
  const interestSets = [
    ["Web Development", "React"],
    ["Machine Learning", "Python"],
    ["JavaScript", "Frontend"],
    ["Data Science", "Python"],
    ["React", "UI/UX"],
    ["Machine Learning", "AI Ethics"],
    ["Frontend", "UI/UX"],
    ["Cloud", "DevOps"],
    ["UI/UX", "Design Systems"],
    ["QA", "Automation Testing"],
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
      reviews: [
        { user_id: studentUsers[0]._id, review_text: "Really helpful session, explained concepts clearly!", rating: 5 },
        { user_id: studentUsers[4]._id, review_text: "Good mentor, would recommend.", rating: 4 },
      ],
    },
    {
      expertise: ["Node.js", "MongoDB", "System Design"],
      availability: "Weekends 10am-2pm",
      base_rate: 55,
      bio: "Backend engineer specializing in scalable APIs and databases.",
      reviews: [
        { user_id: studentUsers[1]._id, review_text: "Deep knowledge of system design, very patient.", rating: 5 },
        { user_id: studentUsers[2]._id, review_text: "Helped me restructure my whole API.", rating: 4 },
      ],
    },
    {
      expertise: ["Docker", "Kubernetes", "CI/CD"],
      availability: "Weekdays 8am-11am",
      base_rate: 60,
      bio: "DevOps engineer helping developers level up their deployment skills.",
      reviews: [
        { user_id: studentUsers[3]._id, review_text: "Finally understand Kubernetes thanks to Maria.", rating: 5 },
        { user_id: studentUsers[7]._id, review_text: "Great walkthrough of our CI/CD pipeline issues.", rating: 5 },
      ],
    },
    {
      expertise: ["Python", "Django", "Machine Learning"],
      availability: "Weekdays 5pm-8pm",
      base_rate: 45,
      bio: "ML engineer who loves teaching Python fundamentals and applied ML.",
      reviews: [
        { user_id: studentUsers[5]._id, review_text: "John made scikit-learn feel approachable.", rating: 5 },
        { user_id: studentUsers[8]._id, review_text: "Clear explanations, good pacing.", rating: 4 },
      ],
    },
    {
      expertise: ["Data Science", "SQL", "Pandas"],
      availability: "Weekends 1pm-5pm",
      base_rate: 50,
      bio: "Data scientist focused on query optimization and data pipelines.",
      reviews: [
        { user_id: studentUsers[6]._id, review_text: "My queries are 10x faster now, thank you!", rating: 5 },
        { user_id: studentUsers[9]._id, review_text: "Great insight into indexing strategies.", rating: 4 },
      ],
    },
    {
      expertise: ["React Native", "Flutter", "Mobile Development"],
      availability: "Weekdays 7pm-10pm",
      base_rate: 35,
      bio: "Mobile developer helping students ship their first cross-platform app.",
      reviews: [
        { user_id: studentUsers[7]._id, review_text: "Solved my auth headache in one session.", rating: 4 },
        { user_id: studentUsers[9]._id, review_text: "Very approachable and practical advice.", rating: 3 },
      ],
    },
  ];
  const mentorDocs = await MentorModel.create(
    mentorUsers.map((u, i) => ({
      user_id: u._id,
      ...mentorData[i],
      rating:
        mentorData[i].reviews.reduce((sum, r) => sum + r.rating, 0) / mentorData[i].reviews.length,
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
    {
      title: "How do I get started with machine learning models in Python?",
      content: "I know basic Python but have never trained a model. Where should I start?",
      authorId: studentUsers[5]._id,
      tags: ["python", "machine-learning"],
    },
    {
      title: "What's the best way to handle authentication in a React Native app?",
      content: "Building a mobile app and need secure login with token storage. Any recommended libraries?",
      authorId: studentUsers[6]._id,
      tags: ["react-native", "mobile", "auth"],
    },
    {
      title: "How do I optimize SQL queries for large datasets?",
      content: "My reporting queries are taking minutes to run against a few million rows. What should I check first?",
      authorId: studentUsers[9]._id,
      tags: ["sql", "database", "performance"],
    },
    {
      title: "What are the best practices for CI/CD pipelines with GitHub Actions?",
      content: "Setting up my first pipeline and want to avoid common mistakes for a Node.js project.",
      authorId: studentUsers[7]._id,
      tags: ["cicd", "devops", "github-actions"],
    },
    {
      title: "How can I improve UI/UX for a mentorship platform?",
      content: "Users say booking a session feels clunky. What are some quick UX wins?",
      authorId: studentUsers[8]._id,
      tags: ["ui-ux", "design"],
    },
    {
      title: "What's the difference between REST and GraphQL APIs?",
      content: "Starting a new project and trying to decide which API style fits better for a mobile + web client.",
      authorId: studentUsers[2]._id,
      tags: ["api", "graphql", "rest"],
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
    {
      content: "Start with scikit-learn for classical ML algorithms before jumping into deep learning frameworks like TensorFlow or PyTorch.",
      authorId: mentorUsers[3]._id,
      questionId: questionDocs[4]._id,
      isAccepted: true,
    },
    {
      content: "Also check out fast.ai's practical deep learning course, it's beginner friendly and project based.",
      authorId: studentUsers[5]._id,
      questionId: questionDocs[4]._id,
      isAccepted: false,
    },
    {
      content: "Use Firebase Auth or Auth0 for React Native, and store tokens securely with expo-secure-store or react-native-keychain.",
      authorId: mentorUsers[5]._id,
      questionId: questionDocs[5]._id,
      isAccepted: true,
    },
    {
      content: "Don't forget to handle token refresh and biometric unlock for a smoother mobile UX.",
      authorId: studentUsers[6]._id,
      questionId: questionDocs[5]._id,
      isAccepted: false,
    },
    {
      content: "Add proper indexes on your WHERE and JOIN columns, and use EXPLAIN ANALYZE to find slow query plans.",
      authorId: mentorUsers[4]._id,
      questionId: questionDocs[6]._id,
      isAccepted: true,
    },
    {
      content: "Also consider partitioning very large tables and archiving old rows you rarely query.",
      authorId: mentorUsers[1]._id,
      questionId: questionDocs[6]._id,
      isAccepted: false,
    },
    {
      content: "Cache dependencies, run jobs in parallel matrices, and keep secrets in encrypted GitHub Actions secrets, not the repo.",
      authorId: mentorUsers[2]._id,
      questionId: questionDocs[7]._id,
      isAccepted: true,
    },
    {
      content: "Add a status check that blocks merging until tests and lint both pass on the PR branch.",
      authorId: studentUsers[7]._id,
      questionId: questionDocs[7]._id,
      isAccepted: false,
    },
    {
      content: "Reduce booking to 3 clicks max, and show mentor availability inline instead of a separate calendar page.",
      authorId: studentUsers[8]._id,
      questionId: questionDocs[8]._id,
      isAccepted: true,
    },
    {
      content: "Adding real-time confirmation and a visible progress indicator during checkout would help a lot too.",
      authorId: mentorUsers[0]._id,
      questionId: questionDocs[8]._id,
      isAccepted: false,
    },
    {
      content: "REST is simpler and cacheable out of the box; GraphQL shines when clients need flexible, nested queries across many resources.",
      authorId: mentorUsers[1]._id,
      questionId: questionDocs[9]._id,
      isAccepted: true,
    },
    {
      content: "If your mobile client needs to minimize over-fetching on slow networks, GraphQL is worth the extra setup.",
      authorId: studentUsers[2]._id,
      questionId: questionDocs[9]._id,
      isAccepted: false,
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
    {
      content: "Which dataset did you use to practice with scikit-learn?",
      authorId: studentUsers[8]._id,
      type: "answer",
      typeId: answerDocs[5]._id,
    },
    {
      content: "react-native-keychain saved me from a security review flag, agreed.",
      authorId: studentUsers[9]._id,
      type: "answer",
      typeId: answerDocs[7]._id,
    },
    {
      content: "EXPLAIN ANALYZE should honestly be step one for every slow query ticket.",
      authorId: studentUsers[7]._id,
      type: "answer",
      typeId: answerDocs[9]._id,
    },
  ]);

  // --- Votes (question/answer ratings) ---
  await Vote.create([
    { type: "question", typeId: questionDocs[0]._id, votedById: studentUsers[1]._id, voteStatus: "upvoted" },
    { type: "question", typeId: questionDocs[0]._id, votedById: mentorUsers[0]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[0]._id, votedById: studentUsers[2]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[1]._id, votedById: studentUsers[3]._id, voteStatus: "downvoted" },
    { type: "question", typeId: questionDocs[4]._id, votedById: studentUsers[5]._id, voteStatus: "upvoted" },
    { type: "question", typeId: questionDocs[4]._id, votedById: mentorUsers[3]._id, voteStatus: "upvoted" },
    { type: "question", typeId: questionDocs[5]._id, votedById: studentUsers[6]._id, voteStatus: "upvoted" },
    { type: "question", typeId: questionDocs[6]._id, votedById: mentorUsers[4]._id, voteStatus: "upvoted" },
    { type: "question", typeId: questionDocs[7]._id, votedById: studentUsers[7]._id, voteStatus: "upvoted" },
    { type: "question", typeId: questionDocs[8]._id, votedById: studentUsers[8]._id, voteStatus: "upvoted" },
    { type: "question", typeId: questionDocs[9]._id, votedById: studentUsers[9]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[5]._id, votedById: studentUsers[0]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[6]._id, votedById: studentUsers[1]._id, voteStatus: "downvoted" },
    { type: "answer", typeId: answerDocs[7]._id, votedById: studentUsers[2]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[9]._id, votedById: mentorUsers[0]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[11]._id, votedById: studentUsers[3]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[13]._id, votedById: studentUsers[4]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[15]._id, votedById: studentUsers[5]._id, voteStatus: "upvoted" },
    { type: "answer", typeId: answerDocs[16]._id, votedById: mentorUsers[1]._id, voteStatus: "downvoted" },
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
    {
      mentorId: mentorUsers[3]._id,
      studentId: studentUsers[5]._id,
      date: new Date(now - 2 * 24 * 60 * 60 * 1000),
      time: "17:00",
      sessionLink: ["https://meet.mentorverse.dev/room/session-5"],
    },
    {
      mentorId: mentorUsers[4]._id,
      studentId: studentUsers[6]._id,
      date: new Date(now - 4 * 24 * 60 * 60 * 1000),
      time: "13:00",
      sessionLink: ["https://meet.mentorverse.dev/room/session-6"],
    },
    {
      mentorId: mentorUsers[5]._id,
      studentId: studentUsers[7]._id,
      date: new Date(now + 3 * 24 * 60 * 60 * 1000),
      time: "19:30",
      sessionLink: ["https://meet.mentorverse.dev/room/session-7"],
    },
    {
      mentorId: mentorUsers[3]._id,
      studentId: studentUsers[8]._id,
      date: new Date(now + 6 * 24 * 60 * 60 * 1000),
      time: "17:30",
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
    {
      studentId: studentUsers[5]._id,
      mentorId: mentorUsers[3]._id,
      amount: 45,
      status: "completed",
      transactionId: "txn_seed_0005",
    },
    {
      studentId: studentUsers[6]._id,
      mentorId: mentorUsers[4]._id,
      amount: 50,
      status: "completed",
      transactionId: "txn_seed_0006",
    },
    {
      studentId: studentUsers[7]._id,
      mentorId: mentorUsers[5]._id,
      amount: 35,
      status: "pending",
      transactionId: "txn_seed_0007",
    },
    {
      studentId: studentUsers[8]._id,
      mentorId: mentorUsers[3]._id,
      amount: 45,
      status: "completed",
      transactionId: "txn_seed_0008",
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
    {
      studentId: studentUsers[5]._id,
      mentorId: mentorUsers[3]._id,
      paymentId: paymentDocs[4]._id,
      agreedAmount: 45,
      isPaid: true,
    },
    {
      studentId: studentUsers[6]._id,
      mentorId: mentorUsers[4]._id,
      paymentId: paymentDocs[5]._id,
      agreedAmount: 50,
      isPaid: true,
    },
    {
      studentId: studentUsers[7]._id,
      mentorId: mentorUsers[5]._id,
      paymentId: paymentDocs[6]._id,
      agreedAmount: 35,
      isPaid: false,
    },
    {
      studentId: studentUsers[8]._id,
      mentorId: mentorUsers[3]._id,
      paymentId: paymentDocs[7]._id,
      agreedAmount: 45,
      isPaid: true,
    },
  ]);

  console.log("Created mentor-student matches");

  // --- Feedback (only for completed/past sessions, with ratings) ---
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
    {
      sessionId: sessionDocs[4]._id,
      studentId: studentUsers[5]._id,
      mentorId: mentorUsers[3]._id,
      rating: 5,
      comments: "John's ML walkthrough finally made scikit-learn click for me.",
    },
    {
      sessionId: sessionDocs[5]._id,
      studentId: studentUsers[6]._id,
      mentorId: mentorUsers[4]._id,
      rating: 4,
      comments: "Leila gave me a concrete checklist for optimizing our reporting queries.",
    },
  ]);

  console.log("Created feedback");

  // --- Notifications ---
  await Notification.create([
    {
      userId: studentUsers[0]._id,
      type: "answer",
      sourceId: answerDocs[0]._id,
      message: "sarahCodes answered your question about React state management.",
      isRead: true,
    },
    {
      userId: studentUsers[1]._id,
      type: "comment",
      sourceId: answerDocs[0]._id,
      message: "usmanJs commented on an answer you're following.",
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
      message: "You have a new message from mariaDevops about your upcoming session.",
      isRead: false,
    },
    {
      userId: studentUsers[5]._id,
      type: "answer",
      sourceId: answerDocs[5]._id,
      message: "johnPython answered your question about getting started with machine learning.",
      isRead: false,
    },
    {
      userId: studentUsers[6]._id,
      type: "answer",
      sourceId: answerDocs[9]._id,
      message: "leilaData answered your question about optimizing SQL queries.",
      isRead: true,
    },
    {
      userId: mentorUsers[5]._id,
      type: "vote",
      sourceId: questionDocs[5]._id,
      message: "Your answer received a new upvote.",
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
