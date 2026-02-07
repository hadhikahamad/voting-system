<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('election_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('election_id')->constrained()->onDelete('cascade');
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->bigInteger('total_votes')->default(0);
            $table->decimal('percentage', 5, 2)->default(0);
            $table->integer('rank')->nullable();
            $table->json('breakdown')->nullable();
            $table->timestamp('calculated_at')->useCurrent();
            $table->foreignId('calculated_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->unique(['election_id', 'candidate_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('election_results');
    }
};
