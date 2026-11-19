document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ltd-confirm-wrapper').forEach(initConfirmation);
});

async function initConfirmation(root) {
  const configEl = root.querySelector('.ltd-confirm-config');
  if (!configEl) return;
  let cfg;
  try { cfg = JSON.parse(configEl.textContent); } catch (e) { return; }

  const guests = root.querySelector('.ltd-guests');
  const count = root.querySelector('.ltd-count-select');
  const form = root.querySelector('.ltd-confirm-form');
  const button = root.querySelector('.ltd-confirm-submit');
  const feedback = root.querySelector('.ltd-confirm-feedback');
  let nonceFailureCount = 0;
  let permanentlyClosed = false;
  const labels = cfg.labels || {};
  const texts = cfg.texts || {};
  const requiredFields = new Set(cfg.requiredFields || []);

  function isRequired(key) { return requiredFields.has(key); }

  function floatingField(key, index, options = {}) {
    const id = `${cfg.instance}-${key}-${index}`;
    const label = options.label || labels[key] || key;
    const required = isRequired(key);
    if (options.select) {
      const choices = (options.choices || []).map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
      return `<div class="ltd-field"><label for="${id}">${escapeHtml(label)}${required ? '<span class="ltd-required">*</span>' : ''}</label><select id="${id}" data-key="${key}" ${required ? 'required' : ''}>${choices}</select></div>`;
    }
    if (options.textarea) {
      return `<div class="ltd-field ltd-floating"><textarea rows="1" id="${id}" data-key="${key}" placeholder=" " ${required ? 'required' : ''}></textarea><label for="${id}">${escapeHtml(label)}${required ? ' *' : ''}</label></div>`;
    }
    let type = key === 'contacto' ? 'tel' : 'text';
    let attrs = '';
    if (key === 'edad') attrs = ' inputmode="numeric" autocomplete="off" data-age-field="1"';
    if (key === 'documento') {
      attrs = cfg.documentMode === 'alphanumeric'
        ? ' inputmode="text" autocomplete="off" data-document-mode="alphanumeric"'
        : ' inputmode="numeric" pattern="[0-9]*" autocomplete="off" data-document-mode="numeric"';
    }
    return `<div class="ltd-field ltd-floating"><input id="${id}" data-key="${key}" type="${type}"${attrs} placeholder=" " ${required ? 'required' : ''}><label for="${id}">${escapeHtml(label)}${required ? ' *' : ''}</label></div>`;
  }

  function field(key, index) {
    if (key === 'confirmacion') {
      const required = isRequired(key);
      const requiredAttr = required ? ' required' : '';
      const yes = (cfg.confirmationYesOptions || []).map((option, optionIndex) => `<label class="ltd-radio-option"><input type="radio" name="confirmacion_${index}" value="${escapeHtml(option)}" data-attendance="yes"${optionIndex === 0 ? ' checked' : ''}${requiredAttr}><span class="ltd-radio-circle"></span><span>${escapeHtml(option)}</span></label>`).join('');
      const no = (cfg.confirmationNoOptions || []).map(option => `<label class="ltd-radio-option"><input type="radio" name="confirmacion_${index}" value="${escapeHtml(option)}" data-attendance="no"${requiredAttr}><span class="ltd-radio-circle"></span><span>${escapeHtml(option)}</span></label>`).join('');
      return `<div class="ltd-field ltd-confirm-question ltd-confirm-pills"><div class="ltd-radio-group">${yes}${no}</div></div>`;
    }
    if (key === 'alimentacion') {
      const foodChoices = [...(cfg.foodOptions || []), cfg.foodOtherOption].filter((value, idx, arr) => value && arr.indexOf(value) === idx);
      const opts = foodChoices.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
      return `<div class="ltd-field"><label>${escapeHtml(labels.alimentacion || 'ALIMENTACIÓN')}${isRequired(key) ? '<span class="ltd-required">*</span>' : ''}</label><select data-key="alimentacion" ${isRequired(key) ? 'required' : ''}>${opts}</select><div class="ltd-field ltd-other-food ltd-hidden ltd-floating"><input id="${cfg.instance}-alimentacion_otra-${index}" data-key="alimentacion_otra" type="text" placeholder=" "><label for="${cfg.instance}-alimentacion_otra-${index}">${escapeHtml(labels.alimentacion_otra || 'DETALLAR REQUERIMIENTO')} <span class="ltd-required">*</span></label></div></div>`;
    }
    if (key === 'traslado') return floatingField(key, index, {select:true, choices:cfg.transportOptions || []});
    if (key === 'hospedaje') return floatingField(key, index, {select:true, choices:cfg.lodgingOptions || []});
    if (key === 'mensaje') return floatingField(key, index, {textarea:true});
    if (key === 'extra') {
      const customLabel = cfg.extraLabel || labels.extra || 'EXTRA';
      if (cfg.extraType === 'select') return floatingField(key, index, {select:true, choices:cfg.extraOptions || [], label:customLabel});
      return floatingField(key, index, {label:customLabel});
    }
    return floatingField(key, index);
  }

  function resetSelects(card) {
    card.querySelectorAll('select[data-key]').forEach(select => {
      if (!select.value && select.options.length) select.selectedIndex = 0;
    });
  }

  function applyAttendance(card) {
    const selected = card.querySelector('input[type="radio"]:checked');
    const no = selected && selected.dataset.attendance === 'no';
    card.querySelectorAll('.ltd-field').forEach(fieldEl => {
      if (fieldEl.classList.contains('ltd-confirm-question')) return;
      const keyEl = fieldEl.querySelector('[data-key]');
      const key = keyEl ? keyEl.dataset.key : '';
      if (key === 'nombre' || key === 'apellido') return;
      fieldEl.classList.toggle('ltd-hidden-by-attendance', !!no);
      fieldEl.querySelectorAll('input,select,textarea').forEach(el => {
        el.disabled = !!no;
        if (no) {
          if (el.tagName === 'SELECT') el.selectedIndex = 0;
          else el.value = '';
        }
      });
    });
    if (!no) resetSelects(card);
  }

  function autoGrow(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(54, textarea.scrollHeight)}px`;
  }

  function fitFloatingLabels(scope = guests) {
    scope.querySelectorAll('.ltd-field.ltd-floating').forEach(fieldEl => {
      const label = fieldEl.querySelector(':scope > label');
      if (!label) return;
      fieldEl.style.setProperty('--ltd-label-extra', '0px');
      const lineHeight = parseFloat(getComputedStyle(label).lineHeight) || 20;
      const extra = Math.max(0, Math.ceil(label.scrollHeight - lineHeight));
      fieldEl.style.setProperty('--ltd-label-extra', `${extra}px`);
    });
  }

  function renderGuests() {
    guests.innerHTML = '';
    const amount = Number(count.value || 1);
    const hideSingleHeading = count.type === 'hidden' && amount === 1;
    for (let index = 1; index <= amount; index++) {
      const card = document.createElement('section');
      card.className = 'ltd-guest-card';
      card.dataset.index = index;
      const heading = hideSingleHeading ? '' : `<h3>${escapeHtml(texts.guest || 'INVITADO')} ${index}</h3>`;
      card.innerHTML = `${heading}<div class="ltd-fields-grid">${cfg.fields.map(key => field(key, index)).join('')}</div>`;
      guests.appendChild(card);
    }
    guests.querySelectorAll('[data-key="alimentacion"]').forEach(select => {
      select.addEventListener('change', () => {
        const other = select.parentElement.querySelector('.ltd-other-food');
        const detail = other ? other.querySelector('[data-key="alimentacion_otra"]') : null;
        const isOther = cfg.foodOtherOption !== '' && select.value === String(cfg.foodOtherOption);
        if (other) other.classList.toggle('ltd-hidden', !isOther);
        if (detail) {
          detail.required = isOther;
          if (!isOther) detail.value = '';
        }
        requestAnimationFrame(() => fitFloatingLabels(select.parentElement));
      });
    });
    guests.querySelectorAll('input[type="radio"]').forEach(radio => radio.addEventListener('change', () => applyAttendance(radio.closest('.ltd-guest-card'))));
    guests.querySelectorAll('textarea').forEach(textarea => textarea.addEventListener('input', () => autoGrow(textarea)));

    guests.querySelectorAll('[data-age-field="1"]').forEach(input => {
      input.addEventListener('focus', () => {
        input.value = (input.value.match(/\d+/) || [''])[0];
      });
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D+/g, '');
      });
      input.addEventListener('blur', () => {
        const digits = input.value.replace(/\D+/g, '');
        if (!digits) { input.value = ''; return; }
        const age = Number(digits);
        input.value = `${age} ${age === 1 ? 'AÑO' : 'AÑOS'}`;
      });
    });

    guests.querySelectorAll('[data-document-mode="numeric"]').forEach(input => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D+/g, '');
      });
    });
    requestAnimationFrame(() => fitFloatingLabels());
  }

  let labelResizeFrame = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(labelResizeFrame);
    labelResizeFrame = requestAnimationFrame(() => fitFloatingLabels());
  }, {passive:true});

  if (count.tagName === 'SELECT') count.addEventListener('change', renderGuests);
  renderGuests();

  function closedError(message = 'CONFIRMACIONES CERRADAS') {
    const error = new Error(message);
    error.isClosed = true;
    return error;
  }

  function showClosed(message = 'CONFIRMACIONES CERRADAS') {
    permanentlyClosed = true;
    root.classList.remove('ltd-confirm-pending');
    root.innerHTML = `<div class="ltd-confirm-closed">${escapeHtml(message || 'CONFIRMACIONES CERRADAS')}</div>`;
  }

  async function getStatus() {
    const fd = new FormData();
    fd.append('action','ltd_confirmacion_status');
    fd.append('code',cfg.code);
    let response;
    try {
      response = await fetch(cfg.ajaxUrl,{method:'POST',credentials:'same-origin',cache:'no-store',body:fd});
    } catch (e) {
      throw new Error('NO PUDIMOS VERIFICAR LAS CONFIRMACIONES. ACTUALIZÁ LA INVITACIÓN.');
    }
    const raw = await response.text();
    let data;
    try { data = JSON.parse(raw); } catch (e) { throw new Error('NO PUDIMOS VERIFICAR LAS CONFIRMACIONES. ACTUALIZÁ LA INVITACIÓN.'); }
    if (!response.ok || !data.success || !data.data) throw new Error('NO PUDIMOS VERIFICAR LAS CONFIRMACIONES. ACTUALIZÁ LA INVITACIÓN.');
    return {open:!!data.data.open,message:String(data.data.message || 'CONFIRMACIONES CERRADAS')};
  }

  async function syncStatus({quiet=false} = {}) {
    try {
      const status = await getStatus();
      if (!status.open) {
        showClosed(status.message);
        return false;
      }
      root.classList.remove('ltd-confirm-pending');
      return true;
    } catch (error) {
      if (!quiet) {
        root.classList.remove('ltd-confirm-pending');
        root.innerHTML = `<div class="ltd-confirm-closed">${escapeHtml(error.message)}</div>`;
      }
      return false;
    }
  }

  if (!(await syncStatus())) return;

  document.addEventListener('visibilitychange', () => {
    if (!permanentlyClosed && document.visibilityState === 'visible' && root.isConnected) syncStatus({quiet:true});
  });
  window.addEventListener('pageshow', () => {
    if (!permanentlyClosed && root.isConnected) syncStatus({quiet:true});
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    feedback.textContent = '';
    const people = [];
    let invalid = false;

    guests.querySelectorAll('.ltd-guest-card').forEach(card => {
      const person = {};
      card.querySelectorAll('[data-key]').forEach(el => { if (!el.disabled) person[el.dataset.key] = el.value.trim(); });
      const radio = card.querySelector('input[type="radio"]:checked');
      person.confirmacion = radio ? radio.value : '';
      person.confirmacion_status = radio ? (radio.dataset.attendance || 'yes') : '';
      card.querySelectorAll('[required]:not(:disabled)').forEach(el => { if (!el.value) invalid = true; });
      if ((cfg.fields || []).includes('confirmacion') && isRequired('confirmacion') && !person.confirmacion) invalid = true;
      people.push(person);
    });

    if (invalid) {
      feedback.textContent = texts.required_error || 'COMPLETÁ LOS CAMPOS OBLIGATORIOS';
      return;
    }

    button.disabled = true;
    button.textContent = texts.sending || 'CONFIRMANDO...';

    try {
      const data = await submitWithFreshNonce(people, true);
      root.innerHTML = `<div class="ltd-confirm-success">${escapeHtml((data.data && data.data.message) || cfg.successMessage)}</div>`;
    } catch (error) {
      button.disabled = false;
      button.textContent = texts.submit || 'CONFIRMAR';
      if (error && error.isClosed) {
        showClosed(error.message);
      } else if (error && error.isNonceError) {
        nonceFailureCount++;
        feedback.textContent = nonceFailureCount === 1
          ? 'NO PUDIMOS VALIDAR EL ENVÍO. PRESIONÁ NUEVAMENTE CONFIRMAR.'
          : 'NO PUDIMOS VALIDAR EL ENVÍO. ACTUALIZÁ LA INVITACIÓN PARA CONFIRMAR.';
      } else {
        feedback.textContent = String(error.message || 'NO PUDIMOS ENVIAR. INTENTÁ NUEVAMENTE.').toUpperCase();
      }
    }
  });

  function nonceError() {
    const error = new Error('NO PUDIMOS VALIDAR EL ENVÍO');
    error.isNonceError = true;
    return error;
  }

  async function refreshNonce() {
    const fd = new FormData();
    fd.append('action','ltd_confirmacion_refresh_nonce');
    fd.append('code',cfg.code);
    let response;
    try {
      response = await fetch(cfg.ajaxUrl,{method:'POST',credentials:'same-origin',cache:'no-store',body:fd});
    } catch (e) {
      throw nonceError();
    }
    const raw = await response.text();
    let data;
    try { data = JSON.parse(raw); } catch (e) { throw nonceError(); }
    if (response.status === 410 || (data.data && data.data.closed)) throw closedError((data.data && data.data.message) || 'CONFIRMACIONES CERRADAS');
    if (!response.ok || !data.success || !data.data || !data.data.nonce) throw nonceError();
    cfg.nonce = String(data.data.nonce);
  }

  async function submitWithFreshNonce(people, allowRetry) {
    await refreshNonce();
    const send = async () => {
      const formData = new FormData();
      formData.append('action','ltd_confirmacion_submit');
      formData.append('nonce',cfg.nonce);
      formData.append('code',cfg.code);
      formData.append('people',JSON.stringify(people));
      formData.append('link_count',cfg.linkCount === null || typeof cfg.linkCount === 'undefined' ? '' : String(cfg.linkCount));
      formData.append('invitation_name',cfg.invitationName || '');
      const response = await fetch(cfg.ajaxUrl,{method:'POST',credentials:'same-origin',cache:'no-store',body:formData});
      const raw = await response.text();
      let data;
      try { data = JSON.parse(raw); } catch (e) { throw new Error('RESPUESTA INVÁLIDA DEL SERVIDOR'); }
      return {response,data};
    };

    let result;
    try {
      result = await send();
    } catch (e) {
      throw e;
    }
    if (result.response.status === 410 || (result.data.data && result.data.data.closed)) throw closedError((result.data.data && result.data.data.message) || 'CONFIRMACIONES CERRADAS');
    if (allowRetry && result.response.status === 403 && !result.data.success) {
      await refreshNonce();
      result = await send();
      if (result.response.status === 410 || (result.data.data && result.data.data.closed)) throw closedError((result.data.data && result.data.data.message) || 'CONFIRMACIONES CERRADAS');
    }
    if (result.response.status === 403 && !result.data.success) throw nonceError();
    if (!result.response.ok || !result.data.success) {
      throw new Error((result.data.data && result.data.data.message) || 'NO SE PUDO GUARDAR');
    }
    nonceFailureCount = 0;
    return result.data;
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
