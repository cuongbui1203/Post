<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use DateTimeInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;
use Laravel\Sanctum\NewAccessToken;
use Spatie\Permission\Traits\HasPermissions;
use Spatie\Permission\Traits\HasRoles; 

class User extends BaseAuthModel
{
    use HasApiTokens, HasFactory, Notifiable,HasUuids,HasRoles,HasPermissions;

    protected $primaryKey='uuid';
    public $incrementing=false;
    protected $keyType='string';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address_id',
    ];
    /**
     * Summary of createToken
     *
     * @param  string $name
     * @param  mixed  $expiresAt
     * @return NewAccessToken
     */
    public function createToken(string $name, array $abilities =['*'],  ?DateTimeInterface $expiresAt = null)
    {
        $token = $this->tokens()->create(
            [
            'name' => $name,
            'token' => hash('sha256', $plainTextToken = Str::random(256)),
            'abilities' => ['*'],
            'expires_at' => $expiresAt,
            ]
        );

        return new NewAccessToken($token, $token->getKey() . '|' . $plainTextToken);
    }
    
    public function detail()
    {
        return $this->hasOne(UserDetail::class, 'user_id', 'uuid');
    }
    public function address()
    {
        return $this->hasOne(Address::class, 'id', 'address_id');
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
}