import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Question from "@/models/question.model";
import Answer from "@/models/answer.model";
import Vote from "@/models/vote.model";
import { NextApiRequest, NextApiResponse } from "next";
import { createAiAnswerForQuestion } from "@/utils/aiAnswerService";

// Helper function for error response
function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

// Create Question (POST)
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { title, content, authorId, tags, attachment } = await request.json();

    if (!title || !content || !authorId) {
      return createErrorResponse("Title, content, and authorId are required");
    }

    const newQuestion = await Question.create({
      title,
      content,
      authorId,
      tags,
      attachmentId: attachment || "",
    });
    console.log("newQuestion",newQuestion);

    await createAiAnswerForQuestion(newQuestion._id.toString(), title, content);

    return NextResponse.json({ success: true, message: "Question added successfully", data: newQuestion }, { status: 201 });
  } catch (error) {
    console.error("Error adding question:", error);
    return createErrorResponse("Error adding question", 500);
  }
}

// Update Question (PUT)
export async function PUT(request: NextRequest) {
  await dbConnect();

  try {
    const { id, title, content, tags, attachment } = await request.json();

    if (!id) {
      return createErrorResponse("Question ID is required");
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { title, content, tags, attachmentId: attachment || "" },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return createErrorResponse("Question not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    return createErrorResponse("Error updating question", 500);
  }
}

// Delete Question (DELETE)
export async function DELETE(request: NextRequest) {
  await dbConnect();

  try {
    const { id } = await request.json();

    if (!id) {
      return createErrorResponse("Question ID is required");
    }

    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return createErrorResponse("Question not found", 404);
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    return createErrorResponse("Error deleting question", 500);
  }
}



export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit") || 5);

    // Fetch questions with pagination and populate the author details
    const questions = await Question.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("authorId", "username reputation profileImg") // Fetch username and reputation from User model
      .lean();

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { success: true, data: [], message: "No questions found." },
        { status: 200 }
      );
    }

    // Fetch additional stats for each question in parallel
    const questionStats = await Promise.all(
      questions.map(async (ques) => {
        const [totalAnswers, totalUpvotes, totalDownvotes] = await Promise.all([
          Answer.countDocuments({ questionId: ques._id }), // Count answers
          Vote.countDocuments({ type: "question", typeId: ques._id, voteStatus: "upvoted" }), // Count upvotes
          Vote.countDocuments({ type: "question", typeId: ques._id, voteStatus: "downvoted" }), // Count downvotes
        ]);

        return {
          ...ques,
          totalAnswers,
          totalVotes: totalUpvotes - totalDownvotes, // Calculate total votes
        };
      })
    );
  


    return NextResponse.json({ success: true, data: questionStats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}