<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendCustomSMSRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'message' => 'required|string',
            'params' => 'required|string',
            'sender' => 'nullable|string|max:11',
            'is_email' => 'nullable|integer|in:0,1',
            'msg_mail' => 'nullable|string',
            'objet_mail' => 'nullable|string',
            'date_envois' => 'nullable|date_format:Y-m-d\TH:i:s.u',
            'external_id' => 'nullable|integer',
            'callback_url' => 'nullable|url',
        ];
    }
}