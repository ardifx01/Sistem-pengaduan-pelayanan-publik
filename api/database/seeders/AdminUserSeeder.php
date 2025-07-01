<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Administrator',
            'nik' => '3301010101010001',
            'email' => 'admin@badung.go.id',
            'password' => \Illuminate\Support\Facades\Hash::make('admin123'),
            'phone' => '081234567890',
            'address' => 'Kantor Pemerintah Kabupaten Badung',
            'birth_date' => '1980-01-01',
            'job' => 'Administrator Sistem',
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now()
        ]);

        \App\Models\User::create([
            'name' => 'Operator Layanan',
            'nik' => '3301010101010002',
            'email' => 'operator@badung.go.id',
            'password' => \Illuminate\Support\Facades\Hash::make('operator123'),
            'phone' => '081234567891',
            'address' => 'Kantor Pemerintah Kabupaten Badung',
            'birth_date' => '1985-01-01',
            'job' => 'Operator Sistem',
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now()
        ]);
    }
}
