<?php

namespace App\Notifications;

use App\Models\Complaint;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplaintStatusChanged extends Notification implements ShouldQueue
{
    use Queueable;

    protected $complaint;
    protected $oldStatus;
    protected $newStatus;

    /**
     * Create a new notification instance.
     */
    public function __construct(Complaint $complaint, $oldStatus, $newStatus)
    {
        $this->complaint = $complaint;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
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
            ->subject('Status Pengaduan Anda Telah Diperbarui - #' . $this->complaint->registration_number)
            ->greeting('Halo ' . $notifiable->name . ',')
            ->line('Status pengaduan Anda telah diperbarui.')
            ->line('**Detail Pengaduan:**')
            ->line('Nomor Registrasi: ' . $this->complaint->registration_number)
            ->line('Nama Pemohon: ' . $this->complaint->applicant_name)
            ->line('Layanan: ' . $this->complaint->service->name)
            ->line('Status Lama: ' . ucfirst($this->oldStatus))
            ->line('Status Baru: ' . ucfirst($this->newStatus))
            ->action('Lacak Pengaduan', $trackingUrl)
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
            'old_status' => $this->oldStatus,
            'new_status' => $this->newStatus,
            'service_name' => $this->complaint->service->name,
        ];
    }
}
