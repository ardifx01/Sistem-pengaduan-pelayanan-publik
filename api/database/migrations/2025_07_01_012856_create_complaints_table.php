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
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('service_id')->constrained()->onDelete('cascade');
            $table->string('applicant_name');
            $table->string('applicant_nik', 16);
            $table->text('applicant_address');
            $table->string('applicant_phone')->nullable();
            $table->string('applicant_job')->nullable();
            $table->date('applicant_birth_date')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['pending', 'reviewing', 'approved', 'revision', 'completed', 'rejected'])->default('pending');
            $table->text('notes')->nullable();
            $table->string('result_document')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
