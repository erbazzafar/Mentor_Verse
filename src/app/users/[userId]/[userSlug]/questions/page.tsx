"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import QuestionCard from "@/components/QuestionCard";
import Pagination from "@/components/Pagination";

export default function UserQuestions() {
  const { userId } = useParams();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<any[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 25;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/questions/user/${userId}`, {
          params: { page, limit },
        });
        setQuestions(response.data.data);
        setTotalQuestions(response.data.total);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [userId, page]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6"> Questions Asked</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          // Skeleton Loader while fetching data
          [...Array(8)].map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"
            ></div>
          ))
        ) : (
          <>
            {questions.length > 0 ? (
              questions.map((ques: any) => (
                <QuestionCard key={ques._id} ques={ques} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No questions found.
              </p>
            )}
          </>
        )}
      </div>
      <div className="mt-10">
        <Pagination total={totalQuestions} limit={25} />
      </div>
    </div>
  );
}
