const STORAGE_KEY = "signup_users_st";

const DEFAULT_USERS = [];

// localStorage에서 가입된 회원 배열 불러오기
function loadUsers() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [...DEFAULT_USERS];
    }

    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [...DEFAULT_USERS];
  } catch (error) {
    return [...DEFAULT_USERS];
  }
}

// localStorage에 가입된 회원 배열 저장하기
function saveUsers() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// 가입된 회원 정보를 저장하는 배열
const users = loadUsers();

// 아이디 중복 확인 상태 변수
let isIdChecked = false;
let checkedId = "";

const signupForm = document.getElementById("signup-form");
const userIdInput = document.getElementById("user-id");
const checkIdBtn = document.getElementById("check-id-btn");
const idError = document.getElementById("id-error");

const userPwInput = document.getElementById("user-pw");
const pwError = document.getElementById("pw-error");

const userPw2Input = document.getElementById("user-pw2");
const pw2Error = document.getElementById("pw2-error");

const userEmailInput = document.getElementById("user-email");
const emailError = document.getElementById("email-error");

const userList = document.getElementById("user-list");

// 입력창 오류 스타일(.signup-form__input-box--error) 설정 함수
function setInputErrorState(inputElement, hasError) {
  const inputBox = inputElement.closest(".signup-form__input-box");
  if (!inputBox) {
    return;
  }

  if (hasError) {
    inputBox.classList.add("signup-form__input-box--error");
  } else {
    inputBox.classList.remove("signup-form__input-box--error");
  }
}

// 안내 메시지 출력 함수
function setFieldMessage(messageElement, inputElement, message, isSuccess) {
  messageElement.textContent = message;
  messageElement.classList.remove("signup-form__message--success");

  if (!message) {
    setInputErrorState(inputElement, false);
    return;
  }

  if (isSuccess) {
    messageElement.classList.add("signup-form__message--success");
    setInputErrorState(inputElement, false);
  } else {
    setInputErrorState(inputElement, true);
  }
}

// 아이디 규칙 검사 함수 (영문 필수, 숫자 선택, 4~12자)
function isValidUserId(id) {
  const hasEnglishPattern = /[a-zA-Z]/;
  const allowedCharsPattern = /^[a-zA-Z0-9]{4,12}$/;

  if (!hasEnglishPattern.test(id)) {
    return false;
  }

  if (!allowedCharsPattern.test(id)) {
    return false;
  }

  return true;
}

// 아이디 중복 확인 함수
function handleCheckDuplicateId() {
  const idValue = userIdInput.value.trim();
  isIdChecked = false;
  checkedId = "";

  if (!idValue) {
    setFieldMessage(idError, userIdInput, "아이디를 입력해주세요.", false);
    return;
  }

  if (!isValidUserId(idValue)) {
    setFieldMessage(
      idError,
      userIdInput,
      "아이디는 영문 필수, 숫자 선택으로 조합. 4~12자만 사용할 수 있습니다.",
      false,
    );
    return;
  }

  const isDuplicate = users.some(function (user) {
    return user.id === idValue;
  });

  if (isDuplicate) {
    setFieldMessage(idError, userIdInput, "이미 사용 중인 아이디입니다.", false);
    return;
  }

  isIdChecked = true;
  checkedId = idValue;
  setFieldMessage(idError, userIdInput, "사용 가능한 아이디입니다.", true);
}

