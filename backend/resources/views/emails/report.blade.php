<x-mail::message>
{{-- Header --}}
# 🧪 Your Lab Report is Ready!

Hello {{ $details['name'] ?? 'Valued Patient' }},

We are pleased to inform you that your recent laboratory test report is now available. Please find your detailed report attached as a PDF for your records and review.

<x-mail::panel>
<strong>Test Name:</strong> {{ $details['test_name'] ?? 'Lab Test' }}<br>
<strong>Patient Name:</strong> {{ $details['name'] ?? 'N/A' }}<br>
<strong>Date:</strong> {{ $details['report_date'] ?? (now()->format('F j, Y')) }}
</x-mail::panel>

@if(!empty($details['summary']))
<x-mail::panel>
<strong>Summary:</strong> {{ $details['summary'] }}
</x-mail::panel>
@endif

<x-mail::button :url="$details['report_url'] ?? '#'" color="success">
🔎 View Report Online
</x-mail::button>


Thank you for choosing <strong>us</strong> for your healthcare needs.<br>
Stay healthy!

Regards,<br>
The MediLabX Team
</x-mail::message>
