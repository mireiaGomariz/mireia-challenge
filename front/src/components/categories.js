import React, {useEffect, useState} from 'react';
import './categories.css'
import Timer from './timer'
//import function timer from timer.js
import Shuffle from './shuffle'
//import shuffle function from shuffle.js

function Categories() {
  //state
const [categories, setCategories] = useState([]);
//set all questions in one category
const [questions, setQuestions] = useState([]);
//score of the player
const [score, setScore] = useState(0);
// id of the question, used to pass to the new question
const [id, setId] = useState(1);
// used to format API content to be more functional.
const [answer, setAnswer] = useState([])

useEffect(() => {
  //category Call to API
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
        // fetch all category selected questions

        fetch(`https://opentdb.com/api.php?amount=10&category=${e}`)
              .then(res => res.json())
              .then(response => {
                console.log(response.results)
                //reformat api info
                let formatedQuestions = formatQuestions(response.results)
                console.log(formatedQuestions)
                setQuestions(formatedQuestions)
                if (questions.question.includes("*")) {
                   questions = questions.question.replace(/[^a-zA-Z0-9]/g,'_');
                 }
              })
              .catch(error => console.log(error));
            };

      const formatQuestions = (questions) =>{
        //change the format of info recived from API add in an object all answers and divided in two propieties, questions and answers, inside answers we can se all answers, correct and incorrect.
        let array_questions = []
        //create object
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
        // add answers in array and shuffle all of them to print it in different order every time, also push in the array_answers correct answer and pass the value to the function for correct the answer gived for the player.
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
        // asign a true or false value to correct and incorrect answers and check if option gived for the user mach with correct anserw.
        return correct_answer.includes(a)
      }

      const checkPoints = (correct) => {
        //points sistem once the correction is done.
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
