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
        $instructions = CalculatorService::calc($instructions);
        return $instructions;
    }
   
}
