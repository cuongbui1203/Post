<?php

namespace App\Rules;

use App\Enums\ActionEnum;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CheckAction implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        //
        $data = json_decode($value);
    
        
        if(json_last_error() === JSON_ERROR_NONE) {
            if(!is_array($data)) {
                $fail('must be array');
            }
            if(count($data) == 0) {
                $fail('must has data');
            }
            foreach($data as $e){
                if(!in_array($e, ActionEnum::getValues())) {
                    $fail('invalid action');
                }
            }
        } else{
            $fail('must json format');
        }
    }
}
