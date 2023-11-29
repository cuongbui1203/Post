<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GoodsRouting extends Controller
{

    private function handle($param)
    {
        /**
         * param [address 3 1, address 2 1, address 1 1, address 3 2, address 2 2, address 1 2]
         */
        $res = array();
        $res[] = $param[0];
        $res2[] = $param[3];
        if($param[0] == $param[3]) {
            return $res;
        }
        for( $i = 1; $i < 3; $i++ ) {
            $res[] = $param[$i];
            if($param[$i] == $param[$i + 3]) { break;
            }
            $res2[] = $param[$i + 3];
        }

        for($i = count($res2)-1;$i>=0; $i--) {
            $res[] = $res2[$i];
        }
        return $res;
    }
    public function index(Request $request)
    {
        $data = $request->all();
        
        return response()->json($this->handle($data));
        
    }
}