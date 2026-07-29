import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConfig";
import Answer from "@/models/answer.model";
import Question from "@/models/question.model";
import Notification from "@/models/notification.model";
import Vote from "@/models/vote.model";

function createErrorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { questionId, content, authorId } = await request.json();

    // Validate request
    if (!questionId || !content || !authorId) {
      return createErrorResponse("Question ID, content, and authorId is required", 400);
    }

    // Create the answer
    const answer = await Answer.create({ questionId, content, authorId });

    // Get the question to notify the author
    const question = await Question.findById(questionId).populate("authorId");

    if (question) {
      await Notification.create({
        userId: question.authorId._id, // Notify the question author
        type: "answer",
        sourceId: answer._id,
        message: "Your question received a new answer!",
        isRead: false,
      });
    }

    return NextResponse.json({ success: true, data: answer });
  } catch (error) {
    console.error("Error creating answer:", error);
    return NextResponse.json(
      { success: false, message: "Error creating answer" },
      { status: 500 }
    );
  }
}

// Delete an answer
export async function DELETE(request: Request) {
  await dbConnect();

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return createErrorResponse("Answer ID is required", 400);
    }

    const deletedAnswer = await Answer.findByIdAndDelete(id);

    if (!deletedAnswer) {
      return createErrorResponse("Answer not found", 404);
    }

    return NextResponse.json({ success: true, message: "Answer deleted" });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return createErrorResponse("Error deleting answer", 500);
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!questionId) {
      return NextResponse.json(
        { success: false, message: "Question ID is required" },
        { status: 400 }
      );
    }

    const answers = await Answer.find({ questionId })
      .limit(limit)
      .sort({ isAiGenerated: -1, createdAt: -1 })
      .populate("authorId", "username profileImg reputation") // Fetch username and reputation from User model
      .lean();

      const answersStats = await Promise.all(
        answers.map(async (answer) => {
          const [totalUpvotes, totalDownvotes] = await Promise.all([
            Vote.countDocuments({ type: "answer", typeId: answer._id, voteStatus: "upvoted" }), // Count upvotes
            Vote.countDocuments({ type: "answer", typeId: answer._id, voteStatus: "downvoted" }), // Count downvotes
          ]);

          return {
            ...answer,
            totalUpvotes,
            totalDownvotes, // Calculate total votes
          };
        })
      );
    return NextResponse.json({ success: true, data: answersStats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching answers:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching answers" },
      { status: 500 }
    );
  }
}
