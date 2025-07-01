<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'Permohonan KTP',
                'description' => 'Layanan pembuatan atau perpanjangan Kartu Tanda Penduduk',
                'category' => 'Kependudukan',
                'required_documents' => [
                    'KK (Kartu Keluarga)',
                    'Akta Kelahiran',
                    'Ijazah terakhir',
                    'Surat Nikah (jika sudah menikah)'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Perizinan Usaha',
                'description' => 'Layanan pengurusan izin usaha mikro, kecil, dan menengah',
                'category' => 'Perizinan',
                'required_documents' => [
                    'KTP Pemilik Usaha',
                    'KK (Kartu Keluarga)',
                    'Surat Domisili Usaha',
                    'Denah Lokasi Usaha',
                    'NPWP'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Surat Keterangan Domisili',
                'description' => 'Layanan penerbitan surat keterangan domisili',
                'category' => 'Kependudukan',
                'required_documents' => [
                    'KTP',
                    'KK (Kartu Keluarga)',
                    'Surat Pengantar RT/RW'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Pengaduan Infrastruktur',
                'description' => 'Layanan pengaduan terkait infrastruktur jalan, jembatan, dan fasilitas umum',
                'category' => 'Pengaduan',
                'required_documents' => [
                    'KTP Pelapor',
                    'Foto Kondisi Infrastruktur',
                    'Surat Pengantar RT/RW (opsional)'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Izin Mendirikan Bangunan (IMB)',
                'description' => 'Layanan pengurusan izin mendirikan bangunan',
                'category' => 'Perizinan',
                'required_documents' => [
                    'KTP Pemohon',
                    'Sertifikat Tanah',
                    'Gambar Rencana Bangunan',
                    'Surat Pernyataan Tidak Keberatan Tetangga'
                ],
                'is_active' => true
            ],
            [
                'name' => 'Bantuan Sosial',
                'description' => 'Layanan permohonan bantuan sosial untuk masyarakat kurang mampu',
                'category' => 'Sosial',
                'required_documents' => [
                    'KTP',
                    'KK (Kartu Keluarga)',
                    'Surat Keterangan Tidak Mampu dari Kelurahan',
                    'Foto Kondisi Rumah'
                ],
                'is_active' => true
            ]
        ];

        foreach ($services as $service) {
            \App\Models\Service::create($service);
        }
    }
}
