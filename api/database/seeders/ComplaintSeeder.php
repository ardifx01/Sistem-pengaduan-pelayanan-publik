<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Complaint;
use App\Models\User;
use App\Models\Service;
use Faker\Factory as Faker;

class ComplaintSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Get users and services
        $users = User::where('role', '!=', 'admin')->get();
        $services = Service::all();

        if ($users->isEmpty() || $services->isEmpty()) {
            $this->command->info('No users or services found. Please run AdminUserSeeder and ServiceSeeder first.');
            return;
        }

        $statuses = ['pending', 'reviewing', 'approved', 'revision', 'completed', 'rejected'];

        // Create 50 test complaints
        for ($i = 0; $i < 50; $i++) {
            $complaint = Complaint::create([
                'registration_number' => 'REG-' . date('Y') . '-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                'user_id' => $users->random()->id,
                'service_id' => $services->random()->id,
                'applicant_name' => $faker->name,
                'applicant_nik' => $faker->numerify('################'),
                'applicant_address' => $faker->address,
                'applicant_phone' => $faker->phoneNumber,
                'applicant_job' => $faker->jobTitle,
                'applicant_birth_date' => $faker->date('Y-m-d', '-20 years'),
                'description' => $faker->paragraph(3),
                'status' => $faker->randomElement($statuses),
                'notes' => $faker->optional(0.7)->sentence,
                'created_at' => $faker->dateTimeBetween('-6 months', 'now'),
            ]);

            // Add status history
            $complaint->statusHistories()->create([
                'status' => $complaint->status,
                'notes' => 'Initial status set by seeder',
                'user_id' => $users->first()->id, // First user as admin who set the status
                'created_at' => $complaint->created_at,
            ]);

            // Add some random status changes for some complaints
            if ($faker->boolean(30)) { // 30% chance
                $newStatus = $faker->randomElement(['reviewing', 'approved', 'completed']);
                $complaint->update(['status' => $newStatus]);

                $complaint->statusHistories()->create([
                    'status' => $newStatus,
                    'notes' => $faker->sentence,
                    'user_id' => $users->first()->id,
                    'created_at' => $faker->dateTimeBetween($complaint->created_at, 'now'),
                ]);
            }
        }

        $this->command->info('Created 50 test complaints with status histories.');
    }
}
