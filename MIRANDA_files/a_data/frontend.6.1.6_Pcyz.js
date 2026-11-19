document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ltd-quiz-wrapper').forEach(initTrivia);
});

function initTrivia(wrapper) {
  const configEl = wrapper.querySelector('.ltd-trivia-config');
  if (!configEl) return;

  let config;
  try {
    config = JSON.parse(configEl.textContent);
  } catch (e) {
    return;
  }

  const startScreen = wrapper.querySelector('.ltd-start-screen');
  const quiz = wrapper.querySelector('.ltd-quiz-container');
  const firstName = wrapper.querySelector('.ltd-first-name');
  const lastName = wrapper.querySelector('.ltd-last-name');
  const formError = wrapper.querySelector('.ltd-form-error');
  const startBtn = wrapper.querySelector('.ltd-start-btn');
  const submitBtn = wrapper.querySelector('.ltd-submit-btn');
  const finalForm = wrapper.querySelector('.ltd-final-form');
  const questionEl = wrapper.querySelector('.ltd-question');
  const answersEl = wrapper.querySelector('.ltd-answers');
  const resultEl = wrapper.querySelector('.ltd-result');
  const thanksEl = wrapper.querySelector('.ltd-thanks');
  const progressBar = wrapper.querySelector('.ltd-progress-bar');

  let current = 0;
  let score = 0;
  let selectedAnswers = [];
  let locked = false;
  let submitting = false;
  let nonceFailureCount = 0;
  const texts = Object.assign({
    start: 'COMENZAR TRIVIA',
    complete_data: 'COMPLETÁ TUS DATOS',
    first_name: 'NOMBRE',
    last_name: 'APELLIDO',
    submit: 'ENVIAR RESPUESTAS',
    sending: 'Enviando...',
    result_title: 'RESULTADO',
    result_score: 'RESPONDISTE {PUNTAJE}/{TOTAL}',
    required_names: 'COMPLETÁ NOMBRE Y APELLIDO',
    thanks: '¡GRACIAS POR PARTICIPAR!'
  }, config.texts || {});
  const submitButtonText = texts.submit;

  startBtn.addEventListener('click', () => {
    startScreen.classList.add('ltd-hidden');
    quiz.classList.remove('ltd-hidden');
    loadQuestion();
  });

  function updateProgress() {
    progressBar.style.width = ((current / config.questions.length) * 100) + '%';
  }

  function loadQuestion() {
    locked = false;
    answersEl.innerHTML = '';
    resultEl.classList.add('ltd-hidden');
    questionEl.textContent = config.questions[current].question;
    updateProgress();

    config.questions[current].answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ltd-answer';
      button.textContent = answer;
      button.addEventListener('click', () => selectAnswer(index, button));
      answersEl.appendChild(button);
    });
  }

  function selectAnswer(index, element) {
    if (locked) return;
    locked = true;

    const answerButtons = answersEl.querySelectorAll('.ltd-answer');
    answerButtons.forEach(btn => {
      btn.disabled = true;
      btn.classList.add('ltd-disabled');
    });

    selectedAnswers[current] = index;
    element.classList.add('ltd-selected');

    if (config.revealCorrect) {
      const correctIndex = config.questions[current].correct;
      if (Number.isInteger(correctIndex) && answerButtons[correctIndex]) {
        answerButtons[correctIndex].classList.add('ltd-correct');
      }
      if (index === correctIndex) score++;
    }

    setTimeout(() => {
      current++;
      current < config.questions.length ? loadQuestion() : finishTrivia();
    }, config.revealCorrect ? 900 : 450);
  }

  function finishTrivia() {
    progressBar.style.width = '100%';
    answersEl.innerHTML = '';
    resultEl.classList.add('ltd-hidden');

    if (config.saveResults === false) {
      submitAttempt(true);
      return;
    }

    questionEl.textContent = texts.complete_data;
    finalForm.classList.remove('ltd-hidden');
    firstName.focus();
  }

  submitBtn.addEventListener('click', () => submitAttempt(false));

  [firstName, lastName].forEach(input => {
    input.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitAttempt(false);
      }
    });
  });


  function nonceError() {
    const error = new Error('No pudimos validar el envío.');
    error.isNonceError = true;
    return error;
  }

  async function refreshNonce() {
    const fd = new FormData();
    fd.append('action', 'ltd_trivia_refresh_nonce');
    fd.append('code', config.code);
    let response;
    try {
      response = await fetch(config.ajaxUrl, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        body: fd
      });
    } catch (e) {
      throw nonceError();
    }
    let data;
    try { data = await response.json(); } catch (e) { throw nonceError(); }
    if (!response.ok || !data.success || !data.data || !data.data.nonce) throw nonceError();
    config.nonce = String(data.data.nonce);
  }

  async function submitWithFreshNonce(name, surname, allowRetry) {
    await refreshNonce();
    const send = async () => {
      const formData = new FormData();
      formData.append('action', 'ltd_trivia_submit');
      formData.append('nonce', config.nonce);
      formData.append('code', config.code);
      formData.append('first_name', name);
      formData.append('last_name', surname);
      formData.append('answers', JSON.stringify(selectedAnswers));
      const response = await fetch(config.ajaxUrl, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        body: formData
      });
      let data;
      try { data = await response.json(); } catch (e) { throw new Error('El servidor devolvió una respuesta inválida.'); }
      return {response,data};
    };

    let result = await send();
    if (allowRetry && result.response.status === 403 && !result.data.success) {
      await refreshNonce();
      result = await send();
    }
    if (result.response.status === 403 && !result.data.success) throw nonceError();
    if (!result.response.ok || !result.data.success) {
      throw new Error(result.data && result.data.data && result.data.data.message
        ? String(result.data.data.message)
        : 'No pudimos guardar la trivia. Intentá nuevamente.');
    }
    nonceFailureCount = 0;
    return result.data;
  }

  async function submitAttempt(anonymous = false) {
    if (submitting) return;

    const name = anonymous ? '' : firstName.value.trim();
    const surname = anonymous ? '' : lastName.value.trim();

    if (!anonymous && (!name || !surname)) {
      formError.textContent = texts.required_names;
      return;
    }

    formError.textContent = '';
    submitting = true;
    if (!anonymous) {
      submitBtn.disabled = true;
      submitBtn.textContent = texts.sending;
      submitBtn.setAttribute('aria-busy', 'true');
    }

    try {
      const data = await submitWithFreshNonce(name, surname, true);

      finalForm.classList.add('ltd-hidden');

      if (config.revealCorrect) {
        questionEl.textContent = texts.result_title;
        questionEl.classList.remove('ltd-hidden');
        resultEl.textContent = String(texts.result_score)
          .replace(/\{PUNTAJE\}/g, score)
          .replace(/\{TOTAL\}/g, config.questions.length);
        resultEl.classList.remove('ltd-hidden');
      } else {
        questionEl.classList.add('ltd-hidden');
        resultEl.classList.add('ltd-hidden');
        thanksEl.classList.remove('ltd-hidden');
      }

      if (!anonymous) submitBtn.removeAttribute('aria-busy');

      if (typeof window.confetti === 'function') {
        const root = getComputedStyle(document.documentElement);
        const getColor = (...vars) => {
          for (const v of vars) {
            const value = root.getPropertyValue(v).trim();
            if (value) return value;
          }
          return '#b7b7b7';
        };

        window.confetti({
          particleCount: 160,
          spread: 95,
          origin: { y: 0.62 },
          colors: [
            getColor('--color-texto', '--color-negro'),
            getColor('--color-principal', '--color-negro')
          ]
        });
      }
    } catch (error) {
      if (error && error.isNonceError) nonceFailureCount++;
      const nonceMessage = nonceFailureCount === 1
        ? 'No pudimos validar el envío. Presioná nuevamente ENVIAR.'
        : 'No pudimos validar el envío. Actualizá la invitación para continuar.';
      if (!anonymous) {
        formError.textContent = error && error.isNonceError
          ? nonceMessage
          : (error && error.message ? error.message : 'No pudimos guardar la trivia. Intentá nuevamente.');
        submitBtn.disabled = false;
        submitBtn.textContent = submitButtonText;
        submitBtn.removeAttribute('aria-busy');
        firstName.focus();
      } else {
        questionEl.classList.remove('ltd-hidden');
        questionEl.textContent = error && error.isNonceError
          ? 'No pudimos validar la trivia. Actualizá la invitación para finalizar.'
          : 'No pudimos finalizar la trivia. Actualizá la invitación e intentá nuevamente.';
      }
      submitting = false;
    }
  }
}
