<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Services\CalculatorService; // TO REMOVE !!!!!!!

class HomeController extends Controller
{
    public function index() {
        $buttons = [ 
            ['label' => 'C',        'class' => 'button-clear btn-info'], 
            ['label' => '&divide;', 'value' => '/', 'class' => 'btn-light'], 
            ['label' => '7',        'class' => 'btn-light'], 
            ['label' => '8',        'class' => 'btn-light'],
            ['label' => '9',        'class' => 'btn-light'],
            ['label' => '&times;',  'value' => '*', 'class' => 'btn-light'],
            ['label' => '4',        'class' => 'btn-light'],
            ['label' => '5',        'class' => 'btn-light'],
            ['label' => '6',        'class' => 'btn-light'], 
            ['label' => '&minus;',  'value' => '-',  'class' => 'btn-light'], 
            ['label' => '1',        'class' => 'btn-light'], 
            ['label' => '2',        'class' => 'btn-light'], 
            ['label' => '3',        'class' => 'btn-light'], 
            ['label' => '&plus;',   'value' => '+',   'class' => 'btn-light'],
            ['label' => '0',        'class' => 'button-zero btn-light'], 
            ['label' => '.',        'class' => 'btn-light'],
            ['label' => '=',        'class' => 'button-egual btn-info' ]
        ];
        return view('home', ['buttons' => $buttons]);
    }
}
