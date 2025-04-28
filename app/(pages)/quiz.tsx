import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Surface, Text, Button, RadioButton, IconButton, List, } from 'react-native-paper';
import { router } from 'expo-router';

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

interface QuizData {[key: string]: QuestionSet;
}




export default function QuizScreen() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizTitle, setQuizTitle] = useState<string>('');
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

      const data: QuizData = await response.json();     
       // Process quiz sets
      const sets: { id: number; title: string }[] = [];
      for (const setId in data) {
        const questionSet = data[setId];
        if (questionSet && typeof questionSet.title === 'string') {
          sets.push({ id: parseInt(setId), title: questionSet.title });
        }
      }
      setQuizSets(sets);

      const allQuestions: Question[] = [];
      for (const setId in data) {
        const questionSet = data[setId];
        
        if (questionSet && Array.isArray(questionSet.qlist)) {
          questionSet.qlist.forEach(question => {
            allQuestions.push({ ...question, setId: parseInt(setId) });
          });
        }
      }
      
     

      if (allQuestions.length === 0) {
        throw new Error('No valid questions found in the database');
      }
      

      // Validate questionSet
      const validQuestions = allQuestions.filter(question => {
        return question &&
               typeof question.question === 'string' &&
               Array.isArray(question.options) &&
               typeof question.answer === 'number' &&
               typeof question.setId === 'number';
              
      });

      if (validQuestions.length === 0) {
        throw new Error('No valid questions found after validation');
      }

      let filteredQuestions: Question[] = [];
      // Filter questions based on selected set ID or all if none is selected
       if (selectedSetId !== null) {        
        const selectedSet = sets.find(set => set.id === selectedSetId);
         if(selectedSet){
            setQuizTitle(selectedSet.title);
         }
         else{
           setQuizTitle('');
         }        
        filteredQuestions = validQuestions.filter(question => question.setId === selectedSetId);        
      }
      else{
        setQuizTitle('');
        filteredQuestions =[];
        }
     
      setQuestions(filteredQuestions);      
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      setError('Soru verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');      
    } finally {
      setIsLoading(false);
     
    }
  };
   const handleSetSelect = (setId: number) => {
    setSelectedSetId(setId);
    setQuizStarted(false);
    fetchQuizQuestions()
    
  };

  const handleStartQuiz = () => {
    if (questions.length > 0) {
      setQuizStarted(true);
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizCompleted(false);
    } else {
       setError('Lütfen bir test seçin.');
      
    }
  }

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNextQuestion = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = selectedAnswer === currentQuestion.answer;

    setIsCorrect(correctAnswer);
    setShowFeedback(true);

    if (correctAnswer) {
      setScore(score + 1);
    }

    await new Promise(resolve => setTimeout(resolve, 1000)); 
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
               
              {quizSets.map(set => (
              
                 <List.Item
                   key={set.id}
                  title={set.title}
                  onPress={() => handleSetSelect(set.id)}
                  style={{backgroundColor: selectedSetId === set.id ? '#53565A' : 'transparent',}}
                  titleStyle={{ color: '#FFFFFF' }}
                />
               
              ))}
             </>
             ) : (
                <Text style={styles.loadingText}>Testler yükleniyor...</Text>
             )}
           
        
          
          
        
        <Text variant="headlineMedium" style={styles.surfaceText}>{quizTitle}</Text>
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
            value={selectedAnswer?.toString() || ''}
          >
            {currentQuestion.options.map((option, index) => (
              
                 <List.Item
                  key={index}
                  title={option}
                  left={() => <RadioButton value={index.toString()} />}
                   
                   titleStyle={styles.optionText}
                 />
             ))}
          </RadioButton.Group>
          <Button

            disabled={showFeedback}
            mode="contained"

            onPress={handleNextQuestion}
            style={styles.button}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Testi Bitir' : 'Sonraki Soru'}
          </Button>

          {showFeedback && (
            <Text style={isCorrect ? styles.correctText : styles.incorrectText}>
              {isCorrect ? 'Doğru!' : 'Yanlış!'}
            </Text>)}
        </Surface>
      </>

    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={30}
          iconColor='#FFFFFF'
          onPress={() => router.push('/(tabs)/classroom')}
        />
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionCard:{
    backgroundColor: '#53565A',    
    padding: 16,
  },
  answerCard: {
    padding: 16,
  },
  surface: {
    
    padding: 16,
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
    flex:1,  
    
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

  correctText: {
    color: '#4CAF50',
    fontSize: 24,
    marginTop: 16
  },
  incorrectText: {
    color: '#F44336',    
    fontSize: 24,
  },
  picker: {
    color: '#FFFFFF',
    marginBottom: 16,
    width: '80%',
    
  },
  pickerItem: {
    color: '#FFFFFF',
  },
});
