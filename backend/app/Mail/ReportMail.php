<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public $details;
    public $pdfPath;

    public function __construct($details, $pdfPath)
    {
        $this->details = $details;
        $this->pdfPath = $pdfPath;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Lab Report [' . ($this->details['test_name'] ?? 'Lab Test') . ']',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.report',
        );
    }

    public function build()
    {
        return $this->markdown('emails.report')
            ->attach($this->pdfPath, [
                'as' => 'report.pdf',
                'mime' => 'application/pdf',
            ])
            ->with('details', $this->details);
    }

    public function attachments(): array
    {
        return [];
    }
}
