import { useState } from 'react';
import questions from '../data/trivia.json';

export default function Trivia() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [selection, setSelection] = useState(null);
  const [finished, setFinished] = useState(false);
  const current = questions[answers.length];
  const score = answers.filter((answer, i) => answer === questions[i].correct).length;

  function next() {
    setAnswers([...answers, selection]);
    setSelection(null);
  }

  function restart() {
    setStarted(false); setAnswers([]); setSelection(null); setFinished(false);
  }

  return (
    <div className="ltd-quiz-wrapper">
      {!started ? <div className="ltd-start-screen"><button type="button" className="ltd-btn" onClick={() => setStarted(true)}>Comenzar trivia</button></div> :
        <div className="ltd-quiz-container">
          <div className="ltd-progress"><div className="ltd-progress-bar" style={{ width: `${answers.length / questions.length * 100}%` }} /></div>
          {current ? <>
            <h2 className="ltd-question">{current.question}</h2>
            <div className="ltd-answers">{current.answers.map((answer, i) => (
              <button type="button" key={answer} disabled={selection !== null}
                className={`ltd-answer ${selection !== null && i === current.correct ? 'ltd-correct' : ''} ${selection === i ? 'ltd-selected' : ''}`}
                onClick={() => setSelection(i)}>{answer}</button>
            ))}</div>
            {selection !== null && <><p role="status">{selection === current.correct ? '¡Correcto!' : `La respuesta correcta es: ${current.answers[current.correct]}`}</p><button className="ltd-btn" type="button" onClick={next}>Continuar</button></>}
          </> : <>
            <p className="ltd-result" role="status">RESPONDISTE {score}/{questions.length}</p>
            {!finished ? <form className="ltd-final-form" onSubmit={event => { event.preventDefault(); setFinished(true); }}>
              <div className="ltd-name-fields"><input aria-label="Nombre" placeholder="Nombre" autoComplete="given-name" required pattern=".*\S.*" maxLength={60} /><input aria-label="Apellido" placeholder="Apellido" autoComplete="family-name" required pattern=".*\S.*" maxLength={60} /></div>
              <button className="ltd-btn" type="submit">Enviar respuestas</button>
              <p className="local-note">Juego local: tus datos no se envían.</p>
            </form> : <p role="status">¡Gracias por participar!</p>}
            <button type="button" className="ltd-btn" onClick={restart}>Volver a jugar</button>
          </>}
        </div>}
    </div>
  );
}
