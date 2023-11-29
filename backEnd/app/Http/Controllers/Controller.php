<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
    /**
     * return success response.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendResponse($result, $message, $httpCode = 200)
    {
        
        $response = [
            'success' => true,
            'data'    => $result,
            'message' => $message,
        ];

        if(is_array($result)) {
            $response['size'] = count($result);
        }

        return response()->json($response, $httpCode);
    }


    /**
     * return error response.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendError($error, $errorMessages = [], $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];


        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }


        return response()->json($response, $code);
    }

}
