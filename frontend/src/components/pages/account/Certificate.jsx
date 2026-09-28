import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaCertificate, FaGraduationCap } from 'react-icons/fa'
import Layout from '../../common/Layout'
import { apiUrl, token } from '../../common/config'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const Certificate = () => {

    const { id } = useParams()

    const [certificate, setCertificate] = useState(null)
    const [loading, setLoading] = useState(true)

    const certificateRef = useRef(null)

    const fetchCertificate = async () => {

        await fetch(`${apiUrl}/certificate/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(result => {

            if (result.status == 200) {
                setCertificate(result.data)
            } else {
                console.log("Certificate not found")
            }

            setLoading(false)
        })
        .catch(error => {
            console.log(error)
            setLoading(false)
        })
    }


    const downloadPDF = async () => {

                const element = certificateRef.current

                if (!element) {
                    return
                }

                const canvas = await html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                })

                const imageData = canvas.toDataURL('image/png')

                const pdf = new jsPDF({
                    orientation: 'landscape',
                    unit: 'mm',
                    format: 'a4'
                })

                const pdfWidth = 297
                const pdfHeight = 210

                pdf.addImage(
                    imageData,
                    'PNG',
                    0,
                    0,
                    pdfWidth,
                    pdfHeight
                )

                pdf.save(`Certificate-${certificate.certificate_id}.pdf`)
            }

    useEffect(() => {
        fetchCertificate()
    }, [id])


    if (loading) {
        return (
            <Layout>
                <section className="section-4">
                    <div className="container py-5">
                        <p>Loading certificate...</p>
                    </div>
                </section>
            </Layout>
        )
    }


    if (!certificate) {
        return (
            <Layout>
                <section className="section-4">
                    <div className="container py-5 text-center">

                        <h4>Certificate not found</h4>

                        <Link
                            to="/account/my-learning"
                            className="btn btn-primary mt-3"
                        >
                            Back to My Learning
                        </Link>

                    </div>
                </section>
            </Layout>
        )
    }


    const issuedDate = new Date(certificate.issued_at).toLocaleDateString(
        'en-US',
        {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
    )


    return (
        <Layout>

            <section className="section-4">

                <div className="container py-5">

                    {/* Page Heading */}

                    <div className="text-center mb-4">

                        <h2 className="h4 mb-2">
                            Course Certificate
                        </h2>

                        <p className="text-muted mb-0">
                            Congratulations on completing the course!
                        </p>

                    </div>


                    {/* Certificate */}

                    <div
                        ref={certificateRef}
                        className="certificate-wrapper mx-auto"
                        style={{
                            maxWidth: '1000px',
                            backgroundColor: '#fff',
                            padding: '12px',
                            border: '1px solid #ddd',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.10)'
                        }}
                    >

                        <div
                            style={{
                                border: '6px solid #222',
                                padding: '50px 40px',
                                textAlign: 'center',
                                position: 'relative'
                            }}
                        >

                            {/* Decorative inner border */}

                            <div
                                style={{
                                    border: '2px solid #ddd',
                                    padding: '40px 30px'
                                }}
                            >

                                {/* LMS Logo / Icon */}

                                <div className="mb-3">

                                    <FaGraduationCap
                                        size={42}
                                        style={{
                                            color: '#0d6efd'
                                        }}
                                    />

                                </div>


                                {/* LMS Name */}

                                <div
                                    className="fw-bold mb-4"
                                    style={{
                                        fontSize: '18px',
                                        letterSpacing: '2px'
                                    }}
                                >
                                   LEARNIX - LEARNING MANAGEMENT SYSTEM
                                </div>


                                {/* Certificate Icon */}

                                <div className="mb-3">

                                    <FaCertificate
                                        size={42}
                                        style={{
                                            color: '#f0ad4e'
                                        }}
                                    />

                                </div>


                                {/* Main Heading */}

                                <h1
                                    className="fw-bold mb-2"
                                    style={{
                                        fontSize: '38px',
                                        letterSpacing: '3px'
                                    }}
                                >
                                    CERTIFICATE
                                </h1>

                                <h3
                                    className="mb-4"
                                    style={{
                                        letterSpacing: '4px',
                                        fontSize: '20px'
                                    }}
                                >
                                    OF COMPLETION
                                </h3>


                                {/* Student Text */}

                                <p
                                    className="text-muted mb-2"
                                    style={{
                                        fontSize: '16px'
                                    }}
                                >
                                    This certificate is proudly presented to
                                </p>


                                {/* Student Name */}

                                <h2
                                    className="fw-bold mb-3"
                                    style={{
                                        fontSize: '32px'
                                    }}
                                >
                                    {certificate.user.name}
                                </h2>


                                {/* Description */}

                                <p
                                    className="text-muted mb-2"
                                    style={{
                                        fontSize: '16px'
                                    }}
                                >
                                    for successfully completing the course
                                </p>


                                {/* Course Name */}

                                <h3
                                    className="fw-bold mb-4"
                                    style={{
                                        fontSize: '25px'
                                    }}
                                >
                                    {certificate.course.title}
                                </h3>


                                {/* Date */}

                                <p className="mb-1 text-muted">
                                    Date of Completion
                                </p>

                                <p
                                    className="fw-bold mb-4"
                                    style={{
                                        fontSize: '17px'
                                    }}
                                >
                                    {issuedDate}
                                </p>



                                {/* Certificate ID */}

                                <div className="mt-5">

                                    <p
                                        className="mb-1 text-muted"
                                        style={{
                                            fontSize: '13px'
                                        }}
                                    >
                                        Certificate ID
                                    </p>

                                    <p
                                        className="fw-bold mb-0"
                                        style={{
                                            fontSize: '14px',
                                            letterSpacing: '1px'
                                        }}
                                    >
                                        {certificate.certificate_id}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Buttons */}

                    <div className="text-center mt-4">

                            <button
                                onClick={downloadPDF}
                                className="btn btn-success me-2"
                            >
                                Download Certificate
                            </button>

                            <Link
                                to={`/account/watch-course/${certificate.course.id}`}
                                className="btn btn-primary me-2"
                            >
                                Watch Course
                            </Link>

                            <Link
                                to="/account/my-learning"
                                className="btn btn-outline-secondary"
                            >
                                Back to My Learning
                            </Link>

                        </div>

                </div>

            </section>

        </Layout>
    )
}

export default Certificate