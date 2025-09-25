"use client";

import { useState } from "react";
import { 01 } from "@/lib/01";
import QuizPage from "@/components/quizpage";

const units = {
  "1~28": 01,
};

export default function HomePage() {
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);

  if (selectedUnit) {
    return (
      <QuizPage
        words={units[selectedUnit]}
        onBack={() => setSelectedUnit(null)}
      />
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">상용한자 2136 퀴즈</h1>
      <p className="mb-4 text-center text-gray-600">풀고 싶은 유닛을 선택하세요:</p>
      <div className="space-y-2">
        {Object.keys(units).map((unitName) => (
          <button
            key={unitName}
            onClick={() => setSelectedUnit(unitName)}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {unitName}
          </button>
        ))}
      </div>
    </div>
  );
}
