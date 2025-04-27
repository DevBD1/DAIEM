import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Surface, Text, IconButton, Button, RadioButton } from 'react-native-paper';
import { router } from 'expo-router';

interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface QuizData {
  [key: string]: Question[];
}

export default function QuizScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizQuestions();
  }, []);

  const fetchQuizQuestions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('https://raw.githubusercontent.com/DenizAntalya/DAIEM_DB/main/quiz_questions.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      
      // Clean the JSON by adding missing commas
      const cleanedText = text.replace(/"question":\s*"([^"]*)"\s*"options"/g, '"question": "$1", "options"');
      
      let data: QuizData;
      
      try {
        // Try to parse the cleaned JSON
        data = JSON.parse(cleanedText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Cleaned text:', cleanedText);
        throw new Error('Invalid JSON format in response');
      }

      // Validate the data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
      }

      // Flatten all questions from different categories into one array
      const allQuestions = Object.values(data).flat();
      
      if (!Array.isArray(allQuestions) || allQuestions.length === 0) {
        throw new Error('No valid questions found in the database');
      }

      // Validate each question
      const validQuestions = allQuestions.filter(question => 
        question && 
        typeof question === 'object' &&
        typeof question.question === 'string' &&
        Array.isArray(question.options) &&
        typeof question.answer === 'number'
      );

      if (validQuestions.length === 0) {
        throw new Error('No valid questions found after validation');
      }

      setQuestions(validQuestions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      setError('Soru verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }

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
          <Text variant="headlineMedium" style={styles.surfaceText}>
            İlk Yardım Bilgi Testi
          </Text>
          <Text style={styles.description}>
            Bu test, genel ilk yardım prosedürleri hakkındaki bilginizi ölçecektir.
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
        <Surface style={styles.surface} elevation={4}>
          <Text variant="headlineMedium" style={styles.surfaceText}>
            Test Tamamlandı!
          </Text>
          <Text style={styles.description}>
            Toplam {questions.length} sorudan {score} doğru cevap verdiniz.
          </Text>
          <Button
            mode="contained"
            onPress={handleStartQuiz}
            style={styles.button}
          >
            Tekrar Başla
          </Button>
        </Surface>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <Surface style={styles.surface} elevation={4}>
        <Text variant="titleLarge" style={styles.questionNumber}>
          Soru {currentQuestionIndex + 1}/{questions.length}
        </Text>
        <Text variant="headlineSmall" style={styles.questionText}>
          {currentQuestion.question}
        </Text>
        <RadioButton.Group
          onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          value={selectedAnswer?.toString() || ''}
        >
          {currentQuestion.options.map((option, index) => (
            <View key={index} style={styles.optionContainer}>
              <RadioButton value={index.toString()} />
              <Text style={styles.optionText}>{option}</Text>
            </View>
          ))}
        </RadioButton.Group>
        <Button
          mode="contained"
          onPress={handleNextQuestion}
          style={styles.button}
          disabled={selectedAnswer === null}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Testi Bitir' : 'Sonraki Soru'}
        </Button>
      </Surface>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderQuizContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#282b30',
  },
  surface: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#424549',
    borderWidth: 1,
    borderColor: '#8C8C8C',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surfaceText: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#7289da',
    marginTop: 16,
  },
  questionNumber: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  questionText: {
    color: '#FFFFFF',
    marginBottom: 24,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    color: '#FFFFFF',
    marginLeft: 8,
    flex: 1,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
  },
}); 