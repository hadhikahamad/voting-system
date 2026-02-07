<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'photo')) {
                $table->string('photo')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'voter_id')) {
                $table->string('voter_id')->nullable()->after('photo');
            }
        });

        Schema::table('candidates', function (Blueprint $table) {
            if (!Schema::hasColumn('candidates', 'party_logo')) {
                $table->string('party_logo')->nullable()->after('party');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['photo', 'voter_id']);
        });

        Schema::table('candidates', function (Blueprint $table) {
            $table->dropColumn(['party_logo']);
        });
    }
};
