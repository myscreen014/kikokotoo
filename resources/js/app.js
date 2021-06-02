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
    switch(instruction) {
        case 'C':
            instructions = [];
            break;
        case '+':
        case '−':
        case '×':
        case '÷':
            if (['+', '−', '×', '÷'].includes(instructions[instructions.length-1])) {
                instructions[instructions.length-1] = instruction
            } else {
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
                let oldInstructions = instructions.join('');
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
                        instructionsHistory.push([instructions, response.instruction]);
                        instructions = [];
                        instructions.push(response.instruction[0]);                      
                        display(response.instruction, response.oldInstruction);
                    });
                });
            }
            break;
        default:
            if ((instructions.length > 0 && parseFloat(instructions[instructions.length - 1]) >= 0) && parseFloat(instruction) >= 0) {
                let last = (instructions.length > 0) ? instructions.pop() : '';    
                instructions.push(last.toString() + instruction.toString());
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
 * @param {Object} instructions.
 * @return {Void}
 */
const display = (instructions, oldInstruction) => {
    var instructionString = '';
    for (var i = 0; i <= instructions.length - 1; i++) {
        instructionString += instructions[i];
    }
    screenLine1.innerHTML = (instructionString !== '') ? instructionString : '0';
    if (typeof oldInstruction != 'undefined') {
        screenLine2.innerHTML = oldInstruction;
    }
}

/**
 * Load instructions from history
 *
 * @param {Event} event.
 * @return {Void}
 */
const loadInstructions = (event) => {
    instructions = event.target.dataset.instruction.split(',');
    display(instructions);
}


// Main -----------------------------------------------------------------------------------------
window.onload = () => {

    // Events buttons
    for (let button of buttons) {
        button.addEventListener('click', (event) => {
            event.preventDefault(); 
            manageKey(event.target.dataset.value);
        });   
    }
    let buttonsa = document.getElementById("list-history").querySelectorAll("button");
    for (let buttona of buttonsa) {
        buttona.addEventListener('click', (event) => {
            alert('boom');
        });
    }
    historyButton.addEventListener('click', (event) => {
        if (instructionsHistory.length>0) {
            historyList.innerHTML = '';
        }
        instructionsHistory.forEach(function(element, index, array) {
            historyList.innerHTML = historyList.innerHTML + '<li><button id="button-history-instruction-'+index+'" data-instruction="'+element[0]+'" class="btn btn-outline-primary btn-sm">'+element[0].join(' ').toString()+'</button><span>=</span><button id="button-history-result-'+index+'" data-instruction="'+element[1]+'" class="btn btn-outline-primary btn-sm">'+element[1].toString()+'</button></li>';
        });
        for (var i = 0; i <= instructionsHistory.length - 1; i++) {
            document.getElementById('button-history-instruction-'+i).addEventListener ("click", loadInstructions, false);
            document.getElementById('button-history-result-'+i).addEventListener ("click", loadInstructions, false);
        }
    });   
}



