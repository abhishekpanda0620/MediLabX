<?php

namespace App\Services\PDF;

use Dompdf\Dompdf;
use Dompdf\Options;

class DirectPDFGenerator
{
    /**
     * Generate a PDF from HTML content
     *
     * @param string $html HTML content to convert to PDF
     * @param string $paper Paper size
     * @param string $orientation Page orientation
     * @return Dompdf
     */
    public static function fromHtml($html, $paper = 'a4', $orientation = 'portrait')
    {
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper($paper, $orientation);
        $dompdf->render();
        
        return $dompdf;
    }
    
    /**
     * Generate a PDF from a view
     *
     * @param string $view View name
     * @param array $data Data to pass to the view
     * @param string $paper Paper size
     * @param string $orientation Page orientation
     * @return Dompdf
     */
    public static function fromView($view, $data = [], $paper = 'a4', $orientation = 'portrait')
    {
        $html = view($view, $data)->render();
        return self::fromHtml($html, $paper, $orientation);
    }
}
