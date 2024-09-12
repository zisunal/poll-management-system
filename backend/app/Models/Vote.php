<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Vote
 * 
 * @property int $id
 * @property int $poll_id
 * @property string $option
 * @property string $ip_address
 * @property string $user_agent
 * @property Carbon|null $changed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Poll $poll
 *
 * @package App\Models
 */
class Vote extends Model
{
	protected $table = 'votes';

	protected $casts = [
		'poll_id' => 'int',
		'changed_at' => 'datetime'
	];

	protected $fillable = [
		'poll_id',
		'option',
		'ip_address',
		'user_agent',
		'changed_at'
	];

	public function poll()
	{
		return $this->belongsTo(Poll::class);
	}
}
