<?php

namespace App\Services\PDF;

use Dompdf\Dompdf;
use Dompdf\Options;

class PDFGenerator
{
    protected $dompdf;
    
    public function __construct()
    {
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        
        $this->dompdf = new Dompdf($options);
    }
    
    public function generateFromView($view, $data = [], $paper = 'a4', $orientation = 'portrait')
    {
        $html = view($view, $data)->render();
        
        $this->dompdf->loadHtml($html);
        $this->dompdf->setPaper($paper, $orientation);
        $this->dompdf->render();
        
        return $this->dompdf;
    }
    
    public function download($filename = 'document.pdf')
    {
        return response($this->dompdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', "attachment; filename=\"$filename\"");
    }
    
    public function stream($filename = 'document.pdf')
    {
        return response($this->dompdf->output())
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', "inline; filename=\"$filename\"");
    }
}
