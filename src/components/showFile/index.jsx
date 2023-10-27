import React, { useRef, useState, forwardRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Loading from "../loading";
import './index.scss'
pdfjs.GlobalWorkerOptions.workerSrc = `${window.location.protocol}//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PdfWrapper = forwardRef(({ src }) => {
    const [page, setPage] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageNumberText, setPageNumberText] = useState(2);
    const [pageAll, setPageAll] = useState(true);
    const [scalcnum, setScalcnum] = useState(1);
    const [pageWidth, setpageWidth] = useState(850);
    const [fullscreen, setFullscreen] = useState(false);
    let [count, setCount] = useState(1);
    const pdfRef = useRef();
    const onDocumentLoadSuccess = e => {
        setPage(e._pdfInfo.numPages);
    };
    const pageFullscreen = () => {
        if (fullscreen) {
            setFullscreen(false);
            setpageWidth(850);
        } else {
            setFullscreen(true);
            setpageWidth(1220);
        }
    };

    return (
        <div className="pdfWrap">
            <div ref={pdfRef} className={`pdf_container ${fullscreen ? "pdf_container_pos" : ""}`}>
                <div className={`pdf_top_option ${fullscreen ? "pdf_top_optionWidth" : ""}`}>

                    <span className="svg" onClick={() => pageFullscreen()}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M7.94209 10.0579C8.08296 10.1988 8.16759 10.3862 8.18009 10.5851C8.19259 10.7839 8.13212 10.9805 8.01 11.1379L7.94209 11.2148L2.79409 16.3636L6.52664 16.3645C6.72704 16.3645 6.92046 16.4381 7.07021 16.5712C7.21997 16.7044 7.31564 16.8879 7.33909 17.0869L7.34482 17.1826C7.34477 17.3832 7.27108 17.5767 7.13775 17.7265C7.00441 17.8762 6.82072 17.9718 6.62155 17.9951L6.52664 18.0008H0.818182L0.756818 17.9984L0.653727 17.9845L0.562909 17.9599L0.472091 17.9239L0.391909 17.8814L0.313364 17.8265L0.239727 17.7611C0.211065 17.7325 0.184539 17.7019 0.160364 17.6695L0.102273 17.5795L0.058091 17.4862L0.0294544 17.4003L0.00490913 17.2775L0 17.1818V11.4513C0.000436927 11.2428 0.080434 11.0424 0.223656 10.8909C0.366878 10.7394 0.562522 10.6483 0.770639 10.6362C0.978756 10.6241 1.18365 10.6919 1.34348 10.8257C1.50331 10.9595 1.60602 11.1494 1.63064 11.3564L1.63636 11.4513L1.63555 15.2059L6.78518 10.0579C6.93861 9.90452 7.14668 9.81836 7.36364 9.81836C7.58059 9.81836 7.78866 9.90452 7.94209 10.0579ZM11.4734 0H17.1818L17.2432 0.00245437L17.3463 0.0163636L17.4371 0.0409092L17.5279 0.076909L17.6081 0.119454L17.6866 0.174273L17.7603 0.239727C17.7897 0.268364 17.8159 0.299455 17.8396 0.331364L17.8977 0.421364L17.9419 0.514636L17.9705 0.600546L17.9951 0.723273L18 0.818182V6.54873C17.9996 6.7572 17.9196 6.95764 17.7763 7.10912C17.6331 7.2606 17.4375 7.3517 17.2294 7.36381C17.0212 7.37592 16.8164 7.30814 16.6565 7.17429C16.4967 7.04045 16.394 6.85065 16.3694 6.64364L16.3636 6.54873V2.79327L11.2148 7.94209C11.0676 8.08883 10.87 8.17402 10.6622 8.18037C10.4545 8.18671 10.2521 8.11373 10.0961 7.97625C9.94022 7.83877 9.84248 7.64709 9.82277 7.44016C9.80305 7.23322 9.86284 7.02654 9.99 6.86209L10.0579 6.78518L15.2051 1.63636H11.4742C11.2736 1.63654 11.08 1.56305 10.9301 1.42987C10.7802 1.29668 10.6844 1.11307 10.6609 0.913909L10.6552 0.818182C10.6552 0.617656 10.7289 0.424132 10.8623 0.274357C10.9956 0.124582 11.1793 0.0289882 11.3785 0.00572725L11.4734 0Z"
                                fill="#333333"
                            />
                        </svg>
                    </span>
                </div>
                <div style={{ transform: `scale(${scalcnum})` }}>
                    <Document
                        className="Document_wrap_c"
                        file={src}
                        onLoadSuccess={onDocumentLoadSuccess}
                        renderMode="canvas"
                        loading={Loading}
                        externalLinkTarget="_blank"
                        renderTextLayer={true}

                    >
                        <div>
                            {Array.from({ length: pageAll && page > 1 ? 1 : page }, (v, k) => k + 2).map((v, i) => {
                                return (
                                    <div key={i} className="pdf_item" style={{ color: "red" }}>
                                        <Page width={pageWidth} pageNumber={(v || 1) - 1} key={i} style={{ color: 'red' }} />
                                        {/* {pageAll&& <> <div className={'last'} onClick={pageFun(lastPage)}></div>
                                    <div className={'next'} onClick = {pageFun(nextPage)}></div></>} */}
                                    </div>
                                );
                            })}
                        </div>
                    </Document>
                </div>
                {page > 1 && pageAll && (
                    <div className="pdf_footer_mantle">
                        <p>
                            {/* 剩余{ page - 1 }页未读， */}
                            共有{page}页&nbsp;&nbsp;&nbsp;<span onClick={() => setPageAll(false)}>展开所有</span>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
});

export default PdfWrapper;
