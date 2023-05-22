const allNumbers = document.querySelectorAll('.number'),
  operators = document.querySelectorAll('.operator'),
  resultElement = document.querySelector('.result-element'),
  equalBtn = document.querySelector('.equal'),
  deleteBtn = document.querySelector('.delete'),
  deleteAllBtn = document.querySelector('.delete-all'),
  issue = document.querySelector('.issue');

const modeSection = document.querySelector('.mode')
let currentMode;

let firstNumber,
  secondNumber,
  result,
  operator;

let currentNumber = ''


// Set appearance app on local storage
if (localStorage.getItem('mode')) {
  let mode = localStorage.getItem('mode')
  if (mode === 'dark') {
    document.body.classList.add('dark-mode')
    document.querySelector('.switch').classList.add('active')
    currentMode = 'dark'
  } else {
    document.body.classList.remove('dark-mode')
    document.querySelector('.switch').classList.remove('active')
    currentMode = 'light'
  }
} else {
  currentMode = 'light'
  localStorage.setItem('mode', currentMode)
}

// to make appearance app light or dark
modeSection.addEventListener('click', () => {
  if (currentMode === 'light') {
    document.body.classList.add('dark-mode')
    document.querySelector('.switch').classList.add('active')
    currentMode = 'dark'
    localStorage.setItem('mode', currentMode)
  } else {
    document.body.classList.remove('dark-mode')
    document.querySelector('.switch').classList.remove('active')
    currentMode = 'light'
    localStorage.setItem('mode', currentMode)
  }
})

// to handle keyboard clicks
document.body.addEventListener('keypress', (e) => {
  let key = e.key
  const isOperator = checkOperator(key)
  const isNumber = checkNumber(Number(key))
  if (isOperator) {
    handleOperator(key)
  } else if (isNumber) {
    handleNumberClick(Number(key))
  } else if (key === 'Enter' || key === '=') {
    handleEqualBtn()
  } else if (key === '.') {
    handleNumberClick(key)
  }
})

const checkOperator = (possibleOperator) => {
  const operatorsRegex = /[+\-/*]/g;
  const isOperator = operatorsRegex.test(possibleOperator)
  return isOperator ? true : false
}

const checkNumber = (possibleNumber) => {
  const numberRegex = /[0-9]/g;
  const isNumber = numberRegex.test(possibleNumber)
  return isNumber ? true : false
}

// this works when a user click on number button
const handleNumberClick = (e) => {
  let number = typeof e === 'number'
    ? String(e)
    : e === '.'
      ? e
      : e.target.dataset.number
  if (currentNumber.length === 0 && number === '.') {
    issue.classList.add('active')
  } else if (currentNumber[currentNumber.length - 1] === '.' && number === '.') {
    issue.classList.add('active')
  } else {
    issue.classList.remove('active')
    currentNumber += number
    resultElement.textContent += number
  }
}

// this works when a user click on equal button
const handleEqualBtn = () => {
  secondNumber = currentNumber
  if (secondNumber === '') {
    let currentResult = firstNumber
    defaultValues()
    resultElement.textContent = currentResult
    currentNumber = currentResult
  } else if (firstNumber !== undefined && secondNumber !== undefined) {
    let currentResult

    switch (operator) {
      case '*':
        currentResult = Number(firstNumber) * Number(secondNumber)
        break;
      case '+':
        currentResult = Number(firstNumber) + Number(secondNumber)
        break;
      case '-':
        currentResult = Number(firstNumber) - Number(secondNumber)
        break;
      case '/':
        currentResult = Number(firstNumber) / Number(secondNumber)
    }
    if (!Number.isInteger(currentResult)) {
      currentResult = checkResult(currentResult)
    }
    defaultValues()
    resultElement.textContent = currentResult
    currentNumber = currentResult
  }
}

// to fix the result number after decimal point
const checkResult = (result) => {
  const decimalString = result.toString().split('.')[1];
  const decimalNumbers = decimalString
    ? decimalString.length > 4
      ? 4
      : decimalString.length
    : 0;

  result = result.toFixed(Number(decimalNumbers))
  return result
}

const defaultValues = () => {
  resultElement.textContent = ''
  firstNumber = undefined
  secondNumber = undefined
  currentNumber = ''
  result = undefined
  operator = ''
}

// when the AC button clicked
const handleClearAll = () => {
  defaultValues()
}

// when the C button clicked
const handleClear = () => {
  resultElement.textContent = resultElement.textContent.slice(0, resultElement.textContent.length - 1)
  currentNumber = currentNumber.slice(0, currentNumber.length - 1)
  const operatorsRegex = /[+\-/*]/g;
  const anyOperators = operatorsRegex.test(resultElement.textContent)

  if (!anyOperators) {
    operator = undefined
  }

  if (resultElement.textContent.length === 0) {
    defaultValues()
  }
}


// when an operator button clicked
const handleOperator = (e) => {
  let secondOperator = checkOperator(e) ? e : e.target.dataset.operator

  if (firstNumber === undefined) {
    firstNumber = currentNumber
    currentNumber = ''
    resultElement.textContent += secondOperator
    operator = secondOperator
  } else {
    secondNumber = currentNumber
    currentNumber = calcul(operator)
    firstNumber = currentNumber
    resultElement.textContent = firstNumber + secondOperator
    secondNumber = undefined
    currentNumber = ''
    operator = secondOperator
  }
}

// this doesn't work when equal button clicked
const calcul = (operator) => {
  switch (operator) {
    case '*':
      currentNumber = Number(firstNumber) * Number(secondNumber)
      break;
    case '+':
      currentNumber = Number(firstNumber) + Number(secondNumber)
      break;
    case '-':
      currentNumber = Number(firstNumber) - Number(secondNumber)
      break;
    case '/':
      currentNumber = Number(firstNumber) / Number(secondNumber)
  }

  currentNumber = checkResult(currentNumber)
  return currentNumber

}

// Set click functions to the buttons
allNumbers.forEach(number => {
  number.addEventListener('click', handleNumberClick)
});

operators.forEach(operator => {
  operator.addEventListener('click', handleOperator)
});

equalBtn.addEventListener('click', handleEqualBtn)
deleteBtn.addEventListener('click', handleClear)
deleteAllBtn.addEventListener('click', handleClearAll)