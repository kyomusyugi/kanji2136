"use client";

import { useState, useEffect, KeyboardEvent } from "react";

export type Word = {
  kanji: string;
  kun: string;
  on: string;
};

function shuffle(array: Word[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

type AnswerRecord = {
  word: Word;
  userKun: string;
  userOn: string;
  isCorrect: boolean;
};

export default function QuizPage({
  words,
  onBack,
}: {
  words: Word[];
  onBack: () => void;
}) {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userKun, setUserKun] = useState("");
  const [userOn, setUserOn] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    const shuffled = shuffle(words);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setUserKun("");
    setUserOn("");
    setShowFeedback(false);
    setIsCorrect(false);
    setAnswers([]);
    setShowResult(false);
  }, [words]);

  const currentWord = shuffledWords[currentIndex];

  const normalize = (text: string) =>
    text
      .trim()
      .replace(/\s+/g, "")
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = () => {
    if (!currentWord) return;

    const userKunAnswers = normalize(userKun);
    const correctKunAnswers = normalize(currentWord.kun);
    const kunMatch = userKunAnswers.some((ans) => correctKunAnswers.includes(ans));

    const userOnAnswers = normalize(userOn);
    const correctOnAnswers = normalize(currentWord.on);
    const onMatch = userOnAnswers.some((ans) => correctOnAnswers.includes(ans));

    const correct = kunMatch && onMatch;

    setIsCorrect(correct);
    setShowFeedback(true);

    setAnswers((prev) => [
      ...prev,
      {
        word: currentWord,
        userKun,
        userOn,
        isCorrect: correct,
      },
    ]);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    setUserKun("");
    setUserOn("");
    setShowFeedback(false);
    setIsCorrect(false);

    if (nextIndex < shuffledWords.length) {
      setCurrentIndex(nextIndex);
    } else {
      setShowResult(true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !isComposing) {
      e.preventDefault();

      if (!showFeedback) {
        handleSubmit();
      } else {
        handleNext();
      }
    }
  };

  if (shuffledWords.length === 0)
    return <div className="p-4">로딩 중...</div>;

  if (showResult) {
    const incorrectAnswers = answers.filter((a) => !a.isCorrect);
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">퀴즈 완료!</h1>
        <p className="text-lg mb-4">
          점수: {answers.filter((a) => a.isCorrect).length} / {answers.length}
        </p>

        {incorrectAnswers.length > 0 ? (
          <>
            <h2 className="text-xl font-semibold mb-2">틀린 문제 정리</h2>
            <ul className="space-y-3">
              {incorrectAnswers.map((item, idx) => (
                <li key={idx} className="bg-white p-4 rounded shadow">
                  <p>
                    <strong>문제 단어:</strong> {item.word.kanji}
                  </p>
                  <p>
                    <strong>정답 훈:</strong> {item.word.kun}
                  </p>
                  <p>
                    <strong>정답 음:</strong> {item.word.on}
                  </p>
                  <p>
                    <strong>당신의 답 (훈):</strong> {item.userKun}
                  </p>
                  <p>
                    <strong>당신의 답 (음):</strong> {item.userOn}
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-green-600 font-semibold">
            모든 문제를 정확히 맞혔어요! 🎉
          </p>
        )}

        <button
          onClick={onBack}
          className="mt-6 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          처음으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div
      className="p-4 max-w-md mx-auto"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="mb-4">
        <p className="text-sm text-gray-500">
          문제 {currentIndex + 1} / {shuffledWords.length}
        </p>
        <h2 className="text-xl font-bold">{currentWord.kanji}</h2>
      </div>

      <input
        type="text"
        placeholder="훈 입력"
        value={userKun}
        onChange={(e) => setUserKun(e.target.value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        className="w-full mb-2 p-2 border rounded"
        disabled={showFeedback}
      />
      <input
        type="text"
        placeholder="음 입력"
        value={userOn}
        onChange={(e) => setUserOn(e.target.value)}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        className="w-full mb-4 p-2 border rounded"
        disabled={showFeedback}
      />

      {!showFeedback ? (
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          제출
        </button>
      ) : (
        <div className="space-y-3">
          <p
            className={`text-center font-semibold ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect ? "정답입니다! 🎉" : "오답입니다."}
          </p>
          <div className="text-sm text-gray-700 bg-gray-100 p-3 rounded">
            <p>
              <strong>정답 훈:</strong> {currentWord.kun}
            </p>
            <p>
              <strong>정답 음:</strong> {currentWord.on}
            </p>
          </div>
          <button
            onClick={handleNext}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            autoFocus
          >
            다음 문제
          </button>
        </div>
      )}
    </div>
  );
}
