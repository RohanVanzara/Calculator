// Calculator class to handle all calculator operations
class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetDisplay = false;
    }

    // Clear all values
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    // Delete the last digit
    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    // Append number to the current operand
    appendNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentOperand = '';
            this.shouldResetDisplay = false;
        }
        
        // Don't allow multiple decimal points
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        // Replace initial '0' unless it's a decimal point
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    // Choose operation
    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    // Handle the percent operation
    handlePercent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
    }

    // Compute the result
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case 'x':
                computation = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Cannot divide by zero!");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetDisplay = true;
    }

    // Format display number with commas
    formatDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    // Update the display
    updateDisplay() {
        document.getElementById('current-operand').innerText = this.formatDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            document.getElementById('previous-operand').innerText = 
                `${this.formatDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            document.getElementById('previous-operand').innerText = '';
        }
    }
}

// Create calculator instance
const calculator = new Calculator();

// Add event listeners for number buttons
const numberButtons = document.querySelectorAll('.number');
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Handle the case of double zero
        if (button.id === 'double-zero') {
            calculator.appendNumber('00');
        } else {
            calculator.appendNumber(button.innerText);
        }
        calculator.updateDisplay();
    });
});

// Add event listeners for operator buttons
const operatorButtons = document.querySelectorAll('.operator');
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

// Add event listener for percent button
document.getElementById('percent').addEventListener('click', () => {
    calculator.handlePercent();
    calculator.updateDisplay();
});

// Add event listener for equals button
document.getElementById('equals').addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

// Add event listener for clear button
document.getElementById('clear').addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

// Add event listener for delete button
document.getElementById('delete').addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Initialize display
calculator.updateDisplay();