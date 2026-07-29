"use client";

import React, { useState } from "react";
import axios from "axios";
import RTE from "./RTE";
import Answer from "./AnswerCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast"; // ✅ Import toast hook

const Answers = ({
  initialAnswers,
  questionId,
  questionAuthorId,
}: {
  initialAnswers: any[];
  questionId: string;
  questionAuthorId: string;
}) => {
  const [answers, setAnswers] = useState(initialAnswers);
  const [newAnswer, setNewAnswer] = useState("");

  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast(); // ✅ Use toast hook

  // Handle submitting a new answer
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session) {
      toast({
        title: "Login Required",
        description: "You must be logged in to post an answer.",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (!newAnswer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Your answer cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post("/api/answer", {
        questionId,
        content: newAnswer,
        authorId: session?.user?._id,
      });

      const newAnswerData = {
        ...response.data.data,
        authorId: {
          _id: session.user._id,
          username: session.user.username,
          profileImg: session.user.profileImg,
        },
      };

      setNewAnswer("");

      // Keep AI-generated answers pinned above newly posted ones
      const firstNonAiIndex = answers.findIndex((a) => !a.isAiGenerated);
      const insertAt = firstNonAiIndex === -1 ? answers.length : firstNonAiIndex;
      setAnswers([
        ...answers.slice(0, insertAt),
        newAnswerData,
        ...answers.slice(insertAt),
      ]);

      toast({
        title: "Answer Posted",
        description: "Your answer was added successfully!",
      });
    } catch (error: any) {
      console.error("Error posting answer:", error);
      toast({
        title: "Error",
        description: "Failed to post the answer.",
        variant: "destructive",
      });
    }
  };

  // Handle deleting an answer
  const deleteAnswer = async (answerId: string) => {
    try {
      await axios.delete(`/api/answer?id=${answerId}`);
      setAnswers(answers.filter((answer) => answer._id !== answerId));

      toast({
        title: "Answer Deleted",
        description: "The answer was removed successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting answer:", error);
      toast({
        title: "Error",
        description: "Failed to delete the answer.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <h2 className="mb-4 text-xl">{answers.length} Answers</h2>
      {answers.map((answer) => (
        <Answer
          key={answer._id}
          answer={answer}
          onDelete={deleteAnswer}
          questionAuthorId={questionAuthorId} // Pass question author's ID for acceptance
        />
      ))}
      <hr className="my-4 border-white/40" />
      <form onSubmit={handleSubmit} className="space-y-2">
        <h2 className="mb-4 text-xl">Your Answer</h2>
        <RTE value={newAnswer} onChange={(value) => setNewAnswer(value || "")} />
        <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
          Post Your Answer
        </button>
      </form>
    </>
  );
};

export default Answers;
