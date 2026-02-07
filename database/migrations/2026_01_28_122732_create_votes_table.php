<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('votes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voter_id')->constrained('users');
            $table->foreignId('election_id')->constrained()->onDelete('cascade');
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->timestamp('voted_at')->useCurrent();
            $table->timestamps();

            // One voter can vote only once per election
            $table->unique(['voter_id', 'election_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('votes');
    }
};
