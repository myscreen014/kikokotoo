<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\CalculatorService;

class CalculatorController extends Controller
{
    /**
     * Calculate a listing of instructions.
     *
     * @return Void
     */
    public function calculate(Request $request): array
    {
        $instructions = $request->instructions;
        $instruction = CalculatorService::calc($instructions);
        error_log(print_r($instructions, true));
        $response = [
            'oldInstruction' => implode('', $instructions).' =',
            'instruction' => $instruction
        ];
        return $response;
    }
   
}
