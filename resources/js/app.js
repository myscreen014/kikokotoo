require('./bootstrap');

// Variables
const screen = document.getElementById('screen');
const buttons = document.getElementsByClassName('button');
let instructions = [];


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
            let last = (instructions.length > 0) ? instructions.pop() : '';  
            instructions.push(last.toString() + (!last.includes('.')?instruction.toString():''));
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
                        instructions = [];
                        instructions.push(response[0]);
                        display(instructions);
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
const display = (instructions) => {
    var instructionString = '';
    for (var i = 0; i <= instructions.length - 1; i++) {
        instructionString += instructions[i];
    }
    screen.innerHTML = (instructionString !== '') ? instructionString : '0';
}


// Main -----------------------------------------------------------------------------------------
window.onload = () => {
    for (let button of buttons) {
        button .addEventListener('click', (event) => {
            event.preventDefault(); 
            manageKey(event.target.dataset.value);
        });   
    }
}



