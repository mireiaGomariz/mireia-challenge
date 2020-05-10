import React, {useEffect, useState} from 'react';
import './categories.css'
import Timer from './timer'

function Categories() {
const [categories, setCategories] = useState([]);
const [questions, setQuestions] = useState([]);
const [score, setScore] = useState(0);
const [id, setId] = useState(1);
const [answer, setAnswer] = useState([])

useEffect(() => {
  fetch(`https://opentdb.com/api_category.php`)
        .then(res => res.json())
        .then(response => {
          console.log(response)
          console.log(questions)
          setCategories(response.trivia_categories)
        })
        .catch(error => console.log(error));
      },[]);

      const selectCategory = (e) => {

        fetch(`https://opentdb.com/api.php?amount=10&category=${e}`)
              .then(res => res.json())
              .then(response => {
                console.log(response.results)
                let formatedQuestions = formatQuestions(response.results)
                console.log(formatedQuestions)
                setQuestions(formatedQuestions)
              })
              .catch(error => console.log(error));
            };

      const formatQuestions = (questions) =>{
        let array_questions = []
        let hash = {}
        questions.map((q, index) => (
          array_questions.push(
            { question: q.question,
              answers: formatAnswers(q.correct_answer, q.incorrect_answers)
            }
          )
        ))
        return array_questions
      }

      const formatAnswers = (correct_answer, incorrect_answers) =>{
        let array_answers = []
        let answers = incorrect_answers
        answers.push(correct_answer)
        let shu_answers = Shuffle(answers)
        shu_answers.map((a, index) => (
          array_answers.push(
            { answer: a,
              correct: correctAnswersValidator(a, correct_answer)
            }
          )
        ))
        return array_answers
      }

      const correctAnswersValidator = (a, correct_answer) => {
        return correct_answer.includes(a)
      }

      const Shuffle=(a)=>{
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
        }
        return a;
      }

      const checkPoints = (correct) => {
        if (correct){
          setScore(score + 1)
        }else{
          setScore(score - 1)
        }
      }


  return(
    <div className="mainContainer">
    <h1 className="titleGame">Trivia Game!</h1>

    {questions.length  && id < 9 
      ?
      <div className="questionContainer">
      <p className="score">Score: {score}</p>
      <Timer/>

        <div onClick ={() => setId(id + 1)} >
        <p>{questions[id].question}</p>
          {questions[id].answers.map((a, index) => (
            <div key={index}>
              <button className="buttonAnswer" onClick={() => checkPoints(a.correct)}>{a.answer}</button>
            </div>
          ))}
        </div>
      </div>
      :
      <div >
          <div className="categories">
          {categories.map((cat, index) => (
          <option className="options"key={index} value={cat.id} onClick={(e) => selectCategory(e.target.value)}>{cat.name}</option>
        ))}
        </div>
      </div>

    }
    </div>
  )

}

export default Categories;
