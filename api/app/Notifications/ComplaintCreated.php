<?php

namespace App\Notifications;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintCreated extends Notification implements ShouldQueue
{
    use Queueable;

    protected $complaint;

    /**
     * Create a new notification instance.
     */
    public function __construct(Complaint $complaint)
    {
        $this->complaint = $complaint;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');
        $trackingUrl = $frontendUrl . '/track-complaint?registration_number=' . $this->complaint->registration_number;

        return (new MailMessage)
            ->subject('Pengaduan Anda Berhasil Diterima - #' . $this->complaint->registration_number)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Terima kasih telah mengirimkan pengaduan Anda.')
            ->line('**Detail Pengaduan:**')
            ->line('Nomor Registrasi: ' . $this->complaint->registration_number)
            ->line('Nama Pemohon: ' . $this->complaint->applicant_name)
            ->line('Layanan: ' . $this->complaint->service->name)
            ->line('Status: Diterima')
            ->line('Tanggal Pengajuan: ' . $this->complaint->created_at->format('d F Y H:i'))
            ->action('Lacak Pengaduan', $trackingUrl)
            ->line('Kami akan memproses pengaduan Anda secepatnya.')
            ->line('Terima kasih telah menggunakan layanan pengaduan Kabupaten Badung.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'complaint_id' => $this->complaint->id,
            'registration_number' => $this->complaint->registration_number,
            'applicant_name' => $this->complaint->applicant_name,
            'status' => $this->complaint->status,
            'service_name' => $this->complaint->service->name,
        ];
    }
}
