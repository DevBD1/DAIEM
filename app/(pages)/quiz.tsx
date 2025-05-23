import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import {
  Surface,
  Text,
  Button,
  RadioButton,
  IconButton,
  List,
} from "react-native-paper";
import { router } from "expo-router";
import { styles } from "../../components/styles";

interface Question {
  question: string;
  options: string[];
  answer: number;
  setId: number;
}

interface QuestionSet {
  title: string;
  qlist: Question[];
}

interface QuizData {
  [key: string]: QuestionSet;
}

export default function QuizScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null);
  const [quizSets, setQuizSets] = useState<{ id: number; title: string }[]>([]);
  const [userAnswers, setUserAnswers] = useState<
    {
      question: string;
      options: string[];
      correct: number;
      selected: number | null;
    }[]
  >([]);

  useEffect(() => {
    fetchQuizQuestions();
  }, []);

  const fetchQuizQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        "https://raw.githubusercontent.com/DenizAntalya/DAIEM_DB/main/quiz_questions.json"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: QuizData = await response.json();
      // Process quiz sets
      const sets: { id: number; title: string }[] = [];
      for (const setId in data) {
        const questionSet = data[setId];
        if (questionSet && typeof questionSet.title === "string") {
          sets.push({ id: parseInt(setId), title: questionSet.title });
        }
      }
      setQuizSets(sets);

      const allQuestions: Question[] = [];
      for (const setId in data) {
        const questionSet = data[setId];

        if (questionSet && Array.isArray(questionSet.qlist)) {
          questionSet.qlist.forEach((question) => {
            allQuestions.push({ ...question, setId: parseInt(setId) });
          });
        }
      }

      if (allQuestions.length === 0) {
        throw new Error("No valid questions found in the database");
      }

      // Validate questionSet
      const validQuestions = allQuestions.filter((question) => {
        return (
          question &&
          typeof question.question === "string" &&
          Array.isArray(question.options) &&
          typeof question.answer === "number" &&
          typeof question.setId === "number"
        );
      });

      if (validQuestions.length === 0) {
        throw new Error("No valid questions found after validation");
      }

      let filteredQuestions: Question[] = [];
      // Filter questions based on selected set ID or all if none is selected
      if (selectedSetId !== null) {
        const selectedSet = sets.find((set) => set.id === selectedSetId);
        if (selectedSet) {
          setQuizTitle(selectedSet.title);
        } else {
          setQuizTitle("");
        }
        filteredQuestions = validQuestions.filter(
          (question) => question.setId === selectedSetId
        );
      } else {
        setQuizTitle("");
        filteredQuestions = [];
      }

      setQuestions(filteredQuestions);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      setError(
        "Soru verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleSetSelect = (setId: number) => {
    setSelectedSetId(setId);
    setQuizStarted(false);
    fetchQuizQuestions();
  };

  const handleStartQuiz = () => {
    if (questions.length > 0) {
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizCompleted(false);
    } else {
      setError("Lütfen bir test seçin.");
    }
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = selectedAnswer === currentQuestion.answer;

    setIsCorrect(correctAnswer);
    setShowFeedback(true);

    setUserAnswers((prev) => [
      ...prev,
      {
        question: currentQuestion.question,
        options: currentQuestion.options,
        correct: currentQuestion.answer,
        selected: selectedAnswer,
      },
    ]);

    if (correctAnswer) {
      setScore(score + 1);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setShowFeedback(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const renderQuizContent = () => {
    if (isLoading) {
      return (
        <Surface style={styles.surface} elevation={4}>
          <ActivityIndicator size="large" color="#7289da" />
          <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
        </Surface>
      );
    }

    if (error) {
      return (
        <Surface style={styles.surface} elevation={4}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            mode="contained"
            onPress={fetchQuizQuestions}
            style={styles.button}
          >
            Tekrar Dene
          </Button>
        </Surface>
      );
    }

    if (!quizStarted) {
      return (
        <Surface style={styles.surface} elevation={4}>
          {quizSets.length > 0 ? (
            <>
              <Text variant="headlineMedium" style={styles.surfaceText}>
                Test Seç
              </Text>

              {quizSets.map((set) => (
                <List.Item
                  key={set.id}
                  title={set.title}
                  onPress={() => handleSetSelect(set.id)}
                  style={{
                    backgroundColor:
                      selectedSetId === set.id ? "#53565A" : "transparent",
                  }}
                  titleStyle={{ color: "#FFFFFF" }}
                />
              ))}
            </>
          ) : (
            <Text style={styles.loadingText}>Testler yükleniyor...</Text>
          )}

          <Text variant="headlineMedium" style={styles.surfaceText}>
            {quizTitle}
          </Text>
          <Text style={styles.description}>
            Bu test, genel ilk yardım prosedürleri hakkındaki bilginizi
            ölçecektir.
          </Text>
          <Button
            mode="contained"
            onPress={handleStartQuiz}
            style={styles.button}
          >
            Teste Başla
          </Button>
        </Surface>
      );
    }

    if (quizCompleted) {
      return (
        <ScrollView>
          <Surface style={styles.surface} elevation={4}>
            <Text variant="headlineMedium" style={styles.surfaceText}>
              Test Tamamlandı!
            </Text>
            <Text style={styles.description}>
              Toplam {questions.length} sorudan {score} doğru cevap verdiniz.
            </Text>
          </Surface>

          {userAnswers.map((item, index) => (
            <Surface
              key={index}
              style={[styles.surface, styles.answerCard]}
              elevation={3}
            >
              <Text style={styles.questionNumber}>
                Soru {index + 1}: {item.question}
              </Text>

              {item.options.map((option, i) => {
                const isSelected = i === item.selected;
                const isCorrect = i === item.correct;

                return (
                  <Text
                    key={i}
                    style={{
                      color: isCorrect
                        ? "green"
                        : isSelected
                        ? "red"
                        : "#FFFFFF",
                      fontWeight: isCorrect || isSelected ? "bold" : "normal",
                      marginBottom: 4,
                    }}
                  >
                    {i + 1}. {option}
                  </Text>
                );
              })}
            </Surface>
          ))}

          <Button
            mode="contained"
            onPress={handleStartQuiz}
            style={styles.button}
          >
            Tekrar Başla
          </Button>
        </ScrollView>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <>
        <Surface style={[styles.surface, styles.questionCard]} elevation={4}>
          <Text variant="titleLarge" style={styles.questionNumber}>
            Soru {currentQuestionIndex + 1}/{questions.length}
          </Text>
          <Text variant="headlineSmall" style={styles.questionText}>
            {currentQuestion.question}
          </Text>
        </Surface>
        <Surface style={[styles.surface, styles.answerCard]} elevation={4}>
          <RadioButton.Group
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            value={selectedAnswer?.toString() || ""}
          >
            {currentQuestion.options.map((option, index) => (
              <List.Item
                key={index}
                title={option}
                left={() => <RadioButton value={index.toString()} />}
                titleNumberOfLines={20}
                titleStyle={[styles.optionText]}
              />
            ))}
          </RadioButton.Group>
          <Button
            disabled={showFeedback}
            mode="contained"
            onPress={handleNextQuestion}
            style={styles.button}
          >
            {currentQuestionIndex === questions.length - 1
              ? "Testi Bitir"
              : "Sonraki Soru"}
          </Button>

          {showFeedback && (
            <Text style={isCorrect ? styles.correctText : styles.incorrectText}>
              {isCorrect ? "Doğru!" : "Yanlış!"}
            </Text>
          )}
        </Surface>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <IconButton
          icon="arrow-left"
          size={30}
          iconColor="#FFFFFF"
          onPress={() => router.push("/(tabs)/classroom")}
        />
      </View>
      <ScrollView>{renderQuizContent()}</ScrollView>
    </View>
  );
}
