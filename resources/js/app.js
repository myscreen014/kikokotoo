require('./bootstrap');
import { Offcanvas } from 'bootstrap';

// Variables
const screenLine1 = document.getElementById('screen-line1');
const screenLine2 = document.getElementById('screen-line2');
const buttons = document.getElementsByClassName('button');
const historyButton = document.getElementById('button-history');
const historyList = document.getElementById('list-history');
let instructions = [];
let instructionsHistory = [];


// Methods --------------------------------------------------------------------------------------
/**
 * Manage instruction and create array of instructions.
 *
 * @param {object} instruction.
 * @return {Void}.
 */
const manageKey = (instruction) => {
    instruction = instruction.toString().trim();
    switch(instruction) {
        case 'C':
            instructions = clearLatest(instructions);
            break;
        case '+':
        case '-':
        case '*':
        case '/':
            if (['+', '-', '*', '/'].includes(instructions[instructions.length-1])) {
                instructions[instructions.length-1] = instruction
            } else if ((instructions.length == 0 && instruction == '-') || instructions.length>0) {
                instructions.push(instruction.toString());  
            }
            break;
        case '.':
            if (instructions.length>0) {
                let last = instructions.pop(); 
                instructions.push(last.toString() + (!last.toString().includes('.')?instruction.toString():''));    
            }
            break;
        case '=':
            // Check if is possible : min [number, operator, number] and if length of instruction is odd
            if (instructions.length >=3 && instructions.length%2!==0) {
                fetch('api/calculator',{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        'instructions': instructions
                    })
                }).then(function(response) {
                    return response.json().then(function(response) {
                        if (response.error) {
                            instructions = [];
                            display([response.error]);
                        } else {
                            instructionsHistory.push([instructions, response.instruction]);
                            instructions = [];
                            instructions.push(response.instruction[0]);                      
                            display(response.instruction, response.oldInstruction);    
                        } 
                    });
                });
            }
            break;
        default:
            // If last instruction is number => concat
            if ((instructions.length == 1 && instructions[instructions.length - 1] == '-') || (instructions.length > 0 && parseFloat(instructions[instructions.length - 1]) >= 0) && parseFloat(instruction) >= 0) {
                let last = (instructions.length > 0) ? instructions.pop() : '';    
                instructions.push(last.toString() + instruction.toString());
            // Else add new instruction
            } else {
                instructions.push(instruction.toString());
            }
            break;
    }
    display(instructions);
}

/**
 * Display instructions on the screen.
 *
 * @param {object} instructions.
 * @return {void}
 */
const display = (instructions, oldInstruction) => {
    var instructionString = '';
    for (var i = 0; i <= instructions.length - 1; i++) {
        instructionString += preparedDisplay(instructions[i]);
    }
    screenLine1.innerHTML = (instructionString !== '') ? instructionString : '0';
    if (typeof oldInstruction != 'undefined') {
        var oldInstructionString = '';
        for (var i = 0; i <= oldInstruction.length - 1; i++) {
            oldInstructionString += preparedDisplay(oldInstruction[i]);
        }
        screenLine2.innerHTML = oldInstructionString + '=';
    } else if (instructions.length == 0) {
        screenLine2.innerHTML = '';
    }
}


/**
 * Remove Latest instruction.
 *
 * @param {object} instructions.
 * @return {void}
 */
const clearLatest = (instructions) => {
    instructions.pop()
    return instructions;
}


/**
 * Load instructions from history
 *
 * @param {event} event.
 * @return {void}
 */
const loadInstructions = (event) => {
    instructions = event.target.dataset.instruction.split(',');
    display(instructions);
}


/**
 * Prepare instruction for display
 *
 * @param {string} instruction.
 * @return {string}
 */
const preparedDisplay = (instruction) => {
    return instruction.toString().replace('/', '&divide;').replace('*', '&times;').replace('-', '&minus;').replace('+', '&plus;');
}


// Main -----------------------------------------------------------------------------------------
window.onload = () => {

    // Events buttons calculator
    for (let button of buttons) {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            manageKey(event.target.dataset.value);
        });   
    }

    // Events buttons history
    historyButton.addEventListener('click', (event) => {
        if (instructionsHistory.length>0) {
            historyList.innerHTML = '';
        }
        var instruction;
        var result;
        instructionsHistory.forEach(function(element, index, array) {
            var instructionString = '';
            for (var i = 0; i <= element[0].length - 1; i++) {
                instructionString += preparedDisplay(element[0][i]);
            }
            instruction = instructionString;
            result = preparedDisplay(element[1]);
            historyList.innerHTML = historyList.innerHTML + '<li><button id="button-history-instruction-'+index+'" data-instruction="'+element[0]+'" data-bs-toggle="offcanvas" href="#offcanvas-history" class="btn btn-outline-primary btn-sm">'+instruction+'</button><span>=</span><button id="button-history-result-'+index+'" data-instruction="'+element[1]+'" data-bs-toggle="offcanvas" href="#offcanvas-history" class="btn btn-outline-primary btn-sm">'+result+'</button></li>';
        });
        for (var i = 0; i <= instructionsHistory.length - 1; i++) {
            document.getElementById('button-history-instruction-'+i).addEventListener ("click", loadInstructions, false);
            document.getElementById('button-history-result-'+i).addEventListener ("click", loadInstructions, false);
        }
    });   

    // Events simple keyboard
    document.addEventListener("keydown", event => {
        var key = event.key;
        if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', '*', '/', '-', '+', 'Enter', 'Backspace'].includes(key)) {
            switch (key) {
                case 'Enter':
                    manageKey('=');
                    break;
                case 'Backspace':
                    manageKey('C');
                    break;
                default:
                    manageKey(event.key);
                    break;
            }  
        }
    });

}



