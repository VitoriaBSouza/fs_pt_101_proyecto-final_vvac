import React, { useState, useRef } from "react";

//libraries for PDF and print
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

//icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquareShareNodes } from '@fortawesome/free-solid-svg-icons'
import { faPrint } from '@fortawesome/free-solid-svg-icons'
import { faPaste } from '@fortawesome/free-solid-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faSquareXTwitter } from '@fortawesome/free-brands-svg-icons'
import { faPinterest } from '@fortawesome/free-brands-svg-icons'
import { faSquareWhatsapp } from '@fortawesome/free-brands-svg-icons'

export const ShareButton = ({ text, url, printRef }) => {

    const message = encodeURIComponent(`${text} ${url}`);

    // Social media share handlers
    const handleWhatsAppShare = () => {
        window.open(`https://wa.me/?text=${message}`, "_blank");
    };

    const handlePinterestShare = () => {
        window.open(
        `https://es.pinterest.com/pin/create/button/?description=${encodeURIComponent(url)}`,
        "_blank"
        );
    };

    const handleTwitterShare = () => {
        window.open(`https://twitter.com/intent/tweet?text=${message}`, "_blank");
    };

    const handleFacebookShare = () => {
        window.open(
        `https://www.facebook.com/sharer/sharer.php?u=#url=${message}`,
        "_blank"
        );
    };

    // Clipboard functionality
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
        });
    };

    //Print functionality
    const [printed, setPrinted] = useState(false);

    const addCorsProxyToImages = async (container) => {
        const proxy = 'https://corsproxy.io/?'; // or your preferred proxy
        const imgs = container.querySelectorAll('img');

        await Promise.all(
            Array.from(imgs).map(img => new Promise((resolve) => {
                if (!img.src.startsWith(proxy)) {
                    img.onload = () => resolve();
                    img.onerror = () => resolve(); // resolve even if error, so it doesn't hang
                    img.src = proxy + encodeURIComponent(img.src);
                } else {
                    resolve(); // already proxied, resolve immediately
                }
            }))
        );
    };

    const handlePrint = async () => {
        setPrinted(true);

        const modalEl = document.getElementById("staticBackdrop");
        if (modalEl) {
            const modalInstance = bootstrap.Modal.getInstance(modalEl);
            modalInstance?.hide();
        }

        const element = printRef?.current;
        if (!element) return;

        await addCorsProxyToImages(element);

        const canvas = await html2canvas(element, { useCORS: true });
        const data = canvas.toDataURL('image/png');

        const pdf = new jsPDF();
        const imgProperties = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('print.pdf');
    };


    return(
        <div>
            {/* Main Share Button */}
            <button type="button" 
            className="btn border-0" 
            data-bs-toggle="modal" 
            data-bs-target="#staticBackdrop">
                <FontAwesomeIcon icon={faSquareShareNodes} className="pe-3 btn_share color_icons border-end border-secondary"/>
            </button>

            {/* Modal setting here */}
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog w-75">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">Share this content</h5>
                            <button type="button" 
                            className="btn-close" 
                            data-bs-dismiss="modal" 
                            aria-label="Close"
                            onClick={() => {document.activeElement?.blur(); setPrinted(false)}}></button>
                        </div>
                        <div className="modal-body mx-auto p-0 mt-2">
                            <button type="button" 
                            className="btn p-0"
                            onClick={handleWhatsAppShare}>
                                <FontAwesomeIcon icon={faSquareWhatsapp} className="btn_share whatts_btn"/>
                            </button>

                            <button type="button" 
                            className="btn p-0 ms-3"
                            onClick={handlePinterestShare}>
                                <FontAwesomeIcon icon={faPinterest} className="btn_share pinterest_btn"/>
                            </button>

                            <button type="button" 
                            className="btn p-0 ms-3"
                            onClick={handleTwitterShare}>
                                <FontAwesomeIcon icon={faSquareXTwitter} className="btn_share twitter_btn"/>
                            </button>

                            <button type="button" 
                            className="btn p-0 ms-3"
                            onClick={handleFacebookShare}>
                                <FontAwesomeIcon icon={faFacebook} className="btn_share face_btn"/>
                            </button>

                            <div className="text-center border-top border-secondary my-3">
                                <button type="button" 
                                className="btn p-0 ms-3 my-3 border-0"
                                onClick={handleCopy}>
                                    <FontAwesomeIcon icon={faPaste} className="btn_share paste_btn"/>
                                    <div className="mt-1">{copied ? "Copied!" : "Copy URL"}</div>
                                </button>

                                <button type="button" 
                                className="btn p-0 ms-3 my-3 border-0"
                                onClick={handlePrint}>
                                    <FontAwesomeIcon icon={faPrint} className="btn_share print_btn"/>
                                    <div className="mt-1">{printed ? "Sent to print!" : "Print"}</div>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </div>

        
    );
}