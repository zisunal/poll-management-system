<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Poll
 * 
 * @property int $id
 * @property string $question
 * @property string $options
 * @property Carbon $start_at
 * @property Carbon $end_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * 
 * @property Collection|Vote[] $votes
 *
 * @package App\Models
 */
class Poll extends Model
{
	protected $table = 'polls';

	protected $casts = [
		'start_at' => 'datetime',
		'end_at' => 'datetime'
	];

	protected $fillable = [
		'question',
		'options',
		'start_at',
		'end_at'
	];

	public function votes()
	{
		return $this->hasMany(Vote::class);
	}
}
