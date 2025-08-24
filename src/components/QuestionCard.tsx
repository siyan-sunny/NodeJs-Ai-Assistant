import React from 'react';

interface QuestionCardProps {
  question: string;
  onClick: (question: string) => void;
}

export function QuestionCard({ question, onClick }: QuestionCardProps) {
  return (
    <button
      onClick={() => onClick(question)}
      className="w-full p-4 text-left bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 group"
    >
      <p className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors duration-200">
        {question}
      </p>
    </button>
  );
}