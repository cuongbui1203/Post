<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;


class BaseAuthModel extends Authenticatable
{
    use HasFactory;
     /**
      * Set a given attribute on the model.
      *
      * @param  string $key
      * @param  mixed  $value
      * @return mixed
      */
    public function setAttribute($key, $value)
    {
        $array = [
            'created_at',
            'updated_at',
        ];

        if (in_array($key, $array)) {
            $timezone = new \DateTime('now');

            if (!($value instanceof Carbon)) {
                $value = Carbon::parse($value);
            }

            return $this->attributes[$key] = Carbon::createFromFormat('Y-m-d H:i:s', $value, $timezone->getTimezone())
                ->setTimezone(config('app.timezone'));
        }

        return parent::setAttribute($key, $value);
    }

    /**
     * Get an attribute from the model.
     *
     * @param  string $key
     * @return mixed
     */
    public function getAttribute($key)
    {
        $array = [
            'created_at',
            'updated_at',
        ];

        if (in_array($key, $array)) {
            $timezone = new \DateTime('now');
            $value = $this->getAttributeValue($key);

            if (!($value instanceof Carbon)) {
                $value = Carbon::parse($value);
            }

            return Carbon::createFromFormat('Y-m-d H:i:s', $value, config('app.timezone'))
                ->setTimezone($timezone->getTimezone());
        }

        return parent::getAttribute($key);
    }
}
