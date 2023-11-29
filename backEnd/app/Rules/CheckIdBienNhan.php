<?php

namespace App\Rules;

use App\Models\BienNhan;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class CheckIdBienNhan implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $data = json_decode($value);
    
        
        if(json_last_error() === JSON_ERROR_NONE) {
            if(!is_array($data)) {
                $fail('must be array');
            }
            
            if(count($data) == 0) {
                $fail('must has data');
            }
            foreach($data as $e){
                $res = BienNhan::where('id', '=', $e)->first();
                if(!$res) {
                    $fail("invalid idBienNhan");
                }
            }
        } else{
            $fail('must json format');
        }
    }
}