// 비밀번호 규칙 검사 함수 (FR3: 8~16자, 대문자·소문자·숫자·특수문자 각 1개 이상)
function isValidPassword(password) {
  if (password.length < 8 || password.length > 16) {
    return false;
  }

  if (!/[a-z]/.test(password)) {
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  if (!/\d/.test(password)) {
    return false;
  }

  if (!/[!@#$%^&*]/.test(password)) {
    return false;
  }

  return true;
}

// 비밀번호 입력동안 조건 체크 함수
function handlePasswordInput() {
  const pwValue = userPwInput.value;

  if (!pwValue) {
    setFieldMessage(pwError, userPwInput, "", false);
    return;
  }

  if (isValidPassword(pwValue)) {
    setFieldMessage(pwError, userPwInput, "사용 가능한 비밀번호입니다.", true);
  } else {
    setFieldMessage(
      pwError,
      userPwInput,
      "8~16자, 영문 대·소문자, 숫자, 특수문자를 모두 포함해야 합니다.",
      false,
    );
  }

  if (userPw2Input.value) {
    handlePasswordConfirmInput();
  }
}

// 비밀번호 확인 일치 여부 검사 함수
function handlePasswordConfirmInput() {
  const pwValue = userPwInput.value;
  const pw2Value = userPw2Input.value;

  if (!pw2Value) {
    setFieldMessage(pw2Error, userPw2Input, "", false);
    return false;
  }

  if (pwValue === pw2Value) {
    setFieldMessage(pw2Error, userPw2Input, "비밀번호가 일치합니다.", true);
    return true;
  } else {
    setFieldMessage(pw2Error, userPw2Input, "비밀번호가 일치하지 않습니다.", false);
    return false;
  }
}

// 이메일 형식 검사 함수
function isValidEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function handleEmailInput() {
  const emailValue = userEmailInput.value.trim();

  if (!emailValue) {
    setFieldMessage(emailError, userEmailInput, "", false);
    return;
  }

  if (isValidEmail(emailValue)) {
    setFieldMessage(emailError, userEmailInput, "", false);
  } else {
    setFieldMessage(emailError, userEmailInput, "올바른 이메일 주소를 입력해주세요.", false);
  }
}

// 저장된 회원 배열 화면 출력 함수
function renderUserList() {
  userList.innerHTML = "";

  if (users.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "user-list__item";
    emptyItem.textContent = "가입된 회원이 없습니다.";
    userList.appendChild(emptyItem);
    return;
  }

  users.forEach(function (user) {
    const li = document.createElement("li");
    li.className = "user-list__item";
    li.textContent = "아이디: " + user.id + " | 이메일: " + user.email;
    userList.appendChild(li);
  });
}

// 회원가입 제출 처리 함수
function handleSignupSubmit(event) {
  event.preventDefault();

  const idValue = userIdInput.value.trim();
  const pwValue = userPwInput.value;
  const pw2Value = userPw2Input.value;
  const emailValue = userEmailInput.value.trim();

  if (!idValue) {
    setFieldMessage(idError, userIdInput, "아이디를 입력해주세요.", false);
    userIdInput.focus();
    return;
  }

  if (!isValidUserId(idValue)) {
    setFieldMessage(
      idError,
      userIdInput,
      "아이디는 영문 필수, 숫자 선택으로 4~12자만 사용할 수 있습니다.",
      false,
    );
    userIdInput.focus();
    return;
  }

  if (!isIdChecked || idValue !== checkedId) {
    setFieldMessage(idError, userIdInput, "아이디 중복 확인을 완료해주세요.", false);
    checkIdBtn.focus();
    return;
  }

  if (!pwValue) {
    setFieldMessage(pwError, userPwInput, "비밀번호를 입력해주세요.", false);
    userPwInput.focus();
    return;
  }

  if (!isValidPassword(pwValue)) {
    setFieldMessage(
      pwError,
      userPwInput,
      "8~16자, 영문 대·소문자, 숫자, 특수문자를 모두 포함해야 합니다.",
      false,
    );
    userPwInput.focus();
    return;
  }

  if (!pw2Value) {
    setFieldMessage(pw2Error, userPw2Input, "비밀번호 확인을 입력해주세요.", false);
    userPw2Input.focus();
    return;
  }

  if (pwValue !== pw2Value) {
    setFieldMessage(pw2Error, userPw2Input, "비밀번호가 일치하지 않습니다.", false);
    userPw2Input.focus();
    return;
  }

  if (!emailValue) {
    setFieldMessage(emailError, userEmailInput, "이메일 주소를 입력해주세요.", false);
    userEmailInput.focus();
    return;
  }

  if (!isValidEmail(emailValue)) {
    setFieldMessage(emailError, userEmailInput, "올바른 이메일 주소를 입력해주세요.", false);
    userEmailInput.focus();
    return;
  }

  users.push({
    id: idValue,
    password: pwValue,
    email: emailValue,
  });

  saveUsers();
  renderUserList();
  alert(idValue + "님, 회원가입이 완료되었습니다.");

  signupForm.reset();
  isIdChecked = false;
  checkedId = "";
  setFieldMessage(idError, userIdInput, "", false);
  setFieldMessage(pwError, userPwInput, "", false);
  setFieldMessage(pw2Error, userPw2Input, "", false);
  setFieldMessage(emailError, userEmailInput, "", false);
}

// 이벤트 등록
checkIdBtn.addEventListener("click", handleCheckDuplicateId);
userIdInput.addEventListener("input", function () {
  isIdChecked = false;
  checkedId = "";
  setFieldMessage(idError, userIdInput, "", false);
});

userPwInput.addEventListener("input", handlePasswordInput);
userPw2Input.addEventListener("input", handlePasswordConfirmInput);
userEmailInput.addEventListener("input", handleEmailInput);
signupForm.addEventListener("submit", handleSignupSubmit);

// 초기 회원 목록 렌더링
renderUserList();
