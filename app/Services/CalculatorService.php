<?php

namespace App\Services;

class CalculatorService 
{
	/**
     * Recursive function in order to calculate with operators priorities.
     *
     * @return array
     */
	public static function calc(array $instructions): array {
		$key =  array_search('×', $instructions);
		if ($key !== false) {
			$newInstruction = floatval($instructions[$key - 1]) * floatval($instructions[$key + 1]);
		} else {
			$key =  array_search('÷', $instructions);
			if ($key !== false) {
				$newInstruction = floatval($instructions[$key - 1]) / floatval($instructions[$key + 1]);
			} else {
				$key =  array_search('+', $instructions);
				if ($key !== false) {
					$newInstruction = floatval($instructions[$key - 1]) + floatval($instructions[$key + 1]);
				} else {
					$key =  array_search('−', $instructions);
					if ($key !== false) {
						$newInstruction = floatval($instructions[$key - 1]) - floatval($instructions[$key + 1]);
					}
				}
			}
		}
		unset($instructions[$key - 1]);
		unset($instructions[$key + 1]);
		$instructions[$key] = round($newInstruction, 5);
		if (count($instructions)==1) {
			return [array_pop($instructions)];
		}
		return self::calc(array_values($instructions));   
	}  

}